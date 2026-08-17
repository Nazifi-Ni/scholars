import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Edit2, Trash2, PlusCircle, Tags } from 'lucide-react';

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategories,
});

function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '', slug: '', description: '', icon: '', sort_order: 0
  });

  const fetchCategories = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    
    const promise = fetch(`${API_BASE_URL}/admin/categories/${deleteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to delete');
      setCategories(categories.filter(c => c.id !== deleteId));
      setDeleteId(null);
    });

    toast.promise(promise, {
      loading: 'Deleting category...',
      success: 'Category deleted successfully!',
      error: 'Failed to delete category.'
    });
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      icon: cat.icon || '',
      sort_order: cat.sort_order || 0
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      name: '', slug: '', description: '', icon: '', sort_order: 0
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
      formPayload.append(key, formData[key]);
    });

    if (editingId) formPayload.append('_method', 'PUT');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const endpoint = editingId ? `/admin/categories/${editingId}` : `/admin/categories`;
    
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
      fetchCategories();
    });

    toast.promise(promise, {
      loading: 'Saving category...',
      success: 'Category saved successfully!',
      error: (err) => err.message
    });
  };

  const handleToggleFeatured = async (id: number) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const promise = fetch(`${API_BASE_URL}/admin/categories/${id}/toggle-featured`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to toggle featured status');
      fetchCategories();
    });

    toast.promise(promise, {
      loading: 'Updating status...',
      success: 'Category updated!',
      error: 'Update failed.'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize opportunities and blog posts.</p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
          <PlusCircle className="w-4 h-4 mr-2" /> Create Category
        </Button>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Icon</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 text-center">Featured on Home</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-center">
                    <Switch 
                      checked={!!cat.is_featured_on_home}
                      onCheckedChange={() => handleToggleFeatured(cat.id)}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 font-mono">{cat.sort_order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(cat)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <Tags className="h-6 w-6 text-gray-400" />
                      </div>
                      <p>No categories found.</p>
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
              This action cannot be undone. This will permanently delete the category.
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
        <DialogContent className="max-w-xl p-0 gap-0 bg-gray-50">
          <DialogHeader className="px-6 py-4 bg-white border-b border-gray-100">
            <DialogTitle className="text-xl">{editingId ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={formData.name} onChange={e => handleFieldChange('name', e.target.value)} required className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={formData.slug} onChange={e => handleFieldChange('slug', e.target.value)} required className="bg-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => handleFieldChange('description', e.target.value)} className="bg-white h-24" />
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Icon (Emoji or URL)</Label>
                  <Input value={formData.icon} onChange={e => handleFieldChange('icon', e.target.value)} placeholder="e.g. 🎓" className="bg-white text-lg" />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input value={formData.sort_order} onChange={e => handleFieldChange('sort_order', e.target.value)} type="number" required className="bg-white" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
                {editingId ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
