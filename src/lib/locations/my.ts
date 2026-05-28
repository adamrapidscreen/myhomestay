import type {
  MalaysiaLocation,
  MalaysianState,
} from "@/types/locations";

/**
 * Malaysia location helpers.
 *
 * Provides display formatting and a small starter list of states for
 * directory filtering. Reference data should grow as real listings
 * arrive; this file is the seed.
 */

/** Display label for each Malaysian state, including federal territories. */
export const MALAYSIAN_STATE_LABELS: Record<MalaysianState, string> = {
  johor: "Johor",
  kedah: "Kedah",
  kelantan: "Kelantan",
  melaka: "Melaka",
  "negeri-sembilan": "Negeri Sembilan",
  pahang: "Pahang",
  perak: "Perak",
  perlis: "Perlis",
  "pulau-pinang": "Pulau Pinang",
  sabah: "Sabah",
  sarawak: "Sarawak",
  selangor: "Selangor",
  terengganu: "Terengganu",
  "wp-kuala-lumpur": "Wilayah Persekutuan Kuala Lumpur",
  "wp-labuan": "Wilayah Persekutuan Labuan",
  "wp-putrajaya": "Wilayah Persekutuan Putrajaya",
};

/** Ordered list of all Malaysian states for filter UIs. */
export const MALAYSIAN_STATES: MalaysianState[] = [
  "johor",
  "kedah",
  "kelantan",
  "melaka",
  "negeri-sembilan",
  "pahang",
  "perak",
  "perlis",
  "pulau-pinang",
  "sabah",
  "sarawak",
  "selangor",
  "terengganu",
  "wp-kuala-lumpur",
  "wp-labuan",
  "wp-putrajaya",
];

/** Get the display label for a state slug. */
export function formatStateLabel(state: MalaysianState): string {
  return MALAYSIAN_STATE_LABELS[state];
}

/**
 * Format a location for compact display, e.g. listing card.
 *
 * Examples:
 *   "Balik Pulau, Pulau Pinang"
 *   "Kampung Padang Kuala Besut, Terengganu"
 */
export function formatLocationCompact(location: MalaysiaLocation): string {
  const stateLabel = formatStateLabel(location.state);
  return `${location.area}, ${stateLabel}`;
}

/**
 * Format a location for detail display.
 *
 * Includes town when meaningfully different from area.
 *
 *   "Balik Pulau · Balik Pulau, Pulau Pinang" -> collapses repeats
 *   "Kampung Padang Kuala Besut · Kuala Besut, Terengganu"
 */
export function formatLocationDetail(location: MalaysiaLocation): string {
  const stateLabel = formatStateLabel(location.state);
  const hasDistinctTown =
    location.town && location.town.toLowerCase() !== location.area.toLowerCase();
  if (hasDistinctTown) {
    return `${location.area} · ${location.town}, ${stateLabel}`;
  }
  return `${location.area}, ${stateLabel}`;
}

/** Check whether a value is a valid Malaysian state slug. */
export function isMalaysianState(value: string): value is MalaysianState {
  return (MALAYSIAN_STATES as string[]).includes(value);
}
