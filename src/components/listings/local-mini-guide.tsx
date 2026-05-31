import type { PublicGuideItem } from "@/types/launch";
import { GUIDE_CATEGORY_LABELS } from "@/lib/local-guide";

/**
 * Public local mini-guide section for the listing detail page.
 *
 * Renders owner-authored nearby notes as grouped compact rows (not cards
 * inside cards). Hidden entirely when there are no public items, so an empty
 * guide never creates public clutter.
 */
export function LocalMiniGuide({ items }: { items: PublicGuideItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl text-ink">Nearby and local notes</h2>
      <p className="mt-1 text-sm text-muted-ink">
        Shared by the owner. Distances are approximate.
      </p>
      <ul className="mt-4 divide-y divide-stone border-y border-stone">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 py-3">
            <span className="mt-0.5 flex-none rounded-full bg-rice px-2 py-0.5 text-xs font-medium text-muted-ink">
              {GUIDE_CATEGORY_LABELS[item.category]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-medium text-ink">
                {item.title}
                {item.distanceLabel && (
                  <span className="ml-2 font-normal text-muted-ink">
                    · {item.distanceLabel}
                  </span>
                )}
              </p>
              {item.note && (
                <p className="mt-0.5 break-words text-sm text-muted-ink">
                  {item.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
