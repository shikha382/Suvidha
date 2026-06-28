import Layout from "@/components/layout/Layout";
import PaymentGateway from "@/components/PaymentGateway";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, Zap, Gift } from "lucide-react";

const PaymentsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Payments & Rewards</h1>
              <p className="text-muted-foreground">
                Secure payments powered by Razorpay & reward points system
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <CreditCard className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium">UPI & Cards</p>
              <p className="text-xs text-muted-foreground">All payment methods</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">100% Secure</p>
              <p className="text-xs text-muted-foreground">PCI DSS compliant</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium">Instant</p>
              <p className="text-xs text-muted-foreground">Real-time processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Gift className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium">Earn Rewards</p>
              <p className="text-xs text-muted-foreground">Points on every payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Gateway */}
        <PaymentGateway
          userId="user-123"
          userPoints={1500}
          userPhone="9876543210"
          userEmail="citizen@example.com"
        />
      </div>
    </Layout>
  );
};

export default PaymentsPage;
