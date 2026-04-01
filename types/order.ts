export type OrderStatus = "pending" | "in_transit" | "delivered";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  quantity: string;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderResponse {
  orders: Order[];
  total: number;
}
