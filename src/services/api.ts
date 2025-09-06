import { Property } from '@/types/property';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface PropertyFilters {
  searchQuery?: string;
  propertyType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  bathrooms?: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Properties API
export const propertiesApi = {
  // Get all properties with optional filtering
  async getAll(filters?: PropertyFilters): Promise<ApiResponse<Property[]>> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.searchQuery) params.append('search', filters.searchQuery);
      if (filters?.propertyType) params.append('type', filters.propertyType);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters?.bathrooms) params.append('bathrooms', filters.bathrooms);

      const url = `${API_BASE_URL}/properties${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch properties');
      }

      return data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch properties'
      };
    }
  },

  // Get a single property by ID
  async getById(id: string): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch property');
      }

      return data;
    } catch (error) {
      console.error('Error fetching property:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch property'
      };
    }
  },

  // Create a new property
  async create(property: Omit<Property, 'id' | 'createdAt'>): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create property');
      }

      return data;
    } catch (error) {
      console.error('Error creating property:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create property'
      };
    }
  },

  // Update a property
  async update(id: string, updates: Partial<Omit<Property, 'id' | 'createdAt'>>): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update property');
      }

      return data;
    } catch (error) {
      console.error('Error updating property:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update property'
      };
    }
  },

  // Delete a property
  async delete(id: string): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete property');
      }

      return data;
    } catch (error) {
      console.error('Error deleting property:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete property'
      };
    }
  }
};

// Upload API
export const uploadApi = {
  // Upload a single file
  async uploadFile(file: File): Promise<ApiResponse<UploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      };
    }
  },

  // Upload multiple files
  async uploadFiles(files: File[]): Promise<ApiResponse<UploadResponse[]>> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file));
      const results = await Promise.all(uploadPromises);

      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      if (failedUploads.length > 0) {
        return {
          success: false,
          error: `${failedUploads.length} file(s) failed to upload`
        };
      }

      return {
        success: true,
        data: successfulUploads.map(result => result.data!)
      };
    } catch (error) {
      console.error('Error uploading files:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload files'
      };
    }
  },

  // Get upload configuration
  async getConfig(): Promise<ApiResponse<{
    maxFileSize: string;
    allowedTypes: string[];
    maxFiles: number;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/upload`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get upload config');
      }

      return data;
    } catch (error) {
      console.error('Error getting upload config:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get upload config'
      };
    }
  }
};
