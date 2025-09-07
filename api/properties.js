const { database } = require('../lib/database.js');
const { get } = require('@vercel/edge-config');

// Admin write helper for Edge Config (REST API)
async function writePropertiesToEdgeConfig(properties) {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const edgeConfigToken = process.env.EDGE_CONFIG_TOKEN;
  const teamId = process.env.EDGE_CONFIG_TEAM_ID; // optional

  if (!edgeConfigId || !edgeConfigToken) {
    throw new Error('EDGE_CONFIG_ID and EDGE_CONFIG_TOKEN are required for writes');
  }

  const url = new URL(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`);
  if (teamId) url.searchParams.set('teamId', teamId);

  const body = {
    items: [
      {
        operation: 'upsert',
        key: 'properties',
        value: properties,
      },
    ],
  };

  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${edgeConfigToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Edge Config write failed (${response.status}): ${errText}`);
  }
}

async function readPropertiesFromEdgeConfig() {
  try {
    const list = await get('properties');
    if (Array.isArray(list)) return list;
    return null;
  } catch (e) {
    console.warn('Edge Config read failed, falling back:', e?.message || e);
    return null;
  }
}

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

      // Prefer Edge Config; fall back to in-memory database if unavailable
      const edgeList = await readPropertiesFromEdgeConfig();
      const sourceList = Array.isArray(edgeList) && edgeList.length > 0
        ? edgeList
        : database.getProperties();

      // Apply filters (replicating database.getProperties behavior)
      const filteredProperties = database.getProperties({
        searchQuery,
        propertyType,
        location,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms
      });

      // If we used Edge Config, re-filter against that list
      const finalList = (Array.isArray(edgeList) && edgeList.length > 0)
        ? sourceList.filter((property) => {
            const matchesSearch = !searchQuery ||
              property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              property.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = !propertyType || property.type === propertyType;
            const matchesLocation = !location || property.location.toLowerCase().includes(location.toLowerCase());
            const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
            const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms);
            const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms);
            return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesBedrooms && matchesBathrooms;
          })
        : filteredProperties;

      return res.json({
        success: true,
        data: finalList,
        count: finalList.length
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

      // Read current properties from Edge Config (fallback to in-memory seed)
      const current = (await readPropertiesFromEdgeConfig()) || database.getProperties();
      const updated = [newProperty, ...current];

      // Write back to Edge Config
      await writePropertiesToEdgeConfig(updated);

      return res.status(201).json({
        success: true,
        data: newProperty,
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
