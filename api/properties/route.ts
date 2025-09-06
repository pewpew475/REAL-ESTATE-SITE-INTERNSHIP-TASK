import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { Property } from '@/types/property';

// GET /api/properties - Get all properties with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const searchQuery = searchParams.get('search') || '';
    const propertyType = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '2000000');
    const bedrooms = searchParams.get('bedrooms') || '';
    const bathrooms = searchParams.get('bathrooms') || '';

    // Get filtered properties from database
    const filteredProperties = database.getProperties({
      searchQuery,
      propertyType,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms
    });

    return NextResponse.json({
      success: true,
      data: filteredProperties,
      count: filteredProperties.length
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'price', 'location', 'address', 'pincode', 'bedrooms', 'bathrooms', 'squareFootage', 'description', 'contactName', 'contactPhone', 'contactEmail'];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate new property
    const newProperty: Property = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      type: body.type,
      price: body.price,
      location: body.location,
      address: body.address,
      pincode: body.pincode,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      squareFootage: body.squareFootage,
      description: body.description,
      images: body.images || [],
      amenities: body.amenities || [],
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      yearBuilt: body.yearBuilt,
      parking: body.parking,
      furnished: body.furnished,
      petFriendly: body.petFriendly,
      createdAt: new Date()
    };

    // Add to database
    const createdProperty = database.createProperty(newProperty);

    return NextResponse.json({
      success: true,
      data: createdProperty,
      message: 'Property created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
