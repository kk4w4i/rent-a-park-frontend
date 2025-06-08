import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Listing } from "@/types/Listing";
import { dummyListings } from "@/dummies/searchResponse";
import { Button } from "@/components/ui/button";
import { MapPin, Share, Heart } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import BookingCard from "@/customComponents/BookingCard";

// For date/time pickers, you may want to use a library like react-datepicker or similar.
// Here, we'll use simple HTML <input type="datetime-local"> for demonstration.

const USE_DUMMY_DATA = false; // Set to false when using real API
const API_URL = "http://localhost:8080/lb-service/api/v1";

export default function CustomerListing() {
  const { listing_id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    let found = null;
    if (listing_id) {
      if (USE_DUMMY_DATA) {
        found = dummyListings.find((item) => String(item.listing_id) === String(listing_id));
        setListing(found || null);
      } else {
        console.log(`Fetching listing with ID: ${listing_id}`);
        const fetchListing = async () => {
          const response = await fetch(`${API_URL}/listings/${listing_id}`);
          if (response.ok) {
            const data = await response.json();
            setListing(data);
          } else {
            setListing(null);
          }
        };
        fetchListing();
      }
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
            <AspectRatio className="rounded-lg" ratio={12 / 6}>
                <img
                    src={listing.image}
                    alt={listing.title}
                    className="rounded-lg w-full h-full object-cover"
            />
            </AspectRatio>

          {/* Description */}
          <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            <div className="flex items-center justify-between">
                <div>
                <p className="text-gray-600">Parking type: {listing.type}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <BookingCard listing={listing} />
      </div>
    </div>
  );
}