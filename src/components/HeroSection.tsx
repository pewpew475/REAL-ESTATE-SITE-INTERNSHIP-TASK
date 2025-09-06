import { useState } from "react";
import { Search, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyTypes } from "@/types/property";
import heroImage from "@/assets/hero-image.jpg";

interface HeroSectionProps {
  onSearch: (query: string, type: string, location: string) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery, propertyType, location);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Home className="h-8 w-8 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Find Your Dream Home
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Discover the perfect property that matches your lifestyle and budget
          </p>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-0 bg-background/50"
                />
              </div>
              
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12 border-0 bg-background/50">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {PropertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 border-0 bg-background/50"
                />
              </div>

              <Button 
                onClick={handleSearch}
                className="h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center text-sm">
              <span className="text-muted-foreground">Popular:</span>
              {['Apartments', 'Houses', 'Condos', 'Villas'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setPropertyType(tag.toLowerCase().slice(0, -1));
                    onSearch(searchQuery, tag.toLowerCase().slice(0, -1), location);
                  }}
                  className="px-3 py-1 bg-accent hover:bg-primary hover:text-white rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};