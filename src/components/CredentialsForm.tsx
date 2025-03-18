
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyGamesApi } from "@/services/api";
import { toast } from "sonner";
import { KeyRound, Shield } from "lucide-react";

interface CredentialsFormProps {
  onCredentialsSet: () => void;
}

const CredentialsForm = ({ onCredentialsSet }: CredentialsFormProps) => {
  const [apiKey, setApiKey] = useState("");
  const [signature, setSignature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !signature.trim()) {
      toast.error("Both API Key and Signature are required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      dailyGamesApi.setCredentials(apiKey, signature);
      toast.success("API credentials set successfully");
      onCredentialsSet();
    } catch (error) {
      toast.error("Failed to save credentials");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-fade-in">
      <Card className="w-full max-w-md glass-card animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">Admin Credentials</CardTitle>
          <CardDescription className="text-center">
            Enter your API credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 form-field">
              <Label htmlFor="apiKey" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" /> 
                API Key
              </Label>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-focus-ring"
                required
              />
            </div>
            
            <div className="space-y-2 form-field">
              <Label htmlFor="signature" className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> 
                Signature
              </Label>
              <Input
                id="signature"
                placeholder="Enter your signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="input-focus-ring"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full transition-all duration-300 hover:shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting Credentials..." : "Set Credentials"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialsForm;
