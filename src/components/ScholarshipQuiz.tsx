import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Search, Loader2 } from "lucide-react";

export function ScholarshipQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  const [form, setForm] = useState({
    degree: "",
    country: "",
    course: "",
    funding: "",
    nationality: ""
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const calculateMatches = () => {
    setLoading(true);
    // Fake calculation delay
    setTimeout(() => {
      setLoading(false);
      setMatchCount(Math.floor(Math.random() * 20) + 5); // random 5 to 25 matches
      setStep(6);
    }, 1500);
  };

  const handleViewMatches = () => {
    navigate({
      to: "/opportunities",
      search: {
        degree: form.degree ? form.degree.toLowerCase() : undefined,
        country: form.country && form.country !== 'Europe' && form.country !== 'Anywhere' ? form.country.toLowerCase() : undefined,
        funding: form.funding ? form.funding : undefined,
        q: form.course || undefined
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 font-sans">
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 shrink-0">
          <Search className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-navy font-heading leading-tight">Scholarship Match Quiz</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Find your perfect fit in 60 seconds</p>
        </div>
      </div>

      <div className="relative min-h-[200px]">
        {step < 6 && (
          <div className="mb-6">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              <span>Step {step} of 5</span>
              <span>{Math.round((step / 5) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all duration-500 ease-in-out" 
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-semibold text-navy mb-3">Which degree are you pursuing?</label>
            <div className="grid grid-cols-2 gap-2">
              {['Undergraduate', 'Masters', 'PhD', 'Postdoc'].map(d => (
                <button 
                  key={d} 
                  onClick={() => { setForm({ ...form, degree: d }); handleNext(); }}
                  className="p-3 border border-border rounded-lg text-sm hover:border-secondary hover:bg-secondary/5 transition-all font-medium text-navy/80 hover:scale-[1.02] shadow-sm hover:shadow-md"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-semibold text-navy mb-3">Preferred study destination?</label>
            <div className="grid grid-cols-2 gap-2">
              {['USA', 'UK', 'Canada', 'Australia', 'Europe', 'Anywhere'].map(d => (
                <button 
                  key={d} 
                  onClick={() => { setForm({ ...form, country: d }); handleNext(); }}
                  className="p-3 border border-border rounded-lg text-sm hover:border-secondary hover:bg-secondary/5 transition-all font-medium text-navy/80 hover:scale-[1.02] shadow-sm hover:shadow-md"
                >
                  {d}
                </button>
              ))}
            </div>
            <button onClick={handlePrev} className="mt-4 text-xs font-semibold text-muted-foreground hover:text-navy transition-colors">← Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-semibold text-navy mb-3">What is your field of study?</label>
            <input 
              type="text" 
              placeholder="e.g. Computer Science" 
              className="w-full p-3 border border-border rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary mb-3 font-medium text-navy shadow-sm transition-all"
              value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter' && form.course.trim()) handleNext(); }}
            />
            <div className="flex justify-between items-center mt-2">
              <button onClick={handlePrev} className="text-xs font-semibold text-muted-foreground hover:text-navy transition-colors">← Back</button>
              <Button onClick={handleNext} disabled={!form.course.trim()} className="bg-navy hover:bg-navy-light text-white text-xs h-9 px-6 rounded-full font-bold shadow-md transition-transform hover:scale-105">Next</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-semibold text-navy mb-3">Funding requirement?</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Fully Funded (Tuition + Stipend)', val: 'fully_funded' },
                { label: 'Partially Funded / Tuition Only', val: 'partially_funded' },
                { label: 'Any Funding', val: '' }
              ].map(d => (
                <button 
                  key={d.label} 
                  onClick={() => { setForm({ ...form, funding: d.val }); handleNext(); }}
                  className="p-3 border border-border rounded-lg text-sm hover:border-secondary hover:bg-secondary/5 transition-all text-left font-medium text-navy/80 hover:scale-[1.02] shadow-sm hover:shadow-md"
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button onClick={handlePrev} className="mt-4 text-xs font-semibold text-muted-foreground hover:text-navy transition-colors">← Back</button>
          </div>
        )}

        {step === 5 && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-semibold text-navy mb-3">What is your nationality?</label>
            <input 
              type="text" 
              placeholder="e.g. Nigerian, Kenyan, Indian..." 
              className="w-full p-3 border border-border rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary mb-3 font-medium text-navy shadow-sm transition-all"
              value={form.nationality}
              onChange={e => setForm({ ...form, nationality: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter' && form.nationality.trim()) calculateMatches(); }}
            />
            <div className="flex justify-between items-center mt-2">
              <button onClick={handlePrev} className="text-xs font-semibold text-muted-foreground hover:text-navy transition-colors">← Back</button>
              <Button onClick={calculateMatches} disabled={!form.nationality.trim()} className="bg-secondary hover:bg-green-600 text-white font-bold h-9 px-6 rounded-full shadow-md transition-transform hover:scale-105">
                Find Matches
              </Button>
            </div>
          </div>
        )}

        {step === 5 && loading && (
          <div className="animate-in fade-in zoom-in duration-500 text-center py-8">
            <div className="relative mx-auto h-16 w-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
              <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-6 w-6 text-navy animate-pulse" />
              </div>
            </div>
            <h4 className="text-lg font-bold text-navy animate-pulse">Analyzing Profile...</h4>
            <p className="text-xs text-muted-foreground mt-2">Scanning 1,500+ opportunities across {form.country || 'the globe'}</p>
          </div>
        )}

        {step === 6 && (
          <div className="animate-in fade-in zoom-in duration-500 text-center py-4">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-secondary/20 animate-ping"></div>
              <span className="text-4xl relative z-10">🎉</span>
            </div>
            <h4 className="text-2xl font-black text-navy mb-2 font-heading tracking-tight">We found {matchCount} matches!</h4>
            <p className="text-sm text-muted-foreground mb-6 font-sans">
              Based on your profile, we've found highly relevant opportunities that fit your criteria perfectly.
            </p>
            <Button onClick={handleViewMatches} className="w-full bg-secondary hover:bg-green-600 text-white font-bold rounded-full h-12 text-[15px] shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              View Your Matches
            </Button>
            <button onClick={() => { setStep(1); setForm({ degree: '', country: '', course: '', funding: '', nationality: '' }); }} className="mt-5 text-xs font-semibold text-muted-foreground hover:text-navy underline transition-colors">
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
