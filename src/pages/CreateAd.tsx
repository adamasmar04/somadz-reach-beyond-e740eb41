import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Upload, Loader2, PartyPopper } from "lucide-react";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 3.0,
    duration: "1 Day",
    color: "🟢",
    features: ["1 image", "Social media ad placement", "Basic analytics", "Standard support"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 9.5,
    duration: "3 Days",
    color: "🟡",
    recommended: true,
    features: ["3 images", "Social media + email marketing", "Detailed analytics", "Priority support", "Hashtag boost"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 21.99,
    duration: "7 Days",
    color: "🔵",
    features: ["5 images", "Full marketing suite", "Comprehensive analytics", "Priority support", "Hashtag boost", "Featured placement"],
  },
];

const CreateAd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Step 1 fields
  const [businessName, setBusinessName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [ageRange, setAgeRange] = useState([18, 65]);
  const [tiktok, setTiktok] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [headline, setHeadline] = useState("");

  // Step 2
  const [selectedPlan, setSelectedPlan] = useState("basic");

  // Step 3
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        // Pre-fill from profile
        supabase.from("profiles").select("*").eq("id", data.user.id).single().then(({ data: profile }) => {
          if (profile) {
            if (profile.business_name) setBusinessName(profile.business_name);
            if (profile.business_number) setBusinessNumber(profile.business_number);
            if (profile.business_location) setBusinessLocation(profile.business_location);
          }
        });
      } else {
        toast({ title: "Please sign in", description: "You need to be logged in to create an ad.", variant: "destructive" });
        navigate("/");
      }
    });
  }, []);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const plan = PLANS.find((p) => p.id === selectedPlan);
    const maxFiles = plan?.id === "basic" ? 1 : plan?.id === "standard" ? 3 : 5;

    if (mediaFiles.length + files.length > maxFiles) {
      toast({ title: "File limit", description: `Your plan allows up to ${maxFiles} files.`, variant: "destructive" });
      return;
    }

    setMediaFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setMediaPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const getDurationDays = () => {
    const plan = PLANS.find((p) => p.id === selectedPlan);
    if (plan?.id === "basic") return 1;
    if (plan?.id === "standard") return 3;
    return 7;
  };

  const handleSubmit = async () => {
    if (!userId) return;
    setSubmitting(true);

    try {
      // Upload media files
      const mediaUrls: string[] = [];
      let imageUrl: string | null = null;

      for (const file of mediaFiles) {
        const ext = file.name.split(".").pop();
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("ad-media").upload(path, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("ad-media").getPublicUrl(path);
        mediaUrls.push(urlData.publicUrl);
        if (!imageUrl) imageUrl = urlData.publicUrl;
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + getDurationDays());

      const { error } = await supabase.from("ads").insert({
        user_id: userId,
        business_name: businessName,
        business_number: businessNumber || null,
        target_location: targetLocation || null,
        business_location: businessLocation || null,
        target_age_min: ageRange[0],
        target_age_max: ageRange[1],
        social_media: { tiktok, facebook, instagram, website },
        headline,
        package_type: selectedPlan,
        price: PLANS.find((p) => p.id === selectedPlan)?.price ?? 0,
        currency: "USD",
        image_url: imageUrl,
        media_urls: mediaUrls,
        hashtags: hashtags || null,
        tags: tags || null,
        expires_at: expiresAt.toISOString(),
        status: "active",
      });

      if (error) throw error;

      setSubmitted(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return businessName.trim() !== "" && headline.trim() !== "";
    if (step === 2) return !!selectedPlan;
    if (step === 3) return true;
    return true;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-lg mx-auto px-6 space-y-6">
            <div className="text-7xl animate-bounce">
              <PartyPopper className="w-20 h-20 mx-auto text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">Congratulations! 🎉</h1>
            <p className="text-xl text-muted-foreground">
              Your ad is now live. Seize this opportunity to reach new customers!
            </p>
            <p className="text-muted-foreground">
              Your ad has been successfully published! Get ready to boost your business!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="hero-button" onClick={() => navigate("/ads")}>
                View Live Ads
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => navigate("/profile")}>
                Manage My Ads
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step >= s ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${step > s ? "bg-primary" : "bg-secondary"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Business Info */}
          {step === 1 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-gradient text-2xl">Business & Target Audience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Business Name *</Label>
                    <Input placeholder="Your business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Number</Label>
                    <Input placeholder="+1 234 567 8900" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Audience Location</Label>
                    <Input placeholder="e.g. New York, USA" value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Physical Business Location</Label>
                    <Input placeholder="Your business address" value={businessLocation} onChange={(e) => setBusinessLocation(e.target.value)} className="bg-secondary border-border" />
                  </div>
                </div>

                {/* Age Range Slider */}
                <div className="space-y-3">
                  <Label>Target Audience Age: {ageRange[0]} – {ageRange[1]} years</Label>
                  <Slider
                    min={1}
                    max={65}
                    step={1}
                    value={ageRange}
                    onValueChange={(val) => setAgeRange(val)}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>65</span>
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Social Media Links</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="TikTok profile URL" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="bg-secondary border-border" />
                    <Input placeholder="Facebook profile URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="bg-secondary border-border" />
                    <Input placeholder="Instagram profile URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="bg-secondary border-border" />
                    <Input placeholder="Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} className="bg-secondary border-border" />
                  </div>
                </div>

                {/* Headline */}
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Headline *</Label>
                  <p className="text-sm text-muted-foreground">Write a catchy and attractive headline reflecting your products or services.</p>
                  <Textarea
                    placeholder="E.g. 'Premium Somali Coffee - Fresh Roasted & Delivered to Your Door!'"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="bg-secondary border-border min-h-[100px] text-lg"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground text-right">{headline.length}/200</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Choose Plan */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gradient text-center">Choose Your Plan</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {PLANS.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      selectedPlan === plan.id
                        ? "border-primary shadow-glow scale-105"
                        : "border-border hover:border-primary/50"
                    } ${plan.recommended ? "relative" : ""}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.recommended && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                        Recommended
                      </Badge>
                    )}
                    <CardContent className="p-6 text-center space-y-4">
                      <span className="text-3xl">{plan.color}</span>
                      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                      <div>
                        <span className="text-3xl font-bold text-gradient">${plan.price.toFixed(2)}</span>
                        <p className="text-sm text-muted-foreground">{plan.duration}</p>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-2 text-left">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Upload Media */}
          {step === 3 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-gradient text-2xl">Upload Image/Video & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div className="space-y-3">
                  <Label>Upload Image or Video</Label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-10 cursor-pointer hover:border-primary transition-colors bg-secondary/50">
                    <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">Any image or video format accepted</p>
                    <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaUpload} />
                  </label>
                </div>

                {/* Previews */}
                {mediaPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaPreviews.map((preview, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-border">
                        <img src={preview} alt="" className="w-full aspect-square object-cover" />
                        <button
                          onClick={() => removeMedia(i)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hashtags & Tags */}
                <div className="space-y-2">
                  <Label>Hashtags</Label>
                  <Input placeholder="#SmallBusiness #SomaliAds #Marketing" value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input placeholder="clothing, food, service, technology" value={tags} onChange={(e) => setTags(e.target.value)} className="bg-secondary border-border" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-gradient text-2xl">Review & Confirm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview Card */}
                <div className="border border-border rounded-xl overflow-hidden">
                  {mediaPreviews.length > 0 && (
                    <img src={mediaPreviews[0]} alt="Ad preview" className="w-full max-h-64 object-cover" />
                  )}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-foreground">{headline}</h3>
                    <p className="text-muted-foreground">{businessName}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {businessNumber && <span>📞 {businessNumber}</span>}
                      {targetLocation && <span>📍 {targetLocation}</span>}
                      <span>👥 Age {ageRange[0]}-{ageRange[1]}</span>
                    </div>
                    {hashtags && <p className="text-sm text-primary">{hashtags}</p>}
                    {tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.split(",").map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{tag.trim()}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Plan Summary */}
                <div className="bg-secondary/50 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {PLANS.find((p) => p.id === selectedPlan)?.color}{" "}
                      {PLANS.find((p) => p.id === selectedPlan)?.name} Plan
                    </p>
                    <p className="text-sm text-muted-foreground">{PLANS.find((p) => p.id === selectedPlan)?.duration}</p>
                  </div>
                  <span className="text-2xl font-bold text-gradient">
                    ${PLANS.find((p) => p.id === selectedPlan)?.price.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="border-border"
              onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            {step < 4 ? (
              <Button
                className="hero-button"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="hero-button"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Submit & Publish
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateAd;
