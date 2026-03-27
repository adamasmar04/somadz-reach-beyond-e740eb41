import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Search, Eye } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type Ad = Tables<"ads">;

const AdminAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchAds = async () => {
    setLoading(true);
    const { data } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
    setAds(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAds(); }, []);

  const deleteAd = async (id: string) => {
    const { error } = await supabase.from("ads").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ad deleted" });
      setAds((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const now = new Date();
  const filtered = ads.filter((ad) => {
    const matchSearch = ad.headline.toLowerCase().includes(search.toLowerCase()) ||
      ad.business_name.toLowerCase().includes(search.toLowerCase());
    const isExpired = new Date(ad.expires_at) <= now;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !isExpired) ||
      (statusFilter === "expired" && isExpired);
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Headline</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No ads found</TableCell>
                </TableRow>
              ) : (
                filtered.map((ad) => {
                  const expired = new Date(ad.expires_at) <= now;
                  return (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{ad.headline}</TableCell>
                      <TableCell>{ad.business_name}</TableCell>
                      <TableCell className="capitalize">{ad.package_type}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${expired ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}`}>
                          {expired ? "Expired" : "Active"}
                        </span>
                      </TableCell>
                      <TableCell>{ad.views || 0}</TableCell>
                      <TableCell className="text-xs">{new Date(ad.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/ads/${ad.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteAd(ad.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAds;
