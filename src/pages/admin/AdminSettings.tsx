import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input defaultValue="SomAdz" />
          </div>
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Input defaultValue="USD" />
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input defaultValue="support@somadz.com" placeholder="support@somadz.com" />
          </div>
          <Button className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
