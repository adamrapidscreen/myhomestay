"use client";

import { useRef, useState, useTransition } from "react";
import {
  uploadListingPhotosAction,
  setPhotoCategoryAction,
  deleteListingPhotoAction,
} from "@/app/dashboard/listings/[id]/photos/actions";

const CATEGORIES = [
  "exterior",
  "bedroom",
  "bathroom",
  "kitchen",
  "living",
  "surrounding",
  "other",
] as const;

const ACCEPT = "image/jpeg,image/png,image/webp";
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const MIN_PHOTOS = 3;

export interface PhotoManagerItem {
  id: string;
  url: string | null;
  category: string;
  sortOrder: number;
}

interface PhotoManagerProps {
  listingId: string;
  photos: PhotoManagerItem[];
}

export function PhotoManager({ listingId, photos }: PhotoManagerProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const total = photos.length + pendingCount;
  const met = photos.length >= MIN_PHOTOS;

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const localErrors: string[] = [];
    const valid: File[] = [];
    for (const f of files) {
      if (!ALLOWED.has(f.type)) {
        localErrors.push(`JPG, PNG, or WebP only. "${f.name}" wasn't added.`);
      } else if (f.size > MAX_BYTES) {
        const mb = (f.size / 1024 / 1024).toFixed(1);
        localErrors.push(`Photos must be 5 MB or smaller. "${f.name}" is ${mb} MB.`);
      } else {
        valid.push(f);
      }
    }
    setErrors(localErrors);
    if (valid.length === 0) return;

    const fd = new FormData();
    valid.forEach((f) => fd.append("photos", f));
    setPendingCount(valid.length);
    startTransition(async () => {
      const res = await uploadListingPhotosAction(listingId, fd);
      setPendingCount(0);
      if (res.errors.length > 0) {
        setErrors((prev) => [...prev, ...res.errors]);
      }
    });
  }

  function onCategory(photoId: string, category: string) {
    startTransition(async () => {
      await setPhotoCategoryAction(listingId, photoId, category);
    });
  }

  function onDelete(photoId: string) {
    setConfirmId(null);
    startTransition(async () => {
      const res = await deleteListingPhotoAction(listingId, photoId);
      if (!res.ok && res.error) setErrors((prev) => [...prev, res.error!]);
      inputRef.current?.focus();
    });
  }

  return (
    <section className="space-y-4 rounded-card border border-stone bg-white p-4 sm:p-6">
      <header className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg text-ink">Photos</h2>
          <p className="mt-1 text-xs text-muted-ink">
            Add at least 3 bright photos of the actual rooms.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 sm:text-right">
          <div
            aria-hidden
            className="h-1.5 w-full overflow-hidden rounded-full bg-stone sm:w-48"
          >
            <div
              className="h-full rounded-full bg-leaf transition-[width] duration-200"
              style={{ width: `${Math.min(100, (photos.length / MIN_PHOTOS) * 100)}%` }}
            />
          </div>
          <p className={`mt-1 text-xs ${met ? "text-deep-leaf" : "text-muted-ink"}`}>
            {met
              ? `Ready to publish · ${photos.length} photos`
              : `${photos.length} of ${MIN_PHOTOS} minimum`}
          </p>
        </div>
      </header>

      {errors.length > 0 && (
        <ul className="space-y-2">
          {errors.map((err, i) => (
            <li
              key={i}
              role="alert"
              className="rounded-control border border-danger bg-rice px-3 py-2 text-sm text-danger"
            >
              {err}
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label
          className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-control border border-dashed border-stone text-leaf hover:bg-rice focus-within:outline-2 focus-within:outline-leaf"
        >
          <span aria-hidden className="text-2xl leading-none">+</span>
          <span className="mt-1 text-xs font-medium">Add photos</span>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            onChange={onPick}
            disabled={isPending}
            className="sr-only"
          />
        </label>

        {Array.from({ length: pendingCount }).map((_, i) => (
          <div
            key={`pending-${i}`}
            className="flex aspect-[4/3] items-center justify-center rounded-control border border-stone bg-rice text-xs text-muted-ink opacity-60"
          >
            Uploading…
          </div>
        ))}

        {photos.map((photo, idx) => (
          <div key={photo.id} className="min-w-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-control border border-stone bg-rice">
              {photo.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo.url}
                  alt={`Listing photo ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-ink">
                  Preview unavailable
                </div>
              )}
              {idx === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/85 px-2 py-0.5 text-[10px] font-medium text-paper">
                  Cover
                </span>
              )}
              {confirmId === photo.id ? (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/70 text-xs">
                  <button
                    type="button"
                    onClick={() => onDelete(photo.id)}
                    className="rounded-control bg-danger px-2 py-1 font-medium text-paper"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="rounded-control bg-paper px-2 py-1 font-medium text-ink"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label={`Remove photo ${idx + 1}`}
                  onClick={() => setConfirmId(photo.id)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-ink/85 px-2 py-0.5 text-xs text-paper hover:bg-ink"
                >
                  ✕
                </button>
              )}
            </div>
            <label className="sr-only" htmlFor={`cat-${photo.id}`}>
              Category for photo {idx + 1}
            </label>
            <select
              id={`cat-${photo.id}`}
              defaultValue={photo.category}
              onChange={(e) => onCategory(photo.id, e.target.value)}
              disabled={isPending}
              className="mt-2 w-full min-w-0 rounded-control border border-stone bg-white px-2 py-1.5 text-sm text-ink"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {total} photo{total === 1 ? "" : "s"} on this listing.
      </p>
    </section>
  );
}
