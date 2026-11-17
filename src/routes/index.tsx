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
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 760px)",
        desktop: "(min-width: 761px)",
      },
      (context) => {
        if (!context.conditions?.["motion"]) return;
        const ctx = gsap.context(() => {
          const scenes = gsap.utils.toArray<HTMLElement>(".moment");
          gsap.set(scenes.slice(1), { autoAlpha: 0, y: 25 });
          gsap.set(".growth-circle", { attr: { r: 0 } });
          const camera = root.current?.querySelector(".garden-camera");
          const mobile = window.innerWidth <= 760;
          const cameras: [number, number, number, number][] = [
            [560, 650, 1.08, -5],
            [565, 930, 1.13, -3],
            [530, 760, 1.04, 0],
            [610, 1020, 1.14, -2],
            [480, 1030, 1.14, 2],
            [590, 580, 1.06, -2],
            [490, 570, 1.06, 2],
            [535, 580, 0.75, -1],
            [525, 600, mobile ? 0.49 : 0.65, 0],
            [520, 600, mobile ? 0.41 : 0.6, 0],
            [512, 600, mobile ? 0.33 : 0.56, 0],
          ];
          const first = cameras[0];
          if (camera && first)
            gsap.set(camera, {
              attr: {
                transform: `translate(${first[0]} ${first[1]}) rotate(${first[3]}) scale(${first[2]})`,
              },
            });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.45,
            },
          });
          cameras.forEach(([x, y, scale, rotate], i) => {
            const previous = scenes[i - 1];
            const current = scenes[i];
            if (!previous || !current || !camera) return;
            const at = i - 0.45;
            tl.to(previous, { autoAlpha: 0, y: -18, duration: 0.2 }, at)
              .fromTo(
                current,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 0.28 },
                at + 0.29,
              )
              .to(
                camera,
                {
                  attr: { transform: `translate(${x} ${y}) rotate(${rotate}) scale(${scale})` },
                  duration: 0.95,
                  ease: "sine.inOut",
                },
                at - 0.3,
              );
            const pane = current.querySelector(".pane-position");
            if (pane)
              tl.fromTo(pane, { y: 12 }, { y: 0, duration: 0.8, ease: "sine.out" }, at + 0.29);
          });
          // Start lush. Only reveal the bare painting as the untended-work moment arrives.
          tl.to(".hero-lush", { opacity: 0, duration: 0.45 }, 0.48);
          for (let i = 0; i < 4; i++)
            tl.to(
              `.growth-${i}`,
              { attr: { r: 400 }, duration: 0.8, ease: "power2.inOut" },
              2.6 + i,
            );
          for (let i = 4; i < 6; i++)
            tl.to(
              `.growth-${i}`,
              { attr: { r: 400 }, duration: 0.85, ease: "power2.inOut" },
              6.55 + (i - 4) * 0.25,
            );
          tl.fromTo(
            ".extra-work",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.35 },
            6.55,
          );
          tl.to(".progress-fill", { scaleY: 1, duration: 10, ease: "none" }, 0);
          scenes.forEach((scene) => {
            const counter = scene.querySelector<HTMLElement>("[data-count]");
            if (!counter) return;
            const target = Number(counter.dataset["count"]);
            const value = { n: 0 };
            ScrollTrigger.create({
              trigger: root.current,
              start: () =>
                `${(Number(scene.dataset["step"]) / 10) * ((root.current?.offsetHeight ?? 0) - window.innerHeight)} top`,
              once: true,
              onEnter: () =>
                gsap.to(value, {
                  n: target,
                  duration: 1.3,
                  ease: "power2.out",
                  onUpdate: () => {
                    counter.textContent = String(Math.round(value.n));
                  },
                }),
            });
          });
        }, root);
        return () => ctx.revert();
      },
    );
    return () => mm.revert();
  }, []);
  return (
    <main ref={root} className="scroll-experience">
      <div className="pinned-garden">
        <Garden />
        <header className="brand-header">
          <span className="wordmark">OXTEN</span>
          <span className="brand-note">Backed by Google Ventures. Invite only.</span>
        </header>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" />
        </div>
        <section className="moment hero-moment" data-step="0">
          <div className="moment-copy">
            <h1>
              <span>Standalone</span>
              <span>GRC agents.</span>
              <span className="hero-secondary">Next to any platform.</span>
            </h1>
            <p className="hero-description">
              Domain-trained Oxten agents do the GRC work you didn't think you could hand off.
            </p>
            {form()}
          </div>
          <div className="pane-position">
            <AgentPane />
          </div>
        </section>
        <section className="moment" data-step="1">
          <div className="moment-copy">
            <p className="statement">GRC kept being asked to do more with less.</p>
            <p className="statement statement-large">And your team stays the same size.</p>
          </div>
        </section>
        <section className="moment" data-step="2">
          <div className="moment-copy">
            <h2 className="arrival-heading">Oxten's here now.</h2>
          </div>
        </section>
        <section className="moment" data-step="3">
          <div className="moment-copy">
            <p className="work-title">Works the evidence request list.</p>
            <div className="big-number">
              <span data-count="5">5</span> min
            </div>
            <p className="statement">Your existing evidence, mapped to auditor requests.</p>
          </div>
          <div className="pane-position">
            <AgentPane kind={1} />
          </div>
        </section>
        <section className="moment" data-step="4">
          <div className="moment-copy">
            <p className="work-title">Conducts risk assessments.</p>
            <div className="big-number">
              <span data-count="99">99</span>%
            </div>
            <p className="statement">Fewer resources for an enterprise-wide risk assessment.</p>
          </div>
          <div className="pane-position">
            <AgentPane kind={2} />
          </div>
        </section>
        <section className="moment" data-step="5">
          <div className="moment-copy">
            <p className="work-title">Manages third-party security reviews.</p>
            <div className="big-number">
              <span data-count="0">0</span> min
            </div>
            <p className="statement">What your next vendor assessment will take you.</p>
          </div>
          <div className="pane-position">
            <AgentPane kind={3} />
          </div>
        </section>
        <section className="moment" data-step="6">
          <div className="moment-copy">
            <p className="work-title">Answers customer security questionnaires.</p>
            <p className="statement statement-large">
              You don't need to answer the same question again.
            </p>
          </div>
          <div className="pane-position">
            <AgentPane kind={4} />
          </div>
        </section>
        <section className="moment extras-moment" data-step="7">
          <div className="moment-copy">
            <h2>And everything in between.</h2>
            <div className="extra-list">
              {extras.map((text, i) => (
                <p className="extra-work" key={text}>
                  <span className="extra-index">0{i + 1}</span>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </section>
        <section className="moment" data-step="8">
          <div className="moment-copy">
            <p className="statement statement-large">
              It's the best time to be a GRC professional.
            </p>
            <p className="statement">
              Oxten doesn't replace your team. It gives every person on it a team of their own.
            </p>
          </div>
        </section>
        <section className="moment platform-moment" data-step="9">
          <div className="moment-copy">
            <h2>
              Keep your platform.
              <br />
              Add the multiplier.
            </h2>
            <p className="statement">
              ServiceNow, Archer, AuditBoard, OneTrust, or a spreadsheet. Oxten works next to all of
              them. No migration. No implementation.
            </p>
          </div>
        </section>
        <section className="moment final-moment" data-step="10">
          <div className="moment-copy">
            <h2 className="final-heading">Your team is about to get a lot bigger.</h2>
            <p className="statement">
              We're opening the doors to a small group of GRC, security, and AI leaders.
            </p>
            {form(true)}
          </div>
          <footer>From the team behind Complyance. © 2026 Oxten</footer>
        </section>
      </div>
      <VariantSwitcher />
    </main>
  );
}
