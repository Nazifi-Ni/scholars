import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

export const Route = createFileRoute('/admin/subscribers')({
  component: AdminSubscribers,
});

function AdminSubscribers() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${API_BASE_URL}/admin/subscribers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setSubscribers(await res.json());
    };
    if (token) fetchSubscribers();
  }, [token]);

  const copyEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    alert('Emails copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Newsletter Subscribers</h1>
        <Button onClick={copyEmails} className="bg-blue-600" disabled={subscribers.length === 0}>
          <Copy className="mr-2 h-4 w-4" /> Copy All Emails
        </Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Email Address</th>
              <th className="px-6 py-3 font-semibold text-right">Subscribed Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscribers.map((sub: any) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-right">{new Date(sub.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                  No subscribers found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
