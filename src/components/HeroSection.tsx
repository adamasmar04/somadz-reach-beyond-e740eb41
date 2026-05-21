import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroPortrait from "@/assets/hero-portrait.jpg";


const phrases = ["reach more people", "grow your brand", "boost your sales", "find new customers", "expand your reach"];

const useTypewriter = (texts: string[], typeSpeed = 100, deleteSpeed = 60, pauseDuration = 2000) => {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const currentText = texts[textIndex];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < currentText.length) {
      timeout = setTimeout(() => setDisplayed(currentText.slice(0, displayed.length + 1)), typeSpeed);
    } else if (!isDeleting && displayed.length === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(currentText.slice(0, displayed.length - 1)), deleteSpeed);
    } else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % texts.length);
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, currentText, texts.length, typeSpeed, deleteSpeed, pauseDuration]);

  return displayed;
};

const HeroSection = () => {
  const animatedText = useTypewriter(phrases, 120, 80, 2500);
  const navigate = useNavigate();
  return (
    <section id="home" className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex justify-center animate-float">
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-full blur-3xl absolute inset-0"></div>
              <div className="relative z-10 rounded-3xl border border-border shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <img
                  src={heroPortrait}
                  alt="Entrepreneur working late on SomAdz campaigns"
                  className="w-[420px] h-[480px] object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md rounded-xl px-4 py-3 border border-border">
                  <div className="text-sm font-semibold text-gradient">📈 Growth Analytics</div>
                  <div className="text-xs text-muted-foreground">Late-night hustle, real results</div>
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
              <Button className="hero-button text-lg px-10 py-6" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
              <Button variant="outline" className="text-lg px-10 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => navigate("/ads")}>
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