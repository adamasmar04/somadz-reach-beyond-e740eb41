import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flag className="h-5 w-5 text-orange-500" />
            Reports & Complaints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            No reports yet. When users report ads, they will appear here for review.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
