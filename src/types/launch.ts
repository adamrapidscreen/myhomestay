/**
 * Launch Bloom Pack types.
 *
 * Owner-managed local guide items and public listing reports. These mirror
 * the Supabase tables added in migration 0012. No payment, booking, account,
 * review, or verification semantics live here.
 */

/** Allowlisted local guide categories. Matches guide_item_category enum. */
export type GuideItemCategory =
  | "food"
  | "mosque-surau"
  | "groceries"
  | "attraction"
  | "transport"
  | "check-in"
  | "local-tip"
  | "other";

/** A single owner-authored local guide item. */
export interface GuideItem {
  id: string;
  listingId: string;
  category: GuideItemCategory;
  title: string;
  note: string;
  /** Optional free-text distance hint, e.g. "5 min drive". */
  distanceLabel?: string;
  isPublic: boolean;
  sortOrder: number;
}

/** Public-safe guide item shape returned by the published-items RPC. */
export interface PublicGuideItem {
  id: string;
  category: GuideItemCategory;
  title: string;
  note: string;
  distanceLabel?: string;
  sortOrder: number;
}

/** Allowlisted report reasons. Matches listing_report_reason enum. */
export type ListingReportReason =
  | "misleading"
  | "inappropriate"
  | "not-real-place"
  | "scam-phishing"
  | "other";

/** Report lifecycle status. Matches listing_report_status enum. */
export type ListingReportStatus = "new" | "reviewed" | "dismissed";

/** Admin-facing report row. Never exposed to owners or the public. */
export interface ListingReport {
  id: string;
  listingId: string;
  reason: ListingReportReason;
  details: string;
  reporterContact?: string;
  status: ListingReportStatus;
  createdAt: string;
}
