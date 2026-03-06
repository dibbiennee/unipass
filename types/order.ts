import { CartItem } from "./product";

export interface CheckoutRequest {
  items: CartItem[];
  customer_email: string;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
}

export interface OrderConfirmation {
  order_id: string;
  customer_email: string;
  items: {
    product_name: string;
    /** Price in EUR cents */
    price: number;
    download_url: string;
  }[];
  /** Total in EUR cents */
  total: number;
}
