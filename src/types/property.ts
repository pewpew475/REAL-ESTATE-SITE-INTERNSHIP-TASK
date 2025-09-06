export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  price: number;
  location: string;
  address: string;
  pincode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  description: string;
  images: string[];
  amenities: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  yearBuilt?: number;
  parking?: boolean;
  furnished?: boolean;
  petFriendly?: boolean;
  createdAt: Date;
}

export type PropertyType = 
  | 'apartment'
  | 'house'
  | 'condo'
  | 'townhouse'
  | 'villa'
  | 'studio'
  | 'duplex'
  | 'penthouse'
  | 'commercial'
  | 'land';

export const PropertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

export const CommonAmenities = [
  'Swimming Pool',
  'Gym/Fitness Center',
  'Parking',
  'Balcony',
  'Garden',
  'Security',
  'Elevator',
  'Air Conditioning',
  'Heating',
  'Laundry',
  'Internet/WiFi',
  'Pet Friendly',
  'Furnished',
  'Dishwasher',
  'Microwave',
  'Refrigerator',
  'Washer/Dryer',
  'Fireplace',
  'Hardwood Floors',
  'Walk-in Closet'
];