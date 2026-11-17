import { useEffect, useRef, useState } from "react";

const feeds = [
  {
    title: "Agent activity",
    label: "4 agents running",
    rows: [
      ["Evidence agent", "Mapped 42 requests to existing evidence", "42 / 42 matched"],
      ["Risk agent", "Completed enterprise risk assessment", "99% fewer resources"],
      ["Third-party agent", "Vendor questionnaire sent and reviewed", "Assessment complete"],
      ["Questionnaire agent", "Drafted answers with verified sources", "Ready for review"],
    ],
  },
  {
    title: "Evidence agent",
    label: "Evidence agent running",
    rows: [
      ["Auditor request 001", "Access control policy", "Matched · access_control.pdf"],
      ["Auditor request 002", "Quarterly access review", "Matched · Q3_access_review.xlsx"],
      ["Auditor request 003", "Security awareness training", "Matched · training_records.csv"],
      ["Auditor request 004", "Incident response procedure", "Matched · incident_response.pdf"],
    ],
  },
  {
    title: "Risk agent",
    label: "Risk agent running",
    rows: [
      ["Risk agent", "What are your team's critical dependencies?", "Interview · Operations"],
      ["Operations leader", "Our customer data and core infrastructure.", "Response received"],
      ["Risk agent", "How is access reviewed across those systems?", "Interview · Operations"],
      ["Risk assessment", "Mapped to existing controls and evidence", "Ready for review"],
    ],
  },
  {
    title: "Third-party agent",
    label: "Third-party agent running",
    rows: [
      ["Vendor questionnaire", "Security review initiated", "Questionnaire sent"],
      ["Vendor response", "Encryption and access controls", "Answers received"],
      ["Evidence review", "SOC 2 report and policies", "Sources verified"],
      ["Vendor assessment", "Security review complete", "Ready for review"],
    ],
  },
  {
    title: "Questionnaire agent",
    label: "Questionnaire agent running",
    rows: [
      ["Customer question", "Is customer data encrypted at rest?", "Answer drafted"],
      ["Source", "Encryption policy · Section 3.2", "Verified"],
      ["Customer question", "How often are access reviews performed?", "Answer drafted"],
      ["Source", "Access control policy · Section 4.1", "Verified"],
    ],
  },
];
export function AgentPane({ kind = 0 }: { kind?: number }) {
  const pane = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(timer);
  }, []);
  const feed = feeds[kind] ?? feeds[0];
  if (!feed) return null;
  return (
    <div
      ref={pane}
      className="agent-pane"
      onPointerMove={(e) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        pane.current?.style.setProperty(
          "--tilt-x",
          `${(e.clientY - r.top - r.height / 2) / 80}deg`,
        );
        pane.current?.style.setProperty(
          "--tilt-y",
          `${-(e.clientX - r.left - r.width / 2) / 80}deg`,
        );
      }}
      onPointerLeave={() => {
        pane.current?.style.setProperty("--tilt-x", "0deg");
        pane.current?.style.setProperty("--tilt-y", "0deg");
      }}
    >
      <div className="pane-top">
        <span>{feed.title}</span>
      </div>
      <div className="pane-status">
        <span className="live-dot" />
        {feed.label}
        <span className="status-line" />
      </div>
      <div className="feed-rows">
        {feed.rows.map(([title, text, status], i) => (
          <div className={`feed-row ${tick % 4 === i ? "feed-current" : ""}`} key={`${kind}-${i}`}>
            <div className="feed-meta">
              <span>{title}</span>
            </div>
            <p>{text}</p>
            <div className="feed-result">
              <span className="complete-mark">✓</span>
              {status}
            </div>
          </div>
        ))}
      </div>
      <div className="pane-bottom">
        <span>Illustrative, sample data</span>
      </div>
    </div>
  );
}
