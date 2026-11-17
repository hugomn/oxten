import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Garden, beds } from "@/components/garden";
import { AgentPane } from "@/components/agent-pane";
import { VariantSwitcher } from "@/components/variant-switcher";
import { Button } from "@/components/ui/button";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { waitlistSchema } from "@/lib/waitlist-schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oxten | Standalone GRC Agents" },
      {
        name: "description",
        content:
          "Domain-trained Oxten agents do the GRC work you didn't think you could hand off. Keep your platform. Request an invite.",
      },
      { property: "og:title", content: "Oxten | Standalone GRC Agents" },
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
const extras = [
  "Maps a new framework onto your controls",
  "Runs a gap assessment against a new regulation",
  "Drafts and updates policies",
  "Builds a Board-ready risk report",
  "Chases remediation until it's closed",
  "Answers the question your CISO asked five minutes ago",
];
// One entry per scroll step: which bed the camera goes to (null shows the whole garden),
// which agent run the pane shows, and how many beds are planted once the step is reached.
const steps: { bed: number | null; pane: number | null; planted: number }[] = [
  { bed: null, pane: 0, planted: 6 },
  { bed: null, pane: null, planted: 0 },
  { bed: null, pane: null, planted: 0 },
  { bed: 0, pane: 1, planted: 1 },
  { bed: 2, pane: 2, planted: 3 },
  { bed: 3, pane: 3, planted: 4 },
  { bed: 4, pane: 4, planted: 5 },
  { bed: null, pane: null, planted: 6 },
  { bed: null, pane: null, planted: 6 },
];
const GROWN = "125%";
function Index() {
  const root = useRef<HTMLDivElement>(null);
  const finalInput = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState(0);
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
  const scrollToEnd = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  const form = (final = false) => {
    const id = final ? "invite-email-final" : "invite-email";
    return (
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
                onFocus={final ? scrollToEnd : undefined}
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
  };
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const stage = root.current?.querySelector<HTMLElement>(".garden-window");
    const camera = root.current?.querySelector<HTMLElement>(".garden-camera");
    if (!stage || !camera) return;
    // The garden lies on its side. The camera holds one point of the painting (ix, iy)
    // at a point of the garden window (ax, ay), at scale s.
    const view = { ix: 512, iy: 960, s: 0.5, ax: 0.5, ay: 0.5 };
    const apply = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      camera.style.transform = `translate3d(${view.ax * w + view.s * view.iy}px, ${view.ay * h - view.s * view.ix}px, 0) rotate(90deg) scale(${view.s})`;
    };
    const phone = () => stage.clientWidth <= 760;
    const shot = (bedIndex: number | null) => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const bed = bedIndex === null ? undefined : beds[bedIndex];
      if (!bed) {
        if (phone())
          return {
            ix: 512,
            iy: 960,
            s: Math.min((0.94 * w) / 1920, (0.5 * h) / 1024),
            ax: 0.5,
            ay: 0.27,
          };
        return {
          ix: 512,
          iy: 960,
          s: Math.min((0.63 * w) / 1920, (0.94 * h) / 1024),
          ax: 0.35,
          ay: 0.5,
        };
      }
      const ix = bed.x + bed.width / 2;
      const iy = bed.y + bed.height / 2;
      if (phone())
        return {
          ix,
          iy,
          s: Math.min((0.86 * w) / bed.height, (0.36 * h) / bed.width, 1.5),
          ax: 0.5,
          ay: 0.24,
        };
      return {
        ix,
        iy,
        s: Math.min((0.5 * w) / bed.height, (0.62 * h) / bed.width, 1.6),
        ax: 0.34,
        ay: 0.5,
      };
    };
    Object.assign(view, shot(null));
    apply();
    const onResize = () => {
      ScrollTrigger.refresh();
      apply();
    };
    window.addEventListener("resize", onResize);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const scenes = gsap.utils.toArray<HTMLElement>(".moment");
        gsap.set(scenes.slice(1), { opacity: 0, y: 16, pointerEvents: "none" });
        // The one opening move: the garden is planted, bed by bed, as the page arrives.
        if (window.scrollY < 20)
          gsap.fromTo(
            ".bed",
            { "--grow": "0%" },
            { "--grow": GROWN, duration: 1.1, stagger: 0.14, ease: "power2.inOut", delay: 0.2 },
          );
        let current = 0;
        const last = steps.length - 1;
        const tl = gsap.timeline({
          onUpdate: apply,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / last,
              inertia: false,
              directional: false,
              duration: { min: 0.2, max: 0.45 },
              ease: "power2.inOut",
              delay: 0.12,
            },
            onUpdate: (self) => {
              const next = Math.round(self.progress * last);
              if (next !== current) {
                current = next;
                setStep(next);
              }
            },
          },
        });
        steps.forEach((stepDef, i) => {
          const previous = scenes[i - 1];
          const scene = scenes[i];
          const before = steps[i - 1];
          if (!previous || !scene || !before) return;
          const at = i - 0.5;
          tl.to(previous, { opacity: 0, y: -12, pointerEvents: "none", duration: 0.18 }, at - 0.12)
            .fromTo(
              scene,
              { opacity: 0, y: 16, pointerEvents: "none" },
              { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.24, immediateRender: false },
              at + 0.1,
            )
            .to(
              view,
              {
                ix: () => shot(stepDef.bed).ix,
                iy: () => shot(stepDef.bed).iy,
                s: () => shot(stepDef.bed).s,
                ax: () => shot(stepDef.bed).ax,
                ay: () => shot(stepDef.bed).ay,
                duration: 0.7,
                ease: "power2.inOut",
              },
              at - 0.35,
            );
          // Beds are planted when their work is done, and cleared when the work piles up.
          beds.forEach((_, b) => {
            const was = b < before.planted;
            const is = b < stepDef.planted;
            if (was === is) return;
            tl.fromTo(
              `.bed-${b}`,
              { "--grow": was ? GROWN : "0%" },
              {
                "--grow": is ? GROWN : "0%",
                duration: is ? 0.5 : 0.35,
                ease: "power2.inOut",
                immediateRender: false,
              },
              is ? at + 0.15 + (b % 2) * 0.08 : at - 0.3 + b * 0.03,
            );
          });
        });
        tl.to({}, { duration: 0.001 }, last);
      }, root);
      return () => ctx.revert();
    });
    return () => {
      window.removeEventListener("resize", onResize);
      mm.revert();
    };
  }, []);
  const pane = steps[step]?.pane ?? null;
  return (
    <main ref={root} className="scroll-experience">
      <div className="pinned-garden">
        <header className="brand-header">
          <span className="wordmark" translate="no">
            Oxten
          </span>
          <ul className="trust">
            <li>Backed by Google Ventures</li>
            <li>From the team behind Complyance</li>
          </ul>
          <button
            type="button"
            className={`header-invite ${step === 0 || step === steps.length - 1 ? "header-invite-hidden" : ""}`}
            onClick={() => {
              scrollToEnd();
              finalInput.current?.focus({ preventScroll: true });
            }}
          >
            Request an invite
          </button>
        </header>
        <div className="band">
          <section className="moment hero-moment">
            <div className="moment-main">
              <h1>
                Standalone GRC agents.
                <br />
                <span className="quiet">Next to any platform.</span>
              </h1>
            </div>
            <div className="moment-aside">
              <p className="lead">
                Domain-trained Oxten agents do the GRC work you didn't think you could hand off.
              </p>
              {form()}
              <p className="note">Invite only. Scroll to watch the work get done.</p>
            </div>
          </section>
          <section className="moment">
            <div className="moment-main">
              <h2>
                GRC kept being asked to do more with less.
                <br />
                <span className="quiet">And your team stays the same size.</span>
              </h2>
            </div>
          </section>
          <section className="moment">
            <div className="moment-main">
              <h2>
                Keep your platform.
                <br />
                <span className="quiet">Add the multiplier.</span>
              </h2>
            </div>
            <div className="moment-aside">
              <p className="lead">
                Oxten's here now. ServiceNow, Archer, AuditBoard, OneTrust, or a spreadsheet. It
                works next to all of them.
              </p>
              <p className="note">No migration. No implementation.</p>
            </div>
          </section>
          <section className="moment job-moment">
            <div className="moment-main">
              <p className="job-title">Works the evidence request list</p>
              <p className="figure">
                5<span className="unit">min</span>
              </p>
            </div>
            <div className="moment-aside">
              <p className="lead">
                Your existing evidence is mapped to auditor requests in 5 minutes.
              </p>
            </div>
          </section>
          <section className="moment job-moment">
            <div className="moment-main">
              <p className="job-title">Conducts risk assessments</p>
              <p className="figure">
                99<span className="unit">%</span>
              </p>
            </div>
            <div className="moment-aside">
              <p className="lead">
                An enterprise-wide risk assessment can be conducted with 99% fewer resources.
              </p>
            </div>
          </section>
          <section className="moment job-moment">
            <div className="moment-main">
              <p className="job-title">Manages third-party security reviews</p>
              <p className="figure">
                0<span className="unit">min</span>
              </p>
            </div>
            <div className="moment-aside">
              <p className="lead">Your next vendor assessment will take you 0 minutes.</p>
            </div>
          </section>
          <section className="moment job-moment">
            <div className="moment-main">
              <p className="job-title">Answers customer security questionnaires</p>
              <h2>You don't need to answer the same question again.</h2>
            </div>
          </section>
          <section className="moment">
            <div className="moment-main">
              <h2>And everything in between.</h2>
            </div>
            <ul className="moment-aside extra-list">
              {extras.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </section>
          <section className="moment final-moment">
            <div className="moment-main">
              <h2>Your team is about to get a lot bigger.</h2>
            </div>
            <div className="moment-aside">
              <p className="lead">
                It's the best time to be a GRC professional. Oxten doesn't replace your team. It
                gives every person on it a team of their own.
              </p>
              {form(true)}
              <p className="note">
                We're opening the doors to a small group of GRC, security, and AI leaders.
              </p>
            </div>
          </section>
        </div>
        <div className="garden-frame">
          <Garden />
          <div className={`pane-position ${pane === null ? "pane-hidden" : ""}`}>
            <AgentPane kind={pane ?? 0} />
          </div>
        </div>
        <footer className="site-footer">© 2026 Oxten</footer>
      </div>
      <VariantSwitcher />
    </main>
  );
}
