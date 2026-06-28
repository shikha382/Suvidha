import Layout from "@/components/layout/Layout";
import DocumentVerification from "@/components/DocumentVerification";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Shield, Key, PenTool } from "lucide-react";

const DocumentsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <FileCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Document Verification</h1>
              <p className="text-muted-foreground">
                AI-powered verification, DigiLocker integration & e-Sign
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">AI Verification</p>
              <p className="text-xs text-muted-foreground">Instant authenticity check</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Key className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium">DigiLocker</p>
              <p className="text-xs text-muted-foreground">Government documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <PenTool className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium">e-Sign</p>
              <p className="text-xs text-muted-foreground">Aadhaar-based signing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <FileCheck className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">OCR</p>
              <p className="text-xs text-muted-foreground">Auto text extraction</p>
            </CardContent>
          </Card>
        </div>

        {/* Document Verification Component */}
        <DocumentVerification userId="user-123" />
      </div>
    </Layout>
  );
};

export default DocumentsPage;
