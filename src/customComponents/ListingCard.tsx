import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
  } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Listing } from "../types/Listing";
import { useNavigate } from "react-router-dom";


// Helper to format date
function formatDate(iso: string) {
    const date = new Date(iso);
    return date
        ? `${date.getDate().toString().padStart(2, '0')}/${
            (date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()}`
        : '';
}

export default function ListingCard({ listing }: { listing: Listing }) {
    const navigate = useNavigate();
     
    return (
        <Card className="py-2 gap-3 w-[400px] cursor-pointer drop-shadow-2xl" onClick={() => navigate(`/listing/${listing.listing_id}`)}>
            <CardContent className="px-3 pt-3 pb-0">
                <div>
                <AspectRatio className="rounded-lg" ratio={12 / 6}></AspectRatio>
                <div className="flex justify-between items-center">
                    <section className="flex flex-row justify-center items-center gap-2 text-neutral-400">
                        <div>
                            Price ${listing.rate}/15min
                        </div>
                        <span className="text-[#E4A963] bg-[#FFE4BC] rounded-full px-2 py-1 text-[0.8rem] font-medium">
                            {listing.type}
                        </span>
                    </section>
                    <div className="text-[0.8rem] text-neutral-500 font-medium">
                        Uploaded: {formatDate(listing.updated_at)}
                    </div>
                </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col justify-end items-start gap-2 px-3 pb-3 pt-0">
                <CardTitle className="text-[1rem]">{listing.title}</CardTitle>
                <div className="text-[0.8rem] h-[0.7rem] p-0 m-0 text-neutral-500">
                    {listing.address}
                </div>
            </CardFooter>
        </Card>
    )
}