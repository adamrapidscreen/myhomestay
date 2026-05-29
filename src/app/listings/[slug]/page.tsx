import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findPublishedListingBySlug,
  getPublicListingOwner,
} from "@/server/listings-data";
import { formatLocationDetail } from "@/lib/locations/my";
import { ListingGallery } from "@/components/listings/listing-gallery";
import { TrustStrip } from "@/components/listings/trust-strip";
import { OwnerCard } from "@/components/listings/owner-card";
import { WhatsappCta } from "@/components/listings/whatsapp-cta";

interface ListingDetailParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ListingDetailParams): Promise<Metadata> {
  const { slug } = await params;
  const listing = await findPublishedListingBySlug(slug);
  if (!listing) {
    return { title: "Listing not found" };
  }
  return {
    title: listing.name,
    description: listing.summary,
  };
}

export default async function ListingDetailPage({ params }: ListingDetailParams) {
  const { slug } = await params;
  const listing = await findPublishedListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const owner = await getPublicListingOwner(listing.id);
  if (!owner) notFound();

  return (
    <main className="min-h-screen pb-24 sm:pb-0">
      <header className="border-b border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-medium tracking-tight text-ink">
              MyHomestay
            </span>
            <span className="rounded-full bg-rice px-2 py-0.5 text-xs font-medium text-muted-ink">
              Beta
            </span>
          </Link>
          <Link
            href="/listings"
            className="text-sm text-ink underline-offset-4 hover:underline"
          >
            ← Browse stays
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-public px-4 pt-8 pb-12 sm:px-6 sm:pt-10">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
          {formatLocationDetail(listing.location)}
        </p>
        <h1 className="mt-2 break-words font-display text-3xl leading-tight text-ink sm:text-4xl">
          {listing.name}
        </h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-ink">
          {listing.summary}
        </p>

        <div className="mt-6">
          <TrustStrip listing={listing} />
        </div>

        <div className="mt-6">
          <ListingGallery photos={listing.photos} />
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-1">
            <section>
              <h2 className="font-display text-xl text-ink">
                The stay
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted-ink">Capacity</dt>
                  <dd className="mt-1 font-medium text-ink">
                    {listing.capacity} guests
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-ink">Bedrooms</dt>
                  <dd className="mt-1 font-medium text-ink">
                    {listing.bedrooms}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-ink">Price/night</dt>
                  <dd className="mt-1 font-medium tabular-nums text-ink">
                    RM {listing.price.minPerNight} – {listing.price.maxPerNight}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-muted-ink">Area</dt>
                  <dd className="mt-1 break-words font-medium text-ink">
                    {formatLocationDetail(listing.location)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-xl text-ink">
                About this homestay
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink">
                {listing.description}
              </p>
            </section>

            {listing.amenities.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl text-ink">
                  Amenities
                </h2>
                <ul className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                  {listing.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-control border border-stone bg-white px-3 py-2 text-ink"
                    >
                      {amenity.replace(/-/g, " ")}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {listing.houseRules.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl text-ink">
                  House rules
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {listing.houseRules.map((rule, i) => (
                    <li
                      key={i}
                      className="flex gap-2 border-l-2 border-stone pl-3"
                    >
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="md:col-span-5 md:col-start-8">
            <div className="md:sticky md:top-6 md:space-y-4">
              <OwnerCard owner={owner} />
              <div className="rounded-card border border-stone bg-rice p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
                  Continue on WhatsApp
                </p>
                <p className="mt-2 text-sm text-ink">
                  Message {owner.displayName} with your dates and group size.
                  The owner will confirm availability and total price.
                </p>
                <div className="mt-4">
                  <WhatsappCta listing={listing} owner={owner} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <WhatsappCta listing={listing} owner={owner} variant="sticky" />

      <footer className="border-t border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public flex-col gap-2 px-4 py-8 text-xs text-muted-ink sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <span className="font-display text-sm text-ink">
              MyHomestay
            </span>
            {" · "}
            Listings are owner-created. MyHomestay does not handle payment.
          </p>
          <p>Public listing · Beta</p>
        </div>
      </footer>
    </main>
  );
}
