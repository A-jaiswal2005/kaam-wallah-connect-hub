
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/workers?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary/20 to-background py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Find Skilled Workers <span className="text-primary">Near You</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Connect with trusted laborers, electricians, plumbers and more in your area for your home and business needs
        </p>
        
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <Input 
              type="text" 
              placeholder="What type of work do you need done?" 
              className="flex-1 h-12 text-lg" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="lg" className="h-12">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </form>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate("/post-job")}
            className="group"
          >
            Post a Job
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            size="lg"
            onClick={() => navigate("/workers")}
            className="group"
          >
            Browse Workers
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
            <span className="text-sm font-medium">1000+ Skilled Workers</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
            <span className="text-sm font-medium">500+ Completed Jobs</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
            <span className="text-sm font-medium">100% Satisfaction Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
