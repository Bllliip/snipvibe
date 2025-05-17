
import * as React from "react";
import { Plus, Star, User, Zap } from "lucide-react";
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
    <Sidebar className="bg-[#0c0414]">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Zap className="h-5 w-5 text-white" />
          <span className="font-bold text-sm text-white">ClipVibe</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Create New Project" className="text-white hover:bg-[#1c1528]">
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
            <SidebarMenuButton tooltip="Upgrade" className="text-white hover:bg-[#1c1528]">
              <Star className="text-white" />
              <span>Upgrade</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Account" className="text-white hover:bg-[#1c1528]">
              <User className="text-white" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
