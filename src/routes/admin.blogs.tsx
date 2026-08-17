import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit2, Trash2, PlusCircle, FileText, ImageIcon } from 'lucide-react';

export const Route = createFileRoute('/admin/blogs')({
  component: AdminBlogs,
});

function AdminBlogs() {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '', slug: '', excerpt: '', content: '', category: '', tags: '',
    reading_minutes: 4, status: 'published'
  });

  const fetchBlogs = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${API_BASE_URL}/admin/blogs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setBlogs(await res.json());
    } catch (e) {
      toast.error('Failed to load blogs');
    }
  };

  useEffect(() => {
    if (token) fetchBlogs();
  }, [token]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    
    const promise = fetch(`${API_BASE_URL}/admin/blogs/${deleteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to delete');
      setBlogs(blogs.filter(b => b.id !== deleteId));
      setDeleteId(null);
    });

    toast.promise(promise, {
      loading: 'Deleting post...',
      success: 'Blog post deleted successfully!',
      error: 'Failed to delete post.'
    });
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || '',
      tags: blog.tags ? blog.tags.join(', ') : '',
      reading_minutes: blog.reading_minutes || 4,
      status: blog.status || 'published'
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      title: '', slug: '', excerpt: '', content: '', category: '', tags: '',
      reading_minutes: 4, status: 'published'
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
      if (key !== 'tags') {
        formPayload.append(key, formData[key]);
      }
    });

    // Process tags string to array
    const tagsString = formData.tags;
    const tagsArray = tagsString ? tagsString.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
    tagsArray.forEach((tag: string) => formPayload.append('tags[]', tag));

    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formPayload.append('image', fileInput.files[0]);
    }

    if (editingId) formPayload.append('_method', 'PUT');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const endpoint = editingId ? `/admin/blogs/${editingId}` : `/admin/blogs`;
    
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
      fetchBlogs();
    });

    toast.promise(promise, {
      loading: 'Saving post...',
      success: 'Blog post saved successfully!',
      error: (err) => err.message
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage articles, news, and insights.</p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
          <PlusCircle className="w-4 h-4 mr-2" /> Create Post
        </Button>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 line-clamp-1">{blog.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(blog.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {blog.category || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'} className={blog.status === 'published' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0' : 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-0'}>
                      {blog.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(blog)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(blog.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <p>No blog posts found.</p>
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
              This action cannot be undone. This will permanently delete the post.
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-gray-50">
          <DialogHeader className="px-6 py-4 bg-white border-b border-gray-100">
            <DialogTitle className="text-xl">{editingId ? 'Edit Post' : 'Create Post'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => handleFieldChange('title', e.target.value)} required className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={formData.slug} onChange={e => handleFieldChange('slug', e.target.value)} required className="bg-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={formData.excerpt} onChange={e => handleFieldChange('excerpt', e.target.value)} className="bg-white h-20" />
            </div>

            <div className="space-y-2">
              <Label>Content (Markdown/HTML)</Label>
              <Textarea value={formData.content} onChange={e => handleFieldChange('content', e.target.value)} className="bg-white h-48 font-mono text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={formData.category} onChange={e => handleFieldChange('category', e.target.value)} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags} onChange={e => handleFieldChange('tags', e.target.value)} className="bg-white" />
              </div>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={v => handleFieldChange('status', v)}>
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reading Minutes</Label>
                  <Input value={formData.reading_minutes} onChange={e => handleFieldChange('reading_minutes', e.target.value)} type="number" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <Input id="image" type="file" accept="image/*" className="bg-white cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
                {editingId ? 'Save Changes' : 'Create Post'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
