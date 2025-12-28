import { Link } from 'react-router-dom';
import { Target, Zap, Heart, MapPin, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  
  const programs = [
    {
      id: 1,
      title: 'Weight Loss',
      description: 'Achieve your ideal weight with our scientifically-backed weight loss programs.',
      icon: Target,
      link: '/weight-loss',
      color: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Muscle Build',
      description: 'Build lean muscle mass and increase strength with our specialized training programs.',
      icon: Zap,
      link: '/muscle-build',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      title: 'Stress Relief Program',
      description: 'Reduce stress and improve mental wellness through targeted fitness routines.',
      icon: Heart,
      link: '/stress-relief',
      color: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Exercises Anywhere',
      description: 'Stay fit with bodyweight exercises you can do anywhere, anytime.',
      icon: MapPin,
      link: '/exercises-anywhere',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {user ? 'Welcome back to BitFit Pro!' : 'Transform Your Life with BitFit Pro'}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {user 
              ? 'Continue your fitness journey with our specialized programs designed to help you achieve your goals.'
              : 'Your personal fitness journey starts here. Choose from our specialized programs designed to help you achieve your health and fitness goals.'
            }
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Start Your Journey
          </button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Fitness Path</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select from our four specialized programs, each designed to target specific fitness goals and lifestyle needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program) => {
              const IconComponent = program.icon;
              return (
                <Link
                  key={program.id}
                  to={program.link}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                         style={{
                           backgroundColor: program.id === 1 ? '#ef4444' : program.id === 2 ? '#3b82f6' : program.id === 3 ? '#10b981' : '#8b5cf6'
                         }}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{program.title}</h3>
                    <p className="text-gray-600 mb-6">{program.description}</p>
                    <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors">
                      Learn More →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose BitFit Pro?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Programs</h3>
              <p className="text-gray-600">Tailored fitness plans designed specifically for your goals and fitness level.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Professional coaching and support throughout your fitness journey.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Proven Results</h3>
              <p className="text-gray-600">Science-backed methods that deliver real, lasting results.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest fitness tips, nutrition advice, and wellness insights from our expert team.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link
              to="/blog"
              className="group bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex items-center space-x-3"
            >
              <BookOpen className="h-6 w-6" />
              <span>Explore Our Blog</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export { Home as default };