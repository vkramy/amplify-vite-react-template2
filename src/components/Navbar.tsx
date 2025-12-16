import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg" style={{
      backgroundColor: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-blue-600" style={{ color: '#2563eb' }} />
            <span className="text-xl font-bold text-gray-800">FitCoach Pro</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/weight-loss" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Weight Loss
            </Link>
            <Link 
              to="/muscle-build" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Muscle Build
            </Link>
            <Link 
              to="/stress-relief" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Stress Relief
            </Link>
            <Link 
              to="/exercises-anywhere" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Exercises Anywhere
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;