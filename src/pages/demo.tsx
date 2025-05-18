
// This is a demo of a preview
// That's what users will see in the preview

import { Hero1 } from "@/components/ui/hero-1";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HoverButton } from "@/components/ui/hover-button";

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

// IMPORTANT:
// format of the export MUST be export default { DemoOneOrOtherName }
// if you don't do this, the demo will not be shown
export default { DemoOne, HoverButtonDemo };
