import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const VideoSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              See <span className="text-gradient">SomAdz</span> in Action
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Watch how businesses transform their reach with our powerful advertising platform. 
              From local shops to growing enterprises, see real results in real time.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <span className="text-foreground">AI-powered ad creation in minutes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <span className="text-foreground">Real-time analytics and performance tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm">✓</span>
                </div>
                <span className="text-foreground">Marketplace integration for maximum reach</span>
              </div>
            </div>
            <Button className="hero-button">
              Start Free Trial
            </Button>
          </div>

          {/* Right Side - Video */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl">
              <div className="relative aspect-video bg-gradient-to-br from-card to-secondary flex items-center justify-center group cursor-pointer">
                {/* Video Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10"></div>
                
                {/* Play Button */}
                <div className="relative z-10 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 animate-glow-pulse">
                  <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-1">SomAdz Platform Demo</h3>
                    <p className="text-sm text-muted-foreground">Watch how to create your first ad campaign</p>
                  </div>
                </div>

                {/* Mock Video Elements */}
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  LIVE
                </div>
              </div>
            </Card>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-xl border border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">2.4M</div>
                <div className="text-sm text-muted-foreground">Views This Month</div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-card rounded-xl p-4 shadow-xl border border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">95%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;