import { describe, expect, it } from "vitest";
import { earlyAccessSchema, validateWorkEmail } from "@/lib/early-access";

describe("early access email rules", () => {
  it("rejects malformed email addresses", () => {
    expect(validateWorkEmail("not-an-email")).toBe("Please enter a valid email address.");
  });
  it.each(["gmail", "yahoo", "outlook", "hotmail", "icloud"])("rejects personal %s addresses", domain => {
    expect(validateWorkEmail(`ciso@${domain}.com`)).toBe("Please use your work email.");
  });
  it("accepts work emails", () => {
    expect(validateWorkEmail("ciso@enterprise.com")).toBeNull();
  });
  it("normalizes email casing and spaces for duplicate prevention", () => {
    expect(earlyAccessSchema.parse({ email: " CISO@Enterprise.com " }).email).toBe("ciso@enterprise.com");
  });
});