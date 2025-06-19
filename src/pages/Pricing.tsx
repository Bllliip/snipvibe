
import { PricingSection } from "@/components/ui/pricing-section";
import { X, Sparkles, Zap, ArrowDownToLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: "Get started with basic video editing tools",
    features: [
      {
        name: "5 videos per month",
        description: "Create up to 5 videos each month",
        included: true,
      },
      {
        name: "720p exports",
        description: "Export videos in HD quality",
        included: true,
      },
      {
        name: "Basic templates",
        description: "Access to a limited set of templates",
        included: true,
      },
      {
        name: "AI-powered features",
        description: "Limited access to AI features",
        included: false,
      },
      {
        name: "Watermark-free exports",
        description: "Remove the Snip Vibe watermark",
        included: false,
      },
    ],
    icon: <Zap className="w-5 h-5" />,
  },
  {
    name: "Pro",
    price: {
      monthly: 12,
      yearly: 80,
      originalYearly: 144, // Original price for discount calculation
    },
    description: "Unlock premium features for creators",
    features: [
      {
        name: "Unlimited videos",
        description: "Create as many videos as you want",
        included: true,
      },
      {
        name: "4K exports",
        description: "Export videos in ultra-high quality",
        included: true,
      },
      {
        name: "Premium templates",
        description: "Access to all templates",
        included: true,
      },
      {
        name: "AI-powered features",
        description: "Full access to AI features",
        included: true,
      },
      {
        name: "Watermark-free exports",
        description: "No Snip Vibe watermark on exports",
        included: true,
      },
    ],
    highlight: true,
    badge: "Most Popular",
    icon: <Sparkles className="w-5 h-5" />,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen">
      <button 
        onClick={() => navigate('/demo')}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1c1528]/50 text-white hover:bg-[#1c1528] transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <PricingSection tiers={tiers} />
    </div>
  );
};

export default Pricing;
