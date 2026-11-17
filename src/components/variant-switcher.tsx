import { useEffect, useState } from "react";

const options = ["serif", "sans"] as const;

// Review tool for comparing the two headline typefaces. Remove before launch.
export function VariantSwitcher() {
  const [type, setType] = useState<string>("serif");
  useEffect(() => {
    const value =
      new URLSearchParams(window.location.search).get("type") ??
      window.localStorage.getItem("oxten-v3-type");
    if (value && (options as readonly string[]).includes(value)) setType(value);
  }, []);
  useEffect(() => {
    document.documentElement.dataset["type"] = type;
    window.localStorage.setItem("oxten-v3-type", type);
  }, [type]);
  return (
    <div className="variant-switcher">
      <span>Headlines</span>
      {options.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={type === value}
          onClick={() => setType(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
