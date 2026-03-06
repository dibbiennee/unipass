export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  /** Price in EUR cents */
  price: number;
  /** Original price in EUR cents (for showing discounts) */
  original_price: number | null;
  university: string;
  professor: string | null;
  academic_year: string | null;
  pages: number | null;
  format: string;
  file_path: string | null;
  preview_image: string | null;
  is_featured: boolean;
  is_active: boolean;
  average_rating: number;
  review_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
}

export interface Order {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  customer_email: string;
  /** Total in EUR cents */
  total: number;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
  updated_at: string;
  // Joined fields
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  /** Price at time of purchase in EUR cents */
  price: number;
  product_name: string;
  created_at: string;
  // Joined fields
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  order_id: string;
  customer_email: string;
  display_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface DownloadToken {
  id: string;
  order_item_id: string;
  product_id: string;
  token: string;
  download_count: number;
  max_downloads: number;
  expires_at: string;
  created_at: string;
}
