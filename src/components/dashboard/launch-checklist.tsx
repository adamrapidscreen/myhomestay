import Link from "next/link";
import type { LaunchCheck, LaunchChecklistResult } from "@/lib/launch-checks";

/**
 * Owner Trust Checklist UI.
 *
 * Display-only. The compact variant shows a single progress line; the full
 * variant shows each check with a status icon, label, hint, and action link.
 * Tone never relies on color alone: every row carries a text icon glyph.
 */

const TONE_STYLES: Record<
  LaunchCheck["tone"],
  { icon: string; iconClass: string; labelClass: string }
> = {
  leaf: { icon: "✓", iconClass: "text-deep-leaf", labelClass: "text-ink" },
  clay: { icon: "!", iconClass: "text-clay", labelClass: "text-ink" },
  river: { icon: "→", iconClass: "text-muted-ink", labelClass: "text-ink" },
};

export function LaunchChecklistSummary({
  result,
}: {
  result: LaunchChecklistResult;
}) {
  return (
    <p className="text-sm">
      <span
        className={`font-medium tabular-nums ${
          result.allComplete ? "text-deep-leaf" : "text-clay"
        }`}
      >
        {result.completeCount} of {result.totalCount}
      </span>{" "}
      <span className="text-muted-ink">launch checks complete</span>
    </p>
  );
}

export function LaunchChecklist({ result }: { result: LaunchChecklistResult }) {
  return (
    <div>
      <LaunchChecklistSummary result={result} />
      <ul className="mt-4 space-y-2">
        {result.checks.map((check) => {
          const tone = TONE_STYLES[check.tone];
          return (
            <li
              key={check.id}
              className="flex items-start gap-3 rounded-control border border-stone bg-white p-3"
            >
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-stone text-xs font-bold ${tone.iconClass}`}
              >
                {check.done ? "✓" : tone.icon}
              </span>
              <span className="sr-only">
                {check.done ? "Complete:" : "To do:"}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${tone.labelClass}`}>
                  {check.label}
                </p>
                {!check.done && check.hint && (
                  <p className="mt-0.5 text-xs text-muted-ink">{check.hint}</p>
                )}
              </div>
              {!check.done && check.actionHref && (
                <Link
                  href={check.actionHref}
                  className="flex-none self-center text-xs font-medium text-river underline-offset-4 hover:underline"
                >
                  Fix
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
