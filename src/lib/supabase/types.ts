export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  created_at?: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  created_at?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  created_at?: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  subcategory_id?: string;
  brand_id?: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  sku?: string;
  model_no?: string;
  description: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  subcategory?: Subcategory;
  brand?: Brand;
};

export type Slider = {
  id: string;
  title?: string;
  subtitle?: string;
  image_url: string;
  link?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
};

export type OrderStatus =
  | 'new'
  | 'payment_pending'
  | 'confirmed'
  | 'packaging'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type ShippingArea = 'inside_dhaka' | 'outside_dhaka';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_area: ShippingArea;
  delivery_charge: number;
  subtotal: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  user_id?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
  payment?: Payment;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id?: string;
  product_title: string;
  price: number;
  quantity: number;
  total: number;
  created_at?: string;
};

export type Payment = {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  sender_number: string;
  trx_id: string;
  amount: number;
  status: PaymentStatus;
  admin_notes?: string;
  verified_at?: string;
  created_at: string;
};

export type StoreSettings = {
  id: string;
  store_name: string;
  logo_url?: string;
  whatsapp_number: string;
  hotline_phone?: string;
  bkash_number: string;
  nagad_number: string;
  rocket_number: string;
  delivery_charge_inside_dhaka: number;
  delivery_charge_outside_dhaka: number;
  admin_notification_email: string;
  support_email?: string;
  updated_at?: string;
};
