
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isWorker, setIsWorker] = useState(false);
  
  // Profile data
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Worker data
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [hourlyRate, setHourlyRate] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [available, setAvailable] = useState(true);
  
  // Get user session
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
    queryKey: ['profile-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
  
  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!userId,
  });
  
  // Fetch worker profile if exists
  const { data: workerProfile } = useQuery({
    queryKey: ['worker-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!userId,
  });
  
  // Set form values from fetched data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || "");
      setIsWorker(profile.is_worker || false);
    }
    
    if (workerProfile) {
      setCategoryId(workerProfile.category_id);
      setHourlyRate(workerProfile.hourly_rate?.toString() || "");
      setYearsExperience(workerProfile.years_experience?.toString() || "");
      setSkills(workerProfile.skills?.join(", ") || "");
      setBio(workerProfile.bio || "");
      setLocation(workerProfile.location || "");
      setAvailable(workerProfile.available || true);
    }
  }, [profile, workerProfile]);
  
  const updateProfile = async () => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      // Update basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username,
          avatar_url: avatarUrl,
          is_worker: isWorker,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      // If user is a worker, update or insert worker profile
      if (isWorker) {
        if (!categoryId) {
          toast({
            title: "Error",
            description: "Please select a category for your worker profile",
            variant: "destructive",
          });
          return;
        }
        
        const skillsArray = skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "");
        
        const workerData = {
          id: userId,
          category_id: categoryId,
          hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          skills: skillsArray,
          bio,
          location,
          available,
          updated_at: new Date().toISOString(),
        };
        
        // Check if worker profile exists
        if (workerProfile) {
          const { error: workerError } = await supabase
            .from('workers')
            .update(workerData)
            .eq('id', userId);
          
          if (workerError) throw workerError;
        } else {
          const { error: workerError } = await supabase
            .from('workers')
            .insert([workerData]);
          
          if (workerError) throw workerError;
        }
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="worker">Worker Settings</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Update your personal information and public profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">Avatar URL</Label>
                      <Input
                        id="avatarUrl"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="URL to your profile picture"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-worker"
                        checked={isWorker}
                        onCheckedChange={setIsWorker}
                      />
                      <Label htmlFor="is-worker">Register as a worker</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="worker">
                <Card>
                  <CardHeader>
                    <CardTitle>Worker Profile</CardTitle>
                    <CardDescription>
                      Set up your worker profile to start receiving job offers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={categoryId?.toString()}
                        onValueChange={(value) => setCategoryId(parseInt(value))}
                        disabled={!isWorker}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your work category" />
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
                      <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="Your hourly rate in Rupees"
                        disabled={!isWorker}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        placeholder="Years of experience"
                        disabled={!isWorker}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input
                        id="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="painting, plumbing, electrical, etc."
                        disabled={!isWorker}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell clients about yourself and your work experience"
                        disabled={!isWorker}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Your location (city, area, etc.)"
                        disabled={!isWorker}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="available"
                        checked={available}
                        onCheckedChange={setAvailable}
                        disabled={!isWorker}
                      />
                      <Label htmlFor="available">Available for work</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <div className="mt-6">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
