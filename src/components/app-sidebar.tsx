
import * as React from "react";
import { Plus, Star, User, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function AppSidebar() {
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState<{
    id: string;
    name: string;
  }[]>([
    {
      id: 'default-chat',
      name: 'make money off clips...'
    }
  ]);

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  const handleCreateProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: `Project ${projects.length}`
    };
    setProjects(prev => [newProject, ...prev]);
  };

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
                <SidebarMenuButton tooltip="Create New Project" className="text-white hover:bg-[#1c1528]" onClick={handleCreateProject}>
                  <Plus className="text-white" />
                  <span>Create New Project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {projects.length > 0 && (
                <>
                  <SidebarGroupLabel className="text-white mt-4 px-2">Chat History</SidebarGroupLabel>
                  {projects.map(project => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton tooltip={project.name} className="ml-4 text-white hover:bg-[#1c1528]">
                        <span>{project.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleUpgradeClick} tooltip="Upgrade" className="text-white hover:bg-[#1c1528]">
              <Star className="text-white bg-gray-950" />
              <span>Upgrade</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Account" className="text-white hover:bg-[#1c1528]" onClick={() => navigate('/demo/profile')}>
              <User className="text-white" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
