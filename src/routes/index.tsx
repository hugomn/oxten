import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Garden } from "@/components/garden";
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
function Index() {
  const root = useRef<HTMLDivElement>(null);
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
      setError(parsed.error.issues[0]?.message ?? "Please enter a valid work email.");
      return;
    }
    setError("");
    setPending(true);
    try {
      const result = await save({ data: parsed.data });
      if (result.success) setSuccess(true);
      else setError(result.error ?? "Please try again.");
    } catch {
      setError("We couldn't save your request. Please try again.");
    } finally {
      setPending(false);
    }
  }
  const form = (final = false) => (
    <form className="invite-form" onSubmit={submit} noValidate>
      {success ? (
        <p className="form-success" role="status">
          You're on the list. We'll be in touch.
        </p>
      ) : (
        <>
          <div className="form-controls">
            <input
              type="email"
              aria-label={final ? "Work email for invite" : "Work email for waitlist"}
              placeholder="Work email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              maxLength={254}
              aria-invalid={!!error}
            />
            <Button variant="invite" disabled={pending} type="submit">
              {final ? "Request an invite" : "Join the waitlist"}
              <span aria-hidden="true">↗</span>
            </Button>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </form>
  );
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const camera = root.current?.querySelector<HTMLElement>(".garden-camera");
    if (!camera) return;
    // The camera holds one point of the painting (ix, iy) at a point of the screen (ax, ay).
    // z is the painting's width as a multiple of the viewport width; r is rotation in degrees.
    const view = { ix: 512, iy: 930, z: 1.12, r: -6, ax: 0.72, ay: 0.46 };
    const intro = { k: 0 };
    const apply = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = ((view.z * vw) / 1024) * (1 - 0.55 * intro.k);
      const r = view.r + 14 * intro.k;
      const rad = (r * Math.PI) / 180;
      const px = s * (view.ix * Math.cos(rad) - view.iy * Math.sin(rad));
      const py = s * (view.ix * Math.sin(rad) + view.iy * Math.cos(rad));
      camera.style.transform = `translate3d(${view.ax * vw - px}px, ${view.ay * vh - py}px, 0) rotate(${r}deg) scale(${s})`;
    };
    const wholeAcross = () =>
      (Math.min((0.82 * window.innerWidth) / 1920, (0.56 * window.innerHeight) / 1024) * 1024) /
      window.innerWidth;
    const wholeUpright = () => (((0.44 * window.innerHeight) / 1920) * 1024) / window.innerWidth;
    type Shot = [number, number, number | (() => number), number, number, number];
    const desktop: Shot[] = [
      [512, 930, 1.12, -6, 0.72, 0.46],
      [512, 720, 1.0, -3, 0.72, 0.46],
      [512, 560, 0.92, 0, 0.72, 0.46],
      [400, 359, 1.25, -2, 0.72, 0.42],
      [640, 359, 1.25, 2, 0.72, 0.42],
      [400, 897, 1.15, -2, 0.72, 0.42],
      [640, 897, 1.15, 2, 0.72, 0.42],
      [512, 1470, 1.0, 0, 0.72, 0.46],
      [512, 960, 0.6, 0, 0.72, 0.5],
      [512, 960, 0.42, 0, 0.72, 0.5],
      [512, 960, wholeAcross, 90, 0.5, 0.7],
    ];
    const phone: Shot[] = [
      [512, 930, 2.0, -6, 0.5, 0.78],
      [512, 720, 1.8, -3, 0.5, 0.78],
      [512, 560, 1.7, 0, 0.5, 0.78],
      [400, 359, 2.3, -2, 0.5, 0.78],
      [640, 359, 2.3, 2, 0.5, 0.78],
      [400, 897, 2.1, -2, 0.5, 0.78],
      [640, 897, 2.1, 2, 0.5, 0.78],
      [512, 1470, 1.8, 0, 0.5, 0.78],
      [512, 960, 1.3, 0, 0.5, 0.78],
      [512, 960, 1.0, 0, 0.5, 0.78],
      [512, 960, wholeUpright, 0, 0.5, 0.72],
    ];
    const resolve = (z: Shot[2]) => (typeof z === "function" ? z() : z);
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        still: "(prefers-reduced-motion: reduce)",
        phone: "(max-width: 760px)",
        desktop: "(min-width: 761px)",
      },
      (context) => {
        const shots = context.conditions?.["phone"] ? phone : desktop;
        const first = shots[0];
        if (!first) return;
        Object.assign(view, {
          ix: first[0],
          iy: first[1],
          z: resolve(first[2]),
          r: first[3],
          ax: first[4],
          ay: first[5],
        });
        apply();
        window.addEventListener("resize", apply);
        if (!context.conditions?.["motion"])
          return () => window.removeEventListener("resize", apply);
        const ctx = gsap.context(() => {
          const scenes = gsap.utils.toArray<HTMLElement>(".moment");
          gsap.set(scenes.slice(1), { autoAlpha: 0, y: 18 });
          gsap.set(".bed", { "--grow": "0%" });
          // One orchestrated opening: descend from high above into the garden.
          if (window.scrollY < 20) {
            intro.k = 1;
            apply();
            gsap.to(intro, { k: 0, duration: 2.2, ease: "power3.out", onUpdate: apply });
            gsap.from(".glass-sheet", {
              autoAlpha: 0,
              x: -28,
              duration: 1.1,
              delay: 0.7,
              ease: "power3.out",
            });
          }
          let current = 0;
          const tl = gsap.timeline({
            onUpdate: apply,
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const next = Math.round(self.progress * (shots.length - 1));
                if (next !== current) {
                  current = next;
                  setStep(next);
                }
              },
            },
          });
          shots.forEach(([ix, iy, z, r, ax, ay], i) => {
            const previous = scenes[i - 1];
            const scene = scenes[i];
            if (!previous || !scene) return;
            const at = i - 0.45;
            tl.to(previous, { autoAlpha: 0, y: -14, duration: 0.2 }, at)
              .fromTo(
                scene,
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, duration: 0.28 },
                at + 0.29,
              )
              .to(
                view,
                { ix, iy, z: () => resolve(z), r, ax, ay, duration: 0.95, ease: "sine.inOut" },
                at - 0.3,
              );
          });
          // Start lush. The bare painting shows through as the untended-work moment arrives.
          tl.to(".hero-lush", { opacity: 0, duration: 0.45 }, 0.48);
          for (let i = 0; i < 4; i++)
            tl.to(`.bed-${i}`, { "--grow": "118%", duration: 0.8, ease: "power2.inOut" }, 2.6 + i);
          for (let i = 4; i < 6; i++)
            tl.to(
              `.bed-${i}`,
              { "--grow": "118%", duration: 0.85, ease: "power2.inOut" },
              6.55 + (i - 4) * 0.25,
            );
          tl.fromTo(
            ".extra-work",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.35 },
            6.55,
          );
          tl.to(".glass-sheet", { autoAlpha: 0, duration: 0.3 }, shots.length - 1.5);
          tl.to({}, { duration: 0.05 }, shots.length - 1);
        }, root);
        return () => {
          window.removeEventListener("resize", apply);
          ctx.revert();
        };
      },
    );
    return () => mm.revert();
  }, []);
  const paneKind = ({ 0: 0, 3: 1, 4: 2, 5: 3, 6: 4 } as Record<number, number>)[step];
  return (
    <main ref={root} className="scroll-experience">
      <div className="pinned-garden">
        <Garden />
        <button
          type="button"
          className="header-invite"
          onClick={() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
          }}
        >
          Request an invite
        </button>
        <div className="glass-sheet">
          <header className="brand-header">
            <span className="wordmark" translate="no">
              OXTEN
            </span>
            <span className="brand-note">Backed by Google Ventures. Invite only.</span>
          </header>
          <div className="moments">
            <section className="moment hero-moment">
              <h1>
                <span>Standalone</span>
                <span>GRC agents.</span>
                <span>Next to any platform.</span>
              </h1>
              <p className="hero-description">
                Domain-trained Oxten agents do the GRC work you didn't think you could hand off.
              </p>
              {form()}
            </section>
            <section className="moment">
              <p className="statement">GRC kept being asked to do more with less.</p>
              <p className="statement statement-large">And your team stays the same size.</p>
            </section>
            <section className="moment">
              <h2 className="arrival-heading">Oxten's here now.</h2>
            </section>
            <section className="moment">
              <p className="work-title">Works the evidence request list.</p>
              <div className="big-number">5 min</div>
              <p className="statement">Your existing evidence, mapped to auditor requests.</p>
            </section>
            <section className="moment">
              <p className="work-title">Conducts risk assessments.</p>
              <div className="big-number">99%</div>
              <p className="statement">Fewer resources for an enterprise-wide risk assessment.</p>
            </section>
            <section className="moment">
              <p className="work-title">Manages third-party security reviews.</p>
              <div className="big-number">0 min</div>
              <p className="statement">What your next vendor assessment will take you.</p>
            </section>
            <section className="moment">
              <p className="work-title">Answers customer security questionnaires.</p>
              <p className="statement statement-large">
                You don't need to answer the same question again.
              </p>
            </section>
            <section className="moment extras-moment">
              <h2>And everything in between.</h2>
              <div className="extra-list">
                {extras.map((text) => (
                  <p className="extra-work" key={text}>
                    {text}
                  </p>
                ))}
              </div>
            </section>
            <section className="moment">
              <p className="statement statement-large">
                It's the best time to be a GRC professional.
              </p>
              <p className="statement">
                Oxten doesn't replace your team. It gives every person on it a team of their own.
              </p>
            </section>
            <section className="moment">
              <h2>
                Keep your platform.
                <br />
                Add the multiplier.
              </h2>
              <p className="statement">
                ServiceNow, Archer, AuditBoard, OneTrust, or a spreadsheet. Oxten works next to all
                of them. No migration. No implementation.
              </p>
            </section>
          </div>
          <p className={`scroll-hint ${step === 0 ? "" : "scroll-hint-hidden"}`}>
            Scroll to watch the work get done
          </p>
        </div>
        <div className={`pane-position ${paneKind === undefined ? "pane-hidden" : ""}`}>
          <AgentPane kind={paneKind ?? 0} />
        </div>
        <section className="moment final-moment">
          <h2 className="final-heading">Your team is about to get a lot bigger.</h2>
          <p className="statement">
            We're opening the doors to a small group of GRC, security, and AI leaders.
          </p>
          {form(true)}
          <footer>From the team behind Complyance. © 2026 Oxten</footer>
        </section>
      </div>
      <VariantSwitcher />
    </main>
  );
}
