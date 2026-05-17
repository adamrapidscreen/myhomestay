import Image from "next/image";
import { homestays } from "@/data/homestays";

export default function DirectoryPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Browse Homestays</h1>
        <p className="text-muted text-lg">
          Find a place that feels like home. Contact owners directly via WhatsApp.
        </p>
      </div>

      {/* Responsive card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {homestays.map((homestay) => (
          <a
            key={homestay.id}
            href={`/directory/${homestay.id}`}
            className="group rounded-2xl overflow-hidden bg-white border border-soft-border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300"
          >
            {/* Card image */}
            <div className="relative w-full h-56 overflow-hidden">
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
              {/* Bottom gradient for text readability */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Card content */}
            <div className="p-6">
              <h2 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                {homestay.name}
              </h2>
              <p className="text-sm text-muted mb-4 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {homestay.location}
              </p>

              {/* Facilities preview */}
              <div className="flex flex-wrap gap-2 mb-5">
                {homestay.facilities.slice(0, 3).map((facility) => (
                  <span
                    key={facility}
                    className="text-xs bg-gradient-to-r from-primary/5 to-primary/10 text-primary border border-primary/15 px-3 py-1.5 rounded-full font-medium"
                  >
                    {facility}
                  </span>
                ))}
                {homestay.facilities.length > 3 && (
                  <span className="text-xs text-muted px-2.5 py-1.5">
                    +{homestay.facilities.length - 3} more
                  </span>
                )}
              </div>

              {/* View details row */}
              <div className="flex items-center justify-between pt-5 border-t border-soft-border">
                <span className="text-sm text-muted">
                  {homestay.availableDates.split(" ").slice(0, 2).join(" ")}
                </span>
                <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1.5">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
