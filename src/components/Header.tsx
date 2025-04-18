
import { Button } from "@/components/ui/button";
import { Hammer, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Hammer className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Kaam Wallah</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Post a Job</Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
