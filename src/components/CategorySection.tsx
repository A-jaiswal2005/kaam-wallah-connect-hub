
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hammer, Wrench, Plug, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconComponents = {
  Hammer: Hammer,
  Plug: Plug,
  Wrench: Wrench,
  Briefcase: Briefcase,
};

export function CategorySection() {
  const navigate = useNavigate();
  
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const handleViewWorkers = (categoryId: number, categoryName: string) => {
    navigate(`/workers?category=${categoryId}&name=${categoryName}`);
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Loading categories...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => {
            const IconComponent = iconComponents[category.icon as keyof typeof iconComponents] || Briefcase;
            
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewWorkers(category.id, category.name)}
                  >
                    View Workers
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
