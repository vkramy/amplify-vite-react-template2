import React, { useState } from 'react';
import { Dumbbell, Scale, Heart, MapPin, Menu, X, ArrowRight, Star } from 'lucide-react';

export default function FitnessCoachingSite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const programs = [
    {
      icon: Scale,
      title: "Weight Loss",
      description: "Achieve your ideal weight with personalized meal plans and targeted workouts designed for sustainable results.",
      color: "from-purple-500 to-pink-500",
      features: ["Custom nutrition plans", "Fat-burning workouts", "Progress tracking"]
    },
    {
      icon: Dumbbell,
      title: "Muscle Build",
      description: "Build strength and sculpt your physique with progressive resistance training and optimal nutrition strategies.",
      color: "from-blue-500 to-cyan-500",
      features: ["Strength training programs", "Muscle-gain nutrition", "Form coaching"]
    },
    {
      icon: Heart,
      title: "Stress Relief Program",
      description: "Find balance and peace through mindful movement, breathwork, and recovery-focused training sessions.",
      color: "from-green-500 to-emerald-500",
      features: ["Yoga & stretching", "Meditation guidance", "Recovery protocols"]
    },
    {
      icon: MapPin,
      title: "Exercises Anywhere",
      description: "Stay fit on the go with flexible workout routines that require minimal or no equipment, adaptable to any location.",
      color: "from-orange-500 to-red-500",
      features: ["No-equipment workouts", "Travel-friendly routines", "Time-efficient sessions"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                FitCoach Pro
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#programs" className="hover:text-cyan-400 transition">Programs</a>
              <a href="#about" className="hover:text-cyan-400 transition">About</a>
              <a href="#contact" className="hover:text-cyan-400 transition">Contact</a>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-3">
              <a href="#programs" className="block hover:text-cyan-400 transition">Programs</a>
              <a href="#about" className="block hover:text-cyan-400 transition">About</a>
              <a href="#contact" className="block hover:text-cyan-400 transition">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Transform Your Body,
            <br />Transform Your Life
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional personal training tailored to your goals. Start your fitness journey with expert guidance and proven results.
          </p>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition transform hover:scale-105 shadow-lg shadow-cyan-500/50">
            Start Your Journey
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h2>
            <p className="text-xl text-gray-400">Choose the path that fits your fitness goals</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div 
                  key={index}
                  className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{program.title}</h3>
                  <p className="text-gray-400 mb-6">{program.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <Star className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full bg-gradient-to-r ${program.color} hover:opacity-90 text-white py-3 rounded-lg font-semibold transition`}>
                    Learn More
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">500+</div>
              <div className="text-gray-400 text-lg">Clients Transformed</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">10+</div>
              <div className="text-gray-400 text-lg">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-gray-400 text-lg">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-cyan-50">
            Book your free consultation today and take the first step towards your fitness goals.
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition transform hover:scale-105 shadow-lg">
            Book Free Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 FitCoach Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
