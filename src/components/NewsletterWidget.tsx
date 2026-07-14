import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NewsletterWidget({ className, variant = 'default' }: { className?: string, variant?: 'default' | 'footer' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={cn("rounded-xl p-6 text-center shadow-sm", variant === 'default' ? "bg-white border border-border" : "bg-transparent", className)}>
        <CheckCircle2 className={cn("mx-auto h-12 w-12 mb-3", variant === 'default' ? "text-green-500" : "text-white")} />
        <h3 className={cn("text-xl font-bold font-heading", variant === 'default' ? "text-navy" : "text-white")}>You're Subscribed!</h3>
        <p className={cn("mt-2 font-sans", variant === 'default' ? "text-muted-foreground" : "text-white/80")}>Keep an eye on your inbox for the latest scholarship alerts.</p>
        <Button variant={variant === 'default' ? 'outline' : 'secondary'} className="mt-6 w-full" onClick={() => setStatus('idle')}>Subscribe another email</Button>
      </div>
    );
  }

  return (
    <div className={cn(
      variant === 'default' && "rounded-xl border border-border bg-white p-6 shadow-sm",
      className
    )}>
      {variant === 'default' && (
        <>
          <h3 className="text-xl font-bold text-navy font-heading mb-2">Never Miss an Opportunity!</h3>
          <p className="text-sm text-muted-foreground mb-6 font-sans">Join thousands of African students receiving our weekly scholarship alerts directly in their inbox.</p>
        </>
      )}
      
      <form onSubmit={subscribe} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Enter your email address..."
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
        />
        <Button 
          type="submit" 
          disabled={status === 'loading'}
          className={cn("w-full font-bold uppercase tracking-wider py-6", variant === 'footer' ? "bg-secondary text-white hover:bg-secondary/90" : "bg-navy text-white hover:bg-navy/90")}
        >
          {status === 'loading' ? 'Subscribing...' : (
            <>Subscribe Now <Send className="ml-2 h-4 w-4" /></>
          )}
        </Button>
        {status === 'error' && (
          <p className="text-red-500 text-xs text-center font-bold mt-2">Failed to subscribe. Please try again.</p>
        )}
      </form>
    </div>
  );
}
