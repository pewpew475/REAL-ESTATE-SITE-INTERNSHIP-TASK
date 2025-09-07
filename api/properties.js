const { database } = require('../lib/database.js');

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
      
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

      return res.json({
        success: true,
        data: filteredProperties,
        count: filteredProperties.length
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch properties'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      
      // Validate required fields
      const requiredFields = ['name', 'type', 'price', 'location', 'address', 'pincode', 'bedrooms', 'bathrooms', 'squareFootage', 'description', 'contactName', 'contactPhone', 'contactEmail'];
      
      for (const field of requiredFields) {
        if (!body[field]) {
          return res.status(400).json({
            success: false,
            error: `Missing required field: ${field}`
          });
        }
      }

      // Generate new property
      const newProperty = {
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

      return res.status(201).json({
        success: true,
        data: createdProperty,
        message: 'Property created successfully'
      });
    } catch (error) {
      console.error('Error creating property:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create property'
      });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
