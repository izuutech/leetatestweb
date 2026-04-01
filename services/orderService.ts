import { Order, OrderResponse } from "@/types/order";

// Mock data with Nigerian phone numbers
const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    customerName: "John Doe",
    phone: "08012345678",
    quantity: "12.5kg",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "2",
    customerName: "Jane Smith",
    phone: "08098765432",
    quantity: "6kg",
    status: "in_transit",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: "3",
    customerName: "Bob Johnson",
    phone: "08055555555",
    quantity: "12.5kg",
    status: "delivered",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "4",
    customerName: "Alice Brown",
    phone: "08044444444",
    quantity: "25kg",
    status: "pending",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
  },
  {
    id: "5",
    customerName: "Michael Okafor",
    phone: "08033333333",
    quantity: "50kg",
    status: "in_transit",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    id: "6",
    customerName: "Sarah Adeyemi",
    phone: "08022222222",
    quantity: "12.5kg",
    status: "pending",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
  },
  {
    id: "7",
    customerName: "David Okonkwo",
    phone: "08011111111",
    quantity: "25kg",
    status: "delivered",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "8",
    customerName: "Grace Eze",
    phone: "08099999999",
    quantity: "6kg",
    status: "in_transit",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderService = {
  async fetchOrders(): Promise<OrderResponse> {
    try {
      await delay(800);

      // Simulate random error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error("Network connection failed");
      }

      return {
        orders: MOCK_ORDERS,
        total: MOCK_ORDERS.length,
      };
    } catch (error) {
      throw new Error("Unable to fetch orders. Please check your connection.");
    }
  },

  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
  ): Promise<Order> {
    try {
      await delay(500);

      const order = MOCK_ORDERS.find((o) => o.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      // Simulate random error (3% chance)
      if (Math.random() < 0.03) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = { ...order, status };
      const index = MOCK_ORDERS.findIndex((o) => o.id === orderId);
      if (index !== -1) {
        MOCK_ORDERS[index] = updatedOrder;
      }

      return updatedOrder;
    } catch (error) {
      throw new Error("Failed to update order status. Please try again.");
    }
  },
};
