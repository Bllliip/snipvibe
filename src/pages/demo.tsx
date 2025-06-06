
import { Hero1 } from "@/components/ui/hero-1";
import { AppSidebar, ChatProvider } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HoverButton } from "@/components/ui/hover-button";
import { ProfileInfo } from "@/components/ui/profile-info";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DemoOne = () => {
  return (
    <ChatProvider>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1">
            <Hero1 />
          </div>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
};

const HoverButtonDemo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen grid place-items-center bg-[#0c0414] relative">
      <button 
        onClick={() => navigate('/demo')}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1c1528]/50 text-white hover:bg-[#1c1528] transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <HoverButton>Get Started</HoverButton>
    </div>
  );
};

const ProfileDemo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0414] p-4 relative">
      <button 
        onClick={() => navigate('/demo')}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1c1528]/50 text-white hover:bg-[#1c1528] transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <ProfileInfo 
        username="John Doe"
        email="john@example.com"
        plan="free"
        credits={45}
        maxCredits={100}
      />
    </div>
  );
};

// IMPORTANT:
// format of the export MUST be export default { DemoOneOrOtherName }
// if you don't do this, the demo will not be shown
export default { DemoOne, HoverButtonDemo, ProfileDemo };
