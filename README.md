# Real Estate Ecommerce Platform

A modern, full-stack real estate ecommerce platform built with React, TypeScript, and Vercel. Features property listings, search, filtering, and image uploads with Vercel Blob storage.

## 🚀 Features

- **Property Listings**: Browse and search through property listings
- **Advanced Filtering**: Filter by type, location, price, bedrooms, bathrooms
- **Image Upload**: Upload property images to Vercel Blob storage
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Built with Radix UI components and shadcn/ui
- **Type Safety**: Full TypeScript support
- **API Integration**: RESTful API with proper error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** + **shadcn/ui** for components
- **React Query** for data fetching
- **React Hook Form** with Zod validation
- **React Router** for navigation

### Backend
- **Vercel Functions** (Node.js)
- **Vercel Blob** for image storage
- **TypeScript** for type safety
- **RESTful API** design

## 📁 Project Structure

```
homestead-forge-main/
├── api/                    # Vercel API routes
│   ├── properties/         # Property CRUD operations
│   └── upload/            # Image upload endpoints
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility functions
├── lib/                  # Backend utilities
│   └── database.ts       # Database abstraction layer
├── public/               # Static assets
└── vercel.json          # Vercel configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd homestead-forge-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📡 API Endpoints

### Properties
- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/[id]` - Get a specific property
- `POST /api/properties` - Create a new property
- `PUT /api/properties/[id]` - Update a property
- `DELETE /api/properties/[id]` - Delete a property

### Upload
- `POST /api/upload` - Upload images to Vercel Blob
- `GET /api/upload` - Get upload configuration

### Example API Usage

```typescript
// Get all properties
const response = await fetch('/api/properties');
const { data } = await response.json();

// Create a new property
const newProperty = await fetch('/api/properties', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Beautiful House',
    type: 'house',
    price: 500000,
    // ... other fields
  })
});

// Upload an image
const formData = new FormData();
formData.append('file', imageFile);
const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

## 🎨 UI Components

The project uses a comprehensive set of UI components from shadcn/ui:

- **Forms**: Input, Select, Checkbox, Radio Group
- **Layout**: Card, Dialog, Sheet, Accordion
- **Navigation**: Button, Dropdown Menu, Tabs
- **Feedback**: Toast, Alert, Progress
- **Data Display**: Table, Badge, Avatar

## 🗄️ Database Schema

Currently using in-memory storage for demo purposes. The schema includes:

```typescript
interface Property {
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
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Yes |
| `NEXT_PUBLIC_API_URL` | API base URL | Yes |
| `NODE_ENV` | Environment | Yes |

### Vercel Configuration

The project includes `vercel.json` for optimal Vercel deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for git messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Review the [Vercel Documentation](https://vercel.com/docs)
- Open an issue for bugs or feature requests

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Persistent database (PostgreSQL/MongoDB)
- [ ] Payment processing
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications
- [ ] Mobile app with React Native
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Advanced image processing