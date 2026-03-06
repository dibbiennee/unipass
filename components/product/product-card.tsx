"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import { Card, Badge, PriceDisplay, StarRating, Button } from "@/components/ui";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/ui/toast";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;

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

  return (
    <Link href={`/catalogo/${product.slug}`}>
      <Card className="h-full flex flex-col overflow-hidden group">
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
          {product.preview_image ? (
            <Image
              src={product.preview_image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${
                  ["#6366F1,#818CF8", "#F59E0B,#FBBF24", "#10B981,#34D399", "#EC4899,#F472B6", "#8B5CF6,#A78BFA", "#3B82F6,#60A5FA"][
                    Math.abs(product.name.charCodeAt(0) + product.name.charCodeAt(1)) % 6
                  ]
                })`,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className="text-white/90 text-caption font-bold text-center px-2 line-clamp-1">
                PDF
              </span>
            </div>
          )}
          {product.original_price && (
            <div className="absolute top-2 left-2">
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

        <div className="flex flex-col flex-1 p-3">
          <p className="text-caption text-neutral-400 mb-1">
            {product.university}
          </p>
          <h3 className="text-body-sm font-bold text-neutral-900 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {product.review_count > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <StarRating rating={product.average_rating} size={12} />
              <span className="text-caption text-neutral-400">
                ({product.review_count})
              </span>
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-2">
            <PriceDisplay
              price={product.price}
              originalPrice={product.original_price}
              size="sm"
            />
            <Button
              size="icon"
              variant={inCart ? "ghost" : "primary"}
              onClick={handleAddToCart}
              disabled={inCart}
              className="flex-shrink-0"
            >
              {inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
