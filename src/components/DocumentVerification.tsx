import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  Eye,
  Download,
  Trash2,
  FileImage,
  File,
  Clock,
  AlertTriangle,
  Link2,
  PenTool,
  Fingerprint,
  Key,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  uploadDocument,
  verifyDocument,
  fetchDigiLockerDocuments,
  initiateESign,
  performOCR,
  DOCUMENT_TYPES,
  type UploadedDocument,
  type VerificationResult,
  type DigiLockerDocument,
  type ESignRequest,
} from "@/lib/documentService";
import { useToast } from "@/hooks/use-toast";

interface DocumentVerificationProps {
  userId?: string;
  complaintId?: string;
}

const DocumentVerification = ({
  userId = "user-123",
  complaintId,
}: DocumentVerificationProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [digiLockerDocs, setDigiLockerDocs] = useState<DigiLockerDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [fetchingDigiLocker, setFetchingDigiLocker] = useState(false);
  const [signingDoc, setSigningDoc] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocType, setSelectedDocType] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedDocType) {
      toast({
        title: "Select Document Type",
        description: "Please select a document type before uploading",
        variant: "destructive",
      });
      return;
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only JPG, PNG, and PDF files are allowed",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadDocument(file, selectedDocType, userId, complaintId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedDocs(prev => [...prev, result]);

      toast({
        title: "Document Uploaded",
        description: "Document uploaded successfully. Starting verification...",
      });

      // Auto-verify
      await handleVerifyDocument(result);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleVerifyDocument = async (doc: UploadedDocument) => {
    setVerifying(true);
    setSelectedDoc(doc);

    try {
      const result = await verifyDocument(doc.id);
      setVerificationResult(result);

      // Update doc status
      setUploadedDocs(prev =>
        prev.map(d =>
          d.id === doc.id
            ? { ...d, verificationStatus: result.isValid ? "verified" : "failed" }
            : d
        )
      );

      toast({
        title: result.isValid ? "Verification Successful" : "Verification Failed",
        description: result.isValid
          ? "Document has been verified successfully"
          : result.issues?.join(", ") || "Document verification failed",
        variant: result.isValid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Could not verify document",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleFetchDigiLocker = async () => {
    setFetchingDigiLocker(true);

    try {
      const docs = await fetchDigiLockerDocuments(userId);
      setDigiLockerDocs(docs);

      toast({
        title: "DigiLocker Connected",
        description: `Found ${docs.length} documents in your DigiLocker`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to DigiLocker. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFetchingDigiLocker(false);
    }
  };

  const handleInitiateESign = async (docId: string) => {
    setSigningDoc(docId);

    try {
      const request = await initiateESign(docId, userId, "aadhaar");

      toast({
        title: "e-Sign Initiated",
        description: "Please complete the signing process",
      });

      // In real implementation, redirect to signing page
      window.open(request.signUrl, "_blank");

      // Update doc after signing
      setTimeout(() => {
        setUploadedDocs(prev =>
          prev.map(d =>
            d.id === docId ? { ...d, isSigned: true } : d
          )
        );
        setSigningDoc(null);
      }, 3000);
    } catch (error) {
      toast({
        title: "e-Sign Failed",
        description: "Could not initiate signing process",
        variant: "destructive",
      });
      setSigningDoc(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return File;
    if (mimeType.includes("image")) return FileImage;
    return FileText;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" /> Verified</Badge>;
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "failed":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="digilocker" className="gap-2">
            <Key className="h-4 w-4" />
            DigiLocker
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            My Documents
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Upload documents for verification with AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Document Type Selection */}
              <div className="space-y-2">
                <Label>Document Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DOCUMENT_TYPES.map(type => (
                    <Button
                      key={type.id}
                      variant={selectedDocType === type.id ? "default" : "outline"}
                      className="justify-start gap-2"
                      onClick={() => setSelectedDocType(type.id)}
                    >
                      <FileText className="h-4 w-4" />
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                  selectedDocType
                    ? "border-primary/50 hover:border-primary hover:bg-primary/5"
                    : "border-muted-foreground/25 cursor-not-allowed opacity-50"
                )}
                onClick={() => selectedDocType && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={!selectedDocType || uploading}
                />
                {uploading ? (
                  <div className="space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <p>Uploading document...</p>
                    <Progress value={uploadProgress} className="w-48 mx-auto" />
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-medium">
                      {selectedDocType
                        ? "Click to upload or drag and drop"
                        : "Select document type first"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG or PDF (max 10MB)
                    </p>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">AI Verification</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">OCR Extraction</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Fingerprint className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">e-Sign Support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verificationResult && selectedDoc && (
            <Card className={cn(
              "border-2",
              verificationResult.isValid ? "border-green-500" : "border-red-500"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {verificationResult.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Verification {verificationResult.isValid ? "Passed" : "Failed"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Confidence Score</span>
                  <span className="font-bold">{verificationResult.confidenceScore}%</span>
                </div>
                <Progress
                  value={verificationResult.confidenceScore}
                  className={cn(
                    "h-2",
                    verificationResult.confidenceScore < 70 && "[&>div]:bg-red-500"
                  )}
                />

                {verificationResult.extractedData && (
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Extracted Information:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(verificationResult.extractedData).map(([key, value]) => (
                        <div key={key} className="p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="font-medium">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {verificationResult.issues && verificationResult.issues.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="font-medium text-red-700 dark:text-red-400 flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Issues Found
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 text-muted-foreground">
                      {verificationResult.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* DigiLocker Tab */}
        <TabsContent value="digilocker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                DigiLocker Integration
              </CardTitle>
              <CardDescription>
                Access your verified documents from DigiLocker
              </CardDescription>
            </CardHeader>
            <CardContent>
              {digiLockerDocs.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">Connect to DigiLocker</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access your government-issued documents securely
                  </p>
                  <Button
                    className="mt-4 gap-2"
                    onClick={handleFetchDigiLocker}
                    disabled={fetchingDigiLocker}
                  >
                    {fetchingDigiLocker ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}
                    Connect DigiLocker
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {digiLockerDocs.map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Issued by {doc.issuer} • {doc.issueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">DigiLocker Verified</Badge>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Use
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleFetchDigiLocker}
                    disabled={fetchingDigiLocker}
                  >
                    <RefreshCw className={cn("h-4 w-4", fetchingDigiLocker && "animate-spin")} />
                    Refresh Documents
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                Manage your uploaded and verified documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedDocs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">No documents yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your first document to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedDocs.map(doc => {
                    const FileIcon = getFileIcon(doc.mimeType);
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                            <FileIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.documentType} • {(doc.fileSize / 1024).toFixed(1)} KB
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(doc.verificationStatus)}
                              {doc.isSigned && (
                                <Badge variant="outline" className="gap-1 text-green-600">
                                  <PenTool className="h-3 w-3" />
                                  Signed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerifyDocument(doc)}
                            disabled={verifying}
                          >
                            {verifying && selectedDoc?.id === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                          </Button>
                          {!doc.isSigned && doc.verificationStatus === "verified" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleInitiateESign(doc.id)}
                              disabled={signingDoc === doc.id}
                            >
                              {signingDoc === doc.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <PenTool className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentVerification;
