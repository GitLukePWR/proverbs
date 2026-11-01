import { describe, expect, it } from 'vitest';
import { parseExploreTab } from './exploreTabs';

describe('parseExploreTab', () => {
  it('accepts known tabs and defaults to studies', () => {
    expect(parseExploreTab('chapters')).toBe('chapters');
    expect(parseExploreTab('wisdom')).toBe('wisdom');
    expect(parseExploreTab('saved')).toBe('saved');
    expect(parseExploreTab(null)).toBe('studies');
    expect(parseExploreTab('nonsense')).toBe('studies');
  });
});
