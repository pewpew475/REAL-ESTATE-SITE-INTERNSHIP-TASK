# Real Estate Ecommerce - Deployment Guide

This guide will help you deploy your real estate ecommerce website to Vercel with Vercel Blob for image storage.

## Prerequisites

1. A Vercel account (free tier available)
2. A GitHub account (for connecting your repository)
3. Your project code pushed to a GitHub repository

## Step 1: Set up Vercel Blob

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project or create a new one
3. Go to the "Storage" tab
4. Click "Create Database" and select "Blob"
5. Give your blob storage a name (e.g., "real-estate-images")
6. Copy the `BLOB_READ_WRITE_TOKEN` - you'll need this for environment variables

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project

### Option B: Deploy via GitHub Integration

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `homestead-forge-main`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add the following variables:

   ```
   BLOB_READ_WRITE_TOKEN=your_blob_token_here
   NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
   NODE_ENV=production
   ```

3. Make sure to add these for all environments (Production, Preview, Development)

## Step 4: Update Frontend Configuration

Update your frontend to use the production API URL:

1. Create a `.env.production` file:
   ```env
   VITE_API_URL=https://your-project.vercel.app/api
   ```

2. Or update your `vite.config.ts` to use environment-specific URLs:
   ```typescript
   export default defineConfig({
     // ... other config
     define: {
       'import.meta.env.VITE_API_URL': JSON.stringify(
         process.env.NODE_ENV === 'production' 
           ? 'https://your-project.vercel.app/api'
           : 'http://localhost:3000/api'
       )
     }
   });
   ```

## Step 5: Test Your Deployment

1. Visit your deployed URL
2. Test the following features:
   - Viewing properties
   - Filtering properties
   - Adding new properties
   - Image uploads
   - Property details modal

## Step 6: Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Update your environment variables with the new domain

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Yes |
| `NEXT_PUBLIC_API_URL` | API base URL for frontend | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |

## API Endpoints

Your deployed API will have the following endpoints:

- `GET /api/properties` - Get all properties with filtering
- `GET /api/properties/[id]` - Get a specific property
- `POST /api/properties` - Create a new property
- `PUT /api/properties/[id]` - Update a property
- `DELETE /api/properties/[id]` - Delete a property
- `POST /api/upload` - Upload images to Vercel Blob
- `GET /api/upload` - Get upload configuration

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **API Errors**: Verify environment variables are set correctly
3. **Image Upload Issues**: Ensure `BLOB_READ_WRITE_TOKEN` is valid
4. **CORS Issues**: Vercel handles CORS automatically for same-origin requests

### Debugging:

1. Check Vercel function logs in the dashboard
2. Use browser developer tools to inspect network requests
3. Verify environment variables in Vercel dashboard

## Production Considerations

1. **Database**: Consider upgrading to a persistent database (PostgreSQL, MongoDB) for production
2. **Authentication**: Add user authentication for property management
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Caching**: Add caching for better performance
5. **Monitoring**: Set up error monitoring and analytics

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vite Documentation](https://vitejs.dev/)

## Next Steps

After successful deployment:

1. Set up a proper database (PostgreSQL with Prisma, or MongoDB)
2. Add user authentication and authorization
3. Implement property management features
4. Add payment processing for property listings
5. Set up monitoring and analytics
6. Add SEO optimization
7. Implement caching strategies
