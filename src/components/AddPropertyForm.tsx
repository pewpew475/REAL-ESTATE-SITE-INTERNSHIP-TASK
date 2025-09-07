import { useState, useRef } from "react";
import { X, Upload, Plus, MapPin, Home, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Property, PropertyTypes, CommonAmenities } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

interface AddPropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (property: Omit<Property, 'id' | 'createdAt'>) => void;
}

export const AddPropertyForm = ({ isOpen, onClose, onSubmit }: AddPropertyFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    location: '',
    address: '',
    pincode: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    yearBuilt: '',
    parking: false,
    furnished: false,
    petFriendly: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageAdd = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImages(prev => [...prev, result.data.url]);
        toast({
          title: "Image uploaded successfully!",
          description: "Your image has been uploaded to the cloud.",
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.price || !formData.location) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const property: Omit<Property, 'id' | 'createdAt'> = {
      name: formData.name,
      type: formData.type as any,
      price: parseFloat(formData.price),
      location: formData.location,
      address: formData.address,
      pincode: formData.pincode,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      squareFootage: parseInt(formData.squareFootage) || 0,
      description: formData.description,
      images,
      amenities: selectedAmenities,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
      parking: formData.parking,
      furnished: formData.furnished,
      petFriendly: formData.petFriendly,
    };

    onSubmit(property);
    
    // Reset form
    setFormData({
      name: '',
      type: '',
      price: '',
      location: '',
      address: '',
      pincode: '',
      bedrooms: '',
      bathrooms: '',
      squareFootage: '',
      description: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      yearBuilt: '',
      parking: false,
      furnished: false,
      petFriendly: false,
    });
    setImages([]);
    setSelectedAmenities([]);
    onClose();
    
    toast({
      title: "Property added successfully!",
      description: "Your property has been listed.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            Add New Property
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to list your property.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Property Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Beautiful Family Home"
                required
              />
            </div>
            
            <div>
              <Label>Property Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {PropertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">City/Area *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="New York, NY"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
            
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="10001"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="500000"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="3"
              />
            </div>
            
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="2"
              />
            </div>
            
            <div>
              <Label htmlFor="sqft">Square Footage</Label>
              <Input
                id="sqft"
                type="number"
                value={formData.squareFootage}
                onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                placeholder="1500"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                placeholder="2020"
              />
            </div>
            
            <div className="flex items-center space-x-6 pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={formData.parking}
                  onCheckedChange={(checked) => handleInputChange('parking', checked)}
                />
                <Label htmlFor="parking">Parking Available</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furnished"
                  checked={formData.furnished}
                  onCheckedChange={(checked) => handleInputChange('furnished', checked)}
                />
                <Label htmlFor="furnished">Furnished</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="petFriendly"
                  checked={formData.petFriendly}
                  onCheckedChange={(checked) => handleInputChange('petFriendly', checked)}
                />
                <Label htmlFor="petFriendly">Pet Friendly</Label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <Label>Property Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleImageAdd}
                disabled={isUploading}
                className="w-full h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 mx-auto mb-1 text-muted-foreground animate-spin" />
                  ) : (
                    <Plus className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Uploading...' : 'Add Image'}
                  </span>
                </div>
              </button>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Amenities */}
          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {CommonAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your property..."
              rows={4}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              <Upload className="mr-2 h-4 w-4" />
              List Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};