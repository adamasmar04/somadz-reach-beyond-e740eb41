import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();
  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses starting their digital journey",
      features: [
        "Up to 5 ad campaigns",
        "Basic targeting options",
        "Standard analytics",
        "Email support",
        "Marketplace listing"
      ],
      recommended: false
    },
    {
      name: "Standard", 
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses ready to scale their reach",
      features: [
        "Up to 25 ad campaigns",
        "Advanced targeting",
        "Real-time analytics",
        "Priority support",
        "AI design tools",
        "A/B testing",
        "Custom branding"
      ],
      recommended: true
    },
    {
      name: "Premium",
      price: "$199", 
      period: "/month",
      description: "Comprehensive solution for established businesses",
      features: [
        "Unlimited ad campaigns",
        "Advanced AI targeting",
        "Enterprise analytics",
        "24/7 phone support",
        "White-label solution",
        "API access",
        "Dedicated account manager",
        "Custom integrations"
      ],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Pricing & Packages</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan to accelerate your business growth
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`pricing-card relative ${plan.recommended ? 'recommended scale-105 z-10' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <h3 className="text-2xl font-bold text-gradient mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground text-xs">✓</span>
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.recommended ? 'hero-button' : 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground'}`}
                  variant={plan.recommended ? 'default' : 'outline'}
                >
                  {plan.recommended ? 'Get Started' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            💰 30-day money-back guarantee • 🔒 Secure payment • 📞 Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;