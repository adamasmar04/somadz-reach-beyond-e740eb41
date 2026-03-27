import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const AdminFeatured = () => {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Ads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            Feature management coming soon. You'll be able to highlight ads on the homepage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeatured;
