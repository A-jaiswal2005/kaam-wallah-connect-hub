
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/Header";

export default function PostJob() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  
  // Get user ID
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
        return;
      }
      setUserId(data.session.user.id);
    };
    
    checkUser();
  }, [navigate]);
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['job-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a job",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!title || !description || !categoryId) {
      toast({
        title: "Required fields missing",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([
          {
            title,
            description,
            category_id: categoryId,
            client_id: userId,
            budget: budget ? parseFloat(budget) : null,
            location,
            status: 'open',
          },
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Job posted",
        description: "Your job has been successfully posted",
      });
      
      navigate("/jobs");
    } catch (error: any) {
      toast({
        title: "Error posting job",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide the details of the job you want to post
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Bathroom Renovation, Electrical Repair"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={categoryId?.toString()}
                    onValueChange={(value) => setCategoryId(parseInt(value))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the job, requirements, and any specific details"
                    className="min-h-[150px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Your budget for this job in Rupees"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where the job will be performed"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Posting..." : "Post Job"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
