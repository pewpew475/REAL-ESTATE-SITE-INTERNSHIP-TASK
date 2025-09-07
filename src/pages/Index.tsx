import { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/HeroSection";
import { PropertyFilters, FilterState } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";
import { AddPropertyForm } from "@/components/AddPropertyForm";
import { PropertyDetailsModal } from "@/components/PropertyDetailsModal";
import { Property } from "@/types/property";
import { mockProperties } from "@/data/mockProperties";
import { propertiesApi } from "@/services/api";

const Index = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    propertyType: '',
    location: '',
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: '',
    bathrooms: '',
  });

  // Fetch and keep properties in sync with API
  const fetchAndSetProperties = useCallback(async () => {
    try {
      const response = await propertiesApi.getAll({
        searchQuery: filters.searchQuery,
        propertyType: filters.propertyType,
        location: filters.location,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
      });

      if (response.success && response.data) {
        setProperties(response.data);
      }
    } catch (err) {
      // Silently ignore to avoid UX disruption; local state remains
    }
  }, [filters]);

  useEffect(() => {
    // Initial fetch
    fetchAndSetProperties();

    // Poll every 15s
    const intervalId = window.setInterval(fetchAndSetProperties, 15000);

    // Refetch on window focus
    const onFocus = () => fetchAndSetProperties();
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchAndSetProperties]);

  const filteredProperties = useMemo(() => {
    const filtered = properties.filter(property => {
      const matchesSearch = !filters.searchQuery || 
        property.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesType = !filters.propertyType || property.type === filters.propertyType;
      
      const matchesLocation = !filters.location || 
        property.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesPrice = property.price >= filters.minPrice && property.price <= filters.maxPrice;
      
      const matchesBedrooms = !filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms);
      
      const matchesBathrooms = !filters.bathrooms || property.bathrooms >= parseInt(filters.bathrooms);
      
      return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesBedrooms && matchesBathrooms;
    });
    
    console.log('Filtered properties:', filtered.length, 'out of', properties.length, 'total');
    console.log('Current filters:', filters);
    
    return filtered;
  }, [properties, filters]);

  const handleSearch = (query: string, type: string, location: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query,
      propertyType: type,
      location: location
    }));
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleAddProperty = async (newProperty: Omit<Property, 'id' | 'createdAt'>) => {
    try {
      // Create the property object
      const property: Property = {
        ...newProperty,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      };
      
      // Add to local state immediately for better UX
      setProperties(prev => {
        const newProperties = [property, ...prev];
        console.log('Properties updated:', newProperties.length, 'total properties');
        console.log('New property added:', property);
        return newProperties;
      });
      
      // Also try to save to API (optional - for persistence)
      try {
        const response = await fetch('/api/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(property),
        });
        
        if (response.ok) {
          console.log('Property saved to API successfully');
          // Immediately refetch to reconcile IDs and ensure global visibility
          fetchAndSetProperties();
        } else {
          console.warn('Failed to save property to API, but it\'s still added locally');
        }
      } catch (apiError) {
        console.warn('API save failed, but property is still added locally:', apiError);
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">RealEstate</h1>
            </div>
            <Button 
              onClick={() => setIsAddFormOpen(true)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              List Property
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters onFilterChange={setFilters} />
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Available Properties
            </h2>
            <p className="text-muted-foreground">
              {filteredProperties.length} properties found
            </p>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No properties found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters or add a new property.
            </p>
            <Button 
              onClick={() => setIsAddFormOpen(true)}
              className="mt-4 bg-gradient-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddPropertyForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddProperty}
      />

      <PropertyDetailsModal
        property={selectedProperty}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProperty(null);
        }}
      />
    </div>
  );
};

export default Index;
