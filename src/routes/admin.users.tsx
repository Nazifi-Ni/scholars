import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit2, Trash2, UserPlus, Users as UsersIcon } from 'lucide-react';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
});

function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '', email: '', password: '', role: 'user'
  });

  const fetchUsers = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    
    const promise = fetch(`${API_BASE_URL}/admin/users/${deleteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to delete');
      setUsers(users.filter(u => u.id !== deleteId));
      setDeleteId(null);
    });

    toast.promise(promise, {
      loading: 'Deleting user...',
      success: 'User deleted successfully!',
      error: 'Failed to delete user.'
    });
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    const role = user.roles && user.roles.length > 0 ? user.roles[0].role : 'user';
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Don't show password
      role: role
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      name: '', email: '', password: '', role: 'user'
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
      // If editing, and password is empty, don't append it
      if (editingId && key === 'password' && !formData[key]) {
        return;
      }
      formPayload.append(key, formData[key]);
    });

    if (editingId) formPayload.append('_method', 'PUT');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const endpoint = editingId ? `/admin/users/${editingId}` : `/admin/users`;
    
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
      fetchUsers();
    });

    toast.promise(promise, {
      loading: 'Saving user...',
      success: 'User saved successfully!',
      error: (err) => err.message
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Users</h1>
          <p className="text-sm text-gray-500 mt-1">Control access roles and accounts.</p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
          <UserPlus className="w-4 h-4 mr-2" /> Add New User
        </Button>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const role = user.roles && user.roles.length > 0 ? user.roles[0].role : 'user';
                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`capitalize border-0 ${role === 'admin' ? 'bg-purple-100 text-purple-800' : role === 'moderator' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                        {role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(user)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <UsersIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <p>No users found.</p>
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
              This action cannot be undone. This will permanently delete the user's account.
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
            <DialogTitle className="text-xl">{editingId ? 'Edit User' : 'Create User'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={formData.name} onChange={e => handleFieldChange('name', e.target.value)} required className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={formData.email} onChange={e => handleFieldChange('email', e.target.value)} type="email" required className="bg-white" />
              </div>
            </div>
            
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
              <h3 className="font-semibold text-gray-900">Security & Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Password {editingId && <span className="text-gray-400 font-normal text-xs">(leave blank to keep current)</span>}</Label>
                  <Input 
                    value={formData.password} 
                    onChange={e => handleFieldChange('password', e.target.value)} 
                    type="password" 
                    minLength={8} 
                    required={!editingId} 
                    className="bg-white" 
                    placeholder={editingId ? '••••••••' : 'Enter new password'}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Role</Label>
                  <Select value={formData.role} onValueChange={v => handleFieldChange('role', v)}>
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User (Standard)</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
                {editingId ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
