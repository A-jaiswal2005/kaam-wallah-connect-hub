
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hammer, Wrench, Plug, Tools } from "lucide-react";

const categories = [
  {
    title: "Laborers",
    description: "General construction and manual labor work",
    icon: Hammer,
  },
  {
    title: "Electricians",
    description: "Electrical installation and repairs",
    icon: Plug,
  },
  {
    title: "Plumbers",
    description: "Plumbing services and repairs",
    icon: Wrench,
  },
  {
    title: "Other Skills",
    description: "Various skilled trade services",
    icon: Tools,
  },
];

export function CategorySection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Workers
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
