
import { Hero1 } from "@/components/ui/hero-1";
import { AppSidebar, ChatProvider } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HoverButton } from "@/components/ui/hover-button";
import { ProfileInfo } from "@/components/ui/profile-info";
import { AccountDialog } from "@/components/ui/account-dialog";
import { X, User } from "lucide-react";
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

const AccountDemo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <button 
        onClick={() => navigate('/demo')}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <AccountDialog
        username="John Doe"
        email="john@example.com"
        plan="free"
        credits={45}
        maxCredits={100}
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <User className="h-4 w-4" />
          Account Settings
        </button>
      </AccountDialog>
    </div>
  );
};

// IMPORTANT:
// format of the export MUST be export default { DemoOneOrOtherName }
// if you don't do this, the demo will not be shown
export default { DemoOne, HoverButtonDemo, ProfileDemo, AccountDemo };
