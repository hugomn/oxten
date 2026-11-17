export const VILLA_SESSION_KEY = "oxten-villa-sequence-played";
export const VILLA_STEP_MS = 1500;
export const VILLA_FADE_OUT_MS = 120;
export const VILLA_FADE_IN_MS = 150;
export const villaSteps = [
  { time: "11:42 PM", task: "Sending vendor assessments" },
  { time: "11:43 PM", task: "Triaging the audit request list" },
  { time: "11:45 PM", task: "Mapping evidence to controls" },
  { time: "11:46 PM", task: "Preparing tomorrow's risk interviews" },
  { time: "11:49 PM", task: "Reviewing a vendor's SOC 2 report" },
  { time: "11:50 PM", task: "Drafting questionnaire answers" },
  { time: "11:52 PM", task: "Mapping ISO 42001 to your controls" },
  { time: "11:53 PM", task: "Chasing remediation owners" },
  { time: "11:55 PM", task: "Following up on missing evidence" },
  { time: "11:58 PM", task: "Updating the access control policy" },
  { time: "11:59 PM", task: "Running a gap assessment" },
  { time: "12:01 AM", task: "Building the Board risk report" },
  { time: "12:03 AM", task: "Reconciling user access reviews" },
  { time: "12:04 AM", task: "Logging a new AI tool for review" },
  { time: "12:07 AM", task: "Scoring new third-party risks" },
  { time: "12:08 AM", task: "Checking backup restore evidence" },
  { time: "12:10 AM", task: "Flagging an expiring vendor SOC 2" },
  { time: "12:12 AM", task: "Tagging controls for the auditor" },
  { time: "12:13 AM", task: "Drafting the DORA gap summary" },
  { time: "12:15 AM", task: "Summarizing findings for the CISO" },
  { time: "12:16 AM", task: "Still working" },
] as const;
export const VILLA_FINAL_INDEX = villaSteps.length - 1;
export function villaStepAt(elapsed: number) {
  return Math.min(VILLA_FINAL_INDEX, Math.max(0, Math.floor(elapsed / VILLA_STEP_MS)));
}
export function shouldPlayVillaSequence(reduced: boolean, storage: Pick<Storage, "getItem" | "setItem">) {
  if (reduced) return false;
  try {
    if (storage.getItem(VILLA_SESSION_KEY)) return false;
    storage.setItem(VILLA_SESSION_KEY, "1");
  } catch { /* Restricted storage must not prevent the scene from rendering. */ }
  return true;
}