import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CreditCard, Upload, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      title: "Your Business Info",
      description: "Start by entering your business details and target audience.",
      icon: <Briefcase className="w-10 h-10" />,
    },
    {
      step: "2",
      title: "Choose a Plan",
      description: "Select the advertising package that best fits your needs.",
      icon: <CreditCard className="w-10 h-10" />,
    },
    {
      step: "3",
      title: "Upload Your Ad",
      description: "Upload the images or videos you want to advertise.",
      icon: <Upload className="w-10 h-10" />,
    },
    {
      step: "4",
      title: "Confirm & Publish",
      description: "Review your ad and publish it.",
      icon: <CheckCircle className="w-10 h-10" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Placing an ad on <span className="text-primary font-semibold">SOMADZ</span> is simple. Just follow these easy steps:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="feature-card group text-center relative overflow-hidden">
              <CardContent className="p-8">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{step.step}</span>
                </div>

                <div className="text-primary mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold mb-4 text-gradient">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
