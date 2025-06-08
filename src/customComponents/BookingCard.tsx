import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL = "http://localhost:8080/lb-service/api/v1";

export default function BookingCard({ listing }: { listing: any }) {
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const [vehicle, setVehicle] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const getTotal = () => {
        if (!start || !end || !listing) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate.getTime() - startDate.getTime();
        if (diffMs <= 0) return 0;
        // 15min = 900000ms
        const sessions = Math.ceil(diffMs / 900000);
        return sessions * listing.rate;
    };

    const handleSubmit = async () => {
        if (!start || !end || getTotal() === 0) return;
        setLoading(true);
        setError(null);
        setSuccess(false);

        const params = new URLSearchParams({
            listing_id: listing.id,
            start_time: start,
            end_time: end,
            vehicle_id: vehicle,
        });

        try {
            const response = await fetch(`${API_URL}/bookings?${params}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price_total: getTotal(),
                    payment_status: 'pending'
                })
            });
            if (!response.ok) throw new Error('Failed to create booking');
                setSuccess(true);
                window.location.href = '/profile';
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
        }
    };

     return (
        <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-baseline gap-2">
                        <span className="text-2xl font-semibold">${listing.rate}</span>
                        <span className="text-base font-normal text-gray-600">/ 15min</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle Registration</label>
                    <Input
                        required
                        value={vehicle}
                        onChange={e => setVehicle(e.target.value)}
                        placeholder="Enter your vehicle registration"
                    />
                    <label className="block text-xs font-medium text-gray-700 mb-1">Select parking period</label>
                    <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <input
                        type="datetime-local"
                        className="border rounded px-2 py-1 text-sm w-full"
                        value={start}
                        onChange={e => setStart(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <input
                        type="datetime-local"
                        className="border rounded px-2 py-1 text-sm w-full"
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        min={start || new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                    </div>
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={!start || !end || getTotal() === 0 || loading}
                    onClick={handleSubmit}
                >
                    {loading ? 'Reserving...' : 'Reserve'}
                </Button>
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                {success && <p className="text-green-500 text-xs text-center">Booking created successfully!</p>}
                <p className="text-center text-xs text-gray-500">You won't be charged yet</p>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${getTotal()}</span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                    (${listing.rate} per 15min)
                </div>
                </CardContent>
            </Card>
        </div>
    );
}