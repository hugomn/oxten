import { z } from "zod";

const personalDomains = new Set(["gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "outlook.com", "hotmail.com", "hotmail.co.uk", "icloud.com", "me.com", "live.com"]);

export function validateWorkEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (!z.string().email().max(254).safeParse(email).success) return "Please enter a valid email address.";
  if (personalDomains.has(email.split("@")[1] ?? "")) return "Please use your work email.";
  return null;
}

export const earlyAccessSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  website: z.string().max(200).default(""),
}).superRefine(({ email }, context) => {
  const error = validateWorkEmail(email);
  if (error) context.addIssue({ code: z.ZodIssueCode.custom, message: error, path: ["email"] });
});