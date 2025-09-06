import { useState } from "react";
import { Heart, MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard = ({ property, onViewDetails }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDefaultImage = () => {
    // Use our generated sample images as fallbacks
    const sampleImages = [
      '/src/assets/apartment-sample.jpg',
      '/src/assets/villa-sample.jpg'
    ];
    return sampleImages[Math.floor(Math.random() * sampleImages.length)];
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageError ? getDefaultImage() : (property.images[0] || getDefaultImage())}
            alt={property.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>

        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
        </Badge>

        {property.images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white text-sm rounded">
            +{property.images.length - 1} photos
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1">
            {property.name}
          </h3>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.squareFootage} sqft</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(property.price)}
          </div>
          <Button 
            onClick={() => onViewDetails(property)}
            variant="outline"
            size="sm"
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>

        {property.amenities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};