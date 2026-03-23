import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const useTypewriter = (text: string, typeSpeed = 100, deleteSpeed = 60, pauseDuration = 2000) => {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < text.length) {
      timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
    } else if (!isDeleting && displayed.length === text.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), deleteSpeed);
    } else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => setIsDeleting(false), 500);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, text, typeSpeed, deleteSpeed, pauseDuration]);

  return displayed;
};

const HeroSection = () => {
  const animatedText = useTypewriter("reach more people", 120, 80, 2500);
  return (
    <section id="home" className="min-h-screen bg-background pt-20 lg:pt-0">
      <div className="container mx-auto px-6 h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex justify-center animate-float">
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl absolute inset-0"></div>
              <div className="relative z-10 bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-2xl">
                <div className="space-y-6">
                  <div className="h-4 bg-gradient-to-r from-primary to-purple-400 rounded-full w-3/4"></div>
                  <div className="h-3 bg-muted rounded-full w-1/2"></div>
                  <div className="h-3 bg-muted rounded-full w-2/3"></div>
                  <div className="flex space-x-4 pt-4">
                    <div className="h-12 w-12 bg-primary rounded-xl"></div>
                    <div className="h-12 w-12 bg-purple-500 rounded-xl"></div>
                    <div className="h-12 w-12 bg-blue-500 rounded-xl"></div>
                  </div>
                  <div className="pt-4">
                    <div className="h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg w-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                      📈 Growth Analytics
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Main Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Help small businesses{" "}
                <span className="text-gradient inline-block min-w-[1ch]">
                  {animatedText}
                  <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />
                </span>{" "}
                and expand beyond their local area
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                SomAdz empowers entrepreneurs with AI-powered advertising tools, 
                marketplace access, and professional design capabilities to grow 
                their business reach and impact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="hero-button text-lg px-10 py-6">
                Get Started
              </Button>
              <Button variant="outline" className="text-lg px-10 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">50K+</div>
                <div className="text-sm text-muted-foreground">Ads Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;