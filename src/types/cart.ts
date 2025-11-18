export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "completed" | "failed";
  transactionHash?: string;
  createdAt: number;
}

