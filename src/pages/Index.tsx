
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
      </main>
    </div>
  );
};

export default Index;
