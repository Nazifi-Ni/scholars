import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Settings as SettingsIcon, Globe, Image as ImageIcon } from 'lucide-react';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
});

function AdminSettings() {
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    site_name: '', site_tagline: '', contact_email: '', 
    meta_description: '', meta_keywords: '', facebook_url: '', 
    twitter_url: '', linkedin_url: '', instagram_url: ''
  });

  const fetchSettings = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData((prev: any) => ({ ...prev, ...data }));
      }
    } catch (e) {
      toast.error('Failed to load settings');
    }
  };

  useEffect(() => {
    if (token) fetchSettings();
  }, [token]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    
    const promise = fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify(formData)
    }).then(async (res) => {
      setIsSaving(false);
      if (!res.ok) throw new Error('Failed to save settings');
    }).catch(err => {
      setIsSaving(false);
      throw err;
    });

    toast.promise(promise, {
      loading: 'Saving settings...',
      success: 'Global settings updated successfully!',
      error: 'Failed to update settings.'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Global Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform configuration, SEO, and contact details.</p>
        </div>
        <Button onClick={handleSubmit} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
          <SettingsIcon className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <div className="bg-gray-50/50 px-6 pt-4 border-b border-gray-100">
              <TabsList className="w-full justify-start h-auto bg-transparent p-0 gap-8">
                <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-sm font-medium">
                  <SettingsIcon className="w-4 h-4 mr-2" /> General Info
                </TabsTrigger>
                <TabsTrigger value="seo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-sm font-medium">
                  <Globe className="w-4 h-4 mr-2" /> SEO & Social
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              {/* General Tab */}
              <TabsContent value="general" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Platform Name</Label>
                    <Input value={formData.site_name} onChange={e => handleFieldChange('site_name', e.target.value)} placeholder="e.g. ScholarsConnect" className="bg-gray-50" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Tagline</Label>
                    <Input value={formData.site_tagline} onChange={e => handleFieldChange('site_tagline', e.target.value)} placeholder="Empowering Global Education" className="bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Contact Support Email</Label>
                    <Input value={formData.contact_email} onChange={e => handleFieldChange('contact_email', e.target.value)} type="email" placeholder="support@scholarsconnect.com" className="bg-gray-50" />
                  </div>
                </div>
              </TabsContent>

              {/* SEO & Social Tab */}
              <TabsContent value="seo" className="space-y-8 mt-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Global Meta Description</Label>
                    <Textarea value={formData.meta_description} onChange={e => handleFieldChange('meta_description', e.target.value)} placeholder="Default description for search engines..." className="bg-gray-50 h-24" />
                    <p className="text-xs text-gray-500">This is used as the fallback meta description across the platform.</p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Global Meta Keywords</Label>
                    <Input value={formData.meta_keywords} onChange={e => handleFieldChange('meta_keywords', e.target.value)} placeholder="scholarships, study abroad, internships..." className="bg-gray-50" />
                    <p className="text-xs text-gray-500">Comma separated keywords.</p>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Facebook URL</Label>
                      <Input value={formData.facebook_url} onChange={e => handleFieldChange('facebook_url', e.target.value)} placeholder="https://facebook.com/..." className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Twitter (X) URL</Label>
                      <Input value={formData.twitter_url} onChange={e => handleFieldChange('twitter_url', e.target.value)} placeholder="https://twitter.com/..." className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">LinkedIn URL</Label>
                      <Input value={formData.linkedin_url} onChange={e => handleFieldChange('linkedin_url', e.target.value)} placeholder="https://linkedin.com/..." className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Instagram URL</Label>
                      <Input value={formData.instagram_url} onChange={e => handleFieldChange('instagram_url', e.target.value)} placeholder="https://instagram.com/..." className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </div>
    </div>
  );
}
