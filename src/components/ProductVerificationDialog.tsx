
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { OrderItem } from '@/services/orderService';

interface ProductVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: OrderItem[];
}

const ProductVerificationDialog: React.FC<ProductVerificationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  items
}) => {
  // State to track verification status for each individual item instance
  const [verificationStatus, setVerificationStatus] = useState<Record<string, {
    verified: boolean;
    verifying: boolean;
    scannedBarcode: string;
    error: boolean;
  }>>({});

  // Initialize verification status for all individual item instances
  useEffect(() => {
    const initialStatus: Record<string, {
      verified: boolean;
      verifying: boolean;
      scannedBarcode: string;
      error: boolean;
    }> = {};
    
    items.forEach(item => {
      // Create separate entries for each quantity of the item
      for (let i = 0; i < item.quantity; i++) {
        const itemInstanceId = `${item.id}-${i}`;
        initialStatus[itemInstanceId] = {
          verified: false,
          verifying: false,
          scannedBarcode: '',
          error: false
        };
      }
    });
    
    setVerificationStatus(initialStatus);
  }, [items]);

  // Check if all items are verified
  const allItemsVerified = Object.values(verificationStatus).every(status => status.verified);

  // Handle barcode input change for a specific item instance
  const handleBarcodeInput = (itemInstanceId: string, value: string) => {
    setVerificationStatus(prev => ({
      ...prev,
      [itemInstanceId]: {
        ...prev[itemInstanceId],
        scannedBarcode: value,
        error: false
      }
    }));
  };

  // Handle verify button click for a specific item instance
  const handleVerify = (itemInstanceId: string, barcode: string) => {
    setVerificationStatus(prev => ({
      ...prev,
      [itemInstanceId]: {
        ...prev[itemInstanceId],
        verifying: true
      }
    }));

    // Simulate verification process (in a real app, this might be an API call)
    setTimeout(() => {
      const isMatch = verificationStatus[itemInstanceId].scannedBarcode === barcode;
      
      setVerificationStatus(prev => ({
        ...prev,
        [itemInstanceId]: {
          ...prev[itemInstanceId],
          verified: isMatch,
          verifying: false,
          error: !isMatch
        }
      }));
    }, 500);
  };

  // Format date as YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Verify Products Before Processing</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Scan each product barcode to verify before processing the order.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Exp Date</TableHead>
                <TableHead>Verify Barcode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.flatMap((item) => {
                // Generate multiple rows based on quantity
                const rows = [];
                for (let i = 0; i < item.quantity; i++) {
                  const itemInstanceId = `${item.id}-${i}`;
                  const status = verificationStatus[itemInstanceId] || {
                    verified: false,
                    verifying: false,
                    scannedBarcode: '',
                    error: false
                  };
                  
                  rows.push(
                    <TableRow key={itemInstanceId}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.barcode || 'BC-' + item.id}</TableCell>
                      <TableCell>{item.expDate ? formatDate(item.expDate) : '2024-12-31'}</TableCell>
                      <TableCell>
                        <Input
                          placeholder="Scan barcode here"
                          value={status.scannedBarcode}
                          onChange={(e) => handleBarcodeInput(itemInstanceId, e.target.value)}
                          className={status.error ? "border-red-500" : ""}
                          disabled={status.verified}
                        />
                      </TableCell>
                      <TableCell>
                        {status.verified ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle2 className="h-5 w-5 mr-1" />
                            Verified
                          </span>
                        ) : status.error ? (
                          <span className="flex items-center text-red-600">
                            <XCircle className="h-5 w-5 mr-1" />
                            Invalid
                          </span>
                        ) : status.verifying ? (
                          <span className="flex items-center text-amber-600">
                            <RefreshCw className="h-5 w-5 mr-1 animate-spin" />
                            Verifying
                          </span>
                        ) : (
                          <span className="flex items-center text-muted-foreground">
                            <AlertCircle className="h-5 w-5 mr-1" />
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleVerify(itemInstanceId, item.barcode || 'BC-' + item.id)}
                          disabled={status.verified || !status.scannedBarcode || status.verifying}
                        >
                          Confirm
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }
                return rows;
              })}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={!allItemsVerified}
            className="bg-order-processing hover:bg-amber-600"
          >
            Confirm All & Process Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductVerificationDialog;
