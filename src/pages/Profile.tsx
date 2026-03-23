import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Plus, Trash2, BarChart3, CheckCircle, XCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Ad = Tables<"ads">;

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [profileEmail, setProfileEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setProfileEmail(data.user.email ?? "");
        fetchAds(data.user.id);
        // Fetch profile name
        supabase.from("profiles").select("full_name").eq("id", data.user.id).single().then(({ data: profile }) => {
          if (profile?.full_name) setProfileName(profile.full_name);
        });
      } else {
        toast({ title: "Please sign in", description: "You need to be logged in to view your profile.", variant: "destructive" });
        navigate("/login");
      }
    });
  }, []);

  const fetchAds = async (uid: string) => {
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (!error && data) setAds(data);
    setLoading(false);
  };

  const deleteAd = async (adId: string) => {
    const { error } = await supabase.from("ads").delete().eq("id", adId);
    if (!error) {
      setAds((prev) => prev.filter((a) => a.id !== adId));
      toast({ title: "Ad deleted" });
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt).getTime() < Date.now();

  const activeAds = ads.filter((a) => !isExpired(a.expires_at));
  const expiredAds = ads.filter((a) => isExpired(a.expires_at));
  const totalViews = ads.reduce((sum, a) => sum + (a.views ?? 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gradient">{profileName || "My Profile"}</h1>
              {profileEmail && <p className="text-muted-foreground text-sm mt-0.5">{profileEmail}</p>}
            </div>
            <Button className="hero-button flex items-center gap-2" onClick={() => navigate("/create-ad")}>
              <Plus className="w-4 h-4" /> New Ad
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="bg-card border-border p-4 text-center">
              <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{ads.length}</p>
              <p className="text-xs text-muted-foreground">Total Ads</p>
            </Card>
            <Card className="bg-card border-border p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{activeAds.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </Card>
            <Card className="bg-card border-border p-4 text-center">
              <XCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{expiredAds.length}</p>
              <p className="text-xs text-muted-foreground">Expired</p>
            </Card>
            <Card className="bg-card border-border p-4 text-center">
              <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalViews}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </Card>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4">My Ads</h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card border-border animate-pulse h-24" />
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">You haven't created any ads yet</p>
              <Button className="hero-button" onClick={() => navigate("/create-ad")}>Create Your First Ad</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <Card key={ad.id} className="bg-card border-border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-glow transition-shadow">
                  <div className="w-full sm:w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0 cursor-pointer" onClick={() => navigate(`/ads/${ad.id}`)}>
                    {ad.image_url ? (
                      <img src={ad.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📢</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate cursor-pointer hover:text-primary" onClick={() => navigate(`/ads/${ad.id}`)}>
                      {ad.headline}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{ad.views ?? 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{getTimeRemaining(ad.expires_at)}</span>
                      </div>
                      {ad.price != null && (
                        <span className="font-medium text-foreground">${Number(ad.price).toFixed(2)}</span>
                      )}
                      <Badge variant={isExpired(ad.expires_at) ? "destructive" : "secondary"} className="capitalize">
                        {isExpired(ad.expires_at) ? "expired" : ad.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{ad.package_type}</Badge>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 shrink-0" onClick={() => deleteAd(ad.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
