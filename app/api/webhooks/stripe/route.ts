import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-server";
import { generateToken, getDownloadExpiry } from "@/lib/tokens";
import { DOWNLOAD_CONFIG, SITE_CONFIG } from "@/lib/constants";
import { sendPurchaseEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const supabase = createAdminClient();

    try {
      // Update order status
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq("stripe_session_id", session.id)
        .select()
        .single();

      if (orderError || !order) {
        console.error("Failed to update order:", orderError);
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      // Get product IDs from session metadata
      const productIds = (session.metadata?.product_ids || "").split(",");

      // Create order items and download tokens
      const downloadLinks: {
        product_name: string;
        price: number;
        download_url: string;
      }[] = [];

      for (const productId of productIds) {
        // Get product details
        const { data: product } = await supabase
          .from("products")
          .select("id, name, price")
          .eq("id", productId)
          .single();

        if (!product) continue;

        // Create order item
        const { data: orderItem } = await supabase
          .from("order_items")
          .insert({
            order_id: order.id,
            product_id: product.id,
            price: product.price,
            product_name: product.name,
          })
          .select()
          .single();

        if (!orderItem) continue;

        // Create download token
        const token = generateToken();
        await supabase.from("download_tokens").insert({
          order_item_id: orderItem.id,
          product_id: product.id,
          token,
          max_downloads: DOWNLOAD_CONFIG.maxDownloads,
          expires_at: getDownloadExpiry().toISOString(),
        });

        // Note: download_count is tracked via download_tokens table

        downloadLinks.push({
          product_name: product.name,
          price: product.price,
          download_url: `${SITE_CONFIG.url}/api/download/${token}`,
        });
      }

      // Send purchase confirmation email
      if (order.customer_email && downloadLinks.length > 0) {
        try {
          await sendPurchaseEmail({
            order_id: order.id,
            customer_email: order.customer_email,
            items: downloadLinks,
            total: order.total,
          });
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }
      }
    } catch (err) {
      console.error("Webhook processing error:", err);
      return NextResponse.json(
        { error: "Processing error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
