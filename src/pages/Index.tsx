
import React, { useEffect, useState } from 'react';
import { Order, fetchOrders, fetchOrderById } from '@/services/orderService';
import OrderSidebar from '@/components/OrderSidebar';
import OrderDetail from '@/components/OrderDetail';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState<boolean>(false);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
        
        // Auto-select first order if available and none selected
        if (fetchedOrders.length > 0 && !selectedOrderId) {
          setSelectedOrderId(fetchedOrders[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, [toast]);

  // Load selected order details when selectedOrderId changes
  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!selectedOrderId) {
        setSelectedOrder(null);
        return;
      }

      setIsLoadingOrderDetails(true);
      try {
        const orderDetails = await fetchOrderById(selectedOrderId);
        if (orderDetails) {
          setSelectedOrder(orderDetails);
        } else {
          setSelectedOrder(null);
          toast({
            title: 'Not Found',
            description: `Order #${selectedOrderId} could not be found.`,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load order details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingOrderDetails(false);
      }
    };

    loadOrderDetails();
  }, [selectedOrderId, toast]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    // Update the order in the orders list
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    
    // Update the selected order if it's the one that was updated
    if (selectedOrder && selectedOrder.id === updatedOrder.id) {
      setSelectedOrder(updatedOrder);
    }
  };

  // For mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Order Vista</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-4/5">
              <OrderSidebar
                orders={orders}
                selectedOrderId={selectedOrderId}
                onSelectOrder={(orderId) => {
                  handleSelectOrder(orderId);
                  // Close the sheet automatically on mobile after selection
                  document.body.click(); // This is a hack to close the sheet
                }}
                isLoading={isLoadingOrders}
              />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex-1 overflow-auto">
          <OrderDetail
            order={selectedOrder}
            isLoading={isLoadingOrderDetails}
            onOrderUpdated={handleOrderUpdated}
          />
        </div>
      </div>
    );
  }

  // For desktop view
  return (
    <div className="flex h-screen bg-background">
      {/* Order sidebar - 20% width */}
      <div className="w-1/5 border-r h-full">
        <OrderSidebar
          orders={orders}
          selectedOrderId={selectedOrderId}
          onSelectOrder={handleSelectOrder}
          isLoading={isLoadingOrders}
        />
      </div>
      
      {/* Main content area - 80% width */}
      <div className="w-4/5 h-full">
        <OrderDetail
          order={selectedOrder}
          isLoading={isLoadingOrderDetails}
          onOrderUpdated={handleOrderUpdated}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
