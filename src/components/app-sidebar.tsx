
import * as React from "react";
import { Plus, Star, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar className="bg-[#121212]">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <img src="/lovable-uploads/19121974-93f0-40e5-996f-76720d6bbf5b.png" width={24} height={24} alt="ClipVibe Logo" />
          <span className="font-bold text-sm text-white">ClipVibe</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Create New Project" className="text-white hover:bg-[#1e1e1e]">
                  <Plus className="text-white" />
                  <span>Create New Project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Upgrade" className="text-white hover:bg-[#1e1e1e]">
              <Star className="text-white" />
              <span>Upgrade</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Account" className="text-white hover:bg-[#1e1e1e]">
              <User className="text-white" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
