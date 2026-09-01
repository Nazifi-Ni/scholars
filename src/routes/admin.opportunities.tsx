import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit2, Trash2, PlusCircle, LayoutList, Layers, Link as LinkIcon, Image as ImageIcon, FileText } from 'lucide-react';

export const Route = createFileRoute('/admin/opportunities')({
  component: AdminOpportunities,
});

function AdminOpportunities() {
  const { token } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '', slug: '', summary: '', eligibility: '', benefits: '',
    opportunity_type: 'scholarship', category_id: '', funding_type: 'fully_funded',
    status: 'published', degree_levels: '["Bachelors"]', is_featured: false,
    application_link: '', official_website: '', required_documents: '',
    application_procedure: '', deadline: '', meta_description: '', meta_keywords: ''
  });

  const fetchData = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    try {
      const resOpps = await fetch(`${API_BASE_URL}/admin/opportunities`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (resOpps.ok) setOpportunities(await resOpps.json());

      const resCats = await fetch(`${API_BASE_URL}/admin/categories`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (resCats.ok) setCategories(await resCats.json());
    } catch (e) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    
    const promise = fetch(`${API_BASE_URL}/admin/opportunities/${deleteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to delete');
      setOpportunities(opportunities.filter(o => o.id !== deleteId));
      setDeleteId(null);
    });

    toast.promise(promise, {
      loading: 'Deleting opportunity...',
      success: 'Opportunity deleted successfully!',
      error: 'Failed to delete opportunity.'
    });
  };

  const handleEdit = (opp: any) => {
    setEditingId(opp.id);
    setFormData({
      title: opp.title || '',
      slug: opp.slug || '',
      summary: opp.summary || '',
      eligibility: opp.eligibility || '',
      benefits: opp.benefits || '',
      opportunity_type: opp.opportunity_type || 'scholarship',
      category_id: opp.category_id ? String(opp.category_id) : '',
      funding_type: opp.funding_type || 'fully_funded',
      status: opp.status || 'published',
      degree_levels: opp.degree_levels ? JSON.stringify(opp.degree_levels) : '["Bachelors"]',
      is_featured: !!opp.is_featured,
      application_link: opp.application_link || '',
      official_website: opp.official_website || '',
      required_documents: opp.required_documents || '',
      application_procedure: opp.application_procedure || '',
      scholarsconnect_advice: opp.scholarsconnect_advice || '',
      deadline: opp.deadline ? opp.deadline.split('T')[0] : '',
      meta_description: opp.meta_description || '',
      meta_keywords: opp.meta_keywords || ''
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      title: '', slug: '', summary: '', eligibility: '', benefits: '',
      opportunity_type: 'scholarship', category_id: '', funding_type: 'fully_funded',
      status: 'published', degree_levels: '["Bachelors"]', is_featured: false,
      application_link: '', official_website: '', required_documents: '',
      application_procedure: '', scholarsconnect_advice: '', deadline: '', meta_description: '', meta_keywords: ''
    });
    setIsModalOpen(true);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formPayload = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'is_featured') {
        formPayload.append(key, formData[key] ? '1' : '0');
      } else if (key === 'degree_levels') {
        try {
          formPayload.append(key, JSON.stringify(JSON.parse(formData[key])));
        } catch(err) {
          toast.error("Degree levels must be a valid JSON array like [\"Bachelors\"]");
          return;
        }
      } else if (key === 'category_id' && formData[key] === 'none') {
        formPayload.append(key, '');
      } else {
        formPayload.append(key, formData[key] || '');
      }
    });

    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formPayload.append('image', fileInput.files[0]);
    }

    if (editingId) formPayload.append('_method', 'PUT');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const endpoint = editingId ? `/admin/opportunities/${editingId}` : `/admin/opportunities`;
    
    const promise = fetch(API_BASE_URL + endpoint, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      body: formPayload
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error saving data');
      }
      setIsModalOpen(false);
      fetchData();
    });

    toast.promise(promise, {
      loading: 'Saving opportunity...',
      success: 'Opportunity saved successfully!',
      error: (err) => err.message
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-1">Manage scholarships, jobs, and internships.</p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
          <PlusCircle className="w-4 h-4 mr-2" /> Create Opportunity
        </Button>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type & Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 line-clamp-1">{opp.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(opp.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <Badge variant="outline" className="capitalize bg-indigo-50 text-indigo-700 border-indigo-100">
                        {opp.opportunity_type?.replace('_', ' ')}
                      </Badge>
                      {opp.category && <span className="text-xs text-gray-500">{opp.category.name}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={opp.status === 'published' ? 'default' : 'secondary'} className={opp.status === 'published' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0' : 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-0'}>
                      {opp.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(opp)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(opp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {opportunities.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <p>No opportunities found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the opportunity from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-gray-50">
          <DialogHeader className="px-6 py-4 bg-white border-b border-gray-100">
            <DialogTitle className="text-xl">{editingId ? 'Edit Opportunity' : 'Create Opportunity'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <Tabs defaultValue="basic" className="w-full">
              <div className="bg-white px-6 pt-2 border-b border-gray-100 sticky top-0 z-10">
                <TabsList className="w-full justify-start h-auto bg-transparent p-0 gap-6">
                  <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-sm font-medium">
                    <LayoutList className="w-4 h-4 mr-2" /> Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-sm font-medium">
                    <Layers className="w-4 h-4 mr-2" /> Details
                  </TabsTrigger>
                  <TabsTrigger value="links" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-sm font-medium">
                    <LinkIcon className="w-4 h-4 mr-2" /> Links & Media
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-sm font-medium">
                    <FileText className="w-4 h-4 mr-2" /> SEO
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="basic" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={formData.title} onChange={e => handleFieldChange('title', e.target.value)} required placeholder="e.g. Oxford Full Scholarship" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input value={formData.slug} onChange={e => handleFieldChange('slug', e.target.value)} required placeholder="e.g. oxford-scholarship-2026" className="bg-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Summary</Label>
                    <Textarea value={formData.summary} onChange={e => handleFieldChange('summary', e.target.value)} className="bg-white h-24" placeholder="Brief description..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={formData.opportunity_type} onValueChange={v => handleFieldChange('opportunity_type', v)}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scholarship">Scholarship</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="job">Job</SelectItem>
                          <SelectItem value="grant">Grant</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="hackathon">Hackathon</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category_id} onValueChange={v => handleFieldChange('category_id', v)}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Category</SelectItem>
                          {categories.map((c: any) => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Funding</Label>
                      <Select value={formData.funding_type} onValueChange={v => handleFieldChange('funding_type', v)}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fully_funded">Fully Funded</SelectItem>
                          <SelectItem value="partially_funded">Partially Funded</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Eligibility</Label>
                      <Textarea value={formData.eligibility} onChange={e => handleFieldChange('eligibility', e.target.value)} className="bg-white h-40" />
                    </div>
                    <div className="space-y-2">
                      <Label>Benefits</Label>
                      <Textarea value={formData.benefits} onChange={e => handleFieldChange('benefits', e.target.value)} className="bg-white h-40" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Required Documents</Label>
                      <Textarea value={formData.required_documents} onChange={e => handleFieldChange('required_documents', e.target.value)} className="bg-white h-40" />
                    </div>
                    <div className="space-y-2">
                      <Label>Application Procedure</Label>
                      <Textarea value={formData.application_procedure} onChange={e => handleFieldChange('application_procedure', e.target.value)} className="bg-white h-40" />
                    </div>
                    <div className="space-y-2">
                      <Label>ScholarsConnect Advice</Label>
                      <Textarea value={formData.scholarsconnect_advice} onChange={e => handleFieldChange('scholarsconnect_advice', e.target.value)} placeholder="Exclusive advice to beat AdSense 'low value' flag" className="bg-white h-32 border-indigo-200 focus-visible:ring-indigo-500" />
                      <p className="text-xs text-muted-foreground">This adds unique content to your listings to help with SEO and AdSense.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Degree Levels (JSON Array)</Label>
                    <Input value={formData.degree_levels} onChange={e => handleFieldChange('degree_levels', e.target.value)} className="bg-white font-mono text-sm" />
                  </div>
                </TabsContent>

                <TabsContent value="links" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Application Link</Label>
                      <Input value={formData.application_link} onChange={e => handleFieldChange('application_link', e.target.value)} type="url" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label>Official Website</Label>
                      <Input value={formData.official_website} onChange={e => handleFieldChange('official_website', e.target.value)} type="url" className="bg-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Input value={formData.deadline} onChange={e => handleFieldChange('deadline', e.target.value)} type="date" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover Image</Label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input id="image" type="file" accept="image/*" className="bg-white cursor-pointer file:cursor-pointer file:border-0 file:bg-gray-100 file:text-gray-700 file:font-medium file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-gray-200" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
                    <h3 className="font-semibold text-gray-900">Publishing Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={v => handleFieldChange('status', v)}>
                          <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-3 pt-8">
                        <input 
                          type="checkbox" 
                          id="is_featured" 
                          checked={formData.is_featured} 
                          onChange={e => handleFieldChange('is_featured', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        />
                        <Label htmlFor="is_featured" className="cursor-pointer font-medium">Feature on Homepage</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea value={formData.meta_description} onChange={e => handleFieldChange('meta_description', e.target.value)} placeholder="Brief description for search engines (max 160 chars)" className="bg-white h-24" />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Keywords</Label>
                    <Input value={formData.meta_keywords} onChange={e => handleFieldChange('meta_keywords', e.target.value)} placeholder="scholarships, undergraduate, funding..." className="bg-white" />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-end gap-3 mt-auto sticky bottom-0">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
                {editingId ? 'Save Changes' : 'Create Opportunity'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
