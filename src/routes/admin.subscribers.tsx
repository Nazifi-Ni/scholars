import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Mail, Users } from 'lucide-react';

export const Route = createFileRoute('/admin/subscribers')({
  component: AdminSubscribers,
});

function AdminSubscribers() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
      try {
        const res = await fetch(`${API_BASE_URL}/admin/subscribers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setSubscribers(await res.json());
      } catch (e) {
        toast.error('Failed to load subscribers');
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchSubscribers();
  }, [token]);

  const copyEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    toast.success('Emails copied to clipboard!', {
      description: `Successfully copied ${subscribers.length} email addresses.`
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your mailing list ({subscribers.length} total).</p>
        </div>
        <Button onClick={copyEmails} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200" disabled={subscribers.length === 0 || isLoading}>
          <Copy className="mr-2 h-4 w-4" /> Copy All Emails
        </Button>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-right">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p className="animate-pulse">Loading subscribers...</p>
                    </div>
                  </td>
                </tr>
              ) : subscribers.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-indigo-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-right">{new Date(sub.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
              {!isLoading && subscribers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                        <Mail className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-lg font-medium text-gray-900">No subscribers found yet.</p>
                      <p className="text-sm mt-1">Users who subscribe to your newsletter will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
