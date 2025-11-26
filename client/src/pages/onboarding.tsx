import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckSquare } from "lucide-react";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setLocation("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="zigzag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L10 10 L20 20 L30 10 L40 20" stroke="white" strokeWidth="2" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zigzag)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-md text-center space-y-8">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
            <CheckSquare className="w-16 h-16 text-white" strokeWidth={2} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Manage What To Do
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            The best way to manage what you have to do, and to forget your plans
          </p>
        </div>

        <div className="pt-8">
          <Button
            onClick={handleGetStarted}
            className="w-full bg-white text-primary hover:bg-white/90 text-lg font-semibold py-6 shadow-lg"
            data-testid="button-get-started"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
