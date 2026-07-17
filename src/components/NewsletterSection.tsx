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
    <section className="relative overflow-hidden bg-navy px-4 py-24 lg:px-8 border-t border-white/10">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 blur-[100px] rounded-full pointer-events-none opacity-50"></div>
      
      <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-green-600 shadow-2xl shadow-secondary/30 mb-6 border border-white/10">
          <Mail className="h-8 w-8 text-white" />
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight drop-shadow-sm">Never Miss a Deadline Again</h2>
        <p className="mt-5 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
          Join <strong className="text-white">85,000+</strong> ambitious students getting the newest scholarships, internships, and grants delivered straight to their inbox every single week.
        </p>

        {state === "done" ? (
          <p className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 rounded-full border border-green-400/30 bg-green-500/10 backdrop-blur-sm px-8 py-4 font-bold text-green-300 shadow-lg">
            <CheckCircle2 className="h-6 w-6" /> You're on the list! Watch your inbox.
          </p>
        ) : (
          <form onSubmit={subscribe} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row bg-white/5 backdrop-blur-md p-2 rounded-3xl sm:rounded-full border border-white/10 shadow-2xl">
            <div className="flex-1 relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your best email address"
                className="h-14 w-full rounded-full border-none bg-transparent pl-14 pr-5 text-[16px] text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              type="submit"
              disabled={state === "loading"}
              className="h-14 sm:w-auto w-full rounded-2xl sm:rounded-full bg-gradient-to-r from-secondary to-green-500 px-10 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 text-[16px] uppercase tracking-wider"
            >
              {state === "loading" ? "Joining..." : "Subscribe for Free"}
            </Button>
          </form>
        )}
        {state === "error" && (
          <p className="mt-4 text-[15px] font-medium text-red-400 bg-red-500/10 inline-block px-4 py-1.5 rounded-full border border-red-500/20">Please enter a valid email address and try again.</p>
        )}
      </div>
    </section>
  );
}