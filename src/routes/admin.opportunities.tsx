import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Edit2,
  Trash2,
  PlusCircle,
  LayoutList,
  Layers,
  Link as LinkIcon,
  ImageIcon,
  FileText,
  ShieldCheck,
  Sparkles,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Eye,
} from "lucide-react";
import {
  OPPORTUNITY_TYPES,
  FUNDING_TYPES,
  DEGREE_LEVELS,
  APPLICATION_DIFFICULTIES,
  VERIFICATION_STATUSES,
} from "@/lib/sc-shared";

export const Route = createFileRoute("/admin/opportunities")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminOpportunities,
});

const INITIAL_FORM_STATE = {
  title: "",
  slug: "",
  summary: "",
  provider: "",
  opportunity_type: "scholarship",
  category_id: "",
  funding_type: "fully_funded",
  application_fee: "Free / No Application Fee",
  degree_levels: "[]",
  eligible_countries: "",
  eligibility: "",
  benefits: "",
  required_documents: "",
  application_procedure: "",
  application_link: "",
  official_website: "",
  application_open_date: "",
  deadline: "",
  verification_status: "verified",
  verified_by: "ScholarsConnect Editorial Team",
  official_source_url: "",
  last_verified_at: new Date().toISOString().split("T")[0],
  application_difficulty: "Moderate",
  best_for: "",
  not_suitable_for: "",
  common_mistakes: "",
  scholarsconnect_advice: "",
  editorial_verdict: "",
  status: "published",
  is_featured: false,
  is_sponsored: false,
  is_expired: false,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  focus_keyword: "",
};

function AdminOpportunities() {
  const { token } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filterTab, setFilterTab] = useState<
    "all" | "needs_review" | "verified" | "expired" | "draft"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>(INITIAL_FORM_STATE);
  const [activeTab, setActiveTab] = useState("basic");

  const fetchData = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
    try {
      const resOpps = await fetch(`${API_BASE_URL}/admin/opportunities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resOpps.ok) setOpportunities(await resOpps.json());

      const resCats = await fetch(`${API_BASE_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resCats.ok) setCategories(await resCats.json());
    } catch (e) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

    const promise = fetch(`${API_BASE_URL}/admin/opportunities/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      if (!res.ok) throw new Error("Failed to delete");
      setOpportunities(opportunities.filter((o) => o.id !== deleteId));
      setDeleteId(null);
    });

    toast.promise(promise, {
      loading: "Deleting opportunity...",
      success: "Opportunity deleted successfully!",
      error: "Failed to delete opportunity.",
    });
  };

  const handleEdit = (opp: any) => {
    setEditingId(opp.id);
    setFormData({
      title: opp.title || "",
      slug: opp.slug || "",
      summary: opp.summary || "",
      provider: opp.provider || opp.university?.name || opp.organization?.name || "",
      opportunity_type: opp.opportunity_type || "scholarship",
      category_id: opp.category_id ? String(opp.category_id) : "",
      funding_type: opp.funding_type || "fully_funded",
      application_fee: opp.application_fee || "Free / No Application Fee",
      degree_levels: opp.degree_levels ? JSON.stringify(opp.degree_levels) : "[]",
      eligible_countries: opp.eligible_countries
        ? Array.isArray(opp.eligible_countries)
          ? opp.eligible_countries.join(", ")
          : String(opp.eligible_countries)
        : "",
      eligibility: opp.eligibility || "",
      benefits: opp.benefits || "",
      required_documents: opp.required_documents || "",
      application_procedure: opp.application_procedure || "",
      application_link: opp.application_link || "",
      official_website: opp.official_website || "",
      application_open_date: opp.application_open_date
        ? opp.application_open_date.split("T")[0]
        : "",
      deadline: opp.deadline ? opp.deadline.split("T")[0] : "",
      verification_status: opp.verification_status || (opp.is_verified ? "verified" : "unverified"),
      verified_by: opp.verified_by || "ScholarsConnect Editorial Team",
      official_source_url: opp.official_source_url || "",
      last_verified_at: opp.last_verified_at
        ? opp.last_verified_at.split("T")[0]
        : opp.updated_at
          ? opp.updated_at.split("T")[0]
          : "",
      application_difficulty: opp.application_difficulty || "Moderate",
      best_for: opp.best_for || "",
      not_suitable_for: opp.not_suitable_for || "",
      common_mistakes: opp.common_mistakes || "",
      scholarsconnect_advice: opp.scholarsconnect_advice || "",
      editorial_verdict: opp.editorial_verdict || "",
      status: opp.status || "published",
      is_featured: !!opp.is_featured,
      is_sponsored: !!opp.is_sponsored,
      is_expired: !!opp.is_expired,
      meta_title: opp.meta_title || "",
      meta_description: opp.meta_description || "",
      meta_keywords: opp.meta_keywords || "",
      focus_keyword: opp.focus_keyword || "",
    });
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM_STATE,
      last_verified_at: new Date().toISOString().split("T")[0],
    });
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title if creating and slug was empty
      if (
        field === "title" &&
        !editingId &&
        (!prev.slug ||
          prev.slug ===
            prev.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""))
      ) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.slug?.trim()) {
      toast.error("Slug is required");
      return;
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "eligible_countries") {
        const val = formData[key]?.trim();
        if (val) {
          const arr = val
            .split(",")
            .map((c: string) => c.trim())
            .filter(Boolean);
          formPayload.append("eligible_countries", JSON.stringify(arr));
        }
      } else if (
        key === "is_featured" ||
        key === "is_sponsored" ||
        key === "is_expired" ||
        key === "is_verified"
      ) {
        formPayload.append(key, formData[key] ? "1" : "0");
      } else {
        formPayload.append(key, formData[key] ?? "");
      }
    });

    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formPayload.append("image", fileInput.files[0]);
    }

    if (editingId) formPayload.append("_method", "PUT");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
    const endpoint = editingId ? `/admin/opportunities/${editingId}` : `/admin/opportunities`;

    const promise = fetch(API_BASE_URL + endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: formPayload,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error saving data");
      }
      setIsModalOpen(false);
      fetchData();
    });

    toast.promise(promise, {
      loading: "Saving opportunity...",
      success: "Opportunity saved successfully!",
      error: (err) => err.message,
    });
  };

  const countNeedsReview = opportunities.filter(
    (o) =>
      !o.is_verified ||
      o.verification_status === "needs_review" ||
      o.verification_status === "unverified" ||
      !o.editorial_verdict ||
      !o.best_for ||
      !o.official_source_url,
  ).length;
  const countVerified = opportunities.filter(
    (o) => (o.verification_status === "verified" || o.is_verified) && !o.is_expired,
  ).length;
  const countExpired = opportunities.filter((o) => o.is_expired).length;
  const countDraft = opportunities.filter((o) => o.status === "draft").length;

  const filteredOpportunities = opportunities.filter((opp) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        opp.title?.toLowerCase().includes(q) ||
        opp.provider?.toLowerCase().includes(q) ||
        opp.slug?.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterTab === "needs_review") {
      return (
        !opp.is_verified ||
        opp.verification_status === "needs_review" ||
        opp.verification_status === "unverified" ||
        !opp.editorial_verdict ||
        !opp.best_for ||
        !opp.official_source_url
      );
    }
    if (filterTab === "verified") {
      return (opp.verification_status === "verified" || opp.is_verified) && !opp.is_expired;
    }
    if (filterTab === "expired") {
      return opp.is_expired;
    }
    if (filterTab === "draft") {
      return opp.status === "draft";
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-heading">
            Editorial Opportunity Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-sans">
            Curate, verify, and publish opportunities with rich editorial signals and fraud
            protection.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Create Opportunity
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={filterTab === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab("all")}
            className="rounded-full text-xs font-semibold"
          >
            All ({opportunities.length})
          </Button>
          <Button
            type="button"
            variant={filterTab === "needs_review" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab("needs_review")}
            className={`rounded-full text-xs font-semibold ${
              filterTab === "needs_review"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100"
            }`}
          >
            Needs Editorial Review ({countNeedsReview})
          </Button>
          <Button
            type="button"
            variant={filterTab === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab("verified")}
            className="rounded-full text-xs font-semibold"
          >
            Active Verified ({countVerified})
          </Button>
          <Button
            type="button"
            variant={filterTab === "expired" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab("expired")}
            className="rounded-full text-xs font-semibold"
          >
            Closed / Expired ({countExpired})
          </Button>
          {countDraft > 0 && (
            <Button
              type="button"
              variant={filterTab === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTab("draft")}
              className="rounded-full text-xs font-semibold"
            >
              Drafts ({countDraft})
            </Button>
          )}
        </div>

        <div className="w-full sm:w-72">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities…"
            className="bg-gray-50 border-gray-200 text-xs rounded-full px-4"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100 font-sans">
              <tr>
                <th className="px-6 py-4">Opportunity</th>
                <th className="px-6 py-4">Type & Category</th>
                <th className="px-6 py-4">Verification & Status</th>
                <th className="px-6 py-4">Flags</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredOpportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 line-clamp-1">{opp.title}</div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <span>
                        {opp.provider ||
                          opp.university?.name ||
                          opp.organization?.name ||
                          "No provider"}
                      </span>
                      {opp.last_verified_at && (
                        <span>
                          • Verified: {new Date(opp.last_verified_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <Badge
                        variant="outline"
                        className="capitalize bg-indigo-50 text-indigo-700 border-indigo-100"
                      >
                        {opp.opportunity_type?.replace(/_/g, " ")}
                      </Badge>
                      {opp.category && (
                        <span className="text-xs text-gray-500">{opp.category.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <Badge
                        className={
                          opp.verification_status === "verified" || opp.is_verified
                            ? "bg-emerald-100 text-emerald-800 border-0"
                            : opp.verification_status === "needs_review"
                              ? "bg-amber-100 text-amber-800 border-0"
                              : "bg-gray-100 text-gray-700 border-0"
                        }
                      >
                        {opp.verification_status === "verified" || opp.is_verified
                          ? "Verified"
                          : opp.verification_status === "needs_review"
                            ? "Needs Review"
                            : "Unverified"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Status: <strong className="capitalize">{opp.status}</strong>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {opp.is_featured && (
                        <Badge className="bg-purple-100 text-purple-800 border-0 text-[10px]">
                          Featured
                        </Badge>
                      )}
                      {opp.is_sponsored && (
                        <Badge className="bg-amber-100 text-amber-800 border-0 text-[10px]">
                          Sponsored
                        </Badge>
                      )}
                      {opp.is_expired && (
                        <Badge className="bg-red-100 text-red-800 border-0 text-[10px]">
                          Expired
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <a
                        href={`/opportunities/${opp.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                        title="View Live Listing"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEdit(opp)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(opp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOpportunities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-sans">
                    {opportunities.length === 0
                      ? 'No opportunities found. Click "Create Opportunity" to add one.'
                      : `No opportunities match the current "${filterTab}" filter or search query.`}
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
              This will permanently delete this opportunity from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Modal with 8 Organized Sections */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[96vw] max-w-5xl max-h-[94vh] overflow-hidden flex flex-col p-0 gap-0 bg-gray-50 rounded-2xl shadow-2xl">
          <DialogHeader className="px-4 sm:px-6 py-4 bg-white border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-heading">
                {editingId ? "Edit Opportunity" : "Create Opportunity"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comprehensive editorial intelligence & SEO management
              </p>
            </div>
            {editingId && formData.slug && (
              <a
                href={`/opportunities/${formData.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 hover:underline mr-8 flex items-center gap-1"
              >
                <span className="hidden sm:inline">View Live Page</span>{" "}
                <Eye className="h-3.5 w-3.5" />
              </a>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto font-sans flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full flex-1 flex flex-col"
            >
              <div className="bg-white px-4 sm:px-6 pt-2 border-b border-gray-200 sticky top-0 z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <TabsList className="w-max sm:w-full justify-start h-auto bg-transparent p-0 gap-2 sm:gap-4 text-xs border-b-0">
                  <TabsTrigger
                    value="basic"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-2.5 sm:px-3 py-3 font-semibold text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
                  >
                    1. Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="eligibility"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-2.5 sm:px-3 py-3 font-semibold text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
                  >
                    2. Eligibility & Scope
                  </TabsTrigger>
                  <TabsTrigger
                    value="funding"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-2.5 sm:px-3 py-3 font-semibold text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
                  >
                    3. Funding & Benefits
                  </TabsTrigger>
                  <TabsTrigger
                    value="dates"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-2.5 sm:px-3 py-3 font-semibold text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
                  >
                    4. Dates & Links
                  </TabsTrigger>
                  <TabsTrigger
                    value="verification"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-2.5 sm:px-3 py-3 font-semibold text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
                  >
                    5. Verification
                  </TabsTrigger>
                  <TabsTrigger
                    value="editorial"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-2.5 sm:px-3 py-3 font-semibold text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
                  >
                    6. Editorial Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="seo"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-2.5 sm:px-3 py-3 font-semibold text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
                  >
                    7. SEO
                  </TabsTrigger>
                  <TabsTrigger
                    value="publishing"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-2.5 sm:px-3 py-3 font-semibold text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
                  >
                    8. Publishing
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 sm:p-6 flex-1">
                {/* 1. Basic Info */}
                <TabsContent value="basic" className="space-y-5 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Title *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        required
                        placeholder="e.g. Oxford Rhodes Scholarship 2026"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Slug *</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => handleFieldChange("slug", e.target.value)}
                        required
                        placeholder="oxford-rhodes-scholarship-2026"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <Label>Awarding Body / Provider</Label>
                      <Input
                        value={formData.provider}
                        onChange={(e) => handleFieldChange("provider", e.target.value)}
                        placeholder="e.g. University of Oxford / Rhodes Trust"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Opportunity Type *</Label>
                      <Select
                        value={formData.opportunity_type}
                        onValueChange={(v) => handleFieldChange("opportunity_type", v)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPPORTUNITY_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Select
                        value={formData.category_id || "none"}
                        onValueChange={(v) =>
                          handleFieldChange("category_id", v === "none" ? "" : v)
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Category</SelectItem>
                          {categories.map((c: any) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Short Executive Summary</Label>
                    <Textarea
                      value={formData.summary}
                      onChange={(e) => handleFieldChange("summary", e.target.value)}
                      className="bg-white h-24"
                      placeholder="Crisp 2-sentence summary of the program..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Featured Cover Image</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="bg-white cursor-pointer"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* 2. Eligibility & Scope */}
                <TabsContent value="eligibility" className="space-y-5 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Application Difficulty</Label>
                      <Select
                        value={formData.application_difficulty}
                        onValueChange={(v) => handleFieldChange("application_difficulty", v)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {APPLICATION_DIFFICULTIES.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Eligible Citizenships / Countries (comma-separated)</Label>
                      <Input
                        value={formData.eligible_countries}
                        onChange={(e) => handleFieldChange("eligible_countries", e.target.value)}
                        placeholder="e.g. Nigeria, Ghana, Kenya, Rwanda (or leave empty if worldwide)"
                        className="bg-white"
                      />
                      <p className="text-[11px] text-gray-500">
                        Do NOT automatically type 'Global'. Leave blank if worldwide or specify
                        exact countries.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>
                      Degree Levels (JSON Array e.g. ["undergraduate", "masters"] or
                      ["not_applicable"])
                    </Label>
                    <Input
                      value={formData.degree_levels}
                      onChange={(e) => handleFieldChange("degree_levels", e.target.value)}
                      className="bg-white font-mono text-xs"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {DEGREE_LEVELS.map((dl) => (
                        <button
                          type="button"
                          key={dl.value}
                          onClick={() => {
                            let curr: string[] = [];
                            try {
                              curr = JSON.parse(formData.degree_levels || "[]");
                            } catch {
                              curr = [];
                            }
                            if (dl.value === "not_applicable") {
                              curr = ["not_applicable"];
                            } else {
                              curr = curr.filter((x) => x !== "not_applicable");
                              if (curr.includes(dl.value)) {
                                curr = curr.filter((x) => x !== dl.value);
                              } else {
                                curr.push(dl.value);
                              }
                            }
                            handleFieldChange("degree_levels", JSON.stringify(curr));
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-100"
                        >
                          + {dl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Eligibility Requirements (Detailed Markdown)</Label>
                    <Textarea
                      value={formData.eligibility}
                      onChange={(e) => handleFieldChange("eligibility", e.target.value)}
                      className="bg-white h-40"
                      placeholder="Minimum GPA, age limits, citizenship criteria, language tests..."
                    />
                  </div>
                </TabsContent>

                {/* 3. Funding & Benefits */}
                <TabsContent value="funding" className="space-y-5 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Funding Category *</Label>
                      <Select
                        value={formData.funding_type}
                        onValueChange={(v) => handleFieldChange("funding_type", v)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FUNDING_TYPES.map((f) => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Application Fee</Label>
                      <Input
                        value={formData.application_fee}
                        onChange={(e) => handleFieldChange("application_fee", e.target.value)}
                        placeholder="e.g. Free / No Application Fee, or $75 USD"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Benefits & Coverage (Detailed Markdown)</Label>
                    <Textarea
                      value={formData.benefits}
                      onChange={(e) => handleFieldChange("benefits", e.target.value)}
                      className="bg-white h-36"
                      placeholder="Full tuition, monthly stipend, return flights, health insurance..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Required Documents Checklist</Label>
                    <Textarea
                      value={formData.required_documents}
                      onChange={(e) => handleFieldChange("required_documents", e.target.value)}
                      className="bg-white h-36"
                      placeholder="Academic transcripts, 2 letters of reference, statement of purpose, CV..."
                    />
                  </div>
                </TabsContent>

                {/* 4. Dates & Links */}
                <TabsContent value="dates" className="space-y-5 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Application Open Date</Label>
                      <Input
                        value={formData.application_open_date}
                        onChange={(e) => handleFieldChange("application_open_date", e.target.value)}
                        type="date"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Application Deadline</Label>
                      <Input
                        value={formData.deadline}
                        onChange={(e) => handleFieldChange("deadline", e.target.value)}
                        type="date"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Official Application Portal Link</Label>
                      <Input
                        value={formData.application_link}
                        onChange={(e) => handleFieldChange("application_link", e.target.value)}
                        type="url"
                        placeholder="https://..."
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Official Program Website</Label>
                      <Input
                        value={formData.official_website}
                        onChange={(e) => handleFieldChange("official_website", e.target.value)}
                        type="url"
                        placeholder="https://..."
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Application Procedure / Steps</Label>
                    <Textarea
                      value={formData.application_procedure}
                      onChange={(e) => handleFieldChange("application_procedure", e.target.value)}
                      className="bg-white h-36"
                      placeholder="Step 1: Complete online portal registration..."
                    />
                  </div>
                </TabsContent>

                {/* 5. Verification */}
                <TabsContent value="verification" className="space-y-5 mt-0">
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-xl mb-4">
                    <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" /> ScholarsConnect
                      Verification Standard
                    </h3>
                    <p className="text-xs text-emerald-900 mt-1">
                      Verification proves to Google AdSense and applicants that an editor personally
                      vetted this program against its primary source.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <Label>Verification Status *</Label>
                      <Select
                        value={formData.verification_status}
                        onValueChange={(v) => handleFieldChange("verification_status", v)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VERIFICATION_STATUSES.map((vs) => (
                            <SelectItem key={vs.value} value={vs.value}>
                              {vs.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Verified By</Label>
                      <Input
                        value={formData.verified_by}
                        onChange={(e) => handleFieldChange("verified_by", e.target.value)}
                        placeholder="ScholarsConnect Editorial Team"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Last Verified Date</Label>
                      <Input
                        value={formData.last_verified_at}
                        onChange={(e) => handleFieldChange("last_verified_at", e.target.value)}
                        type="date"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Official Source Verification URL</Label>
                    <Input
                      value={formData.official_source_url}
                      onChange={(e) => handleFieldChange("official_source_url", e.target.value)}
                      type="url"
                      placeholder="https://oxford.ac.uk/scholarships/official-notice"
                      className="bg-white"
                    />
                    <p className="text-[11px] text-gray-500">
                      The authoritative page on the awarding institution's domain where requirements
                      were verified.
                    </p>
                  </div>
                </TabsContent>

                {/* 6. Editorial Analysis */}
                <TabsContent value="editorial" className="space-y-5 mt-0">
                  <div className="space-y-1.5">
                    <Label className="text-amber-900 font-bold flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-600" /> ScholarsConnect Advice (Core
                      Anti-Low-Value Feature)
                    </Label>
                    <Textarea
                      value={formData.scholarsconnect_advice}
                      onChange={(e) => handleFieldChange("scholarsconnect_advice", e.target.value)}
                      placeholder="Insider tips on writing winning essays, timing submissions, supervisor contacts..."
                      className="bg-white h-36 border-amber-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Best Suited For</Label>
                      <Textarea
                        value={formData.best_for}
                        onChange={(e) => handleFieldChange("best_for", e.target.value)}
                        placeholder="Students with First Class or strong leadership experience..."
                        className="bg-white h-28"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Not Suitable For</Label>
                      <Textarea
                        value={formData.not_suitable_for}
                        onChange={(e) => handleFieldChange("not_suitable_for", e.target.value)}
                        placeholder="Candidates seeking short-term certificate programs without degree award..."
                        className="bg-white h-28"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Common Mistakes to Avoid</Label>
                    <Textarea
                      value={formData.common_mistakes}
                      onChange={(e) => handleFieldChange("common_mistakes", e.target.value)}
                      placeholder="Waiting until deadline week for references, generic personal statement..."
                      className="bg-white h-28"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>ScholarsConnect Editorial Verdict</Label>
                    <Textarea
                      value={formData.editorial_verdict}
                      onChange={(e) => handleFieldChange("editorial_verdict", e.target.value)}
                      placeholder="Overall assessment of value, prestige, competitiveness, and ROI..."
                      className="bg-white h-24"
                    />
                  </div>
                </TabsContent>

                {/* 7. SEO */}
                <TabsContent value="seo" className="space-y-5 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>SEO Title (max 60 chars)</Label>
                      <Input
                        value={formData.meta_title}
                        onChange={(e) => handleFieldChange("meta_title", e.target.value)}
                        placeholder="Rhodes Scholarship 2026: Fully Funded Oxford Award"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Focus Keyword</Label>
                      <Input
                        value={formData.focus_keyword}
                        onChange={(e) => handleFieldChange("focus_keyword", e.target.value)}
                        placeholder="rhodes scholarship 2026 oxford"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Meta Description (max 160 chars)</Label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) => handleFieldChange("meta_description", e.target.value)}
                      placeholder="Apply for the Oxford Rhodes Scholarship 2026 for African students. Full funding, eligibility, documents, and application tips."
                      className="bg-white h-24"
                    />
                  </div>
                </TabsContent>

                {/* 8. Publishing */}
                <TabsContent value="publishing" className="space-y-5 mt-0">
                  <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-4">
                    <h3 className="font-semibold text-gray-900">Publication State & Visibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label>Publish Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(v) => handleFieldChange("status", v)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => handleFieldChange("is_featured", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium">Feature on Homepage</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_sponsored}
                          onChange={(e) => handleFieldChange("is_sponsored", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm font-medium">Mark as Sponsored</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_expired}
                          onChange={(e) => handleFieldChange("is_expired", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium">Mark as Expired / Closed</span>
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex items-center justify-between gap-3 mt-auto sticky bottom-0 z-20">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 font-semibold"
                >
                  {editingId ? "Save Opportunity" : "Create Opportunity"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
