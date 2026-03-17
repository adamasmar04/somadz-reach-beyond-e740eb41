import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[85vh]">
        <Card className="w-full max-w-md mx-6 bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-gradient">Reset Password</CardTitle>
            <p className="text-muted-foreground mt-2">We'll send you a reset link</p>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Check your email for a password reset link.</p>
                <Link to="/login"><Button variant="outline" className="border-border">Back to Login</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-secondary border-border" required />
                  </div>
                </div>
                <Button type="submit" className="hero-button w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Send Reset Link
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
