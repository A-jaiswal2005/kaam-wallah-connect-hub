
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/Header";

type Worker = {
  id: string;
  hourly_rate: number;
  years_experience: number;
  bio: string;
  location: string;
  skills: string[];
  profile: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
};

export default function Workers() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");
  const categoryName = queryParams.get("name");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  
  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers', categoryId],
    queryFn: async () => {
      const query = supabase
        .from('workers')
        .select(`
          id,
          hourly_rate,
          years_experience,
          bio,
          location,
          skills,
          profile:profiles(full_name, username, avatar_url)
        `)
        .eq('available', true);
        
      if (categoryId) {
        query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Worker[];
    },
  });
  
  useEffect(() => {
    if (workers) {
      setFilteredWorkers(
        searchTerm
          ? workers.filter(
              (worker) =>
                worker.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (worker.skills && worker.skills.some(skill => 
                  skill.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            )
          : workers
      );
    }
  }, [workers, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="bg-gradient-to-b from-primary/10 to-background py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">
              {categoryName ? `${categoryName} Workers` : "All Workers"}
            </h1>
            
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex w-full max-w-md items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search by name, skills, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </form>
            
            {isLoading ? (
              <p>Loading workers...</p>
            ) : filteredWorkers.length === 0 ? (
              <p>No workers found. Try a different search or category.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map((worker) => (
                  <Card key={worker.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {worker.profile.avatar_url ? (
                            <img
                              src={worker.profile.avatar_url}
                              alt={worker.profile.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-primary">
                              {worker.profile.full_name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <CardTitle>{worker.profile.full_name}</CardTitle>
                          <CardDescription>@{worker.profile.username}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {worker.location && (
                        <p><span className="font-semibold">Location:</span> {worker.location}</p>
                      )}
                      {worker.hourly_rate && (
                        <p><span className="font-semibold">Rate:</span> ₹{worker.hourly_rate}/hr</p>
                      )}
                      {worker.years_experience && (
                        <p><span className="font-semibold">Experience:</span> {worker.years_experience} years</p>
                      )}
                      {worker.bio && (
                        <p><span className="font-semibold">Bio:</span> {worker.bio}</p>
                      )}
                      {worker.skills && worker.skills.length > 0 && (
                        <div>
                          <span className="font-semibold">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {worker.skills.map((skill, index) => (
                              <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Contact Worker</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
