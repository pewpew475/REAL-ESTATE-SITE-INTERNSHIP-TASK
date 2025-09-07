import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
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
      const maxPrice = parseInt(searchParams.get('maxPrice') || `${Number.MAX_SAFE_INTEGER}`);
      const bedrooms = searchParams.get('bedrooms') || '';
      const bathrooms = searchParams.get('bathrooms') || '';

      // Supabase fetch with filters
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars');
      }
      const supabase = createClient(supabaseUrl, supabaseKey);
      let query = supabase
        .from('properties')
        .select('*')
        .gte('price', minPrice)
        .lte('price', maxPrice);

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }
      if (propertyType) query = query.eq('type', propertyType);
      if (location) query = query.ilike('location', `%${location}%`);
      if (bedrooms) query = query.gte('bedrooms', parseInt(bedrooms));
      if (bathrooms) query = query.gte('bathrooms', parseInt(bathrooms));

      const { data: rows, error } = await query.order('createdAt', { ascending: false });
      if (error) throw error;

      const finalList = (rows || []).map(row => ({
        ...row,
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date()
      }));

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

      // Insert into Supabase
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars');
      }
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('properties')
        .insert({
          id: newProperty.id,
          name: newProperty.name,
          type: newProperty.type,
          price: newProperty.price,
          location: newProperty.location,
          address: newProperty.address,
          pincode: newProperty.pincode,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms,
          squareFootage: newProperty.squareFootage,
          description: newProperty.description,
          images: newProperty.images,
          amenities: newProperty.amenities,
          contactName: newProperty.contactName,
          contactPhone: newProperty.contactPhone,
          contactEmail: newProperty.contactEmail,
          yearBuilt: newProperty.yearBuilt ?? null,
          parking: newProperty.parking ?? null,
          furnished: newProperty.furnished ?? null,
          petFriendly: newProperty.petFriendly ?? null,
          createdAt: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        data: data,
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
