import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Job = {
  id: string;
  title: string;
  description: string;
  category_id: number;
  client_id: string;
  worker_id: string | null;
  status: string;
  budget: number | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
  };
  client_name: string | null;
  client_username: string | null;
};

export default function Jobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("_all");
  const [statusFilter, setStatusFilter] = useState<string>("_all");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all-jobs");
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      }
    };
    
    checkUser();
  }, []);
  
  const { data: categories } = useQuery({
    queryKey: ['jobs-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
  
  const { data: allJobs, isLoading: isLoadingAllJobs, refetch: refetchAllJobs } = useQuery({
    queryKey: ['all-jobs'],
    queryFn: async () => {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          category:categories(id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (jobsError) throw jobsError;
      
      const jobsWithClientData = await Promise.all((jobsData || []).map(async (job) => {
        const { data: clientData } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', job.client_id)
          .single();
          
        return {
          ...job,
          client_name: clientData?.full_name || null,
          client_username: clientData?.username || null
        };
      }));
      
      return jobsWithClientData as Job[];
    },
  });
  
  const { data: myJobs, isLoading: isLoadingMyJobs, refetch: refetchMyJobs } = useQuery({
    queryKey: ['my-jobs', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (jobsError) throw jobsError;
      
      const jobsWithClientData = await Promise.all((jobsData || []).map(async (job) => {
        const { data: clientData } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', job.client_id)
          .single();
          
        return {
          ...job,
          client_name: clientData?.full_name || null,
          client_username: clientData?.username || null
        };
      }));
      
      return jobsWithClientData as Job[];
    },
    enabled: !!userId,
  });
  
  const { data: assignedJobs, isLoading: isLoadingAssignedJobs, refetch: refetchAssignedJobs } = useQuery({
    queryKey: ['assigned-jobs', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('worker_id', userId)
        .order('created_at', { ascending: false });
      
      if (jobsError) throw jobsError;
      
      const jobsWithClientData = await Promise.all((jobsData || []).map(async (job) => {
        const { data: clientData } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', job.client_id)
          .single();
          
        return {
          ...job,
          client_name: clientData?.full_name || null,
          client_username: clientData?.username || null
        };
      }));
      
      return jobsWithClientData as Job[];
    },
    enabled: !!userId,
  });
  
  useEffect(() => {
    console.log("Filtering jobs based on active tab:", activeTab);
    console.log("allJobs:", allJobs);
    console.log("myJobs:", myJobs);
    console.log("assignedJobs:", assignedJobs);
    console.log("userId:", userId);
    
    const filterJobs = (jobs: Job[] | undefined) => {
      if (!jobs) return [];
      
      return jobs.filter((job) => {
        const matchesSearch = 
          !searchTerm || 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));
          
        const matchesCategory = categoryFilter === "_all" || job.category_id.toString() === categoryFilter;
        const matchesStatus = statusFilter === "_all" || job.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
    };
    
    if (activeTab === 'my-jobs') {
      setFilteredJobs(filterJobs(myJobs));
    } else if (activeTab === 'assigned-jobs') {
      setFilteredJobs(filterJobs(assignedJobs));
    } else {
      if (allJobs) {
        const otherJobs = userId 
          ? allJobs.filter(job => job.client_id !== userId)
          : allJobs;
        setFilteredJobs(filterJobs(otherJobs));
      }
    }
  }, [allJobs, myJobs, assignedJobs, searchTerm, categoryFilter, statusFilter, userId, activeTab]);
  
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
    setSearchTerm("");
    setCategoryFilter("_all");
    setStatusFilter("_all");
    
    if (value === 'all-jobs') refetchAllJobs();
    if (value === 'my-jobs') refetchMyJobs();
    if (value === 'assigned-jobs') refetchAssignedJobs();
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Jobs</h1>
          <Button onClick={() => navigate('/post-job')}>
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        </div>
        
        <Tabs defaultValue="all-jobs" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs" disabled={!userId}>My Jobs</TabsTrigger>
            <TabsTrigger value="assigned-jobs" disabled={!userId}>Assigned to Me</TabsTrigger>
          </TabsList>
          
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-1 items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">All categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">All statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>
          
          <TabsContent value="all-jobs">
            {isLoadingAllJobs ? (
              <p>Loading jobs...</p>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No jobs found. Try a different search or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} userId={userId} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-jobs">
            {!userId ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">Please log in to view your jobs</p>
                <Button className="mt-4" onClick={() => navigate('/auth')}>
                  Login
                </Button>
              </div>
            ) : isLoadingMyJobs ? (
              <p>Loading your jobs...</p>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">You haven't posted any jobs yet</p>
                <Button className="mt-4" onClick={() => navigate('/post-job')}>
                  Post a Job
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} userId={userId} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="assigned-jobs">
            {!userId ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">Please log in to view jobs assigned to you</p>
                <Button className="mt-4" onClick={() => navigate('/auth')}>
                  Login
                </Button>
              </div>
            ) : isLoadingAssignedJobs ? (
              <p>Loading assigned jobs...</p>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No jobs are currently assigned to you</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} userId={userId} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function JobCard({ job, userId }: { job: Job; userId: string | null }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-100 text-emerald-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const applyForJob = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for this job",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    const { data: workerProfile, error: workerError } = await supabase
      .from('workers')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (workerError || !workerProfile) {
      toast({
        title: "Worker profile required",
        description: "You need to register as a worker to apply for jobs",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }
    
    toast({
      title: "Application sent",
      description: "Your interest has been registered for this job",
    });
  };
  
  return (
    <Card key={job.id}>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>
              Posted by: {job.client_name || "Anonymous"}
            </CardDescription>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(job.status)}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Category:</span> {job.category?.name}
        </p>
        {job.location && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Location:</span> {job.location}
          </p>
        )}
        {job.budget && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Budget:</span> ₹{job.budget}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Posted:</span> {formatDate(job.created_at)}
        </p>
        <p className="line-clamp-3 text-sm mt-2">{job.description}</p>
      </CardContent>
      <CardFooter>
        {job.client_id === userId ? (
          <Button variant="outline" className="w-full">
            Manage Job
          </Button>
        ) : (
          <Button 
            className="w-full" 
            disabled={job.status !== 'open'}
            onClick={applyForJob}
          >
            {job.status === 'open' ? 'Apply for Job' : 'Not Available'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
