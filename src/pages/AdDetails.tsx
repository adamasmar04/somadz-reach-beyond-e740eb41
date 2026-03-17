import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Phone, Eye, Clock, MapPin, Globe } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import type { Json } from "@/integrations/supabase/types";

type Ad = Tables<"ads">;

interface SocialMedia {
  tiktok?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

const parseSocialMedia = (data: Json | null): SocialMedia => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  return data as unknown as SocialMedia;
};

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAd = async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setAd(data);
        // Increment views
        await supabase.from("ads").update({ views: (data.views ?? 0) + 1 }).eq("id", id);
      }
      setLoading(false);
    };

    fetchAd();
  }, [id]);

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days} days, ${hours} hours left`;
    return `${hours} hours left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading ad...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-2xl text-muted-foreground">Ad not found</p>
          <Button variant="outline" onClick={() => navigate("/ads")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Ads
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const social = parseSocialMedia(ad.social_media);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground" onClick={() => navigate("/ads")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Live Ads
          </Button>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Image/Video - Left */}
            <div className="lg:col-span-3 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                {ad.image_url ? (
                  <img src={ad.image_url} alt={ad.headline} className="w-full object-contain max-h-[500px]" />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center bg-secondary">
                    <span className="text-7xl">📢</span>
                  </div>
                )}
              </div>

              {/* Additional media */}
              {ad.media_urls && ad.media_urls.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {ad.media_urls.map((url, i) => (
                    <img key={i} src={url} alt="" className="w-20 h-20 rounded-lg object-cover border border-border cursor-pointer hover:border-primary transition-colors" />
                  ))}
                </div>
              )}
            </div>

            {/* Details - Right */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Badge className="bg-primary/90 text-primary-foreground capitalize mb-3">
                  {ad.package_type}
                </Badge>
                <h1 className="text-3xl font-bold text-foreground leading-tight">{ad.headline}</h1>
                <p className="text-lg text-muted-foreground mt-2 font-medium">{ad.business_name}</p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{ad.views ?? 0} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeRemaining(ad.expires_at)}</span>
                </div>
                {ad.target_location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{ad.target_location}</span>
                  </div>
                )}
              </div>

              {/* Price */}
              {ad.price && (
                <div className="bg-secondary/50 rounded-xl p-4">
                  <span className="text-2xl font-bold text-gradient">{ad.currency ?? "$"}{ad.price}</span>
                  {ad.negotiable && <Badge variant="secondary" className="ml-2">Negotiable</Badge>}
                </div>
              )}

              {/* Social Media */}
              {(social.facebook || social.instagram || social.tiktok || social.website) && (
                <Card className="bg-card border-border p-4">
                  <h3 className="font-semibold text-foreground mb-3">Connect</h3>
                  <div className="flex gap-3">
                    {social.facebook && (
                      <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" title="Facebook">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      </a>
                    )}
                    {social.instagram && (
                      <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" title="Instagram">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                      </a>
                    )}
                    {social.tiktok && (
                      <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" title="TikTok">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.15V11.7a4.84 4.84 0 01-3.58-1.43V6.69h3.58z" /></svg>
                      </a>
                    )}
                    {social.website && (
                      <a href={social.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" title="Website">
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </Card>
              )}

              {/* Tags */}
              {ad.tags && (
                <div className="flex flex-wrap gap-2">
                  {ad.tags.split(",").map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag.trim()}</Badge>
                  ))}
                </div>
              )}

              {ad.hashtags && (
                <p className="text-sm text-primary">{ad.hashtags}</p>
              )}

              {/* Contact Button */}
              {ad.business_number && (
                <a href={`tel:${ad.business_number}`} className="block">
                  <Button className="hero-button w-full text-lg py-6 flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdDetails;
