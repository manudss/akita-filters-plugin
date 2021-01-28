export interface DataSourceWithServerOptions {
    searchFilterId?: string; // Id used for search when use search in filters
    serverPagination?: boolean; // Use server pagnidation
    pageIndexId?: string; // Id used for page Index ID
    pageIndexName?: string; // Name used to display page index filter
    pageIndexDisplay?: boolean; // True to enable display
    pageSizeId?: string; // Page size for Size ID
    pageSizeName?: string; // Name for display page size filter
    pageSizeDisplay?: boolean; // Display page size filter
    debounceTimeBetweenTwoChanges?: number; // Debounce time number between two changes, to avoid closest multiples changes events
    resetPageIndexOnFiltersChange?: boolean; // If true, will resets page Index after each filters changes (default: true)
}
