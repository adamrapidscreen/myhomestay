import Link from "next/link";
import { listMockListingsByStatus } from "@/data/listings";
import { formatLocationCompact } from "@/lib/locations/my";

export default function HomePage() {
  const published = listMockListingsByStatus("published");
  const featured = published[0];
  const featuredHref = featured ? `/listings/${featured.slug}` : "/listings";

  return (
    <main className="min-h-screen">
      <header className="border-b border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-medium tracking-tight text-ink">
              MyHomestay
            </span>
            <span className="rounded-full bg-rice px-2 py-0.5 text-xs font-medium text-muted-ink">
              Beta
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-ink sm:flex">
            <Link href="/listings" className="hover:text-ink">
              Browse stays
            </Link>
            <Link href="/dashboard" className="hover:text-ink">
              For owners
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-public px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
              Malaysia · For homestay owners
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl md:text-[3.4rem]">
              Set up your homestay page,{" "}
              <span className="text-leaf">share the link,</span>{" "}
              continue on WhatsApp.
            </h1>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-ink">
              MyHomestay is a quiet owner tool for local operators. Publish a
              trustworthy listing, share the link on WhatsApp, Facebook, TikTok
              or Google Maps. Booking and payment stay between you and your
              guest.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/dashboard/onboarding"
                className="inline-flex items-center justify-center rounded-control bg-leaf px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf"
              >
                Create your homestay page
              </Link>
              <Link
                href={featuredHref}
                className="inline-flex items-center justify-center rounded-control border border-stone bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-rice"
              >
                See an example listing
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-ink">
              Free for early owners · Up to 3 listings · No payment platform
            </p>
          </div>

          <aside className="md:col-span-5">
            {featured ? (
              <Link
                href={`/listings/${featured.slug}`}
                className="block rounded-card border border-stone bg-white p-5 transition-colors hover:border-leaf sm:p-6"
              >
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
                  Featured listing
                </p>
                <h2 className="mt-2 font-display text-xl text-ink">
                  {featured.name}
                </h2>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-muted-ink">Status</dt>
                    <dd className="mt-1 inline-flex items-center gap-2 font-medium text-leaf">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-leaf"
                      />
                      Published
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-ink">Capacity</dt>
                    <dd className="mt-1 font-medium text-ink">
                      {featured.capacity} guests
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-muted-ink">Area</dt>
                    <dd className="mt-1 break-words font-medium text-ink">
                      {formatLocationCompact(featured.location)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-ink">Price/night</dt>
                    <dd className="mt-1 font-medium tabular-nums text-ink">
                      RM {featured.price.minPerNight} – {featured.price.maxPerNight}
                    </dd>
                  </div>
                </dl>

                <ul className="mt-5 flex flex-wrap gap-2 text-xs">
                  {featured.trust.muslimFriendly && (
                    <li className="rounded-full border border-stone bg-rice px-2.5 py-1 text-muted-ink">
                      Muslim-friendly
                    </li>
                  )}
                  {featured.trust.familyFriendly && (
                    <li className="rounded-full border border-stone bg-rice px-2.5 py-1 text-muted-ink">
                      Family-friendly
                    </li>
                  )}
                  <li className="rounded-full border border-stone bg-rice px-2.5 py-1 text-muted-ink">
                    Photos: {featured.photos.length}
                  </li>
                </ul>

                <p className="mt-5 border-t border-stone pt-4 text-sm text-muted-ink">
                  Guests will{" "}
                  <span className="font-medium text-ink">
                    WhatsApp the owner
                  </span>{" "}
                  directly. Booking and payment stay off-platform.
                </p>
              </Link>
            ) : (
              <div className="rounded-card border border-stone bg-white p-5 sm:p-6">
                <p className="text-sm text-muted-ink">
                  No published listings yet. The first owner listing will appear here.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="border-t border-stone bg-rice">
        <div className="mx-auto grid w-full max-w-public gap-8 px-4 py-12 sm:px-6 sm:py-14 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-leaf">
              Step one
            </p>
            <h3 className="mt-2 font-display text-xl text-ink">
              Add your listing
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-ink">
              Stay basics, location, photos, house rules, and Muslim-friendly
              or family-friendly notes. Save as draft any time.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-river">
              Step two
            </p>
            <h3 className="mt-2 font-display text-xl text-ink">
              Publish and share the link
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-ink">
              Share your clean public listing on WhatsApp, Facebook, TikTok, or
              Google Maps. Travellers see a calm, scannable record.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-clay">
              Step three
            </p>
            <h3 className="mt-2 font-display text-xl text-ink">
              Continue on WhatsApp
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-ink">
              The WhatsApp button opens a prefilled chat with the listing
              details. Booking and payment remain between you and the guest.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public flex-col gap-2 px-4 py-8 text-xs text-muted-ink sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <span className="font-display text-sm text-ink">
              MyHomestay
            </span>
            {" · "}
            Owner-first homestay platform for Malaysia.
          </p>
          <p>Free for homestay owners in Malaysia · Beta</p>
        </div>
      </footer>
    </main>
  );
}
