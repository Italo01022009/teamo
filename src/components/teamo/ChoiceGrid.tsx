import { Check } from "lucide-react";
import { type ReactNode } from "react";

interface Props<T extends string> {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T | T[];
  onChange: (v: T) => void;
  multi?: boolean;
  columns?: 2 | 3;
}

export function ChoiceGrid<T extends string>({
  options,
  value,
  onChange,
  multi,
  columns = 2,
}: Props<T>) {
  const isSelected = (v: T) =>
    multi ? (value as T[]).includes(v) : value === v;
  return (
    <div className={`grid gap-2 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {options.map((o) => {
        const sel = isSelected(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`relative flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 text-sm font-medium transition-all ${
              sel
                ? "border-primary bg-primary-soft text-primary shadow-sm"
                : "border-border bg-card text-foreground hover:border-primary/40"
            }`}
          >
            {sel && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
            {o.icon}
            <span className="text-center leading-tight">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
