import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Wallet,
  Gift,
  Building2,
  Droplets,
  FileText,
  Heart,
  CheckCircle,
  Loader2,
  Shield,
  ArrowRight,
  Sparkles,
  IndianRupee,
  Receipt,
  Timer,
} from "lucide-react";
import {
  loadRazorpaySDK,
  createOrder,
  processPayment,
  redeemReward,
  getPaymentHistory,
  PAYMENT_TYPES,
  REWARD_ITEMS,
  type PaymentResult,
  type RewardRedemption,
} from "@/lib/paymentService";
import { useToast } from "@/hooks/use-toast";

interface PaymentGatewayProps {
  userId?: string;
  userPoints?: number;
  userPhone?: string;
  userEmail?: string;
}

const PaymentGateway = ({
  userId = "user-123",
  userPoints = 1500,
  userPhone = "9876543210",
  userEmail = "user@example.com",
}: PaymentGatewayProps) => {
  const { toast } = useToast();
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [redemptionResult, setRedemptionResult] = useState<RewardRedemption | null>(null);
  const [points, setPoints] = useState(userPoints);

  const handlePayment = async () => {
    if (!selectedPaymentType) return;

    const paymentType = PAYMENT_TYPES.find(p => p.id === selectedPaymentType);
    if (!paymentType) return;

    const amount = paymentType.amount || parseInt(customAmount) * 100;
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Load Razorpay SDK
      await loadRazorpaySDK();

      // Create order
      const order = await createOrder(amount, paymentType.id);

      // Process payment
      const result = await processPayment(order, {
        name: "SUVIDHA Payment",
        description: paymentType.description,
        prefill: {
          email: userEmail,
          contact: userPhone,
        },
      });

      setPaymentResult(result);

      // Add points for payment (1 point per ₹10)
      const earnedPoints = Math.floor(amount / 1000);
      setPoints(prev => prev + earnedPoints);

      toast({
        title: "Payment Successful! 🎉",
        description: `Transaction ID: ${result.transactionId}. You earned ${earnedPoints} points!`,
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async () => {
    if (!selectedReward) return;

    const reward = REWARD_ITEMS.find(r => r.id === selectedReward);
    if (!reward) return;

    if (points < reward.pointsRequired) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.pointsRequired - points} more points`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await redeemReward(userId, reward.id, reward.pointsRequired);
      setRedemptionResult(result);
      setPoints(prev => prev - reward.pointsRequired);

      toast({
        title: "Reward Redeemed! 🎁",
        description: `You received ${reward.name}. Check your email for details.`,
      });
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "Could not redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (id: string) => {
    switch (id) {
      case "property_tax":
        return Building2;
      case "water_bill":
        return Droplets;
      case "birth_certificate":
      case "income_certificate":
        return FileText;
      case "donation":
        return Heart;
      default:
        return CreditCard;
    }
  };

  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Reward Points Balance</p>
              <p className="text-4xl font-bold">{points.toLocaleString()}</p>
              <p className="text-white/70 text-sm mt-1">
                ≈ ₹{(points * 0.5).toLocaleString()} value
              </p>
            </div>
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pay" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pay" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Pay Bills
          </TabsTrigger>
          <TabsTrigger value="redeem" className="gap-2">
            <Gift className="h-4 w-4" />
            Redeem Points
          </TabsTrigger>
        </TabsList>

        {/* Payment Tab */}
        <TabsContent value="pay" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>
                Pay government fees, bills, and donations securely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedPaymentType || ""}
                onValueChange={setSelectedPaymentType}
              >
                <div className="grid gap-3">
                  {PAYMENT_TYPES.map(type => {
                    const Icon = getPaymentIcon(type.id);
                    return (
                      <div
                        key={type.id}
                        className={cn(
                          "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                          selectedPaymentType === type.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        )}
                        onClick={() => setSelectedPaymentType(type.id)}
                      >
                        <RadioGroupItem value={type.id} id={type.id} />
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          type.category === "utility" && "bg-blue-100 text-blue-600",
                          type.category === "certificate" && "bg-green-100 text-green-600",
                          type.category === "donation" && "bg-pink-100 text-pink-600"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={type.id} className="font-medium cursor-pointer">
                            {type.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                        <div className="text-right">
                          {type.amount ? (
                            <p className="font-bold">₹{(type.amount / 100).toLocaleString()}</p>
                          ) : (
                            <Badge variant="outline">Custom</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>

              {selectedPaymentType && !PAYMENT_TYPES.find(p => p.id === selectedPaymentType)?.amount && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Enter Amount (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Separator />
              <div className="w-full flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Points you'll earn:</span>
                <span className="font-medium text-green-600">
                  +{selectedPaymentType 
                    ? Math.floor((PAYMENT_TYPES.find(p => p.id === selectedPaymentType)?.amount || parseInt(customAmount) * 100 || 0) / 1000)
                    : 0} pts
                </span>
              </div>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handlePayment}
                disabled={!selectedPaymentType || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                Pay Securely with Razorpay
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                100% Secure Payments • UPI, Cards, Net Banking
              </div>
            </CardFooter>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: "TXN001", type: "Water Bill", amount: 850, date: "Today, 2:30 PM", status: "success" },
                  { id: "TXN002", type: "Birth Certificate", amount: 50, date: "Yesterday", status: "success" },
                  { id: "TXN003", type: "Property Tax", amount: 15000, date: "Dec 15, 2024", status: "success" },
                ].map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tx.type}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{tx.amount.toLocaleString()}</p>
                      <p className="text-xs text-green-600">{tx.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redeem Tab */}
        <TabsContent value="redeem" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redeem Your Points</CardTitle>
              <CardDescription>
                Exchange points for rewards and benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {REWARD_ITEMS.map(reward => {
                  const canAfford = points >= reward.pointsRequired;
                  return (
                    <div
                      key={reward.id}
                      className={cn(
                        "relative p-4 border rounded-lg transition-all cursor-pointer",
                        selectedReward === reward.id
                          ? "border-primary ring-2 ring-primary/20"
                          : canAfford
                          ? "hover:border-primary/50"
                          : "opacity-60 cursor-not-allowed"
                      )}
                      onClick={() => canAfford && setSelectedReward(reward.id)}
                    >
                      {!canAfford && (
                        <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                          <Badge variant="secondary">
                            Need {(reward.pointsRequired - points).toLocaleString()} more
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                          <Gift className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{reward.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {reward.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {reward.pointsRequired.toLocaleString()} pts
                            </Badge>
                            <span className="text-xs text-green-600">
                              ≈ ₹{reward.cashValue}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleRedeemReward}
                disabled={!selectedReward || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Gift className="h-4 w-4" />
                )}
                Redeem Reward
                {selectedReward && (
                  <span className="ml-1">
                    ({REWARD_ITEMS.find(r => r.id === selectedReward)?.pointsRequired.toLocaleString()} pts)
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Redemption History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Redemption History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { reward: "₹100 Cashback", points: 200, date: "Dec 10, 2024", status: "completed" },
                  { reward: "Free Certificate", points: 500, date: "Nov 25, 2024", status: "completed" },
                ].map((redemption, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Gift className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{redemption.reward}</p>
                        <p className="text-xs text-muted-foreground">{redemption.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-orange-600">
                      -{redemption.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Success Modal */}
      {paymentResult && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
          <CardContent className="py-6 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-400">
              Payment Successful!
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Transaction ID: {paymentResult.transactionId}
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Receipt className="h-4 w-4" />
                Download Receipt
              </Button>
              <Button
                size="sm"
                onClick={() => setPaymentResult(null)}
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentGateway;
