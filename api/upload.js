const { put } = require('@vercel/blob');
const formidable = require('formidable');

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
    return res.json({
      success: true,
      data: {
        maxFileSize: '10MB',
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxFiles: 10
      }
    });
  }

  if (req.method === 'POST') {
    try {
      // Check if we have the BLOB_READ_WRITE_TOKEN
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('BLOB_READ_WRITE_TOKEN not found in environment variables');
        return res.status(500).json({
          success: false,
          error: 'Blob storage not configured'
        });
      }

      // Parse the multipart form data using formidable
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024, // 10MB
        keepExtensions: true,
      });
      
      const [fields, files] = await form.parse(req);
      const file = files.file?.[0];
      
      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No file provided'
        });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
        });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.originalFilename.split('.').pop();
      const fileName = `property-${timestamp}-${randomString}.${fileExtension}`;

      // Read the file buffer
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(file.filepath);

      // Upload to Vercel Blob
      const blob = await put(fileName, fileBuffer, {
        access: 'public',
        contentType: file.mimetype,
      });

      return res.json({
        success: true,
        data: {
          url: blob.url,
          filename: fileName,
          size: file.size,
          type: file.mimetype
        },
        message: 'File uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload file'
      });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
