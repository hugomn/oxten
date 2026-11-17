import { useEffect, useState } from "react";

const groups = {
  type: ["instrument", "bricolage", "bebas"],
  palette: ["glasshouse", "sage", "paper", "vanilla"],
} as const;

type Group = keyof typeof groups;

// Review tool for comparing design variants. Remove before launch.
export function VariantSwitcher() {
  const [state, setState] = useState<Record<Group, string>>({
    type: "instrument",
    palette: "glasshouse",
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = { ...state };
    (Object.keys(groups) as Group[]).forEach((group) => {
      const value = params.get(group) ?? window.localStorage.getItem(`oxten-v2-${group}`);
      if (value && (groups[group] as readonly string[]).includes(value)) next[group] = value;
    });
    setState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    (Object.keys(groups) as Group[]).forEach((group) => {
      document.documentElement.dataset[group] = state[group];
      window.localStorage.setItem(`oxten-v2-${group}`, state[group]);
    });
  }, [state]);
  return (
    <div className="variant-switcher">
      {(Object.keys(groups) as Group[]).map((group) => (
        <div key={group}>
          <span>{group}</span>
          {groups[group].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={state[group] === value}
              onClick={() => setState((s) => ({ ...s, [group]: value }))}
            >
              {value}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
