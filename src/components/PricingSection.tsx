import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Crown, Check, Sparkles, Star } from "lucide-react";

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Gold",
      tagline: "Begin your VIP journey",
      price: "$29",
      period: "/month",
      icon: Star,
      features: [
        "Up to 5 premium ad campaigns",
        "Gold badge on your listings",
        "Standard analytics dashboard",
        "Priority email support",
        "Marketplace listing boost",
      ],
      recommended: false,
    },
    {
      name: "Platinum VIP",
      tagline: "Most chosen elite membership",
      price: "$79",
      period: "/month",
      icon: Crown,
      features: [
        "Up to 25 featured campaigns",
        "Platinum VIP profile badge",
        "Advanced targeting & AI design",
        "Real-time premium analytics",
        "A/B testing & custom branding",
        "Dedicated 24/5 priority support",
        "Exclusive VIP marketplace section",
      ],
      recommended: true,
    },
    {
      name: "Diamond Elite",
      tagline: "The ultimate luxury tier",
      price: "$199",
      period: "/month",
      icon: Sparkles,
      features: [
        "Unlimited premium campaigns",
        "Diamond Elite signature badge",
        "Advanced AI targeting suite",
        "Enterprise-grade analytics",
        "24/7 dedicated account manager",
        "White-label & full API access",
        "Custom integrations & onboarding",
        "Invitation to VIP networking events",
      ],
      recommended: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative py-24 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(255, 215, 0, 0.08), transparent 60%), linear-gradient(180deg, #0a0805 0%, #050505 100%)",
      }}
    >
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #ffd700, transparent)" }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #b8860b, transparent)" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 vip-crown-glow"
            style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(184,134,11,0.1))",
              border: "1px solid rgba(255, 215, 0, 0.4)",
            }}>
            <Crown className="w-4 h-4" style={{ color: "#ffd700" }} />
            <span className="text-sm font-semibold tracking-widest text-gold-gradient">
              VIP MEMBERSHIP
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gold-gradient">
            Elite Membership Plans
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Step into the exclusive circle. Premium tools, luxury placement, and white-glove support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card
                key={index}
                className={`relative rounded-3xl overflow-hidden animate-fade-in transition-all duration-500 hover:-translate-y-3 ${
                  plan.recommended ? "vip-card-elite vip-border-shine md:scale-105 z-10" : "vip-card"
                }`}
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 rounded-b-2xl text-xs font-bold tracking-widest z-20"
                    style={{
                      background: "linear-gradient(135deg, #ffd700, #b8860b)",
                      color: "#1a1306",
                      boxShadow: "0 4px 20px rgba(255, 215, 0, 0.5)",
                    }}>
                    ★ MOST EXCLUSIVE ★
                  </div>
                )}

                <CardHeader className="text-center pt-12 pb-6 relative">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${plan.recommended ? "vip-float" : ""}`}
                      style={{
                        background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(184,134,11,0.1))",
                        border: "1px solid rgba(255, 215, 0, 0.4)",
                      }}>
                      <Icon className="w-8 h-8" style={{ color: "#ffd700" }} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-gold-gradient">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 italic">{plan.tagline}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-6xl font-bold text-gold-gradient">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pb-8">
                  <div className="h-px w-full" style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)",
                  }} />

                  <ul className="space-y-3">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: "linear-gradient(135deg, #ffd700, #b8860b)",
                            boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
                          }}>
                          <Check className="w-3 h-3" style={{ color: "#1a1306" }} strokeWidth={3} />
                        </div>
                        <span className="text-sm text-foreground/90 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-xl py-6 text-base ${plan.recommended ? "vip-button" : "vip-outline-button"}`}
                    onClick={() => navigate("/signup")}
                  >
                    {plan.recommended ? "✦ Claim VIP Access ✦" : "Join " + plan.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-2xl"
            style={{
              background: "rgba(255, 215, 0, 0.05)",
              border: "1px solid rgba(255, 215, 0, 0.2)",
            }}>
            <span className="text-sm text-muted-foreground">💰 30-day money-back guarantee</span>
            <span className="text-sm text-muted-foreground">🔒 Secure payment</span>
            <span className="text-sm text-muted-foreground">👑 Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
