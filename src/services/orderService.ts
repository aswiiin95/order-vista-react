
export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: '1001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      address: '123 Main St, Anytown, CA 94567',
    },
    items: [
      { id: 'item1', name: 'Product A', quantity: 2, price: 29.99 },
      { id: 'item2', name: 'Product B', quantity: 1, price: 49.99 },
    ],
    total: 109.97,
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '1002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-5678',
      address: '456 Oak St, Somewhere, NY 10001',
    },
    items: [
      { id: 'item3', name: 'Product C', quantity: 3, price: 19.99 },
    ],
    total: 59.97,
    status: 'processing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: '1003',
    customer: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '555-9012',
      address: '789 Pine St, Nowhere, TX 75001',
    },
    items: [
      { id: 'item4', name: 'Product D', quantity: 1, price: 99.99 },
      { id: 'item5', name: 'Product E', quantity: 2, price: 34.99 },
    ],
    total: 169.97,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
  },
  {
    id: '1004',
    customer: {
      name: 'Alice Williams',
      email: 'alice@example.com',
      phone: '555-3456',
      address: '321 Maple St, Elsewhere, FL 33101',
    },
    items: [
      { id: 'item6', name: 'Product F', quantity: 1, price: 149.99 },
    ],
    total: 149.99,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(), // 7 hours ago
  },
  {
    id: '1005',
    customer: {
      name: 'Emma Brown',
      email: 'emma@example.com',
      phone: '555-7890',
      address: '654 Cedar St, Someplace, WA 98001',
    },
    items: [
      { id: 'item7', name: 'Product G', quantity: 2, price: 39.99 },
      { id: 'item8', name: 'Product H', quantity: 1, price: 59.99 },
      { id: 'item9', name: 'Product I', quantity: 3, price: 14.99 },
    ],
    total: 184.94,
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

// Simulate API call delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all orders
export const fetchOrders = async (): Promise<Order[]> => {
  console.log('Fetching orders...');
  await delay(800); // Simulate network delay
  return [...mockOrders];
};

// Fetch a single order by ID
export const fetchOrderById = async (orderId: string): Promise<Order | undefined> => {
  console.log(`Fetching order with ID: ${orderId}`);
  await delay(500);
  return mockOrders.find(order => order.id === orderId);
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order | undefined> => {
  console.log(`Updating order ${orderId} status to ${status}`);
  await delay(600);
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) return undefined;
  
  const updatedOrder = {
    ...mockOrders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  mockOrders[orderIndex] = updatedOrder;
  return updatedOrder;
};
