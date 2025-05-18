
import { Hero1 } from "@/components/ui/hero-1";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HoverButton } from "@/components/ui/hover-button";
import { ProfileInfo } from "@/components/ui/profile-info";

const DemoOne = () => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1">
          <Hero1 />
        </div>
      </div>
    </SidebarProvider>
  );
};

const HoverButtonDemo = () => {
  return (
    <div className="min-h-screen grid place-items-center bg-[#0c0414]">
      <HoverButton>Get Started</HoverButton>
    </div>
  );
};

const ProfileDemo = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0414] p-4">
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
