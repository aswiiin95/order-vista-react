export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode?: string;
  expDate?: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1001',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      address: '123 Main St, Anytown, CA 12345'
    },
    items: [
      { id: '1', name: 'Wireless Headphones', price: 79.99, quantity: 1, barcode: 'BRC-9876543210', expDate: '2025-06-30' },
      { id: '2', name: 'Smartphone Case', price: 19.99, quantity: 2, barcode: 'BRC-1234567890', expDate: '2026-03-15' }
    ],
    total: 119.97,
    status: 'new',
    createdAt: '2023-04-10T14:30:00Z',
    updatedAt: '2023-04-10T14:30:00Z'
  },
  {
    id: '1002',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(987) 654-3210',
      address: '456 Oak Ave, Somewhere, NY 54321'
    },
    items: [
      { id: '3', name: 'Bluetooth Speaker', price: 49.99, quantity: 1, barcode: 'BRC-5678901234', expDate: '2024-12-31' },
      { id: '4', name: 'USB-C Cable', price: 12.99, quantity: 3, barcode: 'BRC-6789012345', expDate: '2027-01-10' }
    ],
    total: 88.96,
    status: 'processing',
    createdAt: '2023-04-09T10:15:00Z',
    updatedAt: '2023-04-09T16:45:00Z'
  },
  {
    id: '1003',
    customer: {
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '(555) 123-4567',
      address: '789 Pine Blvd, Elsewhere, TX 67890'
    },
    items: [
      { id: '5', name: 'Wireless Mouse', price: 29.99, quantity: 1, barcode: 'BRC-7890123456', expDate: '2025-09-22' },
      { id: '6', name: 'Keyboard', price: 59.99, quantity: 1, barcode: 'BRC-8901234567', expDate: '2025-10-15' }
    ],
    total: 89.98,
    status: 'completed',
    createdAt: '2023-04-05T09:30:00Z',
    updatedAt: '2023-04-07T11:20:00Z'
  },
  {
    id: '1004',
    customer: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      phone: '(333) 444-5555',
      address: '101 Maple Dr, Nowhere, FL 13579'
    },
    items: [
      { id: '7', name: 'External Hard Drive', price: 89.99, quantity: 1, barcode: 'BRC-9012345678', expDate: '2026-05-18' }
    ],
    total: 89.99,
    status: 'cancelled',
    createdAt: '2023-04-02T15:45:00Z',
    updatedAt: '2023-04-03T08:10:00Z'
  },
  {
    id: '1005',
    customer: {
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      phone: '(777) 888-9999',
      address: '222 Birch St, Somewhere Else, WA 24680'
    },
    items: [
      { id: '8', name: 'Wireless Earbuds', price: 49.99, quantity: 1, barcode: 'BRC-0123456789', expDate: '2025-11-30' },
      { id: '9', name: 'Phone Charger', price: 24.99, quantity: 2, barcode: 'BRC-2345678901', expDate: '2026-01-20' },
      { id: '10', name: 'Screen Protector', price: 9.99, quantity: 3, barcode: 'BRC-3456789012', expDate: '2027-02-25' }
    ],
    total: 119.94,
    status: 'new',
    createdAt: '2023-04-01T12:00:00Z',
    updatedAt: '2023-04-01T12:00:00Z'
  }
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
