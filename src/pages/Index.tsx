import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import VideoSection from "@/components/VideoSection";
import PricingSection from "@/components/PricingSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <VideoSection />
      <PricingSection />
      <WhyChooseSection />
      <Footer />
    </div>
  );
};

export default Index;
