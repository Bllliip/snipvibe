
"use client"

import * as React from "react"
import { User } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface ProfileInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string;
  email?: string;
  plan?: "free" | "pro";
  credits?: number;
  maxCredits?: number;
  avatarUrl?: string;
}

export function ProfileInfo({
  username = "User",
  email = "user@example.com",
  plan = "free",
  credits = 100,
  maxCredits = 100,
  avatarUrl,
  className,
  ...props
}: ProfileInfoProps) {
  const navigate = useNavigate()
  
  const handleUpgrade = () => {
    navigate('/pricing')
  }

  return (
    <Card className={cn("w-full max-w-md overflow-hidden", className)} {...props}>
      <CardHeader className={cn("bg-[#0c0414] text-white", plan === "pro" && "bg-gradient-to-r from-[#1c1528] to-[#0c0414]")}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Profile</CardTitle>
          <Badge variant={plan === "free" ? "default" : "secondary"} className="uppercase">
            {plan === "free" ? "Free" : "Pro"}
          </Badge>
        </div>
        <CardDescription className="text-zinc-300">
          Account details and credit information
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6 bg-zinc-900">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white/10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username} />
            ) : (
              <AvatarFallback className="bg-[#1c1528] text-white">
                <User className="h-8 w-8" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-white">{username}</h3>
            <p className="text-sm text-zinc-400">{email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Credits</span>
            <span className="text-sm text-zinc-300">{credits}/{maxCredits}</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                plan === "free" 
                  ? "bg-zinc-400" 
                  : "bg-gradient-to-r from-[#a0d9f8] to-[#3a5bbf]"
              )}
              style={{ width: `${(credits / maxCredits) * 100}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">
            {plan === "free" 
              ? "Free plan credits reset monthly" 
              : "Pro plan includes premium features and more credits"}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-medium text-zinc-300">Account Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-zinc-500">Plan</div>
            <div className="text-zinc-300 font-medium">{plan === "free" ? "Free" : "Professional"}</div>
            
            <div className="text-zinc-500">Joined</div>
            <div className="text-zinc-300 font-medium">May 2023</div>
            
            <div className="text-zinc-500">Billing cycle</div>
            <div className="text-zinc-300 font-medium">{plan === "free" ? "N/A" : "Monthly"}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 bg-zinc-900 border-t border-zinc-800">
        {plan === "free" ? (
          <Button 
            onClick={handleUpgrade} 
            className="w-full bg-gradient-to-r from-[#a0d9f8] to-[#3a5bbf] hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro
          </Button>
        ) : (
          <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Manage Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
