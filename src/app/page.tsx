import Image from "next/image";
import { homestays } from "@/data/homestays";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[520px] sm:min-h-[600px] flex items-center grain-overlay">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1559628233-100c798642d4?w=1600&h=900&fit=crop"
          alt="Tropical beach kampung with palm trees and crystal clear water"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        {/* Warm overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32 relative z-10">
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight max-w-3xl">
            Find Your Perfect Homestay
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
            Browse real local homestays from real owners. Simple, friendly, and
            direct — no middleman, no fuss.
          </p>
          <a
            href="/directory"
            className="inline-block px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Browse Homestays
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-center mb-4">
          Why MyHomestay?
        </h2>
        <p className="text-muted text-center mb-16 max-w-xl mx-auto">
          We keep it simple so you can focus on finding the right place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Real Local Homes</h3>
            <p className="text-muted text-sm leading-relaxed">
              Every listing is a real homestay from a real owner — kampung houses, villas, and cozy retreats.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Direct WhatsApp Contact</h3>
            <p className="text-muted text-sm leading-relaxed">
              Message the owner directly — no booking forms, no waiting. Just a quick chat to confirm.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center text-sand">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Clear Pricing</h3>
            <p className="text-muted text-sm leading-relaxed">
              See the price upfront — no hidden fees, no surprises. What you see is what you pay.
            </p>
          </div>
        </div>
      </section>

      {/* Homestay Preview Section */}
      <section className="border-t border-soft-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold mb-2">
                Featured Homestays
              </h2>
              <p className="text-muted">A taste of what&apos;s waiting for you.</p>
            </div>
            <a
              href="/directory"
              className="hidden sm:inline-block text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200"
            >
              View all &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {homestays.slice(0, 3).map((homestay) => (
              <a
                key={homestay.id}
                href={`/directory/${homestay.id}`}
                className="group rounded-lg overflow-hidden bg-white border border-soft-border shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="relative w-full h-52 overflow-hidden">
                  <Image
                    src={homestay.image}
                    alt={homestay.name}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-md">
                    <span className="text-sm font-bold text-accent">
                      RM{homestay.price}
                    </span>
                    <span className="text-xs text-muted">/night</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-200">
                    {homestay.name}
                  </h3>
                  <p className="text-sm text-muted mb-3">{homestay.location}</p>
                  <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View details &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <a
              href="/directory"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-200"
            >
              View All Homestays
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
