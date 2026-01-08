import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, refreshUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/calorie-calculator':
        return 'Access Calorie Calculator';
      case '/body-assessment':
        return 'Access Body Assessment';
      case '/cardiovascular-assessment':
        return 'Access Cardiovascular Assessment';
      case '/profile':
        return 'Access Your Profile';
      default:
        return 'Sign In Required';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/calorie-calculator':
        return 'Sign in to calculate your daily calorie needs and create a personalized weight loss timeline with graph visualization.';
      case '/body-assessment':
        return 'Sign in to get a comprehensive analysis of your body composition and health metrics.';
      case '/cardiovascular-assessment':
        return 'Sign in to assess your aerobic fitness and get your VO2 max estimation.';
      case '/profile':
        return 'Sign in to view and manage your personal fitness profile.';
      default:
        return 'You need to sign in to access this feature. Create an account or sign in to continue.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{getPageTitle()}</h2>
                <p className="text-gray-600 mb-6">
                  {getPageDescription()}
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign In / Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={async () => {
            setShowAuthModal(false);
            await refreshUser();
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;