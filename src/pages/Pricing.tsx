
import { Sparkles, Zap, ArrowDownToLine } from "lucide-react";
import { PricingSection } from "@/components/ui/pricing-section";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const defaultTiers = [
  {
    name: "Starter",
    price: {
      monthly: 15,
      yearly: 144,
    },
    description: "Perfect for individuals and small projects",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/30 to-gray-500/30 blur-2xl rounded-full" />
        <Zap className="w-7 h-7 relative z-10 text-gray-500 dark:text-gray-400 animate-[float_3s_ease-in-out_infinite]" />
      </div>
    ),
    features: [
      {
        name: "Basic Analytics",
        description: "Track essential metrics and user behavior",
        included: true,
      },
      {
        name: "5 Team Members",
        description: "Collaborate with a small team",
        included: true,
      },
      {
        name: "Basic Support",
        description: "Email support with 24h response time",
        included: true,
      },
      {
        name: "API Access",
        description: "Limited API access for basic integrations",
        included: false,
      },
    ],
  },
  {
    name: "Pro",
    price: {
      monthly: 49,
      yearly: 470,
    },
    description: "Ideal for growing teams and businesses",
    highlight: true,
    badge: "Most Popular",
    icon: (
      <div className="relative">
        <ArrowDownToLine className="w-7 h-7 relative z-10" />
      </div>
    ),
    features: [
      {
        name: "Advanced Analytics",
        description: "Deep insights and custom reports",
        included: true,
      },
      {
        name: "Unlimited Team Members",
        description: "Scale your team without limits",
        included: true,
      },
      {
        name: "Priority Support",
        description: "24/7 priority email and chat support",
        included: true,
      },
      {
        name: "Full API Access",
        description: "Complete API access with higher rate limits",
        included: true,
      },
    ],
  },
];

const Pricing = () => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-[#0c0414] text-white">
        <AppSidebar />
        <div className="flex-1">
          <PricingSection tiers={defaultTiers} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Pricing;
