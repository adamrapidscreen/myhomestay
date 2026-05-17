import Image from "next/image";
import { homestays } from "@/data/homestays";

export default function DirectoryPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
      {/* Page header */}
      <div className="mb-14">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold mb-3">
          Browse Homestays
        </h1>
        <p className="text-muted text-lg">
          Find a place that feels like home. Contact owners directly via WhatsApp.
        </p>
      </div>

      {/* Responsive card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {homestays.map((homestay) => (
          <a
            key={homestay.id}
            href={`/directory/${homestay.id}`}
            className="group rounded-lg overflow-hidden bg-white border border-soft-border shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            {/* Card image */}
            <div className="relative w-full h-56 overflow-hidden">
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

            {/* Card content */}
            <div className="p-5">
              <h2 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-200">
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
                    className="text-xs bg-sand-light text-foreground px-3 py-1 rounded-md font-medium"
                  >
                    {facility}
                  </span>
                ))}
                {homestay.facilities.length > 3 && (
                  <span className="text-xs text-muted px-2 py-1">
                    +{homestay.facilities.length - 3} more
                  </span>
                )}
              </div>

              {/* View details row */}
              <div className="flex items-center justify-between pt-4 border-t border-soft-border">
                <span className="text-sm text-muted">
                  {homestay.availableDates.split(" ").slice(0, 2).join(" ")}
                </span>
                <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-1.5">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
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
