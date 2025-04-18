
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Hammer, Menu, User, LogOut, Search, Briefcase, FileText, UserCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Hammer className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Kaam Wallah</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link to="/workers" className="text-sm font-medium hover:text-primary">
              Find Workers
            </Link>
            <Link to="/jobs" className="text-sm font-medium hover:text-primary">
              Jobs
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <UserCircle className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/jobs")}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>My Jobs</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button onClick={() => navigate("/post-job")}>
                  Post a Job
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/auth?tab=register")}>
                  Register
                </Button>
              </>
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/">Home</Link>
                  </Button>
                  <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/workers">Find Workers</Link>
                  </Button>
                  <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/jobs">Jobs</Link>
                  </Button>
                  
                  {user ? (
                    <>
                      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                        <Link to="/profile">My Profile</Link>
                      </Button>
                      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                        <Link to="/post-job">Post a Job</Link>
                      </Button>
                      <Button variant="ghost" onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                        <Link to="/auth">Login</Link>
                      </Button>
                      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                        <Link to="/auth?tab=register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
