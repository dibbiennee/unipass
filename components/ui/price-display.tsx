import { formatPrice } from "@/lib/format-price";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  price,
  originalPrice,
  className,
  size = "md",
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-body-sm",
    md: "text-body-lg",
    lg: "text-display-sm",
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span className={cn("font-bold text-neutral-900", sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-body-sm text-neutral-400 line-through">
            {formatPrice(originalPrice)}
          </span>
          <Badge variant="discount">-{discountPercent}%</Badge>
        </>
      )}
    </div>
  );
}
