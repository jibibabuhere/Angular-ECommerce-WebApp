export interface CartItem {
    product_id: string;
    name: string;
    desc: string;
    price: number;
    currency: string;
    imageUrl: string;
    quantity: number;
    tax: number;
    discount: number;
    deliveryCharge: number;
    total: number;
  }