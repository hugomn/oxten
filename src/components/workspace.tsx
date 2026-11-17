import { useEffect, useState } from "react";
import { Plot, plots } from "@/components/garden";

type Row = { label: string; detail: string; state: string; needsYou?: boolean };
type Agent = {
  name: string;
  task: string;
  summary: string;
  rows: Row[];
  result: string;
  action: string;
};

// Sample data, labelled as such in the interface. Each agent is one run with its exceptions.
const agents: Agent[] = [
  {
    name: "Evidence",
    task: "Auditor request list",
    summary: "42 requests",
    rows: [
      { label: "Access control policy", detail: "access_control_v4.pdf", state: "Matched" },
      { label: "Quarterly access review", detail: "Q3_access_review.xlsx", state: "Matched" },
      { label: "Security awareness training", detail: "training_records.csv", state: "Matched" },
      {
        label: "Change management samples",
        detail: "25 tickets pulled from Jira",
        state: "Matched",
      },
      {
        label: "Incident response test",
        detail: "No evidence on file. Owner asked.",
        state: "Needs you",
        needsYou: true,
      },
    ],
    result: "39 of 42 matched. 3 need you.",
    action: "Review package",
  },
  {
    name: "Risk",
    task: "Enterprise risk assessment",
    summary: "14 leaders",
    rows: [
      {
        label: "VP Operations",
        detail: "Interviewed in Slack, 12 risks raised",
        state: "Answered",
      },
      { label: "CIO", detail: "Asked about vendor concentration", state: "Answered" },
      { label: "General Counsel", detail: "Interviewed by email", state: "Answered" },
      { label: "Head of Finance", detail: "Two questions open", state: "Follow-up sent" },
      {
        label: "Risk register",
        detail: "31 risks scored and mapped to controls",
        state: "Draft ready",
      },
    ],
    result: "11 of 14 interviews complete. Draft report ready.",
    action: "Review draft",
  },
  {
    name: "Third party",
    task: "Vendor security review",
    summary: "32 vendors",
    rows: [
      { label: "Custom questionnaire", detail: "Written for 32 vendors and sent", state: "Sent" },
      { label: "Responses", detail: "29 received and read in full", state: "Read" },
      { label: "Non-responders", detail: "3 vendors chased twice", state: "Chasing" },
      { label: "SOC 2 reports", detail: "27 checked against answers", state: "Verified" },
      {
        label: "SSO not enforced",
        detail: "4 vendors, with their answers attached",
        state: "Needs you",
        needsYou: true,
      },
    ],
    result: "32 vendors assessed. 4 findings need your decision.",
    action: "Review findings",
  },
  {
    name: "Questionnaires",
    task: "Customer security questionnaire",
    summary: "212 questions",
    rows: [
      {
        label: "Is customer data encrypted at rest?",
        detail: "Encryption policy, section 3.2",
        state: "Drafted",
      },
      {
        label: "How often are access reviews performed?",
        detail: "Access control policy, section 4.1",
        state: "Drafted",
      },
      {
        label: "Describe your incident response process.",
        detail: "Reused from an approved answer",
        state: "Drafted",
      },
      { label: "Where is data hosted?", detail: "Architecture overview, page 4", state: "Drafted" },
      {
        label: "Do you support customer-managed keys?",
        detail: "No source found",
        state: "Needs you",
        needsYou: true,
      },
    ],
    result: "209 of 212 drafted from your documents. 3 need you.",
    action: "Review answers",
  },
];

const RUN_MS = 7000;

export function Workspace() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((a) => (a + 1) % agents.length), RUN_MS);
    return () => window.clearInterval(timer);
  }, [auto]);
  const agent = agents[active];
  const plot = plots[active];
  if (!agent || !plot) return null;
  return (
    <div className="workspace">
      <div className="ws-rail" role="tablist" aria-label="Oxten agents">
        <p className="ws-rail-title">Agents</p>
        {agents.map((a, i) => (
          <button
            key={a.name}
            type="button"
            role="tab"
            id={`ws-tab-${i}`}
            aria-selected={i === active}
            aria-controls="ws-panel"
            className="ws-tab"
            onClick={() => {
              setActive(i);
              setAuto(false);
            }}
          >
            <span className="ws-tab-name">{a.name}</span>
            <span className="ws-tab-task">{a.summary}</span>
          </button>
        ))}
        <p className="ws-sample">Illustrative, sample data</p>
      </div>
      {/* The key restarts the run each time a different agent is shown. */}
      <div
        className="ws-main"
        role="tabpanel"
        id="ws-panel"
        aria-labelledby={`ws-tab-${active}`}
        key={active}
      >
        <div className="ws-cover">
          <Plot region={plot} plantable className="plot-run" />
        </div>
        <div className="ws-head">
          <p className="ws-task">{agent.task}</p>
          <p className="ws-running">
            <span className="ws-pulse" />
            <span className="ws-running-live">Working</span>
            <span className="ws-running-done">Done</span>
          </p>
        </div>
        <ul className="ws-rows">
          {agent.rows.map((row, i) => (
            <li key={row.label} className="ws-row" style={{ animationDelay: `${0.5 + i * 0.7}s` }}>
              <div className="ws-row-text">
                <span className="ws-row-label">{row.label}</span>
                <span className="ws-row-detail">{row.detail}</span>
              </div>
              <span className={`ws-state ${row.needsYou ? "ws-needs-you" : ""}`}>{row.state}</span>
            </li>
          ))}
        </ul>
        <div className="ws-result" style={{ animationDelay: `${0.5 + agent.rows.length * 0.7}s` }}>
          <span>{agent.result}</span>
          <span className="ws-action">{agent.action}</span>
        </div>
      </div>
    </div>
  );
}
