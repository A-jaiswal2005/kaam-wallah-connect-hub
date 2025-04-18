
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="bg-gradient-to-b from-primary/10 to-background py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Find Skilled Workers Near You
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Connect with trusted laborers, electricians, plumbers and more in your area
        </p>
        <div className="mt-8 flex justify-center">
          <form onSubmit={handleSearch} className="flex w-full max-w-md items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Search for skilled workers..." 
              className="flex-1" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
