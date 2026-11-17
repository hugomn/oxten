import { describe, expect, it } from "vitest";
import { shouldPlayVillaSequence, villaStepAt, VILLA_FINAL_INDEX, VILLA_FADE_OUT_MS, VILLA_FADE_IN_MS } from "@/lib/villa-sequence";

describe("villa sequence behavior", () => {
  it("holds each of 20 steps for 1.5 seconds", () => {
    for (let step = 0; step < 20; step++) {
      expect(villaStepAt(step * 1500)).toBe(step);
      expect(villaStepAt(step * 1500 + 1499)).toBe(step);
    }
  });
  it("holds the final state permanently after 30 seconds without looping", () => {
    expect(villaStepAt(30000)).toBe(20);
    expect(villaStepAt(600000)).toBe(VILLA_FINAL_INDEX);
  });
  it("finishes the old text's 120ms fade before the new text's 150ms entrance", () => {
    expect(VILLA_FADE_OUT_MS).toBe(120);
    expect(VILLA_FADE_IN_MS).toBe(150);
  });
  it("plays only on the first load in a session", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
    expect(shouldPlayVillaSequence(false, storage)).toBe(true);
    expect(shouldPlayVillaSequence(false, storage)).toBe(false);
  });
  it("skips the sequence for reduced motion", () => {
    expect(shouldPlayVillaSequence(true, { getItem: () => null, setItem: () => { throw new Error("must not write"); } })).toBe(false);
  });
  it("still renders when storage is unavailable", () => {
    expect(shouldPlayVillaSequence(false, { getItem: () => { throw new Error("blocked"); }, setItem: () => {} })).toBe(true);
  });
});