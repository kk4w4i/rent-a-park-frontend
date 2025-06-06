export type SearchFilters = {
    lon?: number;
    lat?: number;
    radius?: number;
    priceMin?: number;
    priceMax?: number;
    limit?: number;
    timeStart?: string;
    timeEnd?: string;
    type?: string[];
}