import { Resend } from "resend";
import { OrderConfirmation } from "@/types";
import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/format-price";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

export async function sendPurchaseEmail(order: OrderConfirmation) {
  await getResend().emails.send({
    from: `${SITE_CONFIG.name} <noreply@${SITE_CONFIG.email.split("@")[1]}>`,
    to: order.customer_email,
    subject: `Conferma acquisto - ${SITE_CONFIG.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #6366F1; font-size: 24px;">Grazie per il tuo acquisto!</h1>

        <p style="color: #333; font-size: 16px;">
          Ecco il riepilogo del tuo ordine e i link per scaricare i tuoi appunti.
        </p>

        <div style="background: #f5f5f5; border-radius: 12px; padding: 16px; margin: 24px 0;">
          <h2 style="font-size: 16px; margin: 0 0 12px;">I tuoi prodotti</h2>
          ${order.items
            .map(
              (item) => `
            <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e5e5e5;">
              <p style="font-weight: bold; margin: 0 0 4px;">${item.product_name}</p>
              <p style="color: #666; margin: 0 0 8px;">${formatPrice(item.price)}</p>
              <a href="${item.download_url}" style="display: inline-block; background: #6366F1; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                Scarica ora
              </a>
            </div>
          `
            )
            .join("")}

          <div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #d4d4d4;">
            <p style="font-weight: bold; font-size: 18px; margin: 0;">
              Totale: ${formatPrice(order.total)}
            </p>
          </div>
        </div>

        <div style="background: #FEF3C7; border-radius: 12px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400E;">
            <strong>Importante:</strong> I link di download sono validi per 48 ore
            e puoi scaricare ogni file fino a 5 volte.
          </p>
        </div>

        <p style="color: #666; font-size: 14px;">
          Se hai problemi con il download, rispondi a questa email o scrivici a
          <a href="mailto:${SITE_CONFIG.email}" style="color: #6366F1;">${SITE_CONFIG.email}</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

        <p style="color: #999; font-size: 12px; text-align: center;">
          ${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}
        </p>
      </div>
    `,
  });
}
