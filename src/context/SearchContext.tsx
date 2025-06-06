import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react'
import { dummyListings } from '../dummies/searchResponse'
import { Listing } from '../types/Listing'
import { SearchFilters } from '../types/SearchFilters'

const USE_DUMMY_DATA = false;

type SearchContextType = {
    listings: Listing[];
    filters: SearchFilters;
    loading: boolean;
    error: string | null;
    updateFilters: (newFilters: Partial<SearchFilters>) => void;
    searchListings: () => Promise<void>;
};

// Intialize the context with default values.
// Unflag the USE_DUMMY_DATA variable when using the API endpoint
const SearchContext = createContext<SearchContextType>({
    listings: USE_DUMMY_DATA ? dummyListings : [],
    filters: {},
    loading: false,
    error: null,
    updateFilters: () => {},
    searchListings: async () => {},
});

// The SearchProvider component wraps the Home screen that handles the search functionality
export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // This prevents the search from running on the first render and waits until the filters are set
    // before running the search. This is important because the filters are set based on the map state
    // and the map state is not available on the first render.
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
            searchListings();
    }, [filters]);

    // The search function that calls the API endpoint where the filters are passed as query parameters
    // and the response is set to the listings state
    const searchListings = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.radius) params.append('radius', filters.radius.toString());
            if (filters.lon) params.append('longitude', filters.lon.toString());
            if (filters.lat) params.append('latitude', filters.lat.toString());
            if (filters.priceMin) params.append('priceMax', filters.priceMin.toString());
            if (filters.priceMax) params.append('priceMin', filters.priceMax.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.timeStart) params.append('timeStart', filters.timeStart);
            if (filters.timeEnd) params.append('timeEnd', filters.timeEnd);
            if (filters.type) params.append('type', filters.type.join(','));

            console.log(`http://localhost:7070/search?${params.toString()}`)
            const response = await fetch(`http://localhost:7070/search?${params.toString()}`);
            if (!response.ok) throw new Error('Search failed');
            
            const data = await response.json();
            setListings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch listings');
        } finally {
            setLoading(false);
        }
    };

    // This function updates the filters state with the new filters passed as an argument
    const updateFilters = (newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    return (
        <SearchContext.Provider value={{ listings, filters, loading, error, updateFilters, searchListings }}>
            {children}
        </SearchContext.Provider>
    );
};

// Custom hook to use the SearchContext states and functions
export const useSearchContext = () => useContext(SearchContext);