import type { ListingPhoto } from "@/types/photos";

/**
 * Listing photo gallery.
 *
 * Mock photo paths under /mock/... are not yet served. Until real
 * Supabase Storage lands in Chapter 4, this renders typed placeholder
 * panels labelled by photo category. Layout, ratios, and accessibility
 * are real so swapping in <Image /> later is mechanical.
 */
interface ListingGalleryProps {
  photos: ListingPhoto[];
}

const CATEGORY_LABELS: Record<ListingPhoto["category"], string> = {
  exterior: "Exterior",
  bedroom: "Bedroom",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  living: "Living area",
  surrounding: "Surrounding area",
  other: "Photo",
};

export function ListingGallery({ photos }: ListingGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-card border border-dashed border-stone bg-rice text-sm text-muted-ink">
        No photos yet
      </div>
    );
  }

  const ordered = [...photos].sort((a, b) => a.order - b.order);
  const [hero, ...rest] = ordered;
  const sideShots = rest.slice(0, 4);

  return (
    <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
      <PhotoTile
        photo={hero}
        className="sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto"
      />
      {sideShots.map((photo) => (
        <PhotoTile
          key={photo.id}
          photo={photo}
          className="aspect-[4/3] sm:aspect-auto"
        />
      ))}
    </div>
  );
}

function PhotoTile({
  photo,
  className,
}: {
  photo: ListingPhoto;
  className?: string;
}) {
  return (
    <figure
      className={`relative flex w-full items-end overflow-hidden rounded-card border border-stone bg-rice p-3 ${className ?? ""}`}
    >
      <figcaption className="rounded-full bg-white/85 px-2 py-1 text-xs text-muted-ink">
        {CATEGORY_LABELS[photo.category]}
      </figcaption>
      <span className="sr-only">{photo.alt}</span>
    </figure>
  );
}
