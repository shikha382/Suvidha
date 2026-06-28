import Layout from "@/components/layout/Layout";
import BlockchainTracker from "@/components/BlockchainTracker";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Blocks, Shield, Link, Award, FileCheck } from "lucide-react";

const BlockchainPage = () => {
  const [searchParams] = useSearchParams();
  const complaintId = searchParams.get("id") || "demo-complaint-123";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Blocks className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Blockchain Transparency</h1>
              <p className="text-muted-foreground">
                Immutable, tamper-proof records of all complaint actions
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Tamper-Proof</p>
                  <p className="text-sm text-muted-foreground">
                    Immutable records
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Link className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Chain Linked</p>
                  <p className="text-sm text-muted-foreground">
                    Hash-linked blocks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileCheck className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Smart Contracts</p>
                  <p className="text-sm text-muted-foreground">
                    Auto-escalation rules
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-medium">NFT Certificates</p>
                  <p className="text-sm text-muted-foreground">
                    Resolution proof
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Tracker */}
        <BlockchainTracker
          complaintId={complaintId}
          complaintData={{
            title: "Road Pothole Near City Center",
            category: "Roads & Infrastructure",
            location: "Sector 15, Main Road",
            status: "resolved",
          }}
        />
      </div>
    </Layout>
  );
};

export default BlockchainPage;
