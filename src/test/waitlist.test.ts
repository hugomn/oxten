import { describe, expect, it } from "vitest";
import { waitlistSchema } from "@/lib/waitlist-schema";
describe("Work email waitlist", () => {
  it("accepts a work email", () => {
    expect(waitlistSchema.parse({ email: "leader@enterprise.com" }).email).toBe(
      "leader@enterprise.com",
    );
  });
  it("rejects personal email", () => {
    expect(waitlistSchema.safeParse({ email: "leader@gmail.com" }).success).toBe(false);
  });
  it("rejects malformed email", () => {
    expect(waitlistSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
  it("normalizes email for uniqueness", () => {
    expect(waitlistSchema.parse({ email: " Leader@Enterprise.com " }).email).toBe(
      "leader@enterprise.com",
    );
  });
});
