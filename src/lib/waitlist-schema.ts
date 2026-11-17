import { z } from "zod";

const personalDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "mail.com",
  "gmx.com",
  "yandex.com",
]);
export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "Please enter a valid work email.")
    .email("Please enter a valid work email.")
    .refine(
      (email) => !personalDomains.has(email.split("@")[1] ?? ""),
      "Please use your work email, not a personal email.",
    ),
});
