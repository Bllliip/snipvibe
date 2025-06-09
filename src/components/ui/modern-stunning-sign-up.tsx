
"use client";

import * as React from "react";
import { useState } from "react";
import { Zap } from "lucide-react";

const SignUp1 = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSignedUp, setIsSignedUp] = React.useState(false);
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setError("");
    setIsSignedUp(true);
    alert("Sign up successful! Welcome to ClipVibe!");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0414] relative overflow-hidden w-full rounded-xl">
      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#0c0414] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-6 shadow-lg">
          <Zap className="h-6 w-6 text-white" />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          {isSignedUp ? "Welcome to ClipVibe!" : "Create Your ClipVibe Account"}
        </h2>
        
        {/* Form */}
        {!isSignedUp ? (
          <div className="flex flex-col w-full gap-4">
            <div className="w-full flex flex-col gap-3">
              <input 
                placeholder="Email" 
                type="email" 
                value={email} 
                className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" 
                onChange={e => setEmail(e.target.value)} 
              />
              <input 
                placeholder="Password" 
                type="password" 
                value={password} 
                className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" 
                onChange={e => setPassword(e.target.value)} 
              />
              <input 
                placeholder="Confirm Password" 
                type="password" 
                value={confirmPassword} 
                className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
              {error && <div className="text-sm text-red-400 text-left">{error}</div>}
            </div>
            <hr className="opacity-10" />
            <div>
              <button 
                onClick={handleSignUp} 
                className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition mb-3 text-sm"
              >
                Sign up
              </button>
              
              {/* Google Sign Up */}
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
              
              <div className="w-full text-center mt-2">
                <span className="text-xs text-gray-400">
                  Already have an account?{" "}
                  <a href="/sign-in" className="underline text-white/80 hover:text-white">
                    Sign in
                  </a>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4 items-center">
            <div className="text-center text-gray-300 mb-4">
              <p className="text-lg">Your account has been created successfully!</p>
              <p className="text-sm mt-2">You can now start using ClipVibe.</p>
            </div>
            
            <a 
              href="/demo" 
              className="w-full bg-violet-600 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-violet-700 transition text-sm text-center"
            >
              Continue to App
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export { SignUp1 };
