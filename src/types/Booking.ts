export type Booking = {
    booking_id: string;
    listing_id: string;
    vehicle_id: string;
    customer_id: string;
    provider_id: string;
    start_time: string;
    end_time: string;
    status: string;
    price_total: number;
    payment_status: string;
    created_at: string;
    updated_at: string;
};