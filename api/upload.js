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

      // For now, let's create a mock response to test if the API is working
      // TODO: Implement actual file upload when multipart form data is properly handled
      return res.json({
        success: true,
        data: {
          url: `https://picsum.photos/800/600?random=${Date.now()}`,
          filename: `test-${Date.now()}.jpg`,
          size: 1024,
          type: 'image/jpeg'
        },
        message: 'File uploaded successfully (mock - blob token configured)'
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
