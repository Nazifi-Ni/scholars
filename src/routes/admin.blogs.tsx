import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const Route = createFileRoute('/admin/blogs')({
  component: AdminBlogs,
});

function AdminBlogs() {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const fetchBlogs = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/admin/blogs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setBlogs(await res.json());
  };

  useEffect(() => {
    if (token) fetchBlogs();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setBlogs(blogs.filter(b => b.id !== id));
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setIsModalOpen(true);
    setTimeout(() => {
      if (!formRef.current) return;
      const form = formRef.current;
      (form.elements.namedItem('title') as HTMLInputElement).value = blog.title;
      (form.elements.namedItem('slug') as HTMLInputElement).value = blog.slug;
      (form.elements.namedItem('excerpt') as HTMLTextAreaElement).value = blog.excerpt || '';
      (form.elements.namedItem('content') as HTMLTextAreaElement).value = blog.content || '';
      (form.elements.namedItem('category') as HTMLInputElement).value = blog.category || '';
      (form.elements.namedItem('tags') as HTMLInputElement).value = blog.tags ? blog.tags.join(', ') : '';
      (form.elements.namedItem('reading_minutes') as HTMLInputElement).value = blog.reading_minutes;
      (form.elements.namedItem('status') as HTMLSelectElement).value = blog.status;
    }, 100);
  };

  const handleCreate = () => {
    setEditingId(null);
    setIsModalOpen(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.reset();
        (formRef.current.elements.namedItem('reading_minutes') as HTMLInputElement).value = '4';
      }
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    
    // Process tags string to array
    const tagsString = formData.get('tags') as string;
    const tagsArray = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];
    formData.delete('tags');
    tagsArray.forEach(tag => formData.append('tags[]', tag));

    if (editingId) {
      formData.append('_method', 'PUT');
    }

    const url = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const endpoint = editingId ? `/admin/blogs/${editingId}` : `/admin/blogs`;
    
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
      fetchBlogs();
    } else {
      const error = await res.json();
      alert("Error saving: " + JSON.stringify(error.errors || error.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Blog Posts</h1>
        <Button className="bg-blue-600" onClick={handleCreate}>Create Post</Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Title</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{blog.title}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(blog.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No blog posts found. Click "Create Post" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Post' : 'Create Post'}</DialogTitle>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" name="slug" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown/HTML)</Label>
              <Textarea id="content" name="content" className="h-40" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" name="tags" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reading_minutes">Reading Minutes</Label>
                <Input id="reading_minutes" name="reading_minutes" type="number" defaultValue="4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Post</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
