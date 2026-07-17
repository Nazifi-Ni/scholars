import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CountryData } from "@/lib/sc-shared";
import { Switch } from "@/components/ui/switch";
import { Loader2, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/countries")({
  component: AdminCountries,
});

function AdminCountries() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: countries = [], isLoading } = useQuery<CountryData[]>({
    queryKey: ["admin", "countries"],
    queryFn: async () => {
      const res = await api.get("/admin/countries");
      return res.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/admin/countries/${id}/toggle-featured`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "countries"] });
      // Also invalidate public home query to reflect changes immediately
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });

  const filtered = countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-navy font-heading">Manage Countries</h2>
          <p className="text-muted-foreground mt-1 text-sm">Select which countries appear prominently on the public homepage grid.</p>
        </div>
        <input 
          type="text" 
          placeholder="Search countries..." 
          className="border rounded-full px-4 py-2.5 text-sm w-full sm:w-72 focus:outline-none focus:border-secondary shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-card border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-navy/50" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
            {filtered.map(country => (
              <div 
                key={country.id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${country.is_featured ? 'border-secondary bg-secondary/5 shadow-sm scale-[1.02]' : 'border-border hover:border-border/80'}`}
              >
                <div className="flex items-center gap-3">
                  {country.code ? (
                    <img 
                      src={`https://flagsapi.com/${country.code.toUpperCase()}/flat/64.png`} 
                      alt={country.name} 
                      className="h-10 w-10 object-contain drop-shadow-sm" 
                    />
                  ) : (
                    <Globe className="h-10 w-10 text-muted-foreground/30" />
                  )}
                  <span className={`font-bold text-[15px] ${country.is_featured ? 'text-navy' : 'text-navy/70'}`}>
                    {country.name}
                  </span>
                </div>
                <Switch 
                  checked={!!country.is_featured} 
                  onCheckedChange={() => toggleMutation.mutate(country.id)}
                  disabled={toggleMutation.isPending}
                  className="data-[state=checked]:bg-secondary"
                />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                No countries found matching "{search}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
