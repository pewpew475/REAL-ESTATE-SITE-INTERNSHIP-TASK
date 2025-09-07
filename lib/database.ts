import { Property } from '@/types/property';

// Database schema and types
export interface DatabaseProperty extends Omit<Property, 'createdAt'> {
  createdAt: string; // ISO string for JSON serialization
}

// In-memory database for demo purposes
// In production, you would use a real database like:
// - PostgreSQL with Prisma
// - MongoDB with Mongoose
// - Supabase
// - PlanetScale
// - Vercel Postgres

class Database {
  private properties: DatabaseProperty[] = [
    {
      id: "1",
      name: "Modern Downtown Apartment",
      type: "apartment",
      price: 750000,
      location: "New York, NY",
      address: "123 5th Avenue, Manhattan",
      pincode: "10001",
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1200,
      description: "Stunning modern apartment in the heart of Manhattan with floor-to-ceiling windows, hardwood floors, and a private balcony overlooking Central Park. This luxury unit features top-of-the-line appliances, marble countertops, and an open floor plan perfect for entertaining.",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
      ],
      amenities: ["Swimming Pool", "Gym/Fitness Center", "Doorman", "Rooftop Deck", "In-unit Laundry"],
      contactName: "Sarah Johnson",
      contactPhone: "+1 (212) 555-0123",
      contactEmail: "sarah@realestate.com",
      yearBuilt: 2020,
      parking: true,
      furnished: false,
      petFriendly: false,
      createdAt: "2024-01-15T00:00:00.000Z"
    },
    {
      id: "2",
      name: "Charming Victorian House",
      type: "house",
      price: 950000,
      location: "San Francisco, CA",
      address: "456 Lombard Street",
      pincode: "94133",
      bedrooms: 4,
      bathrooms: 3,
      squareFootage: 2500,
      description: "Beautiful Victorian-style house with original architectural details, updated kitchen and bathrooms, and a private garden. Located in the prestigious Pacific Heights neighborhood with stunning views of the bay.",
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      amenities: ["Garden", "Fireplace", "Hardwood Floors", "Updated Kitchen", "Bay Views"],
      contactName: "Michael Chen",
      contactPhone: "+1 (415) 555-0456",
      contactEmail: "michael@sfhomes.com",
      yearBuilt: 1925,
      parking: true,
      furnished: false,
      petFriendly: true,
      createdAt: "2024-01-10T00:00:00.000Z"
    }
  ];

  // Get all properties with optional filtering
  getProperties(filters?: {
    searchQuery?: string;
    propertyType?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: string;
    bathrooms?: string;
  }): Property[] {
    let filteredProperties = [...this.properties];

    if (filters) {
      const {
        searchQuery,
        propertyType,
        location,
        minPrice = 0,
        maxPrice = Number.MAX_SAFE_INTEGER,
        bedrooms,
        bathrooms
      } = filters;

      filteredProperties = filteredProperties.filter(property => {
        const matchesSearch = !searchQuery || 
          property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = !propertyType || property.type === propertyType;
        
        const matchesLocation = !location || 
          property.location.toLowerCase().includes(location.toLowerCase());
        
        const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
        
        const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms);
        
        const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms);
        
        return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesBedrooms && matchesBathrooms;
      });
    }

    return filteredProperties.map(this.convertToProperty);
  }

  // Get a property by ID
  getPropertyById(id: string): Property | null {
    const property = this.properties.find(p => p.id === id);
    return property ? this.convertToProperty(property) : null;
  }

  // Create a new property
  createProperty(propertyData: Omit<Property, 'id' | 'createdAt'>): Property {
    const newProperty: DatabaseProperty = {
      ...propertyData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    this.properties.unshift(newProperty);
    return this.convertToProperty(newProperty);
  }

  // Update a property
  updateProperty(id: string, updates: Partial<Omit<Property, 'id' | 'createdAt'>>): Property | null {
    const index = this.properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }

    this.properties[index] = {
      ...this.properties[index],
      ...updates
    };

    return this.convertToProperty(this.properties[index]);
  }

  // Delete a property
  deleteProperty(id: string): Property | null {
    const index = this.properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }

    const deletedProperty = this.properties.splice(index, 1)[0];
    return this.convertToProperty(deletedProperty);
  }

  // Convert database property to frontend property
  private convertToProperty(dbProperty: DatabaseProperty): Property {
    return {
      ...dbProperty,
      createdAt: new Date(dbProperty.createdAt)
    };
  }
}

// Export singleton instance
export const database = new Database();

// Database schema for reference (for when you implement a real database)
export const propertySchema = {
  id: 'string (primary key)',
  name: 'string (required)',
  type: 'string (required, enum)',
  price: 'number (required)',
  location: 'string (required)',
  address: 'string (required)',
  pincode: 'string (required)',
  bedrooms: 'number (required)',
  bathrooms: 'number (required)',
  squareFootage: 'number (required)',
  description: 'string (required)',
  images: 'string[] (array of URLs)',
  amenities: 'string[] (array of amenity names)',
  contactName: 'string (required)',
  contactPhone: 'string (required)',
  contactEmail: 'string (required)',
  yearBuilt: 'number (optional)',
  parking: 'boolean (optional)',
  furnished: 'boolean (optional)',
  petFriendly: 'boolean (optional)',
  createdAt: 'Date (auto-generated)'
};
