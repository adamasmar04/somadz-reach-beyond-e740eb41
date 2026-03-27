import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Users, Eye, TrendingUp, Clock, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    expiredAds: 0,
    totalUsers: 0,
    totalViews: 0,
  });
  const [recentAds, setRecentAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [adsRes, usersRes] = await Promise.all([
        supabase.from("ads").select("*"),
        supabase.from("profiles").select("id"),
      ]);

      const ads = adsRes.data || [];
      const now = new Date();
      const active = ads.filter((a) => new Date(a.expires_at) > now && a.status === "active");
      const expired = ads.filter((a) => new Date(a.expires_at) <= now);
      const views = ads.reduce((sum, a) => sum + (a.views || 0), 0);

      setStats({
        totalAds: ads.length,
        activeAds: active.length,
        expiredAds: expired.length,
        totalUsers: usersRes.data?.length || 0,
        totalViews: views,
      });

      setRecentAds(ads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Ads", value: stats.totalAds, icon: Megaphone, color: "text-primary" },
    { title: "Active Ads", value: stats.activeAds, icon: CheckCircle, color: "text-green-500" },
    { title: "Expired Ads", value: stats.expiredAds, icon: Clock, color: "text-orange-500" },
    { title: "Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { title: "Total Views", value: stats.totalViews, icon: Eye, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Ads */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Ads</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAds.length === 0 ? (
            <p className="text-muted-foreground text-sm">No ads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentAds.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-foreground">{ad.headline}</p>
                    <p className="text-xs text-muted-foreground">{ad.business_name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      new Date(ad.expires_at) > new Date() ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                    }`}>
                      {new Date(ad.expires_at) > new Date() ? "Active" : "Expired"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
