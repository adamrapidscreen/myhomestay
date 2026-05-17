import Image from "next/image";
import { notFound } from "next/navigation";
import { homestays } from "@/data/homestays";

// Pre-generate pages for all homestays at build time
export async function generateStaticParams() {
  return homestays.map((homestay) => ({
    id: homestay.id,
  }));
}

export default async function HomestayDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const homestay = homestays.find((h) => h.id === id);

  if (!homestay) {
    notFound();
  }

  // Build WhatsApp URL with prefilled message
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in your homestay "${homestay.name}" listed on MyHomestay. Is it available?`
  );
  const whatsappUrl = `https://wa.me/${homestay.ownerWhatsApp}?text=${whatsappMessage}`;

  return (
    <section className="max-w-4xl mx-auto px-6 py-10 sm:py-16">
      {/* Back link */}
      <a
        href="/directory"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors mb-8 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to all homestays
      </a>

      {/* Hero image */}
      <div className="relative w-full h-64 sm:h-80 md:h-[440px] rounded-2xl overflow-hidden mb-10 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        <Image
          src={homestay.image}
          alt={homestay.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Key info header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">{homestay.name}</h1>
            <p className="text-muted text-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {homestay.location}
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/15 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-3xl font-extrabold text-accent">
              RM{homestay.price}
            </span>
            <span className="text-muted text-sm"> /night</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-10 p-7 bg-white rounded-2xl border border-soft-border shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold mb-3">About this place</h2>
        <p className="text-muted leading-relaxed text-[15px]">{homestay.description}</p>
      </div>

      {/* Facilities */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-5">Facilities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {homestay.facilities.map((facility) => (
            <div
              key={facility}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-soft-border shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(14,165,233,0.08)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-sm font-semibold">{facility}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available dates */}
      <div className="mb-14 p-7 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-2xl">
        <h2 className="text-xl font-bold mb-3">Availability</h2>
        <p className="text-muted flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          {homestay.availableDates}
        </p>
      </div>

      {/* WhatsApp contact button — sticky on mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-soft-border sm:static sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0 z-40">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full sm:w-auto sm:inline-flex px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-[0_8px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_40px_rgba(34,197,94,0.4)] hover:-translate-y-1 transition-all duration-300 text-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contact via WhatsApp
        </a>
      </div>

      {/* Spacer for fixed bottom bar on mobile */}
      <div className="h-24 sm:hidden" />
    </section>
  );
}
