
import { SignIn1 } from "@/components/ui/modern-stunning-sign-in";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative w-full h-full">
      <button 
        onClick={() => navigate('/demo')}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1c1528]/50 text-white hover:bg-[#1c1528] transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <SignIn1 />
    </div>
  );
};

export default SignIn;
