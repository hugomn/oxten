import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Plot, plots, wholeGarden } from "@/components/garden";
import { Workspace } from "@/components/workspace";
import { Button } from "@/components/ui/button";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { waitlistSchema } from "@/lib/waitlist-schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oxten | Standalone GRC agents" },
      {
        name: "description",
        content:
          "Domain-trained Oxten agents do the GRC work you didn't think you could hand off. Keep your platform. Request an invite.",
      },
      { property: "og:title", content: "Oxten | Standalone GRC agents" },
      {
        property: "og:description",
        content:
          "Standalone GRC agents. Next to any platform. Your team is about to get a lot bigger.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const jobs: { title: string; figure: ReactNode; claim: string }[] = [
  {
    title: "Works the evidence request list",
    figure: (
      <>
        5<span className="unit">min</span>
      </>
    ),
    claim: "Your existing evidence is mapped to auditor requests in 5 minutes.",
  },
  {
    title: "Conducts risk assessments",
    figure: (
      <>
        99<span className="unit">%</span>
      </>
    ),
    claim: "An enterprise-wide risk assessment can be conducted with 99% fewer resources.",
  },
  {
    title: "Manages third-party security reviews",
    figure: (
      <>
        0<span className="unit">min</span>
      </>
    ),
    claim: "Your next vendor assessment will take you 0 minutes.",
  },
  {
    title: "Answers customer security questionnaires",
    figure: <>Once</>,
    claim: "You don't need to answer the same question again.",
  },
];
const extras = [
  "Maps a new framework onto your controls",
  "Runs a gap assessment against a new regulation",
  "Drafts and updates policies",
  "Builds a Board-ready risk report",
  "Chases remediation until it's closed",
  "Answers the question your CISO asked five minutes ago",
];
const platforms = ["ServiceNow", "Archer", "AuditBoard", "OneTrust", "A spreadsheet"];

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const finalInput = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const save = useServerFn(joinWaitlist);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    const parsed = waitlistSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid work email.");
      return;
    }
    setError("");
    setPending(true);
    try {
      const result = await save({ data: parsed.data });
      if (result.success) setSuccess(true);
      else setError(result.error ?? "That didn't go through. Try again.");
    } catch {
      setError("We couldn't save your request. Try again.");
    } finally {
      setPending(false);
    }
  }
  const form = (id: string, final = false) => (
    <form className="invite-form" onSubmit={submit} noValidate>
      {success ? (
        <p className="form-success" role="status">
          You're on the list. We'll be in touch.
        </p>
      ) : (
        <>
          <div className="form-controls">
            <label className="sr-only" htmlFor={id}>
              Work email
            </label>
            <input
              id={id}
              ref={final ? finalInput : undefined}
              name="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              spellCheck={false}
              maxLength={254}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            <Button variant="invite" disabled={pending} type="submit">
              {pending ? "Sending…" : "Request an invite"}
            </Button>
          </div>
          {error && (
            <p className="form-error" role="alert" id={`${id}-error`}>
              {error}
            </p>
          )}
        </>
      )}
    </form>
  );
  // A plot is planted when it comes into view: the one piece of motion outside the workspace.
  useEffect(() => {
    const targets = root.current?.querySelectorAll<HTMLElement>("[data-plant]");
    if (!targets || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset["plant"] = "done";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.55 },
    );
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.6) {
        el.dataset["plant"] = "waiting";
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={root} className="page">
      <header className="site-header">
        <span className="wordmark" translate="no">
          Oxten
        </span>
        <button
          type="button"
          className="header-invite"
          onClick={() => {
            finalInput.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            finalInput.current?.focus({ preventScroll: true });
          }}
        >
          Request an invite
        </button>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <h1>
              Standalone GRC agents. <span className="quiet">Next to any platform.</span>
            </h1>
            <div className="hero-side">
              <p className="lead">
                Domain-trained Oxten agents do the GRC work you didn't think you could hand off.
              </p>
              {form("invite-email")}
              <ul className="trust">
                <li>Invite only</li>
                <li>Backed by Google Ventures</li>
                <li>From the team behind Complyance</li>
              </ul>
            </div>
          </div>
          <Workspace />
        </section>

        <section className="statement">
          <p>
            GRC kept being asked to do more with less.{" "}
            <span className="quiet">And your team stays the same size.</span>
          </p>
        </section>

        <section className="platform">
          <div className="platform-inner">
            <h2>
              Keep your platform. <span className="quiet-light">Add the multiplier.</span>
            </h2>
            <div className="platform-side">
              <p className="lead">
                Oxten's here now, and it works next to whatever you already run. No migration. No
                implementation.
              </p>
              <ul className="platform-list">
                {platforms.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="jobs">
          {jobs.map((job, i) => {
            const region = plots[i];
            return (
              <article className="job" key={job.title} data-plant="">
                <p className="figure">{job.figure}</p>
                <div className="job-text">
                  <h3>{job.title}</h3>
                  <p>{job.claim}</p>
                </div>
                {region && <Plot region={region} plantable className="job-plot" />}
              </article>
            );
          })}
        </section>

        <section className="extras">
          <h2>And everything in between.</h2>
          <ul>
            {extras.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>

        <section className="finale">
          <div className="finale-copy">
            <h2>Your team is about to get a lot bigger.</h2>
            <div className="finale-side">
              <p className="lead">
                It's the best time to be a GRC professional. Oxten doesn't replace your team. It
                gives every person on it a team of their own.
              </p>
              {form("invite-email-final", true)}
              <p className="note">
                We're opening the doors to a small group of GRC, security, and AI leaders.
              </p>
            </div>
          </div>
          <Plot region={wholeGarden} className="finale-garden" />
          <footer className="site-footer">
            <span>© 2026 Oxten</span>
            <span>From the team behind Complyance</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
