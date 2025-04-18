
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, User, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Kaam Wallah Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Post a Job</h3>
                <p className="text-gray-600 mb-4">Describe what you need done, when you need it, and your budget</p>
                <Button variant="outline" onClick={() => navigate("/post-job")}>
                  Post a Job
                </Button>
              </div>
              
              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Find Workers</h3>
                <p className="text-gray-600 mb-4">Browse through skilled workers and choose the best match for your job</p>
                <Button variant="outline" onClick={() => navigate("/workers")}>
                  Browse Workers
                </Button>
              </div>
              
              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Get Work Done</h3>
                <p className="text-gray-600 mb-4">Communicate with workers, get your job done, and pay securely</p>
                <Button variant="outline" onClick={() => navigate("/jobs")}>
                  View Jobs
                </Button>
              </div>
            </div>
          </div>
        </section>
      
        <CategorySection />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of people who are already using Kaam Wallah to find workers or jobs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate("/post-job")}>
                  Post a Job <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/workers")}>
                  Find Workers <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Kaam Wallah</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Trusted Workers</h3>
                <p className="text-center text-gray-600">
                  All workers are verified and rated by the community to ensure quality
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6">
                <Star className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Quality Work</h3>
                <p className="text-center text-gray-600">
                  Skilled professionals deliver high-quality work, on time and within budget
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6">
                <Briefcase className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Easy Hiring</h3>
                <p className="text-center text-gray-600">
                  Simple process to post jobs, hire workers, and get your work done
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
