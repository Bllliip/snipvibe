
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to HextaAI Demo</h1>
        <p className="text-xl text-gray-600 mb-8">Check out the stunning hero component!</p>
        <Link 
          to="/demo" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          View Demo
        </Link>
      </div>
    </div>
  );
};

export default Index;
