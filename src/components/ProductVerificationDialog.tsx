
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
import { CheckCircle2, XCircle, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';
import { OrderItem } from '@/services/orderService';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    cancelled: boolean;
  }>>({});

  // State for cancel confirmation dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [itemToCancel, setItemToCancel] = useState<string | null>(null);
  
  // State to track if verification dialog should be reopened after cancel confirmation
  const [shouldFocusVerificationDialog, setShouldFocusVerificationDialog] = useState(false);

  // Initialize verification status for all individual item instances
  useEffect(() => {
    const initialStatus: Record<string, {
      verified: boolean;
      verifying: boolean;
      scannedBarcode: string;
      error: boolean;
      cancelled: boolean;
    }> = {};
    
    items.forEach(item => {
      // Create separate entries for each quantity of the item
      for (let i = 0; i < item.quantity; i++) {
        const itemInstanceId = `${item.id}-${i}`;
        initialStatus[itemInstanceId] = {
          verified: false,
          verifying: false,
          scannedBarcode: '',
          error: false,
          cancelled: false
        };
      }
    });
    
    setVerificationStatus(initialStatus);
  }, [items]);

  // Check if all items are verified or cancelled
  const allItemsProcessed = Object.values(verificationStatus).every(
    status => status.verified || status.cancelled
  );

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

  // Handle cancel item button click
  const handleCancelItem = (itemInstanceId: string) => {
    setItemToCancel(itemInstanceId);
    setCancelDialogOpen(true);
    // When opening the cancel dialog, we want to return focus to the verification dialog after
    setShouldFocusVerificationDialog(true);
  };

  // Confirm cancellation of item
  const confirmCancelItem = () => {
    if (itemToCancel) {
      setVerificationStatus(prev => ({
        ...prev,
        [itemToCancel]: {
          ...prev[itemToCancel],
          cancelled: true,
          verified: false,
          verifying: false,
          error: false
        }
      }));
    }
    
    // Close the cancel dialog
    setCancelDialogOpen(false);
    setItemToCancel(null);
    
    // The verification dialog should already be in focus since shouldFocusVerificationDialog is true
    // We'll reset this flag now that we're done
    setShouldFocusVerificationDialog(false);
  };

  // Format date as YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handle the AlertDialog's onOpenChange event to maintain dialog focus state
  const handleAlertDialogOpenChange = (open: boolean) => {
    if (!open && shouldFocusVerificationDialog) {
      // When alert dialog is closed and we should focus on verification dialog
      setCancelDialogOpen(false);
      setShouldFocusVerificationDialog(false);
    }
  };

  return (
    <>
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
                  <TableHead className="w-[160px]">Actions</TableHead>
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
                      error: false,
                      cancelled: false
                    };
                    
                    rows.push(
                      <TableRow key={itemInstanceId} className={status.cancelled ? "opacity-60 bg-gray-100" : ""}>
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
                            disabled={status.verified || status.cancelled}
                          />
                        </TableCell>
                        <TableCell>
                          {status.cancelled ? (
                            <span className="flex items-center text-gray-500">
                              <XCircle className="h-5 w-5 mr-1" />
                              Cancelled
                            </span>
                          ) : status.verified ? (
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
                          <div className="flex gap-2">
                            {!status.cancelled && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleVerify(itemInstanceId, item.barcode || 'BC-' + item.id)}
                                  disabled={status.verified || !status.scannedBarcode || status.verifying}
                                >
                                  Confirm
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleCancelItem(itemInstanceId)}
                                  disabled={status.verified}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
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
              disabled={!allItemsProcessed}
              className="bg-order-processing hover:bg-amber-600"
            >
              Confirm All & Process Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation confirmation dialog */}
      <AlertDialog 
        open={cancelDialogOpen} 
        onOpenChange={handleAlertDialogOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setCancelDialogOpen(false);
              setShouldFocusVerificationDialog(false);
            }}>
              No, keep item
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelItem} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, cancel item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductVerificationDialog;
