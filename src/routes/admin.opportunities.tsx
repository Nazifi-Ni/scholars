import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useId } from "react";
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
  FileText,
  ShieldCheck,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ExternalLink,
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Wand2,
  Check,
  UploadCloud,
  Globe,
  HelpCircle,
  Info,
  Clock,
  Layers,
  GraduationCap,
  Award,
  DollarSign,
  Send,
  RotateCcw,
} from "lucide-react";
import {
  OPPORTUNITY_TYPES,
  FUNDING_TYPES,
  DEGREE_LEVELS,
  APPLICATION_DIFFICULTIES,
  VERIFICATION_STATUSES,
  getImageUrl,
  daysUntil,
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

const FORM_STEPS = [
  { id: "basic", label: "Overview & Provider", icon: Layers, stepNumber: 1 },
  { id: "eligibility", label: "Eligibility & Funding", icon: GraduationCap, stepNumber: 2 },
  { id: "dates", label: "Deadlines & Portal", icon: Calendar, stepNumber: 3 },
  { id: "editorial", label: "Editorial Verification", icon: ShieldCheck, stepNumber: 4 },
  { id: "publishing", label: "Publish & SEO", icon: Send, stepNumber: 5 },
];

const COMMON_COUNTRY_PRESETS = [
  "Nigeria",
  "Sub-Saharan Africa",
  "Worldwide / All Countries",
  "Commonwealth Countries",
  "Developing Countries",
  "Ghana",
  "Kenya",
  "Rwanda",
  "United Kingdom",
  "United States",
  "Canada",
];

const COMMON_FEE_PRESETS = [
  "Free / No Application Fee",
  "$50 USD",
  "$75 USD",
  "£60 GBP",
  "₦5,000",
  "₦10,000",
];

export function AdminOpportunities() {
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
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch {
      toast.error("Failed to load opportunity data");
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
      setOpportunities((prev) => prev.filter((o) => o.id !== deleteId));
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
    const existingImg = opp.featured_image || opp.image_url;
    setPreviewImage(existingImg ? getImageUrl(existingImg) : null);

    setFormData({
      title: opp.title || "",
      slug: opp.slug || "",
      summary: opp.summary || "",
      provider: opp.provider || opp.university?.name || opp.organization?.name || "",
      opportunity_type: opp.opportunity_type || "scholarship",
      category_id: opp.category_id ? String(opp.category_id) : "",
      funding_type: opp.funding_type || "fully_funded",
      application_fee: opp.application_fee || "Free / No Application Fee",
      degree_levels: opp.degree_levels
        ? typeof opp.degree_levels === "string"
          ? opp.degree_levels
          : JSON.stringify(opp.degree_levels)
        : "[]",
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
    setPreviewImage(null);
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

  const generateSlugFromTitle = () => {
    if (!formData.title?.trim()) {
      toast.error("Please enter a title first");
      return;
    }
    const cleanSlug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev: any) => ({ ...prev, slug: cleanSlug }));
    toast.success("Slug generated from title");
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const toggleDegreeLevel = (val: string) => {
    let curr: string[] = [];
    try {
      curr = JSON.parse(formData.degree_levels || "[]");
      if (!Array.isArray(curr)) curr = [];
    } catch {
      curr = [];
    }

    if (val === "not_applicable") {
      curr = curr.includes("not_applicable") ? [] : ["not_applicable"];
    } else {
      curr = curr.filter((x) => x !== "not_applicable");
      if (curr.includes(val)) {
        curr = curr.filter((x) => x !== val);
      } else {
        curr.push(val);
      }
    }
    handleFieldChange("degree_levels", JSON.stringify(curr));
  };

  const isDegreeSelected = (val: string): boolean => {
    try {
      const curr = JSON.parse(formData.degree_levels || "[]");
      return Array.isArray(curr) && curr.includes(val);
    } catch {
      return false;
    }
  };

  const addCountryPreset = (country: string) => {
    setFormData((prev: any) => {
      const existing = prev.eligible_countries
        ? prev.eligible_countries
            .split(",")
            .map((c: string) => c.trim())
            .filter(Boolean)
        : [];
      if (!existing.includes(country)) {
        existing.push(country);
      }
      return { ...prev, eligible_countries: existing.join(", ") };
    });
  };

  const appendTemplate = (field: string, text: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}\n\n${text}` : text,
    }));
    toast.success("Template inserted into field");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error("Title is required (Step 1)");
      setActiveTab("basic");
      return;
    }
    if (!formData.slug?.trim()) {
      toast.error("URL Slug is required (Step 1)");
      setActiveTab("basic");
      return;
    }

    setIsSubmitting(true);
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
        } else {
          formPayload.append("eligible_countries", "[]");
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

    const fileInput = document.getElementById("cover-image-upload") as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formPayload.append("image", fileInput.files[0]);
    }

    if (editingId) formPayload.append("_method", "PUT");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
    const endpoint = editingId ? `/admin/opportunities/${editingId}` : `/admin/opportunities`;

    try {
      const res = await fetch(API_BASE_URL + endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: formPayload,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error saving opportunity data");
      }

      toast.success(
        editingId ? "Opportunity updated successfully!" : "Opportunity created successfully!",
      );
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step Completion Checkers
  const isBasicComplete = Boolean(formData.title?.trim() && formData.slug?.trim());
  const isEligibilityComplete = Boolean(formData.funding_type && formData.eligibility?.trim());
  const isDatesComplete = Boolean(formData.deadline || formData.application_link?.trim());
  const isEditorialComplete = Boolean(
    formData.scholarsconnect_advice?.trim() && formData.editorial_verdict?.trim(),
  );
  const isPublishingComplete = Boolean(formData.status);

  const getStepStatus = (stepId: string) => {
    switch (stepId) {
      case "basic":
        return isBasicComplete;
      case "eligibility":
        return isEligibilityComplete;
      case "dates":
        return isDatesComplete;
      case "editorial":
        return isEditorialComplete;
      case "publishing":
        return isPublishingComplete;
      default:
        return false;
    }
  };

  // Nav helpers
  const currentStepIdx = FORM_STEPS.findIndex((s) => s.id === activeTab);
  const handleNextStep = () => {
    if (currentStepIdx < FORM_STEPS.length - 1) {
      setActiveTab(FORM_STEPS[currentStepIdx + 1].id);
    }
  };
  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setActiveTab(FORM_STEPS[currentStepIdx - 1].id);
    }
  };

  // Counts & Filtering
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
        opp.slug?.toLowerCase().includes(q) ||
        opp.university?.name?.toLowerCase().includes(q) ||
        opp.organization?.name?.toLowerCase().includes(q);
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
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Editorial Header & Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <ShieldCheck size={16} />
            <span>Editorial Intelligence Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-heading mt-1">
            Opportunity Database
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl font-sans">
            Curate, fact-check, and publish high-yield opportunities with rich editorial signals,
            anti-low-value verification, and structured SEO signals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleCreate}
            className="bg-[#0a1128] hover:bg-[#142148] text-white shadow-md shadow-slate-900/10 font-semibold px-5 h-11 rounded-xl"
          >
            <PlusCircle className="w-4 h-4 mr-2 text-emerald-400" /> Create Opportunity
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{opportunities.length}</div>
            <div className="text-xs text-gray-500">Total Entries</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{countVerified}</div>
            <div className="text-xs text-gray-500">Active & Verified</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-700">{countNeedsReview}</div>
            <div className="text-xs text-gray-500">Needs Review</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{countExpired}</div>
            <div className="text-xs text-gray-500">Closed / Expired</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={filterTab === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab("all")}
            className={`rounded-full text-xs font-semibold h-8 ${
              filterTab === "all" ? "bg-[#0a1128] text-white" : ""
            }`}
          >
            All ({opportunities.length})
          </Button>

          <Button
            type="button"
            variant={filterTab === "needs_review" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab("needs_review")}
            className={`rounded-full text-xs font-semibold h-8 ${
              filterTab === "needs_review"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "text-amber-800 border-amber-200 bg-amber-50/60 hover:bg-amber-100"
            }`}
          >
            Needs Editorial Review ({countNeedsReview})
          </Button>

          <Button
            type="button"
            variant={filterTab === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab("verified")}
            className={`rounded-full text-xs font-semibold h-8 ${
              filterTab === "verified"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "text-emerald-800 border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100"
            }`}
          >
            Active Verified ({countVerified})
          </Button>

          <Button
            type="button"
            variant={filterTab === "expired" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab("expired")}
            className={`rounded-full text-xs font-semibold h-8 ${
              filterTab === "expired" ? "bg-red-600 hover:bg-red-700 text-white" : ""
            }`}
          >
            Closed ({countExpired})
          </Button>

          {countDraft > 0 && (
            <Button
              type="button"
              variant={filterTab === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTab("draft")}
              className={`rounded-full text-xs font-semibold h-8 ${
                filterTab === "draft" ? "bg-slate-700 text-white" : ""
              }`}
            >
              Drafts ({countDraft})
            </Button>
          )}
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, provider, slug..."
            className="bg-gray-50/80 border-gray-200 text-xs rounded-full pl-9 pr-8 h-9 focus-visible:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-100 text-xs">
              <tr>
                <th className="px-6 py-3.5">Opportunity</th>
                <th className="px-6 py-3.5">Type & Funding</th>
                <th className="px-6 py-3.5">Verification</th>
                <th className="px-6 py-3.5">Deadline</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredOpportunities.map((opp) => {
                const days = daysUntil(opp.deadline);
                const isClosed = opp.is_expired || (days !== null && days < 0);

                return (
                  <tr key={opp.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {opp.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium text-gray-600">
                          {opp.provider ||
                            opp.university?.name ||
                            opp.organization?.name ||
                            "No provider stated"}
                        </span>
                        {opp.category && (
                          <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                            {opp.category.name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant="outline"
                          className="capitalize bg-slate-50 text-slate-700 border-slate-200 text-[11px]"
                        >
                          {opp.opportunity_type?.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {opp.funding_type?.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          className={`text-[11px] font-semibold border-0 ${
                            opp.verification_status === "verified" || opp.is_verified
                              ? "bg-emerald-100 text-emerald-800"
                              : opp.verification_status === "needs_review"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {opp.verification_status === "verified" || opp.is_verified
                            ? "Verified"
                            : opp.verification_status === "needs_review"
                              ? "Needs Review"
                              : "Unverified"}
                        </Badge>
                        {opp.last_verified_at && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(opp.last_verified_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {opp.deadline ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-700">
                            {new Date(opp.deadline).toLocaleDateString()}
                          </span>
                          <span
                            className={`text-[10px] font-semibold ${
                              isClosed
                                ? "text-red-500"
                                : days !== null && days <= 14
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                            }`}
                          >
                            {isClosed
                              ? "Expired"
                              : days === 0
                                ? "Closes Today"
                                : `${days} days left`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Rolling / Ongoing</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 sm:gap-2">
                        <a
                          href={`/opportunities/${opp.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="View Live Listing"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEdit(opp)}
                          title="Edit Opportunity"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteId(opp.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOpportunities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-gray-500 font-sans">
                    {opportunities.length === 0
                      ? 'No opportunities found. Click "Create Opportunity" above to add your first listing.'
                      : `No opportunities match the "${filterTab}" filter or search query.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this opportunity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this record from the ScholarsConnect database. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* STREAMLINED 5-STEP CREATE / EDIT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[96vw] max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0 bg-[#F8FAFC] rounded-2xl shadow-2xl border-0">
          {/* Modal Header */}
          <DialogHeader className="px-6 py-4 bg-white border-b border-gray-100 flex flex-row items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg font-bold font-heading text-gray-900">
                  {editingId ? "Edit Opportunity Entry" : "Create New Opportunity"}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                >
                  Step {currentStepIdx + 1} of {FORM_STEPS.length}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 font-sans">
                {editingId
                  ? `Editing: ${formData.title || "Untitled"}`
                  : "Complete structured metadata, editorial analysis, and publication controls."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {editingId && formData.slug && (
                <a
                  href={`/opportunities/${formData.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
                >
                  <span>Preview Live</span>
                  <ExternalLink size={12} />
                </a>
              )}

              {/* Quick Save button in header */}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#0a1128] hover:bg-[#142148] text-white text-xs font-semibold h-9 px-4 rounded-xl shadow-sm"
              >
                {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Publish"}
              </Button>
            </div>
          </DialogHeader>

          {/* Stepper Tabs Bar */}
          <div className="bg-white border-b border-gray-200 px-6 pt-1 shrink-0 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max pb-1">
              {FORM_STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = activeTab === step.id;
                const isComplete = getStepStatus(step.id);

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveTab(step.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0a1128] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? "bg-emerald-400 text-[#0a1128]"
                          : isComplete
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isComplete ? <Check size={12} /> : step.stepNumber}
                    </div>
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Scroll Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col font-sans">
            <div className="p-6 flex-1">
              {/* STEP 1: Basic Info & Provider */}
              {activeTab === "basic" && (
                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <Layers size={16} className="text-emerald-600" />
                      1. Title & URL Routing
                    </h3>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">
                          Program Title <span className="text-red-500">*</span>
                        </Label>
                        <span className="text-[11px] text-gray-400">
                          {formData.title?.length || 0} characters
                        </span>
                      </div>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        placeholder="e.g. Chevening Scholarships 2026 for International Leaders"
                        className="bg-white font-medium text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">
                          URL Slug <span className="text-red-500">*</span>
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={generateSlugFromTitle}
                          className="h-6 text-[11px] text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2"
                        >
                          <Wand2 size={12} className="mr-1" /> Generate from title
                        </Button>
                      </div>
                      <Input
                        value={formData.slug}
                        onChange={(e) => handleFieldChange("slug", e.target.value)}
                        placeholder="chevening-scholarships-2026-uk"
                        className="bg-white font-mono text-xs"
                        required
                      />
                      <p className="text-[11px] text-gray-400">
                        Public URL:{" "}
                        <span className="text-emerald-600 font-mono">
                          scholarsconnect.com.ng/opportunities/{formData.slug || "your-slug"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <GraduationCap size={16} className="text-emerald-600" />
                      2. Provider & Classification
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">
                          Awarding Body / Provider
                        </Label>
                        <Input
                          value={formData.provider}
                          onChange={(e) => handleFieldChange("provider", e.target.value)}
                          placeholder="e.g. UK Foreign & Commonwealth Office"
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">Opportunity Type</Label>
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
                        <Label className="font-semibold text-gray-800">Category</Label>
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
                            <SelectItem value="none">No Specific Category</SelectItem>
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
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">Executive Summary</Label>
                        <span className="text-[11px] text-gray-400">
                          {formData.summary?.split(/\s+/).filter(Boolean).length || 0} words
                        </span>
                      </div>
                      <Textarea
                        value={formData.summary}
                        onChange={(e) => handleFieldChange("summary", e.target.value)}
                        placeholder="A concise 2-sentence summary of the award, who it's for, and key financial coverage."
                        className="bg-white h-24 text-sm"
                      />
                    </div>
                  </div>

                  {/* Image Upload with Preview */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <UploadCloud size={16} className="text-emerald-600" />
                      3. Featured Cover Image
                    </h3>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      {previewImage ? (
                        <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0 bg-gray-100">
                          <img
                            src={previewImage}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shrink-0 bg-gray-50 text-xs">
                          <UploadCloud size={20} className="mb-1" />
                          <span>No Image</span>
                        </div>
                      )}

                      <div className="space-y-2 flex-1">
                        <Input
                          id="cover-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="bg-white cursor-pointer text-xs"
                        />
                        <p className="text-[11px] text-gray-400">
                          Recommended: 1200x630px JPG, PNG, or WebP. Leave blank to retain current
                          image.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Eligibility & Funding */}
              {activeTab === "eligibility" && (
                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <DollarSign size={16} className="text-emerald-600" />
                      Funding Model & Application Cost
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">
                          Funding Category <span className="text-red-500">*</span>
                        </Label>
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
                        <Label className="font-semibold text-gray-800">Application Fee</Label>
                        <Input
                          value={formData.application_fee}
                          onChange={(e) => handleFieldChange("application_fee", e.target.value)}
                          placeholder="e.g. Free / No Application Fee"
                          className="bg-white"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {COMMON_FEE_PRESETS.map((fee) => (
                            <button
                              key={fee}
                              type="button"
                              onClick={() => handleFieldChange("application_fee", fee)}
                              className="text-[10px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full transition-colors"
                            >
                              {fee}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <GraduationCap size={16} className="text-emerald-600" />
                      Degree Level & Target Scope
                    </h3>

                    {/* Interactive Degree Level Chips */}
                    <div className="space-y-2">
                      <Label className="font-semibold text-gray-800">
                        Applicable Degree Levels (Click to select multiple)
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {DEGREE_LEVELS.map((dl) => {
                          const selected = isDegreeSelected(dl.value);
                          return (
                            <button
                              key={dl.value}
                              type="button"
                              onClick={() => toggleDegreeLevel(dl.value)}
                              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                selected
                                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-900 shadow-sm"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <span>{dl.label}</span>
                              {selected && <Check size={14} className="text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">
                          Application Difficulty
                        </Label>
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
                        <Label className="font-semibold text-gray-800">
                          Eligible Citizenships / Countries
                        </Label>
                        <Input
                          value={formData.eligible_countries}
                          onChange={(e) => handleFieldChange("eligible_countries", e.target.value)}
                          placeholder="e.g. Nigeria, Ghana, Kenya"
                          className="bg-white"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {COMMON_COUNTRY_PRESETS.slice(0, 6).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => addCountryPreset(c)}
                              className="text-[10px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full transition-colors border border-emerald-200/60"
                            >
                              + {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <FileText size={16} className="text-emerald-600" />
                      Detailed Eligibility & Benefits Markdown
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">
                          Eligibility Requirements (Markdown)
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            appendTemplate(
                              "eligibility",
                              "- **Citizenship**: Must be a citizen of eligible country\n- **Academic Record**: Minimum Second Class Upper (2:1) or equivalent\n- **Work Experience**: Minimum 2 years of relevant experience\n- **Language**: English proficiency (IELTS 6.5+ or proof of instruction)",
                            )
                          }
                          className="h-6 text-[11px] text-emerald-700 hover:bg-emerald-50"
                        >
                          + Insert Criteria Template
                        </Button>
                      </div>
                      <Textarea
                        value={formData.eligibility}
                        onChange={(e) => handleFieldChange("eligibility", e.target.value)}
                        placeholder="Detail minimum GPA, nationality requirements, age limits, academic background..."
                        className="bg-white h-36 font-sans text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">
                          Benefits & Coverage (Markdown)
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            appendTemplate(
                              "benefits",
                              "- **Tuition**: 100% full university tuition fees\n- **Stipend**: Monthly living allowance covering housing and food\n- **Travel**: Return economy flight tickets\n- **Health**: Comprehensive health insurance coverage",
                            )
                          }
                          className="h-6 text-[11px] text-emerald-700 hover:bg-emerald-50"
                        >
                          + Insert Full Funding Template
                        </Button>
                      </div>
                      <Textarea
                        value={formData.benefits}
                        onChange={(e) => handleFieldChange("benefits", e.target.value)}
                        placeholder="Detail tuition coverage, monthly stipends, flight tickets, health insurance..."
                        className="bg-white h-36 font-sans text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Dates & Application Process */}
              {activeTab === "dates" && (
                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-600" />
                      Key Deadlines & Dates
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">Application Open Date</Label>
                        <Input
                          value={formData.application_open_date}
                          onChange={(e) =>
                            handleFieldChange("application_open_date", e.target.value)
                          }
                          type="date"
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-gray-800">
                            Application Deadline
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFieldChange("deadline", "")}
                            className="h-5 text-[10px] text-gray-500 hover:text-gray-900"
                          >
                            Set Rolling / No Deadline
                          </Button>
                        </div>
                        <Input
                          value={formData.deadline}
                          onChange={(e) => handleFieldChange("deadline", e.target.value)}
                          type="date"
                          className="bg-white"
                        />
                        {formData.deadline && (
                          <p className="text-[11px] text-emerald-600 font-medium">
                            {daysUntil(formData.deadline)! >= 0
                              ? `Opens/closes in ${daysUntil(formData.deadline)} days`
                              : "This deadline has passed"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <Globe size={16} className="text-emerald-600" />
                      Application Links & Portals
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-gray-800">
                            Application Portal Link
                          </Label>
                          {formData.application_link && (
                            <a
                              href={formData.application_link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                            >
                              <span>Test Portal</span>
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                        <Input
                          value={formData.application_link}
                          onChange={(e) => handleFieldChange("application_link", e.target.value)}
                          type="url"
                          placeholder="https://apply.provider.org"
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-gray-800">
                            Official Program Website
                          </Label>
                          {formData.official_website && (
                            <a
                              href={formData.official_website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                            >
                              <span>Test Site</span>
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                        <Input
                          value={formData.official_website}
                          onChange={(e) => handleFieldChange("official_website", e.target.value)}
                          type="url"
                          placeholder="https://provider.org/program"
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <FileText size={16} className="text-emerald-600" />
                      Documents & Step-by-Step Procedure
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">
                          Required Documents Checklist
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            appendTemplate(
                              "required_documents",
                              "- **Academic Transcripts**: Certified copies of degree and high school records\n- **Letters of Recommendation**: 2 academic or professional references\n- **Personal Statement / Motivation Letter**: 500-1000 words\n- **Curriculum Vitae (CV)**: Highlighting leadership and achievements\n- **Valid International Passport**: Data page copy",
                            )
                          }
                          className="h-6 text-[11px] text-emerald-700 hover:bg-emerald-50"
                        >
                          + Standard Docs Template
                        </Button>
                      </div>
                      <Textarea
                        value={formData.required_documents}
                        onChange={(e) => handleFieldChange("required_documents", e.target.value)}
                        placeholder="List academic transcripts, recommendation letters, personal statement guidelines..."
                        className="bg-white h-32 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">
                          Step-by-Step Application Procedure
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            appendTemplate(
                              "application_procedure",
                              "1. **Register**: Create an applicant profile on the official university/scholarship portal.\n2. **Upload Documents**: Submit certified transcripts, reference letters, and statement of purpose.\n3. **Submit Application**: Complete all questionnaire sections before the official closing date.\n4. **Interview Stage**: Shortlisted candidates will be invited for video or panel interviews.",
                            )
                          }
                          className="h-6 text-[11px] text-emerald-700 hover:bg-emerald-50"
                        >
                          + Step-by-Step Template
                        </Button>
                      </div>
                      <Textarea
                        value={formData.application_procedure}
                        onChange={(e) => handleFieldChange("application_procedure", e.target.value)}
                        placeholder="Step 1: Check eligibility. Step 2: Prepare references. Step 3: Complete portal..."
                        className="bg-white h-32 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Editorial Signals & Verification */}
              {activeTab === "editorial" && (
                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
                  {/* Trust Banner */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                        ScholarsConnect Quality & Verification Standard
                      </h4>
                      <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                        To protect students and adhere to Google AdSense journalism standards, every
                        listing must cite an authoritative primary source URL and deliver genuine
                        editorial guidance.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      Verification Proof & Authority
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">Verification Status</Label>
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
                        <Label className="font-semibold text-gray-800">Verified By</Label>
                        <Input
                          value={formData.verified_by}
                          onChange={(e) => handleFieldChange("verified_by", e.target.value)}
                          placeholder="ScholarsConnect Editorial Team"
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-gray-800">Last Verified Date</Label>
                          <button
                            type="button"
                            onClick={() =>
                              handleFieldChange(
                                "last_verified_at",
                                new Date().toISOString().split("T")[0],
                              )
                            }
                            className="text-[10px] text-emerald-700 hover:underline"
                          >
                            Set Today
                          </button>
                        </div>
                        <Input
                          value={formData.last_verified_at}
                          onChange={(e) => handleFieldChange("last_verified_at", e.target.value)}
                          type="date"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">
                          Official Primary Source Verification URL
                        </Label>
                        {formData.official_source_url && (
                          <a
                            href={formData.official_source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <span>Open Primary Source</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                      <Input
                        value={formData.official_source_url}
                        onChange={(e) => handleFieldChange("official_source_url", e.target.value)}
                        type="url"
                        placeholder="https://oxford.ac.uk/rhodes/official-notice-2026"
                        className="bg-white"
                      />
                      <p className="text-[11px] text-gray-400">
                        The primary university, government, or foundation webpage proving this award
                        exists.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-600" />
                      ScholarsConnect Advice & Editorial Intelligence
                    </h3>

                    <div className="space-y-2">
                      <Label className="font-semibold text-amber-900 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-600" />
                        ScholarsConnect Advice (Insider Guidance)
                      </Label>
                      <Textarea
                        value={formData.scholarsconnect_advice}
                        onChange={(e) =>
                          handleFieldChange("scholarsconnect_advice", e.target.value)
                        }
                        placeholder="Key insider strategies on drafting the personal statement, securing top references, and highlighting leadership impact..."
                        className="bg-white h-32 border-amber-200 text-sm focus-visible:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">Best Suited For</Label>
                        <Textarea
                          value={formData.best_for}
                          onChange={(e) => handleFieldChange("best_for", e.target.value)}
                          placeholder="e.g. High-achieving STEM graduates with demonstrated community leadership."
                          className="bg-white h-24 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">Not Suitable For</Label>
                        <Textarea
                          value={formData.not_suitable_for}
                          onChange={(e) => handleFieldChange("not_suitable_for", e.target.value)}
                          placeholder="e.g. Applicants seeking distance-learning degrees or post-baccalaureate diplomas."
                          className="bg-white h-24 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-gray-800">
                        Common Mistakes to Avoid
                      </Label>
                      <Textarea
                        value={formData.common_mistakes}
                        onChange={(e) => handleFieldChange("common_mistakes", e.target.value)}
                        placeholder="e.g. Submitting unauthenticated copies of transcripts; using generic recommendation letters; submitting within the final 2 hours."
                        className="bg-white h-24 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold text-gray-800">Editorial Verdict</Label>
                      <Textarea
                        value={formData.editorial_verdict}
                        onChange={(e) => handleFieldChange("editorial_verdict", e.target.value)}
                        placeholder="e.g. Highly prestigious full award with transformative career trajectory. Application effort is substantial but return on investment is unmatched."
                        className="bg-white h-24 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Publishing & SEO */}
              {activeTab === "publishing" && (
                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <Send size={16} className="text-emerald-600" />
                      Publication State & Flags
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">Publication Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(v) => handleFieldChange("status", v)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">Published (Live to Students)</SelectItem>
                            <SelectItem value="draft">Draft (Private in Admin)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => handleFieldChange("is_featured", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="text-xs">
                          <div className="font-semibold text-gray-900">Featured Placement</div>
                          <div className="text-gray-400">Homepage hero showcase</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.is_sponsored}
                          onChange={(e) => handleFieldChange("is_sponsored", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="text-xs">
                          <div className="font-semibold text-gray-900">Sponsored Notice</div>
                          <div className="text-gray-400">Clear ethical disclosure</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.is_expired}
                          onChange={(e) => handleFieldChange("is_expired", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <div className="text-xs">
                          <div className="font-semibold text-gray-900">Mark as Closed</div>
                          <div className="text-gray-400">Archives the application</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* SEO & Google SERP Preview */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <Globe size={16} className="text-emerald-600" />
                      Search Engine Optimization (SEO)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-gray-800">Meta Title</Label>
                          <span
                            className={`text-[11px] ${
                              (formData.meta_title || formData.title)?.length > 60
                                ? "text-amber-600 font-semibold"
                                : "text-gray-400"
                            }`}
                          >
                            {(formData.meta_title || formData.title)?.length || 0}/60 chars
                          </span>
                        </div>
                        <Input
                          value={formData.meta_title}
                          onChange={(e) => handleFieldChange("meta_title", e.target.value)}
                          placeholder="e.g. Rhodes Scholarship 2026 Oxford: Full Funding & Guide"
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-semibold text-gray-800">Focus Keyword</Label>
                        <Input
                          value={formData.focus_keyword}
                          onChange={(e) => handleFieldChange("focus_keyword", e.target.value)}
                          placeholder="e.g. rhodes scholarship 2026 oxford"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-gray-800">Meta Description</Label>
                        <span
                          className={`text-[11px] ${
                            (formData.meta_description || formData.summary)?.length > 160
                              ? "text-amber-600 font-semibold"
                              : "text-gray-400"
                          }`}
                        >
                          {(formData.meta_description || formData.summary)?.length || 0}/160 chars
                        </span>
                      </div>
                      <Textarea
                        value={formData.meta_description}
                        onChange={(e) => handleFieldChange("meta_description", e.target.value)}
                        placeholder="e.g. Apply for the Oxford Rhodes Scholarship 2026. Discover full funding coverage, eligibility criteria, application steps, and editorial advice."
                        className="bg-white h-20 text-sm"
                      />
                    </div>

                    {/* Google Search Card Preview */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Google Search Preview
                      </div>
                      <div className="text-xs text-emerald-800 font-mono">
                        scholarsconnect.com.ng › opportunities › {formData.slug || "slug"}
                      </div>
                      <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer line-clamp-1">
                        {formData.meta_title || formData.title || "Opportunity Title Preview"}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {formData.meta_description ||
                          formData.summary ||
                          "A comprehensive guide, eligibility requirements, funding coverage, and editorial tips for this opportunity."}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Stepper Footer */}
            <div className="p-4 px-6 bg-white border-t border-gray-200 flex items-center justify-between shrink-0 sticky bottom-0 z-20">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xs font-semibold"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-3">
                {currentStepIdx > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="text-xs font-semibold h-9 rounded-xl gap-1.5"
                  >
                    <ChevronLeft size={14} /> Back
                  </Button>
                )}

                {currentStepIdx < FORM_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-gray-900 hover:bg-black text-white text-xs font-semibold h-9 px-4 rounded-xl gap-1.5"
                  >
                    Next Step <ChevronRight size={14} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0a1128] hover:bg-[#142148] text-white text-xs font-semibold h-9 px-5 rounded-xl shadow-md gap-1.5"
                  >
                    <Check size={14} className="text-emerald-400" />
                    {isSubmitting
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Publish Opportunity"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
