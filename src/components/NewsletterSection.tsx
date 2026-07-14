import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed) || trimmed.length > 255) {
      setState("error");
      return;
    }
    setState("loading");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
    try {
      const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed })
      });
      setState(res.ok ? "done" : "error");
    } catch (error) {
      setState("error");
    }
  };

  return (
    <section className="bg-navy px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center text-white">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary shadow-lg shadow-secondary/20">
          <Mail className="h-7 w-7 text-white" />
        </span>
        <h2 className="mt-5 text-3xl font-bold text-white">Never Miss a Deadline</h2>
        <p className="mt-3 text-white/80">
          Join 85,000+ students getting the newest scholarships, internships and grants in their inbox every week.
        </p>

        {state === "done" ? (
          <p className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full bg-secondary/20 px-6 py-3 font-medium text-secondary">
            <CheckCircle2 className="h-5 w-5" /> You're subscribed! Watch your inbox.
          </p>
        ) : (
          <form onSubmit={subscribe} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-12 rounded-full border-white/20 bg-white/10 px-5 text-white placeholder:text-white/60 focus-visible:ring-secondary"
            />
            <Button
              type="submit"
              disabled={state === "loading"}
              className="h-12 rounded-full bg-secondary px-7 font-semibold text-white shadow-lg transition-transform hover:bg-green-600 hover:scale-105"
            >
              {state === "loading" ? "Subscribing…" : "Subscribe Free"}
            </Button>
          </form>
        )}
        {state === "error" && (
          <p className="mt-3 text-sm text-highlight">Please enter a valid email and try again.</p>
        )}
      </div>
    </section>
  );
}