const { put } = require('@vercel/blob');

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

      // Parse the request body to get the file data
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      await new Promise((resolve, reject) => {
        req.on('end', resolve);
        req.on('error', reject);
      });

      // Try to parse as JSON first (in case frontend sends base64)
      let fileData;
      try {
        const parsed = JSON.parse(body);
        if (parsed.file && parsed.fileName && parsed.fileType) {
          fileData = parsed;
        }
      } catch (e) {
        // If not JSON, it might be multipart form data
        // For now, let's handle the case where we get the file data
      }

      if (!fileData) {
        // If we can't parse the file data, return an error
        return res.status(400).json({
          success: false,
          error: 'No file data received'
        });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(fileData.fileType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
        });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = fileData.fileName.split('.').pop();
      const fileName = `property-${timestamp}-${randomString}.${fileExtension}`;

      // Convert base64 to buffer
      const fileBuffer = Buffer.from(fileData.file, 'base64');

      // Upload to Vercel Blob
      const blob = await put(fileName, fileBuffer, {
        access: 'public',
        contentType: fileData.fileType,
      });

      return res.json({
        success: true,
        data: {
          url: blob.url,
          filename: fileName,
          size: fileBuffer.length,
          type: fileData.fileType
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
