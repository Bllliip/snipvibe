import * as React from "react";
import { Plus, Star, User, Zap, MoreVertical, Pin, Edit, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface Project {
  id: string;
  name: string;
  messages: Message[];
  isPinned?: boolean;
}

// Create a context to share chat data between sidebar and main content
export const ChatContext = React.createContext<{
  projects: Project[];
  activeProjectId: string;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setActiveProjectId: React.Dispatch<React.SetStateAction<string>>;
  updateProjectMessages: (projectId: string, messages: Message[]) => void;
  createNewProject: () => void;
  pinProject: (projectId: string) => void;
  editProjectName: (projectId: string, newName: string) => void;
  deleteProject: (projectId: string) => void;
} | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>([
    {
      id: 'default-chat',
      name: 'make money off clips...',
      messages: [],
      isPinned: false
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
      messages: [],
      isPinned: false
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  const pinProject = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isPinned: !project.isPinned }
        : project
    ));
  };

  const editProjectName = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, name: newName }
        : project
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => {
      const filtered = prev.filter(project => project.id !== projectId);
      // If we're deleting the active project, switch to the first available one
      if (activeProjectId === projectId && filtered.length > 0) {
        setActiveProjectId(filtered[0].id);
      }
      return filtered;
    });
  };

  const value = {
    projects,
    activeProjectId,
    setProjects,
    setActiveProjectId,
    updateProjectMessages,
    createNewProject,
    pinProject,
    editProjectName,
    deleteProject
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
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');
  
  if (!chatContext) {
    throw new Error('AppSidebar must be used within ChatProvider');
  }

  const { projects, activeProjectId, setActiveProjectId, createNewProject, pinProject, editProjectName, deleteProject } = chatContext;

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  const handleCreateProject = () => {
    createNewProject();
  };

  const handleProjectClick = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  const handleEditStart = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingName(project.name);
  };

  const handleEditSubmit = (projectId: string) => {
    if (editingName.trim()) {
      editProjectName(projectId, editingName.trim());
    }
    setEditingProjectId(null);
    setEditingName('');
  };

  const handleEditCancel = () => {
    setEditingProjectId(null);
    setEditingName('');
  };

  // Sort projects: pinned first, then by creation time (newest first)
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <Sidebar className="bg-gradient-to-b from-red-900 to-black">
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
                <SidebarMenuButton tooltip="Create New Project" className="text-white hover:bg-red-800/50" onClick={handleCreateProject}>
                  <Plus className="text-white" />
                  <span>Create New Project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {sortedProjects.length > 0 && (
                <>
                  <SidebarGroupLabel className="text-white mt-4 px-2">Chat History</SidebarGroupLabel>
                  {sortedProjects.map(project => (
                    <SidebarMenuItem key={project.id}>
                      <div className="flex items-center group w-full">
                        <SidebarMenuButton 
                          tooltip={project.name} 
                          className={`flex-1 ml-4 text-white hover:bg-red-800/50 ${
                            activeProjectId === project.id ? 'bg-red-800/50' : ''
                          }`}
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            {project.isPinned && <Pin className="h-3 w-3 text-yellow-400" />}
                            {editingProjectId === project.id ? (
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={() => handleEditSubmit(project.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditSubmit(project.id);
                                  } else if (e.key === 'Escape') {
                                    handleEditCancel();
                                  }
                                }}
                                className="bg-transparent border-none outline-none text-white flex-1 min-w-0"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="truncate flex-1">{project.name}</span>
                            )}
                          </div>
                        </SidebarMenuButton>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-800/50 text-white transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-black border-red-800">
                            <DropdownMenuItem 
                              onClick={() => pinProject(project.id)}
                              className="text-white hover:bg-red-800/50 cursor-pointer"
                            >
                              <Pin className="h-4 w-4 mr-2" />
                              {project.isPinned ? 'Unpin chat' : 'Pin chat'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEditStart(project)}
                              className="text-white hover:bg-red-800/50 cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit chat name
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteProject(project.id)}
                              className="text-red-400 hover:bg-red-800/50 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
            <SidebarMenuButton onClick={handleUpgradeClick} tooltip="Upgrade" className="text-white hover:bg-red-800/50">
              <Star className="text-white bg-gray-950" />
              <span>Upgrade</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Account" className="text-white hover:bg-red-800/50" onClick={() => navigate('/demo/profile')}>
              <User className="text-white" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
