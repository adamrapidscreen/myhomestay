import Image from "next/image";
import { homestays } from "@/data/homestays";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[520px] sm:min-h-[620px] flex items-center">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1559628233-100c798642d4?w=1600&h=900&fit=crop"
          alt="Tropical beach kampung with palm trees and crystal clear water"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/90 mb-6">
            Your trusted homestay directory
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg leading-tight">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">Homestay</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse real local homestays from real owners. Simple, friendly, and
            direct — no middleman, no fuss.
          </p>
          <a
            href="/directory"
            className="inline-block px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl shadow-[0_8px_30px_rgba(215,38,56,0.3)] hover:shadow-[0_12px_40px_rgba(215,38,56,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            Browse Homestays
          </a>
        </div>
      </section>

      {/* Bento Feature Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-3">
          Why MyHomestay?
        </h2>
        <p className="text-muted text-center mb-14 max-w-xl mx-auto">
          We keep it simple so you can focus on finding the right place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group p-7 bg-white rounded-2xl border border-soft-border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(14,165,233,0.1)] hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Real Local Homes</h3>
            <p className="text-muted text-sm leading-relaxed">
              Every listing is a real homestay from a real owner — kampung houses, villas, and cozy retreats.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-7 bg-white rounded-2xl border border-soft-border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.1)] hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Direct WhatsApp Contact</h3>
            <p className="text-muted text-sm leading-relaxed">
              Message the owner directly — no booking forms, no waiting. Just a quick chat to confirm.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-7 bg-white rounded-2xl border border-soft-border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(215,38,56,0.08)] hover:-translate-y-1.5 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Clear Pricing</h3>
            <p className="text-muted text-sm leading-relaxed">
              See the price upfront — no hidden fees, no surprises. What you see is what you pay.
            </p>
          </div>
        </div>
      </section>

      {/* Homestay Preview Section */}
      <section className="bg-gradient-to-b from-white to-background border-y border-soft-border">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                Featured Homestays
              </h2>
              <p className="text-muted">A taste of what&apos;s waiting for you.</p>
            </div>
            <a
              href="/directory"
              className="hidden sm:inline-block text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              View all &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {homestays.slice(0, 3).map((homestay) => (
              <a
                key={homestay.id}
                href={`/directory/${homestay.id}`}
                className="group rounded-2xl overflow-hidden bg-white border border-soft-border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="relative w-full h-52 overflow-hidden">
                  <Image
                    src={homestay.image}
                    alt={homestay.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                    <span className="text-sm font-bold text-accent">
                      RM{homestay.price}
                    </span>
                    <span className="text-xs text-muted">/night</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {homestay.name}
                  </h3>
                  <p className="text-sm text-muted mb-3">{homestay.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-accent font-bold">
                      RM{homestay.price}
                      <span className="text-sm font-normal text-muted"> /night</span>
                    </span>
                    <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View &rarr;
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <a
              href="/directory"
              className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl shadow-[0_6px_20px_rgba(215,38,56,0.25)] hover:shadow-[0_8px_30px_rgba(215,38,56,0.35)] transition-all"
            >
              View All Homestays
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
