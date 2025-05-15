
// This is a demo of a preview
// That's what users will see in the preview

import { Hero1 } from "@/components/ui/hero-1";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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

// IMPORTANT:
// format of the export MUST be export default { DemoOneOrOtherName }
// if you don't do this, the demo will not be shown
export default { DemoOne };
