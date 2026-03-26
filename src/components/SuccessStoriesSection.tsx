import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Star } from "lucide-react";

const SuccessStoriesSection = () => {
  const stories = [
    {
      name: "Amina Farah",
      business: "Amina's Fashion House",
      location: "Muqdisho, Somalia",
      quote: "SomAdz ayaa nolosha iga bedelay! Ganacsigeygii yar oo dharka ahaa wuxuu noqday mid caan ah oo macaamiil badan leh. 3 bilood gudahood macaamiisheydu waxay noqdeen 10x intii hore.",
      stat: "10x",
      statLabel: "Macaamiil kordhay",
      icon: Users,
    },
    {
      name: "Cabdirashiid Maxamed",
      business: "TechSom Solutions",
      location: "Hargeysa, Somaliland",
      quote: "Waxaan isticmaalay SomAdz si aan u xayeysiyo adeegyadeena technology-ga. Natiijadii waxay ahayd mid la yaab leh - dakhligeenii wuxuu kordhay 300% lix bilood gudahood.",
      stat: "300%",
      statLabel: "Dakhli kordhay",
      icon: DollarSign,
    },
    {
      name: "Hodan Cali",
      business: "Hodan Beauty & Spa",
      location: "Nairobi, Kenya",
      quote: "SomAdz waa platform-kii ugu fiicnaa ee aan weligey isticmaalay. Design-ka AI-ga ah iyo marketplace-ka waxay noo fududeeyeen in aan macaamiil cusub helno maalin walba.",
      stat: "5,000+",
      statLabel: "Macaamiil cusub",
      icon: TrendingUp,
    },
    {
      name: "Yusuf Ibrahim",
      business: "Yusuf Electronics",
      location: "Mogadishu, Somalia",
      quote: "Markii aan bilaabay SomAdz, ganacsigeygii wuxuu ahaa mid yar. Maanta waxaan leeyahay 3 branch oo cusub. Xayeysiinta SomAdz ayaa fududeysay in aan dad badan gaadho.",
      stat: "3",
      statLabel: "Branch cusub",
      icon: Star,
    },
    {
      name: "Sahra Nuur",
      business: "Sahra Catering Services",
      location: "Djibouti",
      quote: "Waxaan aad ugu faraxsanahay SomAdz. Cuntadeyda ayaa hadda dad badan gaadhi kartaa. Orders-keenii waxay noqdeen laba jeer intii hore bilihii ugu horeeyay.",
      stat: "2x",
      statLabel: "Orders kordhay",
      icon: TrendingUp,
    },
    {
      name: "Maxamed Axmed",
      business: "Axmed Transport Co.",
      location: "Berbera, Somaliland",
      quote: "SomAdz waxay noo fududeysay in aan adeegyadenna gaadhsiinno macaamiil cusub. Waa investment-kii ugu fiicnaa ee aan sameynay ganacsigeenna.",
      stat: "150%",
      statLabel: "Growth rate",
      icon: DollarSign,
    },
  ];

  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Dadka Ka Guulaystay SomAdz</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sheekooyin dhab ah oo ka socda ganacsato ku guulaystay SomAdz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => {
            const Icon = story.icon;
            return (
              <Card
                key={index}
                className="feature-card group hover:border-primary/50 transition-all duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Stat badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gradient">{story.stat}</div>
                        <div className="text-xs text-muted-foreground">{story.statLabel}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-muted-foreground text-sm leading-relaxed italic border-l-2 border-primary/30 pl-4">
                    "{story.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="pt-2 border-t border-border">
                    <div className="font-semibold text-foreground">{story.name}</div>
                    <div className="text-sm text-primary">{story.business}</div>
                    <div className="text-xs text-muted-foreground">{story.location}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
