
import * as React from "react";
import { Plus, Star, User, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface Project {
  id: string;
  name: string;
  messages: Message[];
}

// Create a context to share chat data between sidebar and main content
export const ChatContext = React.createContext<{
  projects: Project[];
  activeProjectId: string;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setActiveProjectId: React.Dispatch<React.SetStateAction<string>>;
  updateProjectMessages: (projectId: string, messages: Message[]) => void;
  createNewProject: () => void;
} | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>([
    {
      id: 'default-chat',
      name: 'make money off clips...',
      messages: []
    }
  ]);
  const [activeProjectId, setActiveProjectId] = React.useState('default-chat');

  const updateProjectMessages = (projectId: string, messages: Message[]) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, messages }
        : project
    ));
  };

  const createNewProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: 'How ClipVibe can help you today?',
      messages: []
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  const value = {
    projects,
    activeProjectId,
    setProjects,
    setActiveProjectId,
    updateProjectMessages,
    createNewProject
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function AppSidebar() {
  const navigate = useNavigate();
  const chatContext = React.useContext(ChatContext);
  
  if (!chatContext) {
    throw new Error('AppSidebar must be used within ChatProvider');
  }

  const { projects, activeProjectId, setActiveProjectId, createNewProject } = chatContext;

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  const handleCreateProject = () => {
    createNewProject();
  };

  const handleProjectClick = (projectId: string) => {
    setActiveProjectId(projectId);
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
                      <SidebarMenuButton 
                        tooltip={project.name} 
                        className={`ml-4 text-white hover:bg-[#1c1528] ${
                          activeProjectId === project.id ? 'bg-[#1c1528]' : ''
                        }`}
                        onClick={() => handleProjectClick(project.id)}
                      >
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
