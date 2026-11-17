type Row = { label: string; text: string; state: string; needsYou?: boolean };
type Feed = { title: string; scope: string; rows: Row[]; result: string; action: string };

// Sample data, labelled as such in the pane. Each feed is one agent run with its exceptions.
const feeds: Feed[] = [
  {
    title: "Oxten",
    scope: "4 agents at work",
    rows: [
      { label: "Evidence requests", text: "39 of 42 matched", state: "3 need you", needsYou: true },
      { label: "Risk assessment", text: "11 of 14 leaders interviewed", state: "In progress" },
      { label: "Third-party reviews", text: "29 of 32 vendors answered", state: "In progress" },
      {
        label: "Security questionnaire",
        text: "209 of 212 answers drafted",
        state: "3 need you",
        needsYou: true,
      },
    ],
    result: "Nothing is final until you approve it.",
    action: "Open queue",
  },
  {
    title: "Evidence agent",
    scope: "Auditor request list, 42 requests",
    rows: [
      { label: "Access control policy", text: "access_control_v4.pdf", state: "Matched" },
      { label: "Quarterly access review", text: "Q3_access_review.xlsx", state: "Matched" },
      {
        label: "Incident response test",
        text: "No evidence on file",
        state: "Needs you",
        needsYou: true,
      },
    ],
    result: "39 of 42 matched. 3 need you.",
    action: "Review package",
  },
  {
    title: "Risk agent",
    scope: "Enterprise risk assessment, 14 leaders",
    rows: [
      { label: "VP Operations", text: "Interview complete in Slack", state: "Answered" },
      { label: "Head of Finance", text: "Two questions open", state: "Follow-up sent" },
      { label: "CIO", text: "Asked about vendor concentration", state: "Answered" },
    ],
    result: "11 of 14 complete. Draft report ready.",
    action: "Review draft",
  },
  {
    title: "Third-party agent",
    scope: "Vendor review, 32 vendors",
    rows: [
      { label: "Custom questionnaire", text: "Written and sent to 32 contacts", state: "Sent" },
      { label: "Responses", text: "29 read in full", state: "3 chased" },
      {
        label: "Exposure",
        text: "4 vendors without SSO enforcement",
        state: "Needs you",
        needsYou: true,
      },
    ],
    result: "4 findings need your decision.",
    action: "Review findings",
  },
  {
    title: "Questionnaire agent",
    scope: "Customer security questionnaire, 212 questions",
    rows: [
      {
        label: "Is customer data encrypted at rest?",
        text: "Encryption policy, section 3.2",
        state: "Drafted",
      },
      {
        label: "How often are access reviews performed?",
        text: "Access control policy, section 4.1",
        state: "Drafted",
      },
      {
        label: "Do you support customer-managed keys?",
        text: "No source found",
        state: "Needs you",
        needsYou: true,
      },
    ],
    result: "209 drafted from your documents. 3 need you.",
    action: "Review answers",
  },
];

export function AgentPane({ kind = 0 }: { kind?: number }) {
  const feed = feeds[kind] ?? feeds[0];
  if (!feed) return null;
  return (
    // The key restarts the run animation each time a different agent comes into view.
    <div className="agent-pane" key={kind}>
      <div className="pane-top">
        <span className="pane-title">{feed.title}</span>
        <span className="pane-scope">{feed.scope}</span>
      </div>
      <ul className="feed-rows">
        {feed.rows.map((row, i) => (
          <li
            className="feed-row"
            key={row.label}
            style={{ animationDelay: `${0.25 + i * 0.45}s` }}
          >
            <div>
              <span className="feed-label">{row.label}</span>
              <span className="feed-text">{row.text}</span>
            </div>
            <span className={`feed-state ${row.needsYou ? "feed-needs-you" : ""}`}>
              {row.state}
            </span>
          </li>
        ))}
      </ul>
      <div className="pane-result" style={{ animationDelay: `${0.25 + feed.rows.length * 0.45}s` }}>
        <span>{feed.result}</span>
        <span className="pane-action">{feed.action}</span>
      </div>
      <p className="pane-note">Illustrative, sample data</p>
    </div>
  );
}
