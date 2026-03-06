"use client";

import { useEffect } from "react";
import Image from "next/image";
import { FileText, User, Calendar, BookOpen, ShoppingCart, Check } from "lucide-react";
import { Button, Badge, PriceDisplay, StarRating } from "@/components/ui";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/ui/toast";
import { Product } from "@/types";
import { trackViewProduct, trackAddToCart } from "@/lib/analytics";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();
  const inCart = isInCart(product.id);

  useEffect(() => {
    trackViewProduct(product.id, product.name, product.price);
  }, [product.id, product.name, product.price]);

  const handleAddToCart = () => {
    if (inCart) return;
    trackAddToCart(product.id, product.name, product.price);
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price,
      preview_image: product.preview_image,
    });
    toast("Aggiunto al carrello", "success");
  };

  const metadata = [
    { icon: BookOpen, label: "Università", value: product.university },
    product.professor && {
      icon: User,
      label: "Professore",
      value: product.professor,
    },
    product.academic_year && {
      icon: Calendar,
      label: "Anno",
      value: product.academic_year,
    },
    product.pages && {
      icon: FileText,
      label: "Pagine",
      value: `${product.pages} pagine`,
    },
  ].filter(Boolean) as { icon: typeof BookOpen; label: string; value: string }[];

  return (
    <div className="space-y-6">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-neutral-100 rounded-brand overflow-hidden">
        {product.preview_image ? (
          <Image
            src={product.preview_image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <FileText size={64} />
          </div>
        )}
        {product.original_price && (
          <div className="absolute top-3 left-3">
            <Badge variant="discount">
              -
              {Math.round(
                ((product.original_price - product.price) /
                  product.original_price) *
                  100
              )}
              %
            </Badge>
          </div>
        )}
      </div>

      {/* Category */}
      {product.category && (
        <Badge>{product.category.name}</Badge>
      )}

      {/* Title */}
      <h1 className="text-display-sm">{product.name}</h1>

      {/* Rating */}
      {product.review_count > 0 && (
        <div className="flex items-center gap-2">
          <StarRating rating={product.average_rating} size={18} />
          <span className="text-body-sm text-neutral-500">
            {product.average_rating.toFixed(1)} ({product.review_count}{" "}
            {product.review_count === 1 ? "recensione" : "recensioni"})
          </span>
        </div>
      )}

      {/* Price */}
      <PriceDisplay
        price={product.price}
        originalPrice={product.original_price}
        size="lg"
      />

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3">
        {metadata.map((meta) => (
          <div
            key={meta.label}
            className="flex items-center gap-2 p-3 rounded-brand bg-neutral-50 border border-neutral-200"
          >
            <meta.icon size={16} className="text-primary-400 flex-shrink-0" />
            <div>
              <p className="text-caption text-neutral-400">{meta.label}</p>
              <p className="text-body-sm font-medium text-neutral-800">
                {meta.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-body-lg font-bold mb-3">Descrizione</h2>
        <p className="text-body-sm text-neutral-500 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Format badge */}
      <div className="flex items-center gap-2">
        <Badge variant="success">
          {product.format.toUpperCase()}
        </Badge>
        <span className="text-caption text-neutral-400">
          Download immediato
        </span>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-40 safe-bottom">
        <div className="container-app flex items-center justify-between gap-4">
          <PriceDisplay
            price={product.price}
            originalPrice={product.original_price}
            size="md"
          />
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={inCart}
            className="flex-1 max-w-[200px]"
          >
            {inCart ? (
              <>
                <Check size={18} /> Nel carrello
              </>
            ) : (
              <>
                <ShoppingCart size={18} /> Aggiungi
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
