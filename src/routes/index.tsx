import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Atmosphere } from "@/components/atmosphere";
import { validateWorkEmail } from "@/lib/early-access";
import { requestEarlyAccess } from "@/lib/early-access.functions";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Oxten | Standalone GRC Agents" },
    { name: "description", content: "Domain-trained agents that do complex GRC work alongside your current GRC team and platform." },
    { property: "og:title", content: "Oxten | Standalone GRC Agents" },
    { property: "og:description", content: "Domain-trained agents that do complex GRC work alongside your current GRC team and platform." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const submitRequest = useServerFn(requestEarlyAccess);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;
    const validation = validateWorkEmail(email);
    if (validation) { setError(validation); return; }
    setError(""); setStatus("submitting");
    try {
      const result = await submitRequest({ data: { email, website } });
      if (!result.success) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setError("We couldn't save your request. Please try again.");
      setStatus("idle");
    }
  }
  return <main className="oxten-page">
    <Atmosphere />
    <header className="garden-header"><span className="wordmark" aria-label="Oxten">Oxten</span></header>
    <section className="hero-content" aria-labelledby="headline">
      <h1 id="headline" className="hero-title reveal"><span>Standalone</span>{" "}<span>GRC Agents</span></h1>
      <p className="hero-description reveal">Domain-trained agents that do complex GRC work,<br className="desktop-break" /> alongside your current GRC team and platform</p>
      <div className="form-area reveal">
        {status === "success" ? <div className="email-capsule confirmation" role="status"><span className="check-mark"><Check size={18} strokeWidth={2} /></span><span>You're on the list. We'll be in touch.</span></div> :
          <form className="email-capsule" noValidate onSubmit={submit}>
            <label className="sr-only" htmlFor="email">Work email</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="Work email" value={email} onFocus={event => { const field = event.currentTarget; window.setTimeout(() => field.closest("form")?.scrollIntoView({ block: "center", behavior: "smooth" }), 300); }} onChange={event => { setEmail(event.target.value); if (error) setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "email-error" : undefined} disabled={status === "submitting"} required />
            <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></div>
            <Button type="submit" variant="earlyAccess" size="capsule" disabled={status === "submitting"}>{status === "submitting" ? <><Loader2 className="animate-spin" />Requesting access</> : "Request early access"}</Button>
          </form>}
        <p id="email-error" className="email-error" role="status" aria-live="polite">{error}</p>
      </div>
      <div className="credibility reveal"><span>Backed by Google Ventures</span><span className="credibility-divider" aria-hidden="true" /><span>From the team behind Complyance</span></div>
    </section>
  </main>;
}
