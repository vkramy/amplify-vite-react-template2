import { Download, Target, Clock, TrendingDown, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import configData from '../config.json';

// Type definition for config data
interface ConfigData {
  downloadUrls: {
    weightLoss: string;
    muscleBuild: string;
    exercisesAnywhere: string;
  };
  timeout: number;
  fallbackToTextFile: boolean;
}

const WeightLoss = () => {
  const handleDownload = () => {
    // Get the download URL from config
    const config = configData as ConfigData;
    const downloadUrl = config.downloadUrls.weightLoss;
    console.log(downloadUrl);
    if (downloadUrl && downloadUrl.trim() !== '') {
      // If URL is provided in config, redirect to that URL
      window.open(downloadUrl, '_blank');
    } else if (config.fallbackToTextFile) {
      // Fallback: Create a simple text file for the guide
      const guideContent = `
WEIGHT LOSS GUIDE - BitFit Pro

OVERVIEW:
This comprehensive weight loss program is designed to help you lose weight safely and sustainably through a combination of proper nutrition, cardiovascular exercise, and strength training.

PROGRAM STRUCTURE:
- Duration: 12 weeks
- Frequency: 5-6 days per week
- Expected weight loss: 1-2 lbs per week

NUTRITION GUIDELINES:
1. Create a caloric deficit of 500-750 calories per day
2. Focus on whole foods: lean proteins, vegetables, fruits, whole grains
3. Stay hydrated: 8-10 glasses of water daily
4. Meal timing: Eat every 3-4 hours to maintain metabolism

EXERCISE PLAN:
Week 1-4 (Foundation Phase):
- Cardio: 30 minutes, 4x per week (walking, cycling, swimming)
- Strength training: 2x per week (full body workouts)
- Rest days: 1-2 per week

Week 5-8 (Progression Phase):
- Cardio: 40 minutes, 4x per week (increase intensity)
- Strength training: 3x per week (upper/lower split)
- HIIT: 1x per week (20 minutes)

Week 9-12 (Advanced Phase):
- Cardio: 45 minutes, 4x per week
- Strength training: 4x per week (push/pull/legs split)
- HIIT: 2x per week (25 minutes)

SAMPLE DAILY MEAL PLAN:
Breakfast: Oatmeal with berries and protein powder
Snack: Greek yogurt with nuts
Lunch: Grilled chicken salad with olive oil dressing
Snack: Apple with almond butter
Dinner: Baked salmon with roasted vegetables
Evening: Herbal tea

TRACKING & MONITORING:
- Weigh yourself weekly at the same time
- Take body measurements monthly
- Progress photos every 2 weeks
- Keep a food diary
- Track workout performance

TIPS FOR SUCCESS:
1. Set realistic, achievable goals
2. Plan and prep meals in advance
3. Find an accountability partner
4. Celebrate non-scale victories
5. Be patient and consistent
6. Get adequate sleep (7-9 hours)
7. Manage stress through meditation or yoga

COMMON MISTAKES TO AVOID:
- Extreme calorie restriction
- Skipping meals
- Focusing only on cardio
- Expecting immediate results
- Not drinking enough water
- Ignoring portion sizes

Remember: Sustainable weight loss is a marathon, not a sprint. Focus on building healthy habits that you can maintain long-term.

For personalized guidance and support, consult with our certified trainers and nutritionists.

© BitFit Pro - Your Partner in Health and Fitness
      `;

      const blob = new Blob([guideContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Weight-Loss-Guide-BitFit-Pro.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // No URL provided and fallback disabled
      alert('Download is currently unavailable. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Target className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Weight Loss Program</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Achieve sustainable weight loss with our scientifically-backed program that combines nutrition, cardio, and strength training.
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Transform Your Body</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our weight loss program is designed to help you lose weight safely and sustainably. 
                We focus on creating healthy habits that last a lifetime, not quick fixes that fade away.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sustainable Results</h3>
                    <p className="text-gray-600">Lose 1-2 pounds per week through healthy lifestyle changes.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
                    <p className="text-gray-600">Workouts designed to fit into your busy lifestyle.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Program Highlights</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>12-week structured program</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Personalized nutrition plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Cardio and strength training</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Progress tracking tools</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>24/7 support community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Weight Loss Journey Plan */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Weight Loss Journey Plan</h2>
            <p className="text-xl text-gray-600">Follow our step-by-step process to achieve your weight loss goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg relative">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                  Step 1
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Use Calorie Calculator</h3>
                <p className="text-gray-600 mb-4">
                  Set your weight loss goals and calculate your daily calorie needs for sustainable results.
                </p>
                <Link 
                  to="/calorie-calculator"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                >
                  Calculate Now
                </Link>
              </div>
              {/* Arrow for larger screens */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-blue-300"></div>
                <div className="w-0 h-0 border-l-4 border-l-blue-300 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-6 -mt-1"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg relative">
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                  Step 2
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Assess Yourself</h3>
                <p className="text-gray-600 mb-4">
                  Complete comprehensive body and fitness assessments to understand your starting point.
                </p>
                <Link 
                  to="/body-assessment"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
                >
                  Start Assessment
                </Link>
              </div>
              {/* Arrow for larger screens */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-green-300"></div>
                <div className="w-0 h-0 border-l-4 border-l-green-300 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-6 -mt-1"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg relative">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="h-8 w-8 text-white" />
                </div>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                  Step 3
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Plan with Your Trainer</h3>
                <p className="text-gray-600 mb-4">
                  Work with our certified trainers to create a personalized workout and nutrition plan.
                </p>
                <button 
                  onClick={handleDownload}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Get Guide
                </button>
              </div>
              {/* Arrow for larger screens */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-purple-300"></div>
                <div className="w-0 h-0 border-l-4 border-l-purple-300 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-6 -mt-1"></div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                  Step 4
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Become Your Own Trainer</h3>
                <p className="text-gray-600 mb-4">
                  Master the skills and knowledge to maintain your results and continue progressing independently.
                </p>
                <Link 
                  to="/exercises-anywhere"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-block"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Journey Timeline */}
          <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Journey Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-lg mb-3">
                  <h4 className="font-semibold text-blue-800">Week 1</h4>
                  <p className="text-sm text-blue-600">Goal Setting & Assessment</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-lg mb-3">
                  <h4 className="font-semibold text-green-800">Weeks 2-4</h4>
                  <p className="text-sm text-green-600">Foundation Building</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-lg mb-3">
                  <h4 className="font-semibold text-purple-800">Weeks 5-8</h4>
                  <p className="text-sm text-purple-600">Habit Formation</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-lg mb-3">
                  <h4 className="font-semibold text-orange-800">Weeks 9-12</h4>
                  <p className="text-sm text-orange-600">Independence & Mastery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Phases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Program Phases</h2>
            <p className="text-xl text-gray-600">Our progressive approach ensures steady, sustainable weight loss</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">1</span>
                </div>
                <h3 className="text-xl font-bold">Foundation Phase</h3>
                <p className="text-gray-600">Weeks 1-4</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Build exercise habits</li>
                <li>• Learn proper nutrition</li>
                <li>• 30-min cardio sessions</li>
                <li>• Basic strength training</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">2</span>
                </div>
                <h3 className="text-xl font-bold">Progression Phase</h3>
                <p className="text-gray-600">Weeks 5-8</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Increase workout intensity</li>
                <li>• Add HIIT training</li>
                <li>• 40-min cardio sessions</li>
                <li>• Advanced strength moves</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">3</span>
                </div>
                <h3 className="text-xl font-bold">Advanced Phase</h3>
                <p className="text-gray-600">Weeks 9-12</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Peak performance training</li>
                <li>• Complex workout routines</li>
                <li>• 45-min cardio sessions</li>
                <li>• Body composition focus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download Guide Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calorie Calculator */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-xl text-white">
              <Calculator className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-center">Calorie Calculator</h3>
              <p className="mb-6 text-center">
                Calculate your daily calorie needs and create a personalized weight loss timeline with our advanced calculator.
              </p>
              <div className="text-center">
                <Link 
                  to="/calorie-calculator"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
                >
                  Calculate Calories
                </Link>
              </div>
            </div>

            {/* Download Guide */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 rounded-xl text-white">
              <Download className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-center">Complete Weight Loss Guide</h3>
              <p className="mb-6 text-center">
                Get instant access to our comprehensive weight loss guide with meal plans, workout routines, and expert tips.
              </p>
              <div className="text-center">
                <button 
                  onClick={handleDownload}
                  className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Download Free Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeightLoss;