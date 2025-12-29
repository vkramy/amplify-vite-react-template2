import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { 
  Activity, 
  Heart, 
  Scale, 
  Ruler, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Download,
  Calculator
} from 'lucide-react';

interface AssessmentData {
  height: string;
  weight: string;
  waist: string;
  hip: string;
  systolicBP: string;
  diastolicBP: string;
  restingHeartRate: string;
  age: string;
  gender: string;
}

interface AssessmentResults {
  bmi: {
    value: number;
    category: string;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
  };
  waistHipRatio: {
    value: number;
    category: string;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
  };
  bloodPressure: {
    category: string;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
  };
  restingHeartRate: {
    category: string;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
  };
  overallScore: number;
  recommendations: string[];
}

const BodyAssessment = () => {
  const { user } = useAuth();
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    height: '',
    weight: '',
    waist: '',
    hip: '',
    systolicBP: '',
    diastolicBP: '',
    restingHeartRate: '',
    age: '',
    gender: 'male'
  });
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const attributes = await fetchUserAttributes();
      setAssessmentData(prev => ({
        ...prev,
        height: attributes['custom:height'] || '',
        weight: attributes['custom:weight'] || '',
        age: attributes['custom:age'] || '',
      }));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (height: number, weight: number) => {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    let category = '';
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    let description = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      status = 'poor';
      description = 'You may need to gain weight. Consider consulting a healthcare provider.';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      status = 'excellent';
      description = 'You have a healthy weight for your height. Keep up the good work!';
    } else if (bmi < 30) {
      category = 'Overweight';
      status = 'fair';
      description = 'You may benefit from weight loss. Consider a balanced diet and regular exercise.';
    } else {
      category = 'Obese';
      status = 'poor';
      description = 'Consider consulting a healthcare provider for a weight management plan.';
    }

    return { value: parseFloat(bmi.toFixed(1)), category, status, description };
  };

  const calculateWaistHipRatio = (waist: number, hip: number, gender: string) => {
    const ratio = waist / hip;
    
    let category = '';
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    let description = '';

    if (gender === 'male') {
      if (ratio < 0.90) {
        category = 'Low Risk';
        status = 'excellent';
        description = 'Excellent waist-to-hip ratio indicating low health risk.';
      } else if (ratio < 0.95) {
        category = 'Moderate Risk';
        status = 'good';
        description = 'Good waist-to-hip ratio with moderate health risk.';
      } else if (ratio < 1.0) {
        category = 'High Risk';
        status = 'fair';
        description = 'Elevated waist-to-hip ratio indicating higher health risk.';
      } else {
        category = 'Very High Risk';
        status = 'poor';
        description = 'High waist-to-hip ratio indicating significant health risk.';
      }
    } else {
      if (ratio < 0.80) {
        category = 'Low Risk';
        status = 'excellent';
        description = 'Excellent waist-to-hip ratio indicating low health risk.';
      } else if (ratio < 0.85) {
        category = 'Moderate Risk';
        status = 'good';
        description = 'Good waist-to-hip ratio with moderate health risk.';
      } else if (ratio < 0.90) {
        category = 'High Risk';
        status = 'fair';
        description = 'Elevated waist-to-hip ratio indicating higher health risk.';
      } else {
        category = 'Very High Risk';
        status = 'poor';
        description = 'High waist-to-hip ratio indicating significant health risk.';
      }
    }

    return { value: parseFloat(ratio.toFixed(2)), category, status, description };
  };

  const assessBloodPressure = (systolic: number, diastolic: number) => {
    let category = '';
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    let description = '';

    if (systolic < 120 && diastolic < 80) {
      category = 'Normal';
      status = 'excellent';
      description = 'Your blood pressure is in the normal range. Keep up the healthy lifestyle!';
    } else if (systolic < 130 && diastolic < 80) {
      category = 'Elevated';
      status = 'good';
      description = 'Your blood pressure is elevated. Consider lifestyle changes to prevent hypertension.';
    } else if (systolic < 140 || diastolic < 90) {
      category = 'Stage 1 Hypertension';
      status = 'fair';
      description = 'You have Stage 1 hypertension. Consider consulting a healthcare provider.';
    } else {
      category = 'Stage 2 Hypertension';
      status = 'poor';
      description = 'You have Stage 2 hypertension. Please consult a healthcare provider immediately.';
    }

    return { category, status, description };
  };

  const assessRestingHeartRate = (rhr: number) => {
    let category = '';
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    let description = '';

    if (rhr < 60) {
      category = 'Athlete/Excellent';
      status = 'excellent';
      description = 'Excellent cardiovascular fitness. Your heart is very efficient.';
    } else if (rhr < 70) {
      category = 'Good';
      status = 'good';
      description = 'Good cardiovascular fitness. Your heart rate is healthy.';
    } else if (rhr < 80) {
      category = 'Average';
      status = 'fair';
      description = 'Average resting heart rate. Consider improving cardiovascular fitness.';
    } else if (rhr < 100) {
      category = 'Below Average';
      status = 'fair';
      description = 'Below average fitness level. Regular cardio exercise could help.';
    } else {
      category = 'Poor';
      status = 'poor';
      description = 'High resting heart rate. Consider consulting a healthcare provider.';
    }

    return { category, status, description };
  };

  const generateRecommendations = (results: AssessmentResults): string[] => {
    const recommendations: string[] = [];

    if (results.bmi.status === 'poor' || results.bmi.status === 'fair') {
      if (results.bmi.value < 18.5) {
        recommendations.push('Consider a balanced diet with adequate calories and strength training to gain healthy weight.');
      } else {
        recommendations.push('Focus on a calorie-controlled diet and regular cardio exercise for weight management.');
      }
    }

    if (results.waistHipRatio.status === 'poor' || results.waistHipRatio.status === 'fair') {
      recommendations.push('Include core strengthening exercises and reduce abdominal fat through cardio and diet.');
    }

    if (results.bloodPressure.status === 'poor' || results.bloodPressure.status === 'fair') {
      recommendations.push('Reduce sodium intake, increase potassium-rich foods, and engage in regular aerobic exercise.');
    }

    if (results.restingHeartRate.status === 'poor' || results.restingHeartRate.status === 'fair') {
      recommendations.push('Improve cardiovascular fitness through regular aerobic exercise like walking, cycling, or swimming.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Maintain your excellent health with continued regular exercise and balanced nutrition.');
    }

    recommendations.push('Stay hydrated and get adequate sleep (7-9 hours) for optimal health.');
    recommendations.push('Consider regular health check-ups with your healthcare provider.');

    return recommendations;
  };

  const calculateAssessment = () => {
    const height = parseFloat(assessmentData.height);
    const weight = parseFloat(assessmentData.weight);
    const waist = parseFloat(assessmentData.waist);
    const hip = parseFloat(assessmentData.hip);
    const systolic = parseFloat(assessmentData.systolicBP);
    const diastolic = parseFloat(assessmentData.diastolicBP);
    const rhr = parseFloat(assessmentData.restingHeartRate);

    const bmi = calculateBMI(height, weight);
    const waistHipRatio = calculateWaistHipRatio(waist, hip, assessmentData.gender);
    const bloodPressure = assessBloodPressure(systolic, diastolic);
    const restingHeartRate = assessRestingHeartRate(rhr);

    const statusScores = { excellent: 4, good: 3, fair: 2, poor: 1 };
    const totalScore = statusScores[bmi.status] + statusScores[waistHipRatio.status] + 
                      statusScores[bloodPressure.status] + statusScores[restingHeartRate.status];
    const overallScore = Math.round((totalScore / 16) * 100);

    const results: AssessmentResults = {
      bmi,
      waistHipRatio,
      bloodPressure,
      restingHeartRate,
      overallScore,
      recommendations: []
    };

    results.recommendations = generateRecommendations(results);
    setResults(results);
    setShowResults(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5" />;
      case 'good': return <CheckCircle className="h-5 w-5" />;
      case 'fair': return <Info className="h-5 w-5" />;
      case 'poor': return <AlertCircle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const downloadReport = () => {
    if (!results) return;

    const reportContent = `
BODY COMPOSITION ASSESSMENT REPORT - BitFit Pro
Generated on: ${new Date().toLocaleDateString()}

ASSESSMENT RESULTS:
==================

BMI (Body Mass Index):
- Value: ${results.bmi.value}
- Category: ${results.bmi.category}
- Status: ${results.bmi.status.toUpperCase()}
- Description: ${results.bmi.description}

Waist-to-Hip Ratio:
- Value: ${results.waistHipRatio.value}
- Category: ${results.waistHipRatio.category}
- Status: ${results.waistHipRatio.status.toUpperCase()}
- Description: ${results.waistHipRatio.description}

Blood Pressure:
- Reading: ${assessmentData.systolicBP}/${assessmentData.diastolicBP} mmHg
- Category: ${results.bloodPressure.category}
- Status: ${results.bloodPressure.status.toUpperCase()}
- Description: ${results.bloodPressure.description}

Resting Heart Rate:
- Value: ${assessmentData.restingHeartRate} bpm
- Category: ${results.restingHeartRate.category}
- Status: ${results.restingHeartRate.status.toUpperCase()}
- Description: ${results.restingHeartRate.description}

OVERALL HEALTH SCORE: ${results.overallScore}/100

PERSONALIZED RECOMMENDATIONS:
============================
${results.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

DISCLAIMER:
===========
This assessment is for informational purposes only and should not replace professional medical advice. 
Please consult with a healthcare provider for comprehensive health evaluation and personalized recommendations.

© BitFit Pro - Your Partner in Health and Fitness
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Body-Assessment-Report-${new Date().toISOString().split('T')[0]}.txt`;
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
          <p className="mt-4 text-gray-600">Loading assessment...</p>
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
            <div className="bg-blue-100 p-4 rounded-full">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Body Composition Assessment</h1>
              <p className="text-gray-600">Comprehensive health metrics analysis and benchmarking</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Calculator className="h-6 w-6 mr-2" />
              Assessment Input
            </h2>

            <div className="space-y-6">
              {/* Basic Measurements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Measurements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={assessmentData.height}
                      onChange={(e) => setAssessmentData({...assessmentData, height: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={assessmentData.weight}
                      onChange={(e) => setAssessmentData({...assessmentData, weight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waist (cm)
                    </label>
                    <input
                      type="number"
                      value={assessmentData.waist}
                      onChange={(e) => setAssessmentData({...assessmentData, waist: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hip (cm)
                    </label>
                    <input
                      type="number"
                      value={assessmentData.hip}
                      onChange={(e) => setAssessmentData({...assessmentData, hip: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="95"
                    />
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={assessmentData.systolicBP}
                      onChange={(e) => setAssessmentData({...assessmentData, systolicBP: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={assessmentData.diastolicBP}
                      onChange={(e) => setAssessmentData({...assessmentData, diastolicBP: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resting Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={assessmentData.restingHeartRate}
                      onChange={(e) => setAssessmentData({...assessmentData, restingHeartRate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={assessmentData.age}
                      onChange={(e) => setAssessmentData({...assessmentData, age: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={assessmentData.gender}
                  onChange={(e) => setAssessmentData({...assessmentData, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <button
                onClick={calculateAssessment}
                disabled={!assessmentData.height || !assessmentData.weight || !assessmentData.waist || !assessmentData.hip || !assessmentData.systolicBP || !assessmentData.diastolicBP || !assessmentData.restingHeartRate || !assessmentData.age}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Calculate Assessment
              </button>
            </div>
          </div>

          {/* Results */}
          {showResults && results && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Assessment Results
                </h2>
                <button
                  onClick={downloadReport}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </button>
              </div>

              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{results.overallScore}/100</div>
                  <div className="text-lg font-semibold text-gray-700">Overall Health Score</div>
                </div>
              </div>

              {/* Individual Metrics */}
              <div className="space-y-4">
                {/* BMI */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Scale className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold">BMI</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(results.bmi.status)}`}>
                      {getStatusIcon(results.bmi.status)}
                      <span className="text-sm font-medium">{results.bmi.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{results.bmi.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{results.bmi.category}</div>
                  <div className="text-sm text-gray-700">{results.bmi.description}</div>
                </div>

                {/* Waist-Hip Ratio */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold">Waist-Hip Ratio</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(results.waistHipRatio.status)}`}>
                      {getStatusIcon(results.waistHipRatio.status)}
                      <span className="text-sm font-medium">{results.waistHipRatio.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{results.waistHipRatio.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{results.waistHipRatio.category}</div>
                  <div className="text-sm text-gray-700">{results.waistHipRatio.description}</div>
                </div>

                {/* Blood Pressure */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold">Blood Pressure</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(results.bloodPressure.status)}`}>
                      {getStatusIcon(results.bloodPressure.status)}
                      <span className="text-sm font-medium">{results.bloodPressure.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{assessmentData.systolicBP}/{assessmentData.diastolicBP} mmHg</div>
                  <div className="text-sm text-gray-600 mb-2">{results.bloodPressure.category}</div>
                  <div className="text-sm text-gray-700">{results.bloodPressure.description}</div>
                </div>

                {/* Resting Heart Rate */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold">Resting Heart Rate</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(results.restingHeartRate.status)}`}>
                      {getStatusIcon(results.restingHeartRate.status)}
                      <span className="text-sm font-medium">{results.restingHeartRate.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{assessmentData.restingHeartRate} bpm</div>
                  <div className="text-sm text-gray-600 mb-2">{results.restingHeartRate.category}</div>
                  <div className="text-sm text-gray-700">{results.restingHeartRate.description}</div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-6 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{recommendation}</span>
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
                      This assessment is for informational purposes only and should not replace professional medical advice. 
                      Please consult with a healthcare provider for comprehensive health evaluation and personalized recommendations.
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

export default BodyAssessment;