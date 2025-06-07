
"use client";

import * as React from "react";
import { Paperclip, Sparkles, Zap, Send } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { HoverButton } from "@/components/ui/hover-button";
import { ChatContext } from "@/components/app-sidebar";

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
  
  // Get messages from the active project
  const messages = activeProject?.messages || [];
  const showChat = messages.length > 0;

  const handleGetStarted = () => {
    navigate('/sign-in');
  };

  const handleSend = () => {
    if (!inputValue.trim() || !activeProject) return;
    
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
      }, 2000);
    }, 500);
    
    setInputValue("");
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
    <div className="min-h-screen bg-gradient-to-r from-red-400 from-5% via-black via-15% via-black via-85% to-blue-600 to-95% text-white flex flex-col relative overflow-x-hidden">
      {/* Gradient overlay effects */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg] opacity-30">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-red-500 via-black to-blue-500"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-blue-500 via-black to-red-500"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-r from-red-500 via-black to-blue-500"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="mr-2" />
          <Zap className="h-5 w-5 text-white" />
          <div className="font-bold text-md">ClipVibe</div>
        </div>
        <HoverButton onClick={handleGetStarted} className="text-white">
          Get Started
        </HoverButton>
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${showChat ? 'pb-24' : 'items-center justify-center'} px-4 text-center`}>
        <div className="max-w-6xl mx-auto space-y-6 w-full">
          {/* Chat Messages */}
          {showChat && (
            <div className="max-w-4xl mx-auto space-y-4 flex-1 overflow-y-auto">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-red-600 from-5% via-black via-15% via-black via-85% to-red-800 to-95% text-white' 
                      : 'bg-gradient-to-r from-black from-5% via-gray-900 via-15% via-gray-900 via-85% to-black to-95% text-gray-300 border border-red-800'
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
              
              {/* Generation State */}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-black from-5% via-gray-900 via-15% via-gray-900 via-85% to-black to-95% border border-red-800 rounded-lg p-4 max-w-xs lg:max-w-md">
                    <div className="flex items-center gap-2 text-red-200 mb-2">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Generating response...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gradient-to-r from-red-400/20 via-black to-blue-400/20 rounded animate-pulse"></div>
                      <div className="h-2 bg-gradient-to-r from-blue-400/20 via-black to-red-400/20 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search bar - positioned at bottom when chat is active */}
          {!showChat && (
            <div className={`relative max-w-4xl mx-auto w-full transition-all duration-500 ease-in-out ${
              isAnimating ? 'transform translate-y-32' : ''
            }`}>
              <div className="bg-gradient-to-r from-red-600 from-5% via-black via-15% via-black via-85% to-blue-600 to-95% rounded-full p-4 flex items-center shadow-lg border border-red-800">
                <button className="p-2 rounded-full hover:bg-red-800/50 transition-all">
                  <Paperclip className="w-6 h-6 text-gray-300" />
                </button>
                
                <input 
                  type="text" 
                  placeholder="How ClipVibe can help you today?" 
                  className="bg-transparent flex-1 outline-none text-gray-300 pl-6 pr-6 text-lg placeholder-gray-400"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isGenerating}
                />
                
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isGenerating}
                  className="p-2 rounded-full hover:bg-red-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-6 h-6 text-gray-300" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed bottom input when chat is active */}
      {showChat && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 from-5% via-black via-15% via-black via-85% to-blue-600 to-95% border-t border-red-800 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-red-700 from-5% via-black via-15% via-black via-85% to-blue-700 to-95% rounded-full p-4 flex items-center shadow-lg border border-red-800">
              <button className="p-2 rounded-full hover:bg-red-800/50 transition-all">
                <Paperclip className="w-6 h-6 text-gray-300" />
              </button>
              
              <input 
                type="text" 
                placeholder="Message ClipVibe..." 
                className="bg-transparent flex-1 outline-none text-gray-300 pl-6 pr-6 text-lg placeholder-gray-400"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isGenerating}
              />
              
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isGenerating}
                className="p-2 rounded-full hover:bg-red-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-6 h-6 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Hero1 };
