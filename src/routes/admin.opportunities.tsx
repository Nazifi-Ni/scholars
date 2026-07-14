import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const Route = createFileRoute('/admin/opportunities')({
  component: AdminOpportunities,
});

function AdminOpportunities() {
  const { token } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const fetchOpps = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/admin/opportunities`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setOpportunities(await res.json());
  };

  useEffect(() => {
    if (token) fetchOpps();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/admin/opportunities/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setOpportunities(opportunities.filter(o => o.id !== id));
  };

  const handleEdit = (opp: any) => {
    setEditingId(opp.id);
    setIsModalOpen(true);
    // Populate form next tick
    setTimeout(() => {
      if (!formRef.current) return;
      const form = formRef.current;
      (form.elements.namedItem('title') as HTMLInputElement).value = opp.title;
      (form.elements.namedItem('slug') as HTMLInputElement).value = opp.slug;
      (form.elements.namedItem('summary') as HTMLTextAreaElement).value = opp.summary || '';
      (form.elements.namedItem('eligibility') as HTMLTextAreaElement).value = opp.eligibility || '';
      (form.elements.namedItem('benefits') as HTMLTextAreaElement).value = opp.benefits || '';
      (form.elements.namedItem('opportunity_type') as HTMLSelectElement).value = opp.opportunity_type;
      (form.elements.namedItem('funding_type') as HTMLSelectElement).value = opp.funding_type;
      (form.elements.namedItem('status') as HTMLSelectElement).value = opp.status;
      (form.elements.namedItem('degree_levels') as HTMLInputElement).value = opp.degree_levels ? JSON.stringify(opp.degree_levels) : '["Bachelors"]';
      (form.elements.namedItem('is_featured') as HTMLInputElement).checked = !!opp.is_featured;
      (form.elements.namedItem('application_link') as HTMLInputElement).value = opp.application_link || '';
      (form.elements.namedItem('official_website') as HTMLInputElement).value = opp.official_website || '';
      (form.elements.namedItem('required_documents') as HTMLTextAreaElement).value = opp.required_documents || '';
      (form.elements.namedItem('application_procedure') as HTMLTextAreaElement).value = opp.application_procedure || '';
      (form.elements.namedItem('deadline') as HTMLInputElement).value = opp.deadline ? opp.deadline.split('T')[0] : '';
    }, 100);
  };

  const handleCreate = () => {
    setEditingId(null);
    setIsModalOpen(true);
    setTimeout(() => {
      if (formRef.current) formRef.current.reset();
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    
    // Convert string array to proper format for API
    try {
      const degreesStr = formData.get('degree_levels') as string;
      const degreesArr = JSON.parse(degreesStr);
      formData.set('degree_levels', JSON.stringify(degreesArr));
    } catch (e) {
      alert("Degree levels must be a valid JSON array like [\"Bachelors\", \"Masters\"]");
      return;
    }

    if (editingId) {
      formData.append('_method', 'PUT'); // Laravel spoofing for PUT with FormData
    }

    const url = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const endpoint = editingId ? `/admin/opportunities/${editingId}` : `/admin/opportunities`;
    
    const res = await fetch(url + endpoint, {
      method: 'POST', // Always POST when using FormData (with _method=PUT for updates)
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchOpps();
    } else {
      const error = await res.json();
      alert("Error saving: " + JSON.stringify(error.errors || error.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Opportunities</h1>
        <Button className="bg-blue-600" onClick={handleCreate}>Create Opportunity</Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Title</th>
              <th className="px-6 py-3 font-semibold">Type</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {opportunities.map((opp) => (
              <tr key={opp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{opp.title}</td>
                <td className="px-6 py-4 text-gray-500 capitalize">{opp.opportunity_type?.replace('-', ' ')}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${opp.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {opp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleEdit(opp)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                  <button onClick={() => handleDelete(opp.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {opportunities.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No opportunities found. Click "Create Opportunity" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Opportunity' : 'Create Opportunity'}</DialogTitle>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (e.g. my-scholarship-2026)</Label>
                <Input id="slug" name="slug" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eligibility">Eligibility</Label>
                <Textarea id="eligibility" name="eligibility" className="h-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea id="benefits" name="benefits" className="h-32" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="required_documents">Required Documents</Label>
                <Textarea id="required_documents" name="required_documents" className="h-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="application_procedure">Application Procedure</Label>
                <Textarea id="application_procedure" name="application_procedure" className="h-32" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opportunity_type">Type</Label>
                <select id="opportunity_type" name="opportunity_type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                  <option value="scholarship">Scholarship</option>
                  <option value="internship">Internship</option>
                  <option value="job">Job</option>
                  <option value="grant">Grant</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="funding_type">Funding</Label>
                <select id="funding_type" name="funding_type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                  <option value="fully_funded">Fully Funded</option>
                  <option value="partially_funded">Partially Funded</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree_levels">Degree Levels (JSON Array)</Label>
                <Input id="degree_levels" name="degree_levels" defaultValue='["Bachelors", "Masters"]' required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="application_link">Apply Link (URL)</Label>
                <Input id="application_link" name="application_link" type="url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="official_website">Official Website (URL)</Label>
                <Input id="official_website" name="official_website" type="url" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" name="deadline" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Cover Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <input type="checkbox" id="is_featured" name="is_featured" value="1" className="h-4 w-4" />
              <Label htmlFor="is_featured">Feature on Homepage</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Opportunity</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
