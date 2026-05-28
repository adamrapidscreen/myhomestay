import type { Metadata } from "next";
import Link from "next/link";
import { ListingBuilder } from "../listing-builder";

export const metadata: Metadata = {
  title: "New listing",
};

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
          Owner workspace
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Create a new listing
        </h1>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-muted-ink">
          Start as a draft. Save anytime. You can publish from your dashboard
          once you have at least 3 photos selected and the essentials filled
          in.
        </p>
        <Link
          href="/dashboard"
          className="mt-3 inline-flex text-sm text-muted-ink underline-offset-4 hover:text-ink hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
      <ListingBuilder listing={null} isNew />
    </div>
  );
}
