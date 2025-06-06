import { Listing } from './Listing';

export type ProviderListing = Listing & {
    bookingCount: number;
    requestedCount: number;
};