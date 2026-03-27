import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Shield, ShieldOff } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type UserRole = Tables<"user_roles">;

const AdminUsers = () => {
  const [users, setUsers] = useState<(Profile & { role?: string; is_active?: boolean })[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);

    const profiles = profilesRes.data || [];
    const roles = rolesRes.data || [];

    const merged = profiles.map((p) => {
      const role = roles.find((r) => r.user_id === p.id);
      return { ...p, role: role?.role || "user", is_active: role?.is_active ?? true };
    });

    setUsers(merged);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleUserActive = async (userId: string, currentActive: boolean) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ is_active: !currentActive })
      .eq("user_id", userId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: currentActive ? "User banned" : "User unbanned" });
      fetchUsers();
    }
  };

  const filtered = users.filter((u) =>
    (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || "").includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
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
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No users found</TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || "—"}</TableCell>
                    <TableCell>{user.phone || "—"}</TableCell>
                    <TableCell>{user.business_name || "—"}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "admin" || user.role === "super_admin"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {user.is_active ? "Active" : "Banned"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleUserActive(user.id, user.is_active ?? true)}
                        className={user.is_active ? "text-destructive" : "text-green-500"}
                      >
                        {user.is_active ? <ShieldOff className="h-4 w-4 mr-1" /> : <Shield className="h-4 w-4 mr-1" />}
                        {user.is_active ? "Ban" : "Unban"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
