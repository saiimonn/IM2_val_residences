import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, Dumbbell, Home, MapPin, Shield, Waves, Wifi, Wind } from 'lucide-react';
import { ListingsData } from '@/types/tenantDashboard.types';

{
    /* NOTE TO SELF: MAKE THIS INTERFACE A TYPE FOR REUSABILITY */
}

interface ListingCardProps {
    listing: ListingsData;
    onViewDetails: (listing: ListingsData) => void;
    onApply: (listing: ListingsData) => void;
    featured?: boolean;
}

const ListingCard = ({ listing, onViewDetails, onApply, featured = false }: ListingCardProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatArea = (area: number) => {
        return `${area.toLocaleString()} sq ft`;
    };

    const amenityIcons: { [key: string]: any } = {
        wifi: Wifi,
        parking: Car,
        gym: Dumbbell,
        pool: Waves,
        air_conditioning: Wind,
        security: Shield,
    };

    const getAmenityIcon = (amenity: string) => {
        const IconComponent = amenityIcons[amenity.toLowerCase()];
        return IconComponent ? <IconComponent className="size-3" /> : null;
    };

    // Ensure amenities is always treated as an array
    const amenitiesArray = Array.isArray(listing.amenities)
        ? listing.amenities
        : String(listing.amenities || '')
              .split(/,|;/)
              .map((s) => s.trim())
              .filter(Boolean);

    // Ensure unit_photos is always treated as an array
    const photosArray = Array.isArray(listing.unit_photos) ? listing.unit_photos : [];

    if (featured) {
        return (
            <>
                <Card className="overflow-hidden border-gray-200 bg-white py-0">
                    <div className="flex flex-col lg:flex-row">
                        <div className="relative lg:w-1/2">
                            {/* Image */}
                            <img
                                src={photosArray[0] || '/placeholder.svg'}
                                alt={`${listing.address} - Unit ${listing.unit_number}`}
                                className="h-64 w-full object-cover lg:h-100"
                            />

                            {/* Badges on the image */}
                            <Badge className="absolute top-3 left-3 bg-emerald-600 text-white">{listing.availability_status}</Badge>

                            <Badge className="absolute top-3 right-3 bg-blue-600 text-white">{listing.property_type}</Badge>
                        </div>

                        {/* Rent price */}
                        <div className="p-6 lg:w-1/2 flex flex-col">
                            <div className="mb-4">
                                <p className="text-3xl font-bold text-[#3b3b3b]">
                                    {formatPrice(listing.rent_price)}
                                    <span className="text-sm font-normal text-gray-500">/month</span>
                                </p>
                            </div>

                            {/* unit No. */}
                            <div className="mb-3 flex items-start gap-2">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {listing.address}, Unit {listing.unit_number}
                                </span>
                            </div>

                            {/* floor area */}
                            <div className="mb-4 flex items-center gap-2">
                                <Home className="size-4 text-gray-400" />
                                <span className="text-sm text-gray-600">Floor Area: {formatArea(listing.floor_area)}</span>
                            </div>

                            {/* unit description */}
                            <p className="mb-6 line-clamp-3 text-sm text-gray-700">{listing.description}</p>

                            {/* amenities */}
                            <div className="flex-1">
                                <h4 className="mb-3 text-sm font-semibold text-gray-900">Premium Amenities</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {amenitiesArray.slice(0, 6).map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-2 rounded bg-blue-50 px-2 py-1 text-xs text-blue-600">
                                            {getAmenityIcon(amenity)}
                                            <span className="capitalize">{amenity.replace(/_/g, ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-2">
                                <Button onClick={() => onViewDetails(listing)} variant="outline" className="flex-1">
                                    View Details
                                </Button>
                                <Button onClick={() => onApply(listing)} className="flex-1" disabled = {listing.availability_status?.toLowerCase() === "occupied"}>
                                    Apply Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </>
        );
    }

    // Regular listing card
    return (
        <Card className="flex h-full flex-col overflow-hidden border-gray-200 bg-white py-0 transition-shadow hover:shadow-lg">
            <div className="relative">
                <img
                    src={photosArray[0] || '/placeholder.svg'}
                    alt={`${listing.address} - Unit ${listing.unit_number}`}
                    className="h-48 w-full object-cover"
                />
                <Badge className={ `absolute top-3 left-3 ${listing.availability_status === 'available' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>{listing.availability_status}</Badge>
                <Badge className="absolute top-3 right-3 bg-blue-600 text-white">{listing.property_type}</Badge>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-3">
                    <p className="text-2xl font-bold text-[#3b3b3b]">
                        {formatPrice(listing.rent_price)}
                        <span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                </div>

                <div className="mb-2 flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {listing.address}, Unit {listing.unit_number}
                    </span>
                </div>

                <div className="mb-3 flex items-center gap-2">
                    <Home className="size-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{formatArea(listing.floor_area)}</span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-700">{listing.description}</p>

                <div className="mb-4 flex-1">
                    <div className="flex flex-wrap gap-1">
                        {amenitiesArray.slice(0, 4).map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs text-blue-600">
                                {getAmenityIcon(amenity)}
                                <span className="capitalize">{amenity.replace(/_/g, ' ')}</span>
                            </div>
                        ))}
                        {amenitiesArray.length > 4 && (
                            <div className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">+{amenitiesArray.length - 4} more</div>
                        )}
                    </div>
                </div>

                <div className="mt-auto flex gap-2">
                    <Button onClick={() => onViewDetails(listing)} variant="outline" className="flex-1">
                        View Details
                    </Button>
                    <Button onClick={() => onApply(listing)} className="flex-1" disabled = {listing.availability_status?.toLowerCase() === "occupied"}>
                        Apply Now
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ListingCard;
