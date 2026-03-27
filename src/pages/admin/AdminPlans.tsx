import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$5",
    duration: "7 days",
    features: ["1 Ad listing", "Basic visibility", "Standard support"],
  },
  {
    name: "Standard",
    price: "$15",
    duration: "14 days",
    features: ["3 Ad listings", "Priority visibility", "Social media boost", "Email support"],
  },
  {
    name: "Premium",
    price: "$30",
    duration: "30 days",
    features: ["Unlimited ads", "Top visibility", "Featured placement", "Priority support", "Analytics"],
  },
];

const AdminPlans = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className="border-border">
            <CardHeader className="text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-3xl font-bold text-foreground">{plan.price}</p>
              <Badge variant="secondary">{plan.duration}</Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPlans;
