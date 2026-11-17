import { useEffect, useLayoutEffect, useRef, useState } from "react";
import estate from "@/assets/tuscany-pulled-back-nocturne.png";
import { shouldPlayVillaSequence, villaSteps, VILLA_FINAL_INDEX, VILLA_STEP_MS, VILLA_FADE_OUT_MS, VILLA_FADE_IN_MS } from "@/lib/villa-sequence";

// Fireflies stay paused.
const ambienceEnabled = false;
const fireflyPositions: readonly (readonly [number, number])[] = [[.39,.83],[.43,.86],[.48,.82],[.56,.84],[.61,.85],[.53,.89]];

const EDGE = 16;

export function Atmosphere() {
  const flies = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const [task, setTask] = useState(VILLA_FINAL_INDEX);
  const [ready, setReady] = useState(false);
  const play = useRef<boolean | null>(null);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [statusWidth, setStatusWidth] = useState<number>();
  const [shift, setShift] = useState(0);
  const [side, setSide] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (play.current === null) {
      try { play.current = shouldPlayVillaSequence(reduced, window.sessionStorage); }
      catch { play.current = !reduced; }
    }
    setReady(true);
    if (!play.current) return;
    setTask(0);
    let interval = 0;
    let fade = 0;
    let settle = 0;
    let step = 0;
    // Match the existing tag entrance delay; the first step gets its full dwell time.
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setPhase("out");
        fade = window.setTimeout(() => {
          step += 1;
          setTask(step);
          setPhase("in");
          settle = window.setTimeout(() => setPhase("idle"), VILLA_FADE_IN_MS);
          if (step === VILLA_FINAL_INDEX) window.clearInterval(interval);
        }, VILLA_FADE_OUT_MS);
      }, VILLA_STEP_MS);
    }, 200);
    return () => { window.clearTimeout(start); window.clearInterval(interval); window.clearTimeout(fade); window.clearTimeout(settle); };
  }, []);

  // Size the status to the incoming task, then keep the whole tag inside the viewport.
  useLayoutEffect(() => {
    const place = () => {
      if (!anchor.current || !tag.current || !measure.current) return;
      const textWidth = measure.current.offsetWidth;
      setStatusWidth(textWidth);
      const current = tag.current.querySelector<HTMLElement>(".villa-time-status");
      const vw = document.documentElement.clientWidth;
      const finalWidth = Math.min(vw - 2 * EDGE, Math.max(tag.current.offsetWidth, tag.current.offsetWidth - (current?.offsetWidth ?? 0) + textWidth));
      const x = anchor.current.getBoundingClientRect().left;
      const overflow = x + finalWidth / 2 - (vw - EDGE);
      const mobile = vw < 768;
      setSide(vw <= 640 && overflow > 0 && x > vw * .75);
      const leftOverflow = EDGE - (x - finalWidth / 2);
      setShift(!mobile && overflow > 0 ? -overflow : mobile && leftOverflow > 0 ? leftOverflow : mobile && overflow > 0 && vw < 768 ? -overflow : 0);
    };
    place();
    let frame = 0;
    const until = performance.now() + 300;
    const track = () => {
      place();
      if (performance.now() < until) frame = requestAnimationFrame(track);
    };
    frame = requestAnimationFrame(track);
    window.addEventListener("resize", place);
    document.fonts.ready.then(place);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", place); };
  }, [task]);

  useEffect(() => {
    if (!ambienceEnabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const animate = (now: number) => {
      Array.from(flies.current?.children ?? []).forEach((element, index) => {
        const base = fireflyPositions[index];
        if (!base || !(element instanceof HTMLElement)) return;
        element.style.transform = `translate(${base[0] * window.innerWidth}px, ${base[1] * window.innerHeight}px)`;
        element.style.opacity = String(.12 + .5 * ((Math.sin(now / 1800 + index * 2) + 1) / 2));
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div className="garden-scene scene-final" aria-hidden="true">
    <div className="painting-layer">
      <img className="garden-painting" src={estate} alt="" width={1920} height={1088} fetchPriority="high" />
      <img className="pavilion-light" src={estate} alt="" width={1920} height={1088} />
      <div className="villa-anchor" ref={anchor}>
        <div ref={tag} className={`villa-time-tag${side ? " is-side" : ""}${!ready ? " tag-pending" : ""}`} style={{ ["--tag-shift" as string]: `${shift}px` }}>
          <span className="villa-time-dot-space"><span className="villa-time-dot" /></span>
          <span className="villa-time-clock">
            <span key={`clock-${task}-${phase}`} className={`status-text${phase !== "idle" ? ` status-${phase}` : ""}`}>{villaSteps[task]?.time}</span>
          </span>
          <span className="villa-time-separator">·</span>
          <span className="villa-time-status" style={{ width: statusWidth }}>
            <span key={`task-${task}-${phase}`} className={`status-text${phase !== "idle" ? ` status-${phase}` : ""}`}>{villaSteps[task]?.task}</span>
          </span>
          <span ref={measure} className="villa-time-status status-measure">{villaSteps[task]?.task}</span>
        </div>
      </div>
    </div>
    {ambienceEnabled && <div className="fireflies" ref={flies}>{fireflyPositions.map((_, index) => <i key={index} />)}</div>}
  </div>;
}
