import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchBar from "@/customComponents/SearchBar";
import ImageUpload from "@/customComponents/ImageUploader";
import { Label } from "@/components/ui/label";
import { BASE_API_URL } from "@/urls";

const PARKING_TYPES = ["bike", "small", "normal", "disabled"];
const LISTING_API_URL = `${BASE_API_URL}/lb-service/api/v1/`

type FormFields = {
    title: string;
    address: string;
    type: string;
    rate: string;
    latitude: string;
    longitude: string;
    description: string;
    image: string;
};

export default function CreateListing() {
    const [form, setForm] = useState<FormFields>({
        title: "",
        address: "",
        type: "",
        rate: "",
        latitude: "",
        longitude: "",
        description: "",
        image: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (value: string) => {
        setForm((prev) => ({ ...prev, type: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        console.log("Submitting form:", form);

        const required: (keyof FormFields)[] = ["title", "address", "type", "rate", "latitude", "longitude"];
        for (const field of required) {
            if (!form[field]) {
                setError(`Missing required field: ${field}`);
                return;
            }
        }
        if (!PARKING_TYPES.includes(form.type)) {
            setError("Invalid parking type");
            return;
        }

        try {
            const params = new URLSearchParams({
                title: form.title,
                address: form.address,
                type: form.type,
                rate: form.rate,
            });

            const response = await fetch(`${LISTING_API_URL}listings?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: form.latitude,
                    longitude: form.longitude,
                    description: form.description,
                    image: form.image,
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create listing');
            }

            setForm({
                title: "",
                address: "",
                type: "",
                rate: "",
                latitude: "",
                longitude: "",
                description: "",
                image: "",
            });
            window.location.href = "/profile";
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to create listing");
            }
        }
    };

    return (        
          <div className="flex items-center justify-center min-h-screen w-full">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Create Parking Listing</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input fields */}
                    <Input
                        className="w-full"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                    />
                <SearchBar 
                    onSelect={(lat, lon, address) => {
                        setForm((prev) => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lon.toString(),
                        address: address,
                        }));
                    }}
                    placeholder="Address"
                />
                <Select onValueChange={handleSelect} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    {PARKING_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                        {t}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Input
                    name="rate"
                    value={form.rate}
                    onChange={handleChange}
                    placeholder="Rate"
                    type="number"
                    required
                />
                <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                <ImageUpload
                    value={form.image}
                    onChange={(img) => setForm((prev) => ({ ...prev, image: img }))}
                />
                <Label>
                    {error}
                </Label>
                <Button 
                    type="submit" 
                    className="w-full mt-4"
                >
                    Create Listing
                </Button>
                </form>
            </CardContent>
        </Card>
    </div>
    );
}
