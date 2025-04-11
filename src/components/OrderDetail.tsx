
import React from 'react';
import { Order, OrderStatus, updateOrderStatus } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  PackageCheck, 
  PackageX, 
  ShoppingCart, 
  Truck, 
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderDetailProps = {
  order: Order | null;
  isLoading: boolean;
  onOrderUpdated: (updatedOrder: Order) => void;
};

const OrderDetail: React.FC<OrderDetailProps> = ({ 
  order, 
  isLoading,
  onOrderUpdated
}) => {
  const [updatingStatus, setUpdatingStatus] = React.useState<boolean>(false);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    setUpdatingStatus(true);
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus);
      if (updatedOrder) {
        onOrderUpdated(updatedOrder);
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("An error occurred while updating order status");
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Status icon mapping
  const statusIcon: Record<OrderStatus, React.ReactNode> = {
    new: <ShoppingCart className="h-5 w-5" />,
    processing: <Truck className="h-5 w-5" />,
    completed: <PackageCheck className="h-5 w-5" />,
    cancelled: <PackageX className="h-5 w-5" />,
  };

  // Status color mapping
  const statusColor: Record<OrderStatus, string> = {
    new: 'bg-order-new text-white',
    processing: 'bg-order-processing text-white',
    completed: 'bg-order-completed text-white',
    cancelled: 'bg-order-cancelled text-white',
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Order Selected</CardTitle>
            <CardDescription>
              Select an order from the sidebar to view details
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-muted-foreground">
              <Calendar className="inline h-4 w-4 mr-1" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge className={cn('text-md py-1 px-3', statusColor[order.status])}>
            {statusIcon[order.status]}
            <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.customer.name}</p>
                <p className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  {order.customer.email}
                </p>
                <p className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  {order.customer.phone}
                </p>
                {order.customer.address && (
                  <p className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                    <span>{order.customer.address}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <p>Total</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {order.status === 'new' && (
                <Button
                  variant="default"
                  onClick={() => handleStatusUpdate('processing')}
                  disabled={updatingStatus}
                  className="bg-order-processing hover:bg-amber-600"
                >
                  {updatingStatus ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Truck className="h-4 w-4 mr-2" />
                  )}
                  Process Order
                </Button>
              )}
              
              {(order.status === 'new' || order.status === 'processing') && (
                <Button
                  variant="default"
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={updatingStatus}
                  className="bg-order-completed hover:bg-green-600"
                >
                  {updatingStatus ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <PackageCheck className="h-4 w-4 mr-2" />
                  )}
                  Complete Order
                </Button>
              )}
              
              {(order.status === 'new' || order.status === 'processing') && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={updatingStatus}
                  className="text-order-cancelled border-order-cancelled hover:bg-red-50"
                >
                  {updatingStatus ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <PackageX className="h-4 w-4 mr-2" />
                  )}
                  Cancel Order
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Last updated: {formatDate(order.updatedAt)}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
