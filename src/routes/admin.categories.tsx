import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategories,
});

function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const fetchCategories = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setCategories(await res.json());
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setCategories(categories.filter(c => c.id !== id));
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setIsModalOpen(true);
    setTimeout(() => {
      if (!formRef.current) return;
      const form = formRef.current;
      (form.elements.namedItem('name') as HTMLInputElement).value = cat.name;
      (form.elements.namedItem('slug') as HTMLInputElement).value = cat.slug;
      (form.elements.namedItem('description') as HTMLTextAreaElement).value = cat.description || '';
      (form.elements.namedItem('icon') as HTMLInputElement).value = cat.icon || '';
      (form.elements.namedItem('sort_order') as HTMLInputElement).value = cat.sort_order;
    }, 100);
  };

  const handleCreate = () => {
    setEditingId(null);
    setIsModalOpen(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.reset();
        (formRef.current.elements.namedItem('sort_order') as HTMLInputElement).value = '0';
        (formRef.current.elements.namedItem('icon') as HTMLInputElement).value = '';
      }
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    
    if (editingId) {
      formData.append('_method', 'PUT');
    }

    const url = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const endpoint = editingId ? `/admin/categories/${editingId}` : `/admin/categories`;
    
    const res = await fetch(url + endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchCategories();
    } else {
      const error = await res.json();
      alert("Error saving: " + JSON.stringify(error.errors || error.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Categories</h1>
        <Button className="bg-blue-600" onClick={handleCreate}>Create Category</Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Icon</th>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Slug</th>
              <th className="px-6 py-3 font-semibold">Sort Order</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4">{cat.sort_order}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No categories found. Click "Create Category" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" name="slug" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji or URL)</Label>
                <Input id="icon" name="icon" placeholder="e.g. 🎓" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input id="sort_order" name="sort_order" type="number" defaultValue="0" required />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Category</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
