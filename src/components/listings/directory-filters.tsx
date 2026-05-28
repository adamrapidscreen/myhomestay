"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  MALAYSIAN_STATES,
  formatStateLabel,
} from "@/lib/locations/my";

/**
 * Directory filters.
 *
 * Drives `/listings` via URL search params so links are shareable and
 * the server can render the filtered list. Submission and reset both
 * use `router.replace` to avoid bloating browser history.
 */
export function DirectoryFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(formData: FormData) {
    const next = new URLSearchParams();
    const set = (key: string, value: string | null) => {
      if (value && value.length > 0) next.set(key, value);
    };

    set("q", String(formData.get("q") ?? "").trim());
    set("state", String(formData.get("state") ?? ""));
    set("capacity", String(formData.get("capacity") ?? ""));
    set("maxPrice", String(formData.get("maxPrice") ?? ""));
    if (formData.get("muslim") === "on") next.set("muslim", "1");
    if (formData.get("family") === "on") next.set("family", "1");

    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/listings?${qs}` : "/listings");
    });
  }

  function reset() {
    startTransition(() => {
      router.replace("/listings");
    });
  }

  // Pre-fill from URL so the form mirrors current state.
  const q = params.get("q") ?? "";
  const state = params.get("state") ?? "";
  const capacity = params.get("capacity") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const muslim = params.get("muslim") === "1";
  const family = params.get("family") === "1";

  return (
    <form
      action={update}
      className="flex flex-col gap-4 rounded-card border border-stone bg-white p-4 sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-ink sm:col-span-2">
          Search
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Area, town, or stay name"
            className="rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted-ink focus:outline-none focus:ring-2 focus:ring-leaf"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-ink">
          State
          <select
            name="state"
            defaultValue={state}
            className="rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-leaf"
          >
            <option value="">Any state</option>
            {MALAYSIAN_STATES.map((slug) => (
              <option key={slug} value={slug}>
                {formatStateLabel(slug)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-ink">
          Min capacity
          <input
            type="number"
            name="capacity"
            min={1}
            defaultValue={capacity}
            placeholder="Guests"
            className="rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-leaf"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-ink">
          Max price / night
          <input
            type="number"
            name="maxPrice"
            min={1}
            defaultValue={maxPrice}
            placeholder="RM"
            className="rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-leaf"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="muslim"
            defaultChecked={muslim}
            className="h-4 w-4 rounded border-stone text-leaf focus:ring-leaf"
          />
          Muslim-friendly
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="family"
            defaultChecked={family}
            className="h-4 w-4 rounded border-stone text-leaf focus:ring-leaf"
          />
          Family-friendly
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-control bg-leaf px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf disabled:opacity-60"
        >
          {pending ? "Filtering…" : "Apply filters"}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={pending}
          className="inline-flex items-center justify-center rounded-control border border-stone bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-rice disabled:opacity-60"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
