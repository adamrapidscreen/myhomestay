"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GuideItem } from "@/types/launch";
import {
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_LABELS,
  GUIDE_NOTE_MAX,
  GUIDE_TITLE_MAX,
  GUIDE_DISTANCE_MAX,
} from "@/lib/local-guide";
import {
  addGuideItemAction,
  deleteGuideItemAction,
} from "@/app/dashboard/listings/[id]/launch/actions";

/**
 * Owner local-guide manager.
 *
 * Add new guide items and delete existing ones. Edits in this pack are
 * delete-and-re-add to keep the surface small; reorder/inline-edit are listed
 * as future follow-ups in the spec. All writes go through owner-scoped server
 * actions; the router refresh re-reads the RLS-bound list.
 */
interface LocalGuideManagerProps {
  listingId: string;
  items: GuideItem[];
}

export function LocalGuideManager({ listingId, items }: LocalGuideManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onAdd = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await addGuideItemAction(listingId, formData);
      if (!result.ok) {
        setError(result.error ?? "Could not add the guide item.");
        return;
      }
      router.refresh();
    });
  };

  const onDelete = (itemId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteGuideItemAction(listingId, itemId);
      if (!result.ok) {
        setError(result.error ?? "Could not delete the guide item.");
        return;
      }
      setDeletingId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5">
      {items.length === 0 ? (
        <p className="rounded-control border border-dashed border-stone bg-white p-4 text-sm text-muted-ink">
          Add one local note guests usually ask about, like a nearby surau or a
          favourite warung.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-control border border-stone bg-white p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-rice px-2 py-0.5 text-xs font-medium text-muted-ink">
                      {GUIDE_CATEGORY_LABELS[item.category]}
                    </span>
                    {!item.isPublic && (
                      <span className="rounded-full border border-stone px-2 py-0.5 text-xs text-muted-ink">
                        Hidden
                      </span>
                    )}
                    {item.distanceLabel && (
                      <span className="text-xs text-muted-ink">
                        {item.distanceLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 break-words text-sm font-medium text-ink">
                    {item.title}
                  </p>
                  {item.note && (
                    <p className="mt-0.5 break-words text-xs text-muted-ink">
                      {item.note}
                    </p>
                  )}
                </div>
                {deletingId === item.id ? (
                  <div className="flex flex-none gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => onDelete(item.id)}
                      className="rounded-control bg-danger px-2.5 py-1.5 text-xs font-medium text-paper disabled:opacity-60"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(null)}
                      className="rounded-control border border-stone bg-paper px-2.5 py-1.5 text-xs text-ink"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeletingId(item.id)}
                    className="flex-none text-xs text-muted-ink underline-offset-4 hover:text-danger hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={onAdd} className="rounded-control border border-stone bg-white p-4">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
          Add a local note
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-muted-ink">Category</span>
            <select
              name="category"
              defaultValue="local-tip"
              className="mt-1 w-full rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink"
            >
              {GUIDE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {GUIDE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-muted-ink">Distance (optional)</span>
            <input
              name="distanceLabel"
              maxLength={GUIDE_DISTANCE_MAX}
              placeholder="5 min drive"
              className="mt-1 w-full rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink"
            />
          </label>
        </div>
        <label className="mt-3 block text-sm">
          <span className="text-muted-ink">Title</span>
          <input
            name="title"
            required
            maxLength={GUIDE_TITLE_MAX}
            placeholder="Warung Pak Mat"
            className="mt-1 w-full rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-muted-ink">Note (optional)</span>
          <textarea
            name="note"
            rows={2}
            maxLength={GUIDE_NOTE_MAX}
            placeholder="Famous for nasi lemak, opens early."
            className="mt-1 w-full rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="isPublic"
            value="true"
            defaultChecked
            className="h-4 w-4 rounded border-stone"
          />
          Show this on the public listing
        </label>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 inline-flex items-center justify-center rounded-control bg-leaf px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf disabled:opacity-60"
        >
          {pending ? "Saving…" : "Add note"}
        </button>
      </form>
    </div>
  );
}
