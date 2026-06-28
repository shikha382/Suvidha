import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Shield,
  CheckCircle,
  Clock,
  Link,
  FileCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Loader2,
  Blocks,
  Award,
} from "lucide-react";
import {
  recordOnBlockchain,
  verifyComplaintHistory,
  getComplaintTransactions,
  getSmartContracts,
  mintResolutionCertificate,
  type BlockchainTransaction,
  type BlockchainVerification,
  type SmartContractRule,
  type ResolutionCertificate,
} from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";

interface BlockchainTrackerProps {
  complaintId: string;
  complaintData?: {
    title: string;
    category: string;
    location: string;
    status: string;
  };
}

const BlockchainTracker = ({ complaintId, complaintData }: BlockchainTrackerProps) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [verification, setVerification] = useState<BlockchainVerification | null>(null);
  const [smartContracts, setSmartContracts] = useState<SmartContractRule[]>([]);
  const [certificate, setCertificate] = useState<ResolutionCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [minting, setMinting] = useState(false);
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  useEffect(() => {
    loadBlockchainData();
  }, [complaintId]);

  const loadBlockchainData = async () => {
    setLoading(true);
    try {
      // Load transactions
      const txs = getComplaintTransactions(complaintId);
      setTransactions(txs);

      // Verify integrity
      const ver = await verifyComplaintHistory(complaintId);
      setVerification(ver);

      // Load smart contracts
      const contracts = getSmartContracts();
      setSmartContracts(contracts);
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAction = async (action: string, details: string) => {
    try {
      const tx = await recordOnBlockchain({
        complaintId,
        action: action as any,
        actor: "citizen",
        details,
      });

      setTransactions(prev => [...prev, tx]);

      toast({
        title: "Recorded on Blockchain",
        description: `Transaction ${tx.txHash.slice(0, 16)}... confirmed`,
      });

      // Re-verify
      const ver = await verifyComplaintHistory(complaintId);
      setVerification(ver);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record on blockchain",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const ver = await verifyComplaintHistory(complaintId);
      setVerification(ver);

      toast({
        title: ver.isValid ? "Verification Successful" : "Verification Failed",
        description: ver.isValid
          ? "All records are intact and verified"
          : "Chain integrity compromised",
        variant: ver.isValid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify blockchain records",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleMintCertificate = async () => {
    if (!complaintData) return;

    setMinting(true);
    try {
      const cert = await mintResolutionCertificate(
        complaintId,
        "citizen-123",
        "dept-456",
        {
          category: complaintData.category,
          location: complaintData.location,
          description: complaintData.title,
        }
      );

      setCertificate(cert);

      toast({
        title: "NFT Certificate Minted!",
        description: `Token ID: ${cert.tokenId}`,
      });

      // Reload transactions
      await loadBlockchainData();
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Could not mint resolution certificate",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATED":
        return "bg-green-500";
      case "UPDATED":
        return "bg-blue-500";
      case "ASSIGNED":
        return "bg-purple-500";
      case "RESOLVED":
        return "bg-emerald-500";
      case "ESCALATED":
        return "bg-orange-500";
      case "VERIFIED":
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center",
                verification?.isValid ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              )}>
                {verification?.isValid ? (
                  <Shield className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Blockchain Verification</CardTitle>
                <CardDescription>
                  Immutable record of all complaint actions
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerify}
              disabled={verifying}
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileCheck className="h-4 w-4 mr-2" />
              )}
              Verify Chain
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {verification?.transactionCount || 0}
              </p>
              <p className="text-xs text-muted-foreground">Total Blocks</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {verification?.integrityScore || 0}%
              </p>
              <p className="text-xs text-muted-foreground">Integrity Score</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">
                #{verification?.blockNumber || 0}
              </p>
              <p className="text-xs text-muted-foreground">Latest Block</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Badge variant={verification?.isValid ? "default" : "destructive"}>
                {verification?.isValid ? "Verified" : "Unverified"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>
            All actions recorded on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Blocks className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No transactions yet</p>
              <Button
                className="mt-4"
                onClick={() => handleRecordAction("CREATED", "Complaint submitted")}
              >
                Record First Transaction
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {transactions.map((tx, index) => (
                  <div key={tx.txHash} className="relative">
                    {/* Connection Line */}
                    {index < transactions.length - 1 && (
                      <div className="absolute left-[23px] top-12 w-0.5 h-[calc(100%-24px)] bg-muted-foreground/20" />
                    )}

                    <div
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer",
                        expandedTx === tx.txHash ? "bg-muted" : "hover:bg-muted/50"
                      )}
                      onClick={() => setExpandedTx(expandedTx === tx.txHash ? null : tx.txHash)}
                    >
                      {/* Block Number */}
                      <div className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-sm",
                        getActionColor(tx.data.action)
                      )}>
                        #{tx.blockNumber}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{tx.data.action}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{tx.data.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Actor: {tx.data.actor}
                        </p>

                        {/* Expanded Details */}
                        {expandedTx === tx.txHash && (
                          <div className="mt-4 space-y-2 text-xs">
                            <Separator />
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Transaction Hash:</span>
                              <div className="flex items-center gap-1">
                                <code className="bg-muted px-2 py-1 rounded text-xs">
                                  {tx.txHash.slice(0, 20)}...
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(tx.txHash);
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Previous Hash:</span>
                              <code className="bg-muted px-2 py-1 rounded text-xs">
                                {tx.previousHash.slice(0, 20)}...
                              </code>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Nonce:</span>
                              <span>{tx.nonce}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {expandedTx === tx.txHash ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Smart Contracts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Smart Contracts
          </CardTitle>
          <CardDescription>
            Automated rules for complaint processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {smartContracts.map(contract => (
              <div
                key={contract.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{contract.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <code>{contract.condition}</code> → {contract.action}
                  </p>
                </div>
                <Badge variant={contract.isActive ? "default" : "secondary"}>
                  {contract.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* NFT Certificate */}
      {complaintData?.status === "resolved" && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Resolution Certificate NFT
            </CardTitle>
            <CardDescription>
              Mint an NFT certificate as proof of resolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {certificate ? (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-purple-500">NFT Minted</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(certificate.resolvedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-sm break-all">{certificate.tokenId}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Resolution Time</p>
                      <p className="font-medium">{certificate.resolutionTime} hours</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium">{certificate.rating.toFixed(1)} ⭐</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </Button>
              </div>
            ) : (
              <Button
                className="w-full gap-2"
                onClick={handleMintCertificate}
                disabled={minting}
              >
                {minting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Award className="h-4 w-4" />
                )}
                Mint Resolution Certificate
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlockchainTracker;
