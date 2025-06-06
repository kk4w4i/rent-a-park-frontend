import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Listing } from "@/types/Listing";
import { dummyListings } from "@/dummies/searchResponse";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Share, Heart, Calendar } from "lucide-react";

// For date/time pickers, you may want to use a library like react-datepicker or similar.
// Here, we'll use simple HTML <input type="datetime-local"> for demonstration.

export default function CustomerListing() {
  const { listing_id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);

  // Parking time selection state
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  // Calculate total price based on selected time
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

  useEffect(() => {
    if (listing_id) {
      const found = dummyListings.find((item) => String(item.listing_id) === String(listing_id));
      setListing(found || null);
    }
  }, [listing_id]);

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-1">{listing.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="underline">{listing.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="ghost" size="sm" className="gap-2">
            <Share className="w-4 h-4" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Heart className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Parking Image */}
          <div>
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Parking spot"
              width={600}
              height={400}
              className="w-full h-64 lg:h-80 object-cover rounded-lg border"
            />
          </div>

          {/* Host Info */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Parking hosted by Sarah</h2>
              <p className="text-gray-600">{listing.type} · Max vehicle: Sedan · Secure spot</p>
            </div>
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" alt="Host" />
              <AvatarFallback>SH</AvatarFallback>
            </Avatar>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>
        </div>

        {/* Right Column - Booking Card */}
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
              <Button className="w-full" size="lg" disabled={!start || !end || getTotal() === 0}>
                Reserve
              </Button>
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
      </div>
    </div>
  );
}