"use client";

import * as React from "react";
import { Paperclip, Sparkles, Zap, Send, ChevronDown, ChevronUp, Trash2, Edit3, Share2, MoreHorizontal, ThumbsUp, ThumbsDown, Volume, Download, Edit, RefreshCcw, Upload, Globe } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { HoverButton } from "@/components/ui/hover-button";
import { ChatContext } from "@/components/app-sidebar";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const Hero1 = () => {
  const navigate = useNavigate();
  const chatContext = React.useContext(ChatContext);
  
  if (!chatContext) {
    throw new Error('Hero1 must be used within ChatProvider');
  }

  const { projects, activeProjectId, updateProjectMessages } = chatContext;
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const [inputValue, setInputValue] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [credits, setCredits] = React.useState(45);
  const [showClipSection, setShowClipSection] = React.useState(false);
  const [videoLink, setVideoLink] = React.useState("");
  const [showVideoControls, setShowVideoControls] = React.useState(false);
  const [showPublishOptions, setShowPublishOptions] = React.useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([]);
  
  // Get messages from the active project
  const messages = activeProject?.messages || [];
  const showChat = messages.length > 0;
  const showTypingAnimation = !showChat;

  // Check authentication on component mount and persist across navigation
  React.useEffect(() => {
    // Check localStorage first for persistent auth
    const storedAuth = localStorage.getItem('snipvibe_authenticated');
    const storedCredits = localStorage.getItem('snipvibe_credits');
    
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      if (storedCredits) {
        setCredits(parseInt(storedCredits, 10));
      }
    } else {
      // Fallback to URL params for initial authentication
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('authenticated') === 'true') {
        setIsAuthenticated(true);
        // Store authentication in localStorage for persistence
        localStorage.setItem('snipvibe_authenticated', 'true');
        localStorage.setItem('snipvibe_credits', credits.toString());
        
        // Clean up URL params
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  // Update localStorage when credits change
  React.useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('snipvibe_credits', credits.toString());
    }
  }, [credits, isAuthenticated]);

  const handleGetStarted = () => {
    navigate('/sign-in');
  };

  const handlePaperclipClick = () => {
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }
    setShowClipSection(!showClipSection);
  };

  const handleClipVideo = () => {
    if (!videoLink.trim()) return;
    
    // Add user message about clipping
    const userMessage = {
      id: `user-${Date.now()}`,
      text: `Please clip this video: ${videoLink}`,
      isUser: true
    };
    
    const newMessages = [...messages, userMessage];
    updateProjectMessages(activeProject.id, newMessages);
    
    setIsGenerating(true);
    
    // Simulate AI response for video clipping
    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        text: "I'll help you clip that video! Analyzing the content and creating clips based on the most engaging moments.",
        isUser: false
      };
      const finalMessages = [...newMessages, aiMessage];
      updateProjectMessages(activeProject.id, finalMessages);
      setIsGenerating(false);
      setCredits(prev => Math.max(0, prev - 1));
      // Show video controls after generation
      setShowVideoControls(true);
    }, 2000);
    
    setVideoLink("");
    setShowClipSection(false);
  };

  const handleSend = () => {
    if (!inputValue.trim() || !activeProject) return;
    
    // Check if user is authenticated before allowing chat
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      isUser: true
    };
    
    const newMessages = [...messages, userMessage];
    updateProjectMessages(activeProject.id, newMessages);
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsGenerating(true);
      
      // Simulate AI response
      setTimeout(() => {
        const aiMessage = {
          id: `ai-${Date.now()}`,
          text: "I'll help you with that! Let me analyze your request and provide you with a comprehensive strategy.",
          isUser: false
        };
        const finalMessages = [...newMessages, aiMessage];
        updateProjectMessages(activeProject.id, finalMessages);
        setIsGenerating(false);
        // Decrease credits after successful response
        setCredits(prev => Math.max(0, prev - 1));
        // Show video controls after generation
        setShowVideoControls(true);
      }, 2000);
    }, 500);
    
    setInputValue("");
  };

  const handleDeleteVideo = () => {
    setShowVideoControls(false);
    setShowPublishOptions(false);
    console.log("Video deleted");
  };

  const handleFineTune = () => {
    console.log("Fine-tuning video");
  };

  const handlePublish = () => {
    setShowPublishOptions(true);
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handlePlatformPublish = () => {
    if (selectedPlatforms.length === 0) return;
    
    console.log(`Publishing to ${selectedPlatforms.join(', ')}`);
    setShowPublishOptions(false);
    setShowVideoControls(false);
    setSelectedPlatforms([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex flex-col relative overflow-x-hidden">
      {/* Gradient */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-50rem] right-[-50rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-60rem] right-[-60rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        <div className="w-[10rem] h-[30rem]  bg-linear-90 from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem]  bg-linear-90 from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem]  bg-linear-90 from-white to-blue-300"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="mr-2" />
          <Zap className="h-5 w-5 text-white" />
          <div className="font-bold text-md">Snip Vibe</div>
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-2 bg-[#1c1528] px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-medium">{credits} credits</span>
          </div>
        ) : (
          <HoverButton onClick={handleGetStarted} className="text-white">
            Get Started
          </HoverButton>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${showChat ? 'pb-24' : 'items-center justify-center'} px-4 text-center`}>
        <div className="max-w-6xl mx-auto space-y-6 w-full">
          {/* Typing Animation - show when no chat exists */}
          {showTypingAnimation && (
            <div className="mb-8">
              <TypingAnimation
                text="How can I help you?"
                duration={100}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              />
            </div>
          )}

          {/* Chat Messages */}
          {showChat && (
            <div className="max-w-4xl mx-auto space-y-4 flex-1 overflow-y-auto">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-[#1c1528] text-gray-300'
                  }`}>
                    {message.text}
                    
                    {/* Compact Toolbar for AI Messages */}
                    {!message.isUser && (
                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[#2a1f3d]">
                        <button className="p-1 rounded hover:bg-[#2a1f3d] transition-colors">
                          <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#2a1f3d] transition-colors">
                          <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#2a1f3d] transition-colors">
                          <Volume className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#2a1f3d] transition-colors">
                          <Download className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#2a1f3d] transition-colors">
                          <Edit className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#2a1f3d] transition-colors">
                          <RefreshCcw className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#2a1f3d] transition-colors">
                          <Upload className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#2a1f3d] transition-colors">
                          <Globe className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Generation State */}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-[#1c1528] rounded-lg p-4 max-w-xs lg:max-w-md">
                    <div className="flex items-center gap-2 text-violet-200 mb-2">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Generating response...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gradient-to-r from-violet-400/20 to-blue-400/20 rounded animate-pulse"></div>
                      <div className="h-2 bg-gradient-to-r from-blue-400/20 to-violet-400/20 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Control Buttons - appear after generation without forcing interaction */}
              {showVideoControls && !isGenerating && (
                <div className="flex justify-center">
                  {!showPublishOptions ? (
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleDeleteVideo}
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Video
                      </Button>
                      <Button 
                        onClick={handleFineTune}
                        variant="outline"
                        className="flex items-center gap-2 bg-[#0c0414] border-[#3d2e59] text-white hover:bg-[#2a1f3d]"
                      >
                        <Edit3 className="w-4 h-4" />
                        Fine-tune Video
                      </Button>
                      <Button 
                        onClick={handlePublish}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700"
                      >
                        <Share2 className="w-4 h-4" />
                        Publish
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-[#1c1528] rounded-lg p-4 border border-[#3d2e59]">
                      <div className="space-y-4 w-64">
                        <div className="text-center">
                          <h3 className="text-white font-medium mb-3">Select Platforms</h3>
                          <div className="space-y-3">
                            {[
                              { id: 'tiktok', label: 'TikTok' },
                              { id: 'instagram', label: 'Instagram Reels' },
                              { id: 'youtube', label: 'YouTube Shorts' }
                            ].map(platform => (
                              <label key={platform.id} className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedPlatforms.includes(platform.id)}
                                  onChange={() => handlePlatformToggle(platform.id)}
                                  className="w-4 h-4 text-violet-600 bg-[#0c0414] border-[#3d2e59] rounded focus:ring-violet-500"
                                />
                                <span className="text-white text-sm">{platform.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setShowPublishOptions(false)}
                            variant="outline"
                            className="flex-1 bg-[#0c0414] border-[#3d2e59] text-white hover:bg-[#2a1f3d]"
                          >
                            Back
                          </Button>
                          <Button 
                            onClick={handlePlatformPublish}
                            disabled={selectedPlatforms.length === 0}
                            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                          >
                            Publish
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Search bar - positioned at bottom when chat is active */}
          {!showChat && (
            <div className={`relative max-w-4xl mx-auto w-full transition-all duration-500 ease-in-out ${
              isAnimating ? 'transform translate-y-32' : ''
            }`}>
              {/* Video Clipping Section */}
              {showClipSection && (
                <div className="bg-[#1c1528] rounded-xl p-4 mb-4 border border-[#3d2e59]">
                  <div className="flex items-center gap-2 mb-3">
                    <Paperclip className="w-5 h-5 text-violet-400" />
                    <span className="text-white font-medium">Enter your link for clipping</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste your video URL here..."
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      className="flex-1 bg-[#0c0414] border border-[#3d2e59] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400"
                    />
                    <button
                      onClick={handleClipVideo}
                      disabled={!videoLink.trim()}
                      className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Clip Video
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-[#1c1528] rounded-full p-4 flex items-center shadow-lg">
                <button 
                  onClick={handlePaperclipClick}
                  className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all"
                >
                  <Paperclip className="w-6 h-6 text-gray-400" />
                </button>
                
                <input 
                  type="text" 
                  placeholder="How Snip Vibe can help you today?" 
                  className="bg-transparent flex-1 outline-none text-gray-300 pl-6 pr-6 text-lg"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isGenerating}
                />
                
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isGenerating}
                  className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed bottom input when chat is active */}
      {showChat && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0c0414] border-t border-[#1c1528] p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1c1528] rounded-full p-4 flex items-center shadow-lg">
              <button 
                onClick={handlePaperclipClick}
                className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all"
              >
                <Paperclip className="w-6 h-6 text-gray-400" />
              </button>
              
              <input 
                type="text" 
                placeholder="Message Snip Vibe..." 
                className="bg-transparent flex-1 outline-none text-gray-300 pl-6 pr-6 text-lg"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isGenerating}
              />
              
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isGenerating}
                className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Hero1 };
