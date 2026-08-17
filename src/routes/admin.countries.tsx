import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { CountryData } from "@/lib/sc-shared";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Globe, Search } from "lucide-react";

export const Route = createFileRoute("/admin/countries")({
  component: AdminCountries,
});

function AdminCountries() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { token } = useAuth();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

  const { data: countries = [], isLoading } = useQuery<CountryData[]>({
    queryKey: ["admin", "countries"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/countries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch countries');
      return res.json();
    },
    enabled: !!token,
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/admin/countries/${id}/toggle-featured`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to toggle featured status');
      return res.json();
    },
    onMutate: () => {
      toast.loading("Updating status...", { id: "toggle-country" });
    },
    onSuccess: () => {
      toast.success("Country status updated successfully!", { id: "toggle-country" });
      queryClient.invalidateQueries({ queryKey: ["admin", "countries"] });
      // Also invalidate public home query to reflect changes immediately
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
    onError: () => {
      toast.error("Failed to update country status.", { id: "toggle-country" });
    }
  });

  const filtered = countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Countries</h1>
          <p className="text-sm text-gray-500 mt-1">Select which countries appear prominently on the public homepage grid.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search countries..." 
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-gray-500 font-medium animate-pulse">Loading countries...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 bg-gray-50/50">
            {filtered.map(country => (
              <div 
                key={country.id} 
                className={`flex items-center justify-between p-4 rounded-xl border bg-white transition-all duration-300 hover:shadow-md ${country.is_featured ? 'border-indigo-500 shadow-indigo-100 shadow-sm scale-[1.02]' : 'border-gray-200 hover:border-indigo-300'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {country.code ? (
                      <img 
                        src={`https://flagsapi.com/${country.code.toUpperCase()}/flat/64.png`} 
                        alt={country.name} 
                        className="h-10 w-10 object-contain drop-shadow-sm" 
                      />
                    ) : (
                      <Globe className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <span className={`font-semibold text-[15px] truncate max-w-[120px] ${country.is_featured ? 'text-indigo-900' : 'text-gray-700'}`}>
                    {country.name}
                  </span>
                </div>
                <Switch 
                  checked={!!country.is_featured} 
                  onCheckedChange={() => toggleMutation.mutate(country.id)}
                  disabled={toggleMutation.isPending}
                  className="data-[state=checked]:bg-indigo-600 shadow-sm"
                />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 flex flex-col items-center">
                <Globe className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-900">No countries found matching "{search}"</p>
                <p className="text-sm mt-1">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
