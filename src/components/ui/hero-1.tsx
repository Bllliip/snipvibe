
"use client";

import * as React from "react";
import { Paperclip, Sparkles, Zap, Send } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { HoverButton } from "@/components/ui/hover-button";

const Hero1 = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleGetStarted = () => {
    navigate('/sign-in');
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsGenerating(true);
    }, 500);
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
          <div className="font-bold text-md">ClipVibe</div>
        </div>
        <HoverButton onClick={handleGetStarted} className="text-white">
          Get Started
        </HoverButton>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search bar */}
          <div className={`relative max-w-2xl mx-auto w-full transition-all duration-500 ease-in-out ${isAnimating ? 'transform translate-y-48' : ''}`}>
            <div className="bg-[#1c1528] rounded-full p-3 flex items-center">
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              
              <input 
                type="text" 
                placeholder="How ClipVibe can help you today?" 
                className="bg-transparent flex-1 outline-none text-gray-300 pl-4 pr-4"
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
                <Send className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Generation State */}
          {isGenerating && (
            <div className="animate-fade-in mt-8">
              <div className="flex items-center justify-center gap-2 text-violet-200">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Generating your clip strategy...</span>
              </div>
              <div className="mt-4 bg-[#1c1528] rounded-lg p-6 max-w-2xl mx-auto">
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-violet-400/20 to-blue-400/20 rounded animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-blue-400/20 to-violet-400/20 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-violet-400/20 to-blue-400/20 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export { Hero1 };
