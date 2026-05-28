/**
 * Malaysia location reference shape.
 *
 * Designed to mirror the future Supabase `locations` reference table
 * without committing to keys yet. Allows owner addresses, listing
 * locations, and directory filters to share one canonical shape.
 */

export type MalaysianState =
  | "johor"
  | "kedah"
  | "kelantan"
  | "melaka"
  | "negeri-sembilan"
  | "pahang"
  | "perak"
  | "perlis"
  | "pulau-pinang"
  | "sabah"
  | "sarawak"
  | "selangor"
  | "terengganu"
  | "wp-kuala-lumpur"
  | "wp-labuan"
  | "wp-putrajaya";

export interface MalaysiaLocation {
  /** Stable slug-style id, e.g. "balik-pulau-pulau-pinang". */
  id: string;
  /** Town, mukim, or kampung-level name as displayed publicly. */
  area: string;
  /** Town or city the area sits within, when meaningful. */
  town?: string;
  /** State-level identifier. */
  state: MalaysianState;
  /** Optional postcode for owner records. Not shown publicly. */
  postcode?: string;
}
