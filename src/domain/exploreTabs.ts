export const EXPLORE_TABS = ['studies', 'chapters', 'wisdom', 'saved'] as const;
export type ExploreTab = (typeof EXPLORE_TABS)[number];

/** Read the Explore tab from a URL parameter, defaulting to studies. */
export function parseExploreTab(value: string | null): ExploreTab {
  return EXPLORE_TABS.includes(value as ExploreTab) ? (value as ExploreTab) : 'studies';
}
