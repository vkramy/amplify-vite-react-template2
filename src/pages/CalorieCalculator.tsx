import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { 
  Calculator, 
  Target, 
  TrendingDown, 
  AlertCircle, 
  Download,
  BarChart3,
  Calendar,
  Utensils
} from 'lucide-react';

interface CalorieData {
  age: string;
  gender: 'male' | 'female';
  height: string;
  currentWeight: string;
  targetWeight: string;
  activityLevel: string;
  bodyFat: string;
  timeframe: string; // weeks
}

interface CalorieResults {
  bmr: number;
  tdee: number;
  weightToLose: number;
  weeksToGoal: number;
  dailyCalorieDeficit: number;
  targetDailyCalories: number;
  weeklyWeightLoss: number;
  timeline: Array<{
    week: number;
    weight: number;
    date: string;
  }>;
  recommendations: string[];
  macroBreakdown: {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fats: { grams: number; calories: number; percentage: number };
  };
}

const CalorieCalculator = () => {
  const { user } = useAuth();
  const [calorieData, setCalorieData] = useState<CalorieData>({
    age: '',
    gender: 'male',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: '1.2',
    bodyFat: '',
    timeframe: '12'
  });
  const [results, setResults] = useState<CalorieResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const attributes = await fetchUserAttributes();
      setCalorieData(prev => ({
        ...prev,
        height: attributes['custom:height'] || '',
        currentWeight: attributes['custom:weight'] || '',
        age: attributes['custom:age'] || '',
      }));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBMR = (data: CalorieData) => {
    const weight = parseFloat(data.currentWeight);
    const height = parseFloat(data.height);
    const age = parseFloat(data.age);
    const bodyFat = parseFloat(data.bodyFat);

    // Use Katch-McArdle if body fat is provided, otherwise use Mifflin-St Jeor
    if (bodyFat && bodyFat > 0) {
      // Katch-McArdle Formula: BMR = 370 + 21.6(1 - F)W
      const leanBodyMass = weight * (1 - bodyFat / 100);
      return 370 + 21.6 * leanBodyMass;
    } else {
      // Mifflin-St Jeor Equation
      if (data.gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
      }
    }
  };

  const getActivityMultiplier = (level: string) => {
    const multipliers: { [key: string]: number } = {
      '1.2': 1.2,   // Sedentary
      '1.375': 1.375, // Light exercise
      '1.55': 1.55,   // Moderate exercise
      '1.725': 1.725, // Heavy exercise
      '1.9': 1.9      // Very heavy exercise
    };
    return multipliers[level] || 1.2;
  };

  const generateTimeline = (currentWeight: number, targetWeight: number, weeklyLoss: number) => {
    const timeline = [];
    const totalWeeks = Math.ceil((currentWeight - targetWeight) / weeklyLoss);
    
    for (let week = 0; week <= totalWeeks; week++) {
      const weight = Math.max(targetWeight, currentWeight - (week * weeklyLoss));
      const date = new Date();
      date.setDate(date.getDate() + (week * 7));
      
      timeline.push({
        week,
        weight: parseFloat(weight.toFixed(1)),
        date: date.toLocaleDateString()
      });
    }
    
    return timeline;
  };

  const calculateMacros = (calories: number) => {
    // Standard macro distribution for weight loss: 30% protein, 40% carbs, 30% fats
    const proteinCalories = calories * 0.30;
    const carbCalories = calories * 0.40;
    const fatCalories = calories * 0.30;

    return {
      protein: {
        grams: Math.round(proteinCalories / 4),
        calories: Math.round(proteinCalories),
        percentage: 30
      },
      carbs: {
        grams: Math.round(carbCalories / 4),
        calories: Math.round(carbCalories),
        percentage: 40
      },
      fats: {
        grams: Math.round(fatCalories / 9),
        calories: Math.round(fatCalories),
        percentage: 30
      }
    };
  };

  const generateRecommendations = (results: CalorieResults) => {
    const recommendations = [];

    if (results.weeklyWeightLoss > 2) {
      recommendations.push('Your target weight loss exceeds 2 lbs per week. Consider extending your timeframe for healthier, sustainable results.');
    } else if (results.weeklyWeightLoss < 0.5) {
      recommendations.push('Your weight loss rate is very gradual, which is excellent for maintaining muscle mass and metabolism.');
    } else {
      recommendations.push('Your weight loss rate is within the healthy range of 0.5-2 lbs per week.');
    }

    if (results.targetDailyCalories < 1200) {
      recommendations.push('Your target calories are very low. Consider consulting a healthcare provider and focus on nutrient-dense foods.');
    }

    recommendations.push('Drink plenty of water (at least 8 glasses per day) to support metabolism and reduce hunger.');
    recommendations.push('Include strength training 2-3 times per week to preserve muscle mass during weight loss.');
    recommendations.push('Eat protein with every meal to maintain satiety and support muscle preservation.');
    recommendations.push('Focus on whole, minimally processed foods for better nutrition and satiety.');
    recommendations.push('Track your food intake and weight consistently for best results.');

    return recommendations;
  };

  const calculateCalories = () => {
    const currentWeight = parseFloat(calorieData.currentWeight);
    const targetWeight = parseFloat(calorieData.targetWeight);
    const timeframe = parseFloat(calorieData.timeframe);

    if (currentWeight <= targetWeight) {
      alert('Target weight must be less than current weight for weight loss.');
      return;
    }

    const bmr = calculateBMR(calorieData);
    const activityMultiplier = getActivityMultiplier(calorieData.activityLevel);
    const tdee = bmr * activityMultiplier;
    
    const weightToLose = currentWeight - targetWeight;
    const weeksToGoal = timeframe;
    const weeklyWeightLoss = Math.min(2, weightToLose / weeksToGoal); // Cap at 2 lbs per week
    
    // 1 pound = 3500 calories
    const dailyCalorieDeficit = (weeklyWeightLoss * 3500) / 7;
    const targetDailyCalories = Math.max(1200, tdee - dailyCalorieDeficit); // Don't go below 1200 calories
    
    const timeline = generateTimeline(currentWeight, targetWeight, weeklyWeightLoss);
    const macroBreakdown = calculateMacros(targetDailyCalories);

    const results: CalorieResults = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightToLose,
      weeksToGoal,
      dailyCalorieDeficit: Math.round(dailyCalorieDeficit),
      targetDailyCalories: Math.round(targetDailyCalories),
      weeklyWeightLoss: parseFloat(weeklyWeightLoss.toFixed(1)),
      timeline,
      recommendations: [],
      macroBreakdown
    };

    results.recommendations = generateRecommendations(results);
    setResults(results);
    setShowResults(true);
  };

  const downloadReport = () => {
    if (!results) return;

    const reportContent = `
WEIGHT LOSS CALORIE CALCULATOR REPORT - BitFit Pro
Generated on: ${new Date().toLocaleDateString()}

PERSONAL INFORMATION:
====================
Current Weight: ${calorieData.currentWeight} kg
Target Weight: ${calorieData.targetWeight} kg
Weight to Lose: ${results.weightToLose} kg (${(results.weightToLose * 2.2).toFixed(1)} lbs)
Timeframe: ${calorieData.timeframe} weeks

CALORIE CALCULATIONS:
====================
Basal Metabolic Rate (BMR): ${results.bmr} calories/day
Total Daily Energy Expenditure (TDEE): ${results.tdee} calories/day
Daily Calorie Deficit: ${results.dailyCalorieDeficit} calories
Target Daily Calories: ${results.targetDailyCalories} calories
Weekly Weight Loss: ${results.weeklyWeightLoss} lbs

MACRO BREAKDOWN:
===============
Protein: ${results.macroBreakdown.protein.grams}g (${results.macroBreakdown.protein.calories} cal, ${results.macroBreakdown.protein.percentage}%)
Carbohydrates: ${results.macroBreakdown.carbs.grams}g (${results.macroBreakdown.carbs.calories} cal, ${results.macroBreakdown.carbs.percentage}%)
Fats: ${results.macroBreakdown.fats.grams}g (${results.macroBreakdown.fats.calories} cal, ${results.macroBreakdown.fats.percentage}%)

WEIGHT LOSS TIMELINE:
====================
${results.timeline.map(point => `Week ${point.week}: ${point.weight} kg (${point.date})`).join('\n')}

RECOMMENDATIONS:
===============
${results.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

DISCLAIMER:
===========
This calculator provides estimates based on established formulas and should not replace professional medical advice. 
Individual results may vary. Consult with a healthcare provider before starting any weight loss program.

© BitFit Pro - Your Partner in Health and Fitness
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Weight-Loss-Plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Calculator className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Weight Loss Calorie Calculator</h1>
              <p className="text-gray-600">Calculate your daily calorie needs and create a personalized weight loss timeline</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-2" />
              Personal Information
            </h2>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      value={calorieData.age}
                      onChange={(e) => setCalorieData({...calorieData, age: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={calorieData.gender}
                      onChange={(e) => setCalorieData({...calorieData, gender: e.target.value as 'male' | 'female'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={calorieData.height}
                      onChange={(e) => setCalorieData({...calorieData, height: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="175"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={calorieData.currentWeight}
                      onChange={(e) => setCalorieData({...calorieData, currentWeight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="80"
                    />
                  </div>
                </div>
              </div>

              {/* Weight Loss Goals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Weight Loss Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={calorieData.targetWeight}
                      onChange={(e) => setCalorieData({...calorieData, targetWeight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeframe (weeks)
                    </label>
                    <input
                      type="number"
                      value={calorieData.timeframe}
                      onChange={(e) => setCalorieData({...calorieData, timeframe: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="12"
                    />
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity Level</h3>
                <select
                  value={calorieData.activityLevel}
                  onChange={(e) => setCalorieData({...calorieData, activityLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="1.2">Sedentary (little or no exercise)</option>
                  <option value="1.375">Light (light exercise/sports 1-3 days/week)</option>
                  <option value="1.55">Moderate (moderate exercise/sports 3-5 days/week)</option>
                  <option value="1.725">Heavy (hard exercise/sports 6-7 days/week)</option>
                  <option value="1.9">Very Heavy (very hard exercise, physical job)</option>
                </select>
              </div>

              {/* Optional Body Fat */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Optional (for more accuracy)</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Fat Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={calorieData.bodyFat}
                    onChange={(e) => setCalorieData({...calorieData, bodyFat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Optional - leave blank if unknown"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If provided, will use more accurate Katch-McArdle formula
                  </p>
                </div>
              </div>

              <button
                onClick={calculateCalories}
                disabled={!calorieData.age || !calorieData.height || !calorieData.currentWeight || !calorieData.targetWeight || !calorieData.timeframe}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Calculate Weight Loss Plan
              </button>
            </div>
          </div>

          {/* Results */}
          {showResults && results && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2" />
                  Your Weight Loss Plan
                </h2>
                <button
                  onClick={downloadReport}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Plan</span>
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Utensils className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Daily Calories</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{results.targetDailyCalories}</div>
                  <div className="text-sm text-blue-600">calories/day</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Weekly Loss</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{results.weeklyWeightLoss}</div>
                  <div className="text-sm text-green-600">lbs/week</div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Metabolic Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">BMR:</span>
                      <span className="font-semibold ml-2">{results.bmr} cal/day</span>
                    </div>
                    <div>
                      <span className="text-gray-600">TDEE:</span>
                      <span className="font-semibold ml-2">{results.tdee} cal/day</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Daily Deficit:</span>
                      <span className="font-semibold ml-2 text-red-600">-{results.dailyCalorieDeficit} cal</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total to Lose:</span>
                      <span className="font-semibold ml-2">{results.weightToLose} kg</span>
                    </div>
                  </div>
                </div>

                {/* Macro Breakdown */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Daily Macro Targets</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Protein</span>
                      <span className="text-sm font-semibold">{results.macroBreakdown.protein.grams}g ({results.macroBreakdown.protein.calories} cal)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Carbohydrates</span>
                      <span className="text-sm font-semibold">{results.macroBreakdown.carbs.grams}g ({results.macroBreakdown.carbs.calories} cal)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fats</span>
                      <span className="text-sm font-semibold">{results.macroBreakdown.fats.grams}g ({results.macroBreakdown.fats.calories} cal)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Graph */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Weight Loss Timeline
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {results.timeline.slice(0, 12).map((point, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-green-600">{point.week}</span>
                        </div>
                        <span className="text-sm text-gray-600">{point.date}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{point.weight} kg</div>
                        <div className="text-xs text-gray-500">
                          {point.week === 0 ? 'Starting' : `${((parseFloat(calorieData.currentWeight) - point.weight) * 2.2).toFixed(1)} lbs lost`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Important Disclaimer</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      This calculator provides estimates based on established formulas. Individual results may vary due to factors like genetics, 
                      medical conditions, and metabolic differences. Consult with a healthcare provider before starting any weight loss program, 
                      especially if you have underlying health conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;