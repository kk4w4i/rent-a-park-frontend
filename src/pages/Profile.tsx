import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { ProfileProvider, useProfileContext } from "@/context/ProfileContext"
import { Plus } from "lucide-react"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { useNavigate } from "react-router-dom"
import { Listing } from "@/types/Listing"
import { BASE_API_URL } from "@/urls"

export default function Profile() {
  return (
    <ProfileProvider>
      <SidebarProvider>
        <ProfileContent />
      </SidebarProvider>
    </ProfileProvider>
  )
}

const API_URL = `${BASE_API_URL}/lb-service/api/v1`;

function ProviderRoleSwitch() {
  const { profileUser, switchRole } = useProfileContext()

  console.log("ProviderRoleSwitch profileUser:", profileUser)

  const canBeProvider = profileUser?.is_provider

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="provider-switch" className="text-sm font-medium">
        {profileUser?.role === "provider" ? "Provider" : "Customer"}
      </label>
      <Switch
        id="provider-switch"
        checked={profileUser?.role === "provider"}
        onCheckedChange={() => {
          if (canBeProvider) switchRole()
        }}
        disabled={!canBeProvider}
      />
    </div>
  )
}

function ProfileContent() {
  const { profileUser, providerListings, bookings, getListings, getBookings } = useProfileContext();
  const [selectedMenu, setSelectedMenu] = useState<string>("Booked");

  useEffect(() => {
    if (profileUser?.role === 'provider') {
      getListings();
    }
    getBookings();
  }, [profileUser?.role, selectedMenu]);

  const renderContent = () => {
    switch(selectedMenu) {
      case 'Listed':
        return providerListings
          .filter(listing => listing.status === 'listed')
          .map(listing => (
            <ListingSelect key={listing.listing_id} listing={listing} />
          ));

      case 'Pending':
        console.log("Rendering Listed Listings", providerListings);
        return providerListings
          .filter(listing => listing.status === 'pending')
          .map(listing => (
            <ListingSelect key={listing.listing_id} listing={listing} />
          ));

      case 'Closed':
        return providerListings
          .filter(listing => listing.status === 'closed')
          .map(listing => (
            <ListingSelect key={listing.listing_id} listing={listing} />
          ));

      case 'Booked':
        console.log("Rendering Reserved Bookings", bookings);
        return bookings
          .filter(booking => booking.status === 'Booked')
          .map(booking => (
            <BookingSelect key={booking.booking_id} booking={booking} />
          ));

      default:
        return <div className="col-span-5 text-center">Select a category to view</div>;
    }
  };

  if (profileUser === null) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        <AppSidebar profileUser={profileUser} selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
        <SidebarInset>
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {profileUser.role === "provider" ? "Provider Dashbaord" : "Dashboard"}
              <div className="absolute right-5 flex gap-3 items-center">
                {profileUser.role === "provider" && (
                  <Button onClick={() => window.location.href = "/create-listing"}>
                    <Plus/> Create Listing
                  </Button>
                )}
                <ProviderRoleSwitch/>
              </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-5">
              {renderContent()}
            </div>
          </div>
        </SidebarInset>
      </>
    );
  }
}

function ListingSelect ({ listing }: { listing: any }) {
  const navigate = useNavigate();
  console.log("ListingSelect listing:", listing);
  return (
    <div className="cursor-pointer drop-shadow-2xl" onClick={() => navigate(`/listing/${listing.id}`)}>
      <AspectRatio ratio={1 / 1} className="w-full">
        <img
          src={listing?.image}
          alt={listing?.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </AspectRatio>
      <div>
        {listing.title}
      </div>
    </div>
  )
}

function BookingSelect ({ booking }: { booking: any }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const response = await fetch(`${API_URL}/listings/${booking.listing_id}`);
      if (response.ok) {
          const data = await response.json();
          setListing(data);
        } else {
          setListing(null);
        }
    };
    fetchListing();
  }, []);
  
  return (
    <div className="cursor-pointer drop-shadow-2xl" onClick={() => navigate(`/listing/${booking.id}`)}>
      <AspectRatio ratio={1 / 1} className="w-full">
        <img
          src={listing?.image}
          alt={listing?.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </AspectRatio>
      <div>
        {listing?.title}
      </div>
    </div>
  )
}