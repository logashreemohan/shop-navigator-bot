import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Wallet, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface PaymentCheckoutProps {
  items: ShoppingItem[];
  onPaymentComplete: () => void;
  onBack: () => void;
}

const sampleItems: ShoppingItem[] = [
  { id: '1', name: 'Organic Milk', quantity: 1, price: 4.99 },
  { id: '2', name: 'Fresh Bread', quantity: 2, price: 3.50 },
  { id: '3', name: 'Red Apples', quantity: 5, price: 6.25 },
  { id: '4', name: 'Chicken Breast', quantity: 1, price: 12.99 },
];

export default function PaymentCheckout({ 
  items = sampleItems, 
  onPaymentComplete, 
  onBack 
}: PaymentCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState('qpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qpayPhone, setQpayPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      if (paymentMethod === 'qpay' && !qpayPhone) {
        throw new Error('Please enter your QPay phone number');
      }
      
      if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv || !cardName)) {
        throw new Error('Please fill in all card details');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful! 🎉",
        description: `Paid $${total.toFixed(2)} via ${paymentMethod === 'qpay' ? 'QPay' : 'Credit Card'}`,
      });
      
      onPaymentComplete();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            {/* QPay Option */}
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="qpay" id="qpay" />
              <Label htmlFor="qpay" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">QPay</p>
                    <p className="text-sm text-muted-foreground">Pay with your mobile wallet</p>
                  </div>
                  <Badge variant="secondary">Popular</Badge>
                </div>
              </Label>
            </div>

            {/* Credit Card Option */}
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Digital Wallet Option */}
            <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-60">
              <RadioGroupItem value="wallet" id="wallet" disabled />
              <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Digital Wallet</p>
                    <p className="text-sm text-muted-foreground">Apple Pay, Google Pay (Coming Soon)</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Payment Form */}
          <div className="mt-6 space-y-4">
            {paymentMethod === 'qpay' && (
              <div className="space-y-3">
                <Label htmlFor="qpay-phone">QPay Phone Number</Label>
                <Input
                  id="qpay-phone"
                  placeholder="Enter your QPay phone number"
                  value={qpayPhone}
                  onChange={(e) => setQpayPhone(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  You'll receive a notification on your QPay app to confirm payment
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full mt-6 h-12 text-lg font-semibold"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Pay ${total.toFixed(2)}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Your payment information is secure and encrypted
          </p>
        </Card>
      </div>
    </div>
  );
}