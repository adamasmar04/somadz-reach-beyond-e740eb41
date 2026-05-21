import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      quote: "SomAdz transformed our local bakery into a regional success. We've reached customers we never thought possible!",
      author: "Sarah Chen",
      role: "Baker & Business Owner",
      rating: 5
    },
    {
      quote: "The AI design tools saved us thousands on marketing materials. Professional results in minutes, not days.",
      author: "Marcus Rodriguez",
      role: "Restaurant Owner",
      rating: 5
    },
    {
      quote: "From 50 to 5,000 customers in 6 months. SomAdz's advertising platform delivered results beyond our expectations.",
      author: "Jennifer Kim",
      role: "Fitness Studio Owner",
      rating: 5
    },
    {
      quote: "Waxaan ku helay macaamiil cusub maalin walba. SomAdz waa platform-ka ugu fiican ee ganacsiga Soomaalida.",
      author: "Abdirahman Hassan",
      role: "Tech Shop Owner, Mogadishu",
      rating: 5
    },
    {
      quote: "The VIP membership unlocked premium placement that doubled our monthly leads. Worth every dollar!",
      author: "Layla Ahmed",
      role: "Fashion Boutique Owner",
      rating: 5
    },
    {
      quote: "Customer support is incredible — they helped me launch my first ad campaign in under 10 minutes.",
      author: "Daniel Okafor",
      role: "Digital Marketer",
      rating: 5
    },
    {
      quote: "I run three businesses on SomAdz now. The analytics dashboard tells me exactly what's working.",
      author: "Fatima Noor",
      role: "Multi-Business Entrepreneur",
      rating: 5
    },
    {
      quote: "Best return on investment I've ever seen. My real estate listings sell 3x faster with SomAdz.",
      author: "Omar Yusuf",
      role: "Real Estate Agent",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from businesses that grew with SomAdz
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="testimonial-card mx-auto max-w-2xl">
                    <CardContent className="p-8 text-center">
                      <div className="text-6xl mb-6 text-primary">"</div>
                      <blockquote className="text-xl text-foreground mb-6 leading-relaxed">
                        {testimonial.quote}
                      </blockquote>
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">★</span>
                        ))}
                      </div>
                      <cite className="not-italic">
                        <div className="font-semibold text-lg text-gradient">{testimonial.author}</div>
                        <div className="text-muted-foreground">{testimonial.role}</div>
                      </cite>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary scale-125"
                    : "bg-muted hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
