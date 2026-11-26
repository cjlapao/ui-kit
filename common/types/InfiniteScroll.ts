/** Parent-owned incremental data loading shared by tables in both frameworks. */
export interface TableInfiniteScrollState {
  hasMore: boolean;
  /** Append the next page to data before this promise resolves. */
  onLoadMore: () => Promise<void>;
  /** Bottom preload distance in pixels. Defaults to 320. */
  rootMargin?: number;
  onError?: (error: unknown) => void;
  /** Change when replacing the dataset, such as after server sorting or filtering. */
  resetKey?: string | number;
  /**
   * Render the "end of results" marker at all — `false` lets the list simply
   * stop. @default true
   */
  showEndMarker?: boolean;
}
