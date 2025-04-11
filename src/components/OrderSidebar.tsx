
import React from 'react';
import { Order, OrderStatus } from '@/services/orderService';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

type OrderSidebarProps = {
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  isLoading: boolean;
};

const OrderSidebar: React.FC<OrderSidebarProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  isLoading,
}) => {
  // Function to format the time (e.g., "2 hours ago")
  const formatTime = (timestamp: string) => {
    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Function to render the status badge
  const renderStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, string> = {
      new: 'bg-order-new hover:bg-blue-600',
      processing: 'bg-order-processing hover:bg-amber-600',
      completed: 'bg-order-completed hover:bg-green-600',
      cancelled: 'bg-order-cancelled hover:bg-red-600',
    };

    return (
      <Badge className={cn('text-white', variants[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-sm text-muted-foreground">{orders.length} total</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No orders found
        </div>
      ) : (
        <div className="divide-y">
          {orders.map((order) => (
            <div
              key={order.id}
              className={cn(
                'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                selectedOrderId === order.id && 'bg-muted'
              )}
              onClick={() => onSelectOrder(order.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">#{order.id}</span>
                {renderStatusBadge(order.status)}
              </div>
              
              <p className="text-sm font-medium truncate mb-1">
                {order.customer.name}
              </p>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTime(order.createdAt)}</span>
              </div>
              
              <div className="mt-2">
                <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderSidebar;
