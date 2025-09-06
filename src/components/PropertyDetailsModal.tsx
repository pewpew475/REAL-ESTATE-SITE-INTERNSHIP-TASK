import { useState } from "react";
import { X, MapPin, Bed, Bath, Square, Calendar, Car, Heart, Share2, Phone, Mail, User } from "lucide-react";
import { Property } from "@/types/property";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyDetailsModal = ({ property, isOpen, onClose }: PropertyDetailsModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!property) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const images = property.images.length > 0 ? property.images : ['/src/assets/apartment-sample.jpg'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Image Gallery */}
          <div className="relative h-96 md:h-[500px]">
            <img
              src={images[currentImageIndex]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-primary text-primary-foreground">
                {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
              </Badge>
              {property.furnished && (
                <Badge variant="secondary">Furnished</Badge>
              )}
              {property.petFriendly && (
                <Badge variant="secondary">Pet Friendly</Badge>
              )}
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <DialogHeader className="text-left space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl md:text-3xl font-bold">
                    {property.name}
                  </DialogTitle>
                  <DialogDescription className="text-lg flex items-center gap-2 mt-2">
                    <MapPin className="h-5 w-5" />
                    {property.address || property.location}
                    {property.pincode && `, ${property.pincode}`}
                  </DialogDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.bedrooms}</div>
                <div className="text-sm text-muted-foreground">Bedrooms</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.bathrooms}</div>
                <div className="text-sm text-muted-foreground">Bathrooms</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.squareFootage}</div>
                <div className="text-sm text-muted-foreground">Sq Ft</div>
              </div>
              {property.yearBuilt && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{property.yearBuilt}</div>
                  <div className="text-sm text-muted-foreground">Year Built</div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || "No description available."}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Contact Information */}
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {property.contactName && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Contact Person</div>
                      <div className="font-medium">{property.contactName}</div>
                    </div>
                  </div>
                )}
                
                {property.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{property.contactPhone}</div>
                    </div>
                  </div>
                )}
                
                {property.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{property.contactEmail}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button className="flex-1 bg-gradient-primary">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {property.parking && (
                <div className="flex items-center gap-2 text-success">
                  <Car className="h-4 w-4" />
                  <span>Parking Available</span>
                </div>
              )}
              {property.furnished && (
                <div className="flex items-center gap-2 text-success">
                  <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span>Furnished</span>
                </div>
              )}
              {property.petFriendly && (
                <div className="flex items-center gap-2 text-success">
                  <Heart className="h-4 w-4" />
                  <span>Pet Friendly</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};