export type CartItem = { 
  productId: number; 
  name: string; 
  imageUrl?: string | null; 
  unitPrice: number; 
  quantity: number; 
  lineTotal: number; 
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  category?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type OrderItem = { 
  id: number; 
  productId: number; 
  productName: string; 
  unitPrice: number; 
  quantity: number; 
};

export type Order = {
  id: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
};
