import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Clock, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/integrations/supabase/types";

type Ad = Tables<"ads">;

const LiveAds = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data) setAds(data);
    setLoading(false);
  };

  const now = new Date();
  const filteredAds = ads.filter(
    (ad) => {
      const isExpired = new Date(ad.expires_at).getTime() <= now.getTime();
      if (isExpired) return false;
      return (
        ad.headline.toLowerCase().includes(search.toLowerCase()) ||
        ad.business_name.toLowerCase().includes(search.toLowerCase()) ||
        (ad.tags && ad.tags.toLowerCase().includes(search.toLowerCase()))
      );
    }
  );

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gradient">Live Ads</h1>
              <p className="text-muted-foreground mt-2">
                Browse all active advertisements on SOMADZ
              </p>
            </div>
            <Button
              className="hero-button flex items-center gap-2 text-lg px-8 py-6"
              onClick={() => navigate("/create-ad")}
            >
              <Plus className="w-5 h-5" />
              Create Ad
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search ads by name, headline, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Ads Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-card border-border animate-pulse h-72" />
              ))}
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-muted-foreground mb-4">No ads found</p>
              <Button className="hero-button" onClick={() => navigate("/create-ad")}>
                Be the first to create an ad!
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map((ad) => (
                <Card
                  key={ad.id}
                  className="bg-card border-border overflow-hidden cursor-pointer group hover:shadow-glow hover:scale-[1.02] transition-all duration-300"
                  onClick={() => navigate(`/ads/${ad.id}`)}
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-secondary overflow-hidden">
                    {ad.image_url ? (
                      <img
                        src={ad.image_url}
                        alt={ad.headline}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="text-5xl">📢</span>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground capitalize">
                      {ad.package_type}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {ad.headline}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {ad.business_name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{ad.views ?? 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{getTimeRemaining(ad.expires_at)}</span>
                      </div>
                      {ad.target_location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[80px]">{ad.target_location}</span>
                        </div>
                      )}
                    </div>
                    {ad.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {ad.tags.split(",").slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
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

export default LiveAds;
