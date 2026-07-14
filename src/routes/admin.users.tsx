import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
});

function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const fetchUsers = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setUsers(await res.json());
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setUsers(users.filter(u => u.id !== id));
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setIsModalOpen(true);
    setTimeout(() => {
      if (!formRef.current) return;
      const form = formRef.current;
      (form.elements.namedItem('name') as HTMLInputElement).value = user.name;
      (form.elements.namedItem('email') as HTMLInputElement).value = user.email;
      (form.elements.namedItem('password') as HTMLInputElement).value = ''; // Don't show password
      
      const role = user.roles && user.roles.length > 0 ? user.roles[0].role : 'user';
      (form.elements.namedItem('role') as HTMLSelectElement).value = role;
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
    
    // If empty password on edit, remove it so it's not updated
    if (editingId && !formData.get('password')) {
      formData.delete('password');
    }

    if (editingId) {
      formData.append('_method', 'PUT');
    }

    const url = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const endpoint = editingId ? `/admin/users/${editingId}` : `/admin/users`;
    
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
      fetchUsers();
    } else {
      const error = await res.json();
      alert("Error saving: " + JSON.stringify(error.errors || error.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Users</h1>
        <Button className="bg-blue-600" onClick={handleCreate}>Create User</Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Joined</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const role = user.roles && user.roles.length > 0 ? user.roles[0].role : 'user';
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${role === 'admin' ? 'bg-purple-100 text-purple-800' : role === 'moderator' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit User' : 'Create User'}</DialogTitle>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password {editingId && <span className="text-muted-foreground font-normal text-xs">(leave blank to keep current)</span>}</Label>
              <Input id="password" name="password" type="password" minLength={8} required={!editingId} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select id="role" name="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
