import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { FileText, Globe, Users, Mail, TrendingUp } from 'lucide-react';

const mockChartData = [
  { name: 'Mon', views: 0 },
  { name: 'Tue', views: 0 },
  { name: 'Wed', views: 0 },
  { name: 'Thu', views: 0 },
  { name: 'Fri', views: 0 },
  { name: 'Sat', views: 0 },
  { name: 'Sun', views: 0 },
];

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
      try {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (e) {
        console.error("Failed to load stats", e);
      }
    };
    if (token) fetchStats();
  }, [token]);

  const statCards = [
    { title: 'Total Opportunities', value: stats?.opportunities_count || 0, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Total Website Views', value: stats?.total_views?.toLocaleString() || 0, icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Registered Users', value: stats?.users_count || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Newsletter Subscribers', value: stats?.subscribers_count || 0, icon: Mail, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-500">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-900">Platform Traffic (Last 7 Days)</CardTitle>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-0"><TrendingUp className="w-3 h-3 mr-1" /> Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.chart_data || mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="views" name="Page Views" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
                  <Line type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Trending Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {stats?.popular_opportunities?.map((opp: any, i: number) => (
                <div key={opp.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-500 font-bold text-xs">
                      #{i + 1}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold text-gray-900 truncate text-sm">{opp.title}</span>
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${opp.status === 'published' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {opp.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md shrink-0 ml-4">
                    {opp.views_count?.toLocaleString() || 0}
                  </div>
                </div>
              ))}
              {!stats?.popular_opportunities?.length && (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                  <FileText className="w-8 h-8 text-gray-300 mb-2" />
                  <p>No popular opportunities yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
