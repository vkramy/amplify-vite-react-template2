import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { 
  Heart, 
  Timer, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Download,
  Play,
  Clock,
  Target,
  Footprints,
  Zap,
  BarChart3,
  HelpCircle,
  X
} from 'lucide-react';
import cardiovascularData from '../AppData/Cardiovascular_Fitness_Assessments.json';

type TestType = 'rockport' | 'cooper12' | 'mile15' | 'stepTest';

interface BaseAssessmentData {
  age: string;
  gender: string;
  weight: string;
}

interface RockportData extends BaseAssessmentData {
  walkTimeMinutes: string;
  walkTimeSeconds: string;
  heartRate: string;
}

interface Cooper12Data extends BaseAssessmentData {
  distanceMiles: string;
}

interface Mile15Data extends BaseAssessmentData {
  runTimeMinutes: string;
  runTimeSeconds: string;
}

interface StepTestData extends BaseAssessmentData {
  recoveryHeartRate: string;
}

interface AssessmentResults {
  vo2Max?: number;
  fitnessScore?: number;
  fitnessCategory: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  recommendations: string[];
  testSpecificData?: any;
}

const CardiovascularAssessment = () => {
  const { user } = useAuth();
  const [activeTest, setActiveTest] = useState<TestType>('rockport');
  const [activeTab, setActiveTab] = useState<'instructions' | 'test' | 'results'>('instructions');
  
  // Base data shared across all tests
  const [baseData, setBaseData] = useState<BaseAssessmentData>({
    age: '',
    gender: 'male',
    weight: ''
  });

  // Test-specific data
  const [rockportData, setRockportData] = useState<RockportData>({
    ...baseData,
    walkTimeMinutes: '',
    walkTimeSeconds: '',
    heartRate: ''
  });

  const [cooper12Data, setCooper12Data] = useState<Cooper12Data>({
    ...baseData,
    distanceMiles: ''
  });

  const [mile15Data, setMile15Data] = useState<Mile15Data>({
    ...baseData,
    runTimeMinutes: '',
    runTimeSeconds: ''
  });

  const [stepTestData, setStepTestData] = useState<StepTestData>({
    ...baseData,
    recoveryHeartRate: ''
  });

  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  useEffect(() => {
    // Update all test data when base data changes
    setRockportData(prev => ({ ...prev, ...baseData }));
    setCooper12Data(prev => ({ ...prev, ...baseData }));
    setMile15Data(prev => ({ ...prev, ...baseData }));
    setStepTestData(prev => ({ ...prev, ...baseData }));
  }, [baseData]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const attributes = await fetchUserAttributes();
      const userData = {
        age: attributes['custom:age'] || '',
        gender: 'male', // Default, user can change
        weight: attributes['custom:weight'] || '',
      };
      setBaseData(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgeRange = (age: number, testType: TestType): string => {
    // Different tests have different age range formats
    switch (testType) {
      case 'rockport':
        if (age >= 18 && age <= 25) return "18-25 years";
        if (age >= 26 && age <= 35) return "26-35 years";
        if (age >= 36 && age <= 45) return "36-45 years";
        if (age >= 46 && age <= 55) return "46-55 years";
        if (age >= 56 && age <= 65) return "56-65 years";
        if (age >= 65) return "65+ years";
        return "18-25 years"; // Default
      case 'stepTest':
        if (age >= 18 && age <= 25) return "18-25";
        if (age >= 26 && age <= 35) return "26-35";
        if (age >= 36 && age <= 45) return "36-45";
        if (age >= 46 && age <= 55) return "46-55";
        if (age >= 56 && age <= 65) return "56-65";
        if (age >= 65) return "65+";
        return "18-25"; // Default
      case 'cooper12':
        if (age >= 13 && age <= 19) return "13-19";
        if (age >= 20 && age <= 29) return "20-29";
        if (age >= 30 && age <= 39) return "30-39";
        if (age >= 40 && age <= 49) return "40-49";
        if (age >= 50) return "50+";
        return "20-29"; // Default
      case 'mile15':
        if (age >= 18 && age <= 25) return "18-25 years";
        if (age >= 26 && age <= 35) return "26-35 years";
        if (age >= 36 && age <= 45) return "36-45 years";
        if (age >= 46 && age <= 55) return "46-55 years";
        if (age >= 56 && age <= 65) return "56-65 years";
        if (age >= 65) return "65+ years";
        return "18-25 years"; // Default
      default:
        return "18-25 years";
    }
  };

  const parseRange = (range: string) => {
    if (range.includes('>')) return { min: parseFloat(range.replace('>', '').trim()), max: Infinity };
    if (range.includes('<')) return { min: -Infinity, max: parseFloat(range.replace('<', '').trim()) };
    const [min, max] = range.split('-').map(s => parseFloat(s.trim()));
    return { min, max };
  };

  // Rockport Walk Test Calculations
  const calculateRockportVO2Max = () => {
    const age = parseFloat(rockportData.age);
    const weight = parseFloat(rockportData.weight) * 2.20462; // Convert kg to lbs
    const genderValue = rockportData.gender === 'male' ? 1 : 0;
    const timeMinutes = parseFloat(rockportData.walkTimeMinutes) + (parseFloat(rockportData.walkTimeSeconds) / 60);
    const heartRate = parseFloat(rockportData.heartRate);

    const vo2Max = 132.853 - (0.0769 * weight) - (0.3877 * age) + (6.315 * genderValue) - (3.2649 * timeMinutes) - (0.1565 * heartRate);
    return Math.round(vo2Max * 10) / 10;
  };

  const benchmarkRockportResults = (vo2Max: number, age: number, gender: string) => {
    const ageRange = getAgeRange(age, 'rockport');
    const standards = gender === 'male' 
      ? cardiovascularData.rockportWalkTest.maleStandards 
      : cardiovascularData.rockportWalkTest.femaleStandards;
    
    const ageGroup = standards.find(group => group["Age Range"] === ageRange);
    if (!ageGroup) return { category: 'Unknown', status: 'fair' as const, description: 'Unable to determine fitness level.' };

    if (vo2Max > parseRange(ageGroup.Excellent.replace('>', '')).min) {
      return { category: 'Excellent', status: 'excellent' as const, description: 'Excellent cardiovascular fitness! Outstanding performance for your age group.' };
    } else if (vo2Max >= parseRange(ageGroup.Good).min && vo2Max <= parseRange(ageGroup.Good).max) {
      return { category: 'Good', status: 'excellent' as const, description: 'Good cardiovascular fitness. You have a very healthy heart and lungs.' };
    } else if (vo2Max >= parseRange(ageGroup["Above Average"]).min && vo2Max <= parseRange(ageGroup["Above Average"]).max) {
      return { category: 'Above Average', status: 'good' as const, description: 'Above average cardiovascular fitness. You have good endurance capacity.' };
    } else if (vo2Max >= parseRange(ageGroup.Average).min && vo2Max <= parseRange(ageGroup.Average).max) {
      return { category: 'Average', status: 'fair' as const, description: 'Average cardiovascular fitness for your age group.' };
    } else if (vo2Max >= parseRange(ageGroup["Below Average"]).min && vo2Max <= parseRange(ageGroup["Below Average"]).max) {
      return { category: 'Below Average', status: 'fair' as const, description: 'Below average cardiovascular fitness. There is room for improvement with regular exercise.' };
    } else if (vo2Max >= parseRange(ageGroup.Poor).min && vo2Max <= parseRange(ageGroup.Poor).max) {
      return { category: 'Poor', status: 'poor' as const, description: 'Poor cardiovascular fitness. Consider starting a regular exercise program.' };
    } else {
      return { category: 'Very Poor', status: 'poor' as const, description: 'Very poor cardiovascular fitness. Please consult a healthcare provider before starting exercise.' };
    }
  };

  // Cooper 12-minute Run Test Calculations
  const calculateCooper12VO2Max = () => {
    const distance = parseFloat(cooper12Data.distanceMiles);
    const vo2Max = (distance * 35.97) - 11.29;
    return Math.round(vo2Max * 10) / 10;
  };

  const benchmarkCooper12Results = (distance: number, age: number, gender: string) => {
    const ageRange = getAgeRange(age, 'cooper12');
    const standards = gender === 'male' 
      ? cardiovascularData.cooper12MinuteRun.maleStandards 
      : cardiovascularData.cooper12MinuteRun.femaleStandards;
    
    const ageGroup = standards.find(group => group["Age Range"] === ageRange);
    if (!ageGroup) return { category: 'Unknown', status: 'fair' as const, description: 'Unable to determine fitness level.' };

    if (distance > parseRange(ageGroup.Excellent.replace('>', '')).min) {
      return { category: 'Excellent', status: 'excellent' as const, description: 'Excellent cardiovascular endurance! Outstanding performance for your age group.' };
    } else if (distance >= parseRange(ageGroup.Good).min && distance <= parseRange(ageGroup.Good).max) {
      return { category: 'Good', status: 'good' as const, description: 'Good cardiovascular endurance. Above average performance.' };
    } else if (distance >= parseRange(ageGroup.Average).min && distance <= parseRange(ageGroup.Average).max) {
      return { category: 'Average', status: 'fair' as const, description: 'Average cardiovascular endurance for your age group.' };
    } else if (distance >= parseRange(ageGroup["Below Average"]).min && distance <= parseRange(ageGroup["Below Average"]).max) {
      return { category: 'Below Average', status: 'fair' as const, description: 'Below average endurance. Regular training could improve your performance.' };
    } else {
      return { category: 'Poor', status: 'poor' as const, description: 'Poor cardiovascular endurance. Consider starting a structured exercise program.' };
    }
  };

  // 1.5 Mile Run Test Calculations
  const calculateMile15VO2Max = () => {
    const timeMinutes = parseFloat(mile15Data.runTimeMinutes) + (parseFloat(mile15Data.runTimeSeconds) / 60);
    const vo2Max = 483 / timeMinutes + 3.5;
    return Math.round(vo2Max * 10) / 10;
  };

  const benchmarkMile15Results = (vo2Max: number, age: number, gender: string) => {
    const ageRange = getAgeRange(age, 'mile15');
    const standards = gender === 'male' 
      ? cardiovascularData.mile15Run.maleStandards 
      : cardiovascularData.mile15Run.femaleStandards;
    
    const ageGroup = standards.find(group => group["Age Range"] === ageRange);
    if (!ageGroup) return { category: 'Unknown', status: 'fair' as const, description: 'Unable to determine fitness level.' };

    if (vo2Max > parseRange(ageGroup.Excellent.replace('>', '')).min) {
      return { category: 'Excellent', status: 'excellent' as const, description: 'Excellent running performance! Outstanding cardiovascular fitness.' };
    } else if (vo2Max >= parseRange(ageGroup.Good).min && vo2Max <= parseRange(ageGroup.Good).max) {
      return { category: 'Good', status: 'excellent' as const, description: 'Good running performance. Above average cardiovascular fitness.' };
    } else if (vo2Max >= parseRange(ageGroup["Above Average"]).min && vo2Max <= parseRange(ageGroup["Above Average"]).max) {
      return { category: 'Above Average', status: 'good' as const, description: 'Above average running performance. Good cardiovascular fitness.' };
    } else if (vo2Max >= parseRange(ageGroup.Average).min && vo2Max <= parseRange(ageGroup.Average).max) {
      return { category: 'Average', status: 'fair' as const, description: 'Average running performance for your age group.' };
    } else if (vo2Max >= parseRange(ageGroup["Below Average"]).min && vo2Max <= parseRange(ageGroup["Below Average"]).max) {
      return { category: 'Below Average', status: 'fair' as const, description: 'Below average performance. Regular training could help improve your fitness.' };
    } else if (vo2Max >= parseRange(ageGroup.Poor).min && vo2Max <= parseRange(ageGroup.Poor).max) {
      return { category: 'Poor', status: 'poor' as const, description: 'Poor running performance. Consider starting with walking and gradually building endurance.' };
    } else {
      return { category: 'Very Poor', status: 'poor' as const, description: 'Very poor running performance. Please consult a healthcare provider before starting exercise.' };
    }
  };

  // Step Test Calculations
  const calculateStepTestScore = () => {
    const recoveryHR = parseFloat(stepTestData.recoveryHeartRate);
    const fitnessScore = (180 * 100) / (recoveryHR * 5.6);
    return Math.round(fitnessScore * 10) / 10;
  };

  const benchmarkStepTestResults = (recoveryHR: number, age: number, gender: string) => {
    const ageRange = getAgeRange(age, 'stepTest');
    const standards = gender === 'male' 
      ? cardiovascularData.stepTest3Minute.maleStandards 
      : cardiovascularData.stepTest3Minute.femaleStandards;
    
    const ageGroup = standards.find(group => group["Age Range"] === ageRange);
    if (!ageGroup) return { category: 'Unknown', status: 'fair' as const, description: 'Unable to determine fitness level.' };

    if (recoveryHR < parseRange(ageGroup.Excellent.replace('<', '')).max) {
      return { category: 'Excellent', status: 'excellent' as const, description: 'Excellent cardiovascular recovery! Your heart recovers very efficiently.' };
    } else if (recoveryHR >= parseRange(ageGroup.Good).min && recoveryHR <= parseRange(ageGroup.Good).max) {
      return { category: 'Good', status: 'good' as const, description: 'Good cardiovascular recovery. Above average fitness level.' };
    } else if (recoveryHR >= parseRange(ageGroup["Above Average"]).min && recoveryHR <= parseRange(ageGroup["Above Average"]).max) {
      return { category: 'Above Average', status: 'good' as const, description: 'Above average cardiovascular recovery.' };
    } else if (recoveryHR >= parseRange(ageGroup.Average).min && recoveryHR <= parseRange(ageGroup.Average).max) {
      return { category: 'Average', status: 'fair' as const, description: 'Average cardiovascular recovery for your age group.' };
    } else if (recoveryHR >= parseRange(ageGroup["Below Average"]).min && recoveryHR <= parseRange(ageGroup["Below Average"]).max) {
      return { category: 'Below Average', status: 'fair' as const, description: 'Below average recovery. Regular cardio exercise could improve your fitness.' };
    } else {
      return { category: 'Poor', status: 'poor' as const, description: 'Poor cardiovascular recovery. Consider starting a gradual exercise program.' };
    }
  };

  const generateRecommendations = (status: string, testType: TestType): string[] => {
    const recommendations: string[] = [];

    if (status === 'poor' || status === 'fair') {
      if (testType === 'rockport' || testType === 'stepTest') {
        recommendations.push('Start with 20-30 minutes of brisk walking 3-4 times per week.');
        recommendations.push('Gradually increase walking intensity and duration over 4-6 weeks.');
      } else {
        recommendations.push('Begin with a walk-run program, alternating walking and light jogging.');
        recommendations.push('Focus on building your aerobic base with consistent, moderate-intensity exercise.');
      }
      recommendations.push('Include 2-3 days of strength training to support overall fitness.');
    } else if (status === 'good') {
      recommendations.push('Maintain current activity level with 150+ minutes of moderate exercise weekly.');
      recommendations.push('Add interval training 1-2 times per week to improve performance further.');
      recommendations.push('Consider cross-training activities like cycling, swimming, or rowing.');
    } else {
      recommendations.push('Excellent work! Maintain your current fitness level with varied activities.');
      recommendations.push('Challenge yourself with high-intensity interval training (HIIT).');
      recommendations.push('Consider training for endurance events or competitive activities.');
    }

    recommendations.push('Stay consistent with your exercise routine for continued cardiovascular health.');
    recommendations.push('Monitor your progress by retesting every 8-12 weeks.');

    return recommendations;
  };

  const calculateAssessment = () => {
    let results: AssessmentResults;
    const age = parseFloat(baseData.age);

    switch (activeTest) {
      case 'rockport':
        const rockportVO2Max = calculateRockportVO2Max();
        const rockportBenchmark = benchmarkRockportResults(rockportVO2Max, age, rockportData.gender);
        results = {
          vo2Max: rockportVO2Max,
          fitnessCategory: rockportBenchmark.category,
          status: rockportBenchmark.status,
          description: rockportBenchmark.description,
          recommendations: generateRecommendations(rockportBenchmark.status, 'rockport'),
          testSpecificData: {
            walkTime: `${rockportData.walkTimeMinutes}:${rockportData.walkTimeSeconds.padStart(2, '0')}`,
            heartRate: `${rockportData.heartRate} bpm`
          }
        };
        break;

      case 'cooper12':
        const cooper12VO2Max = calculateCooper12VO2Max();
        const cooper12Benchmark = benchmarkCooper12Results(parseFloat(cooper12Data.distanceMiles), age, cooper12Data.gender);
        results = {
          vo2Max: cooper12VO2Max,
          fitnessCategory: cooper12Benchmark.category,
          status: cooper12Benchmark.status,
          description: cooper12Benchmark.description,
          recommendations: generateRecommendations(cooper12Benchmark.status, 'cooper12'),
          testSpecificData: {
            distance: `${cooper12Data.distanceMiles} miles`
          }
        };
        break;

      case 'mile15':
        const mile15VO2Max = calculateMile15VO2Max();
        const mile15Benchmark = benchmarkMile15Results(mile15VO2Max, age, mile15Data.gender);
        results = {
          vo2Max: mile15VO2Max,
          fitnessCategory: mile15Benchmark.category,
          status: mile15Benchmark.status,
          description: mile15Benchmark.description,
          recommendations: generateRecommendations(mile15Benchmark.status, 'mile15'),
          testSpecificData: {
            runTime: `${mile15Data.runTimeMinutes}:${mile15Data.runTimeSeconds.padStart(2, '0')}`
          }
        };
        break;

      case 'stepTest':
        const stepTestScore = calculateStepTestScore();
        const stepTestBenchmark = benchmarkStepTestResults(parseFloat(stepTestData.recoveryHeartRate), age, stepTestData.gender);
        results = {
          fitnessScore: stepTestScore,
          fitnessCategory: stepTestBenchmark.category,
          status: stepTestBenchmark.status,
          description: stepTestBenchmark.description,
          recommendations: generateRecommendations(stepTestBenchmark.status, 'stepTest'),
          testSpecificData: {
            recoveryHeartRate: `${stepTestData.recoveryHeartRate} bpm`
          }
        };
        break;

      default:
        return;
    }

    setResults(results);
    setActiveTab('results');
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

    const testNames = {
      rockport: 'Rockport 1-Mile Walk Test',
      cooper12: 'Cooper 12-Minute Run Test',
      mile15: '1.5-Mile Run Test',
      stepTest: '3-Minute Step Test'
    };

    const reportContent = `
CARDIOVASCULAR FITNESS ASSESSMENT REPORT - BitFit Pro
Generated on: ${new Date().toLocaleDateString()}
Test: ${testNames[activeTest]}

PARTICIPANT INFORMATION:
========================
Age: ${baseData.age} years
Gender: ${baseData.gender}
Weight: ${baseData.weight} kg

TEST RESULTS:
=============
${results.vo2Max ? `VO2 Max: ${results.vo2Max} ml/kg/min` : ''}
${results.fitnessScore ? `Fitness Score: ${results.fitnessScore}` : ''}
Fitness Category: ${results.fitnessCategory}
Status: ${results.status.toUpperCase()}
Description: ${results.description}

${results.testSpecificData ? Object.entries(results.testSpecificData).map(([key, value]) => `${key}: ${value}`).join('\n') : ''}

PERSONALIZED RECOMMENDATIONS:
============================
${results.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

DISCLAIMER:
===========
This assessment is for informational purposes only and should not replace professional medical advice. 
Please consult with a healthcare provider or a fitness professional for comprehensive health evaluation and personalized recommendations.

© BitFit Pro - Your Partner in Health and Fitness
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cardiovascular-Assessment-${testNames[activeTest].replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTestIcon = (testType: TestType) => {
    switch (testType) {
      case 'rockport': return <Footprints className="h-5 w-5" />;
      case 'cooper12': return <Timer className="h-5 w-5" />;
      case 'mile15': return <Zap className="h-5 w-5" />;
      case 'stepTest': return <BarChart3 className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getTestData = () => {
    switch (activeTest) {
      case 'rockport': return cardiovascularData.rockportWalkTest;
      case 'cooper12': return cardiovascularData.cooper12MinuteRun;
      case 'mile15': return cardiovascularData.mile15Run;
      case 'stepTest': return cardiovascularData.stepTest3Minute;
      default: return cardiovascularData.rockportWalkTest;
    }
  };

  const isFormValid = () => {
    if (!baseData.age || !baseData.weight) return false;
    
    switch (activeTest) {
      case 'rockport':
        return rockportData.walkTimeMinutes && rockportData.walkTimeSeconds && rockportData.heartRate;
      case 'cooper12':
        return cooper12Data.distanceMiles;
      case 'mile15':
        return mile15Data.runTimeMinutes && mile15Data.runTimeSeconds;
      case 'stepTest':
        return stepTestData.recoveryHeartRate;
      default:
        return false;
    }
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-4 rounded-full">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Cardiovascular Fitness Assessment</h1>
                <p className="text-gray-600">Choose from multiple scientifically validated fitness tests</p>
              </div>
            </div>
            <button
              onClick={() => setShowGuidelines(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Guidelines</span>
            </button>
          </div>
        </div>

        {/* Test Selection */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
            <button
              onClick={() => {setActiveTest('rockport'); setActiveTab('instructions'); setResults(null);}}
              className={`p-6 text-center transition-colors ${
                activeTest === 'rockport' 
                  ? 'bg-blue-50 border-b-2 border-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full ${activeTest === 'rockport' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Footprints className={`h-6 w-6 ${activeTest === 'rockport' ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Rockport Walk</h3>
                  <p className="text-sm text-gray-600">1-Mile Walk Test</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {setActiveTest('cooper12'); setActiveTab('instructions'); setResults(null);}}
              className={`p-6 text-center transition-colors ${
                activeTest === 'cooper12' 
                  ? 'bg-blue-50 border-b-2 border-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full ${activeTest === 'cooper12' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Timer className={`h-6 w-6 ${activeTest === 'cooper12' ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Cooper 12-Min</h3>
                  <p className="text-sm text-gray-600">Distance Run Test</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {setActiveTest('mile15'); setActiveTab('instructions'); setResults(null);}}
              className={`p-6 text-center transition-colors ${
                activeTest === 'mile15' 
                  ? 'bg-blue-50 border-b-2 border-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full ${activeTest === 'mile15' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Zap className={`h-6 w-6 ${activeTest === 'mile15' ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">1.5-Mile Run</h3>
                  <p className="text-sm text-gray-600">Time Trial Test</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {setActiveTest('stepTest'); setActiveTab('instructions'); setResults(null);}}
              className={`p-6 text-center transition-colors ${
                activeTest === 'stepTest' 
                  ? 'bg-blue-50 border-b-2 border-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full ${activeTest === 'stepTest' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <BarChart3 className={`h-6 w-6 ${activeTest === 'stepTest' ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">3-Min Step</h3>
                  <p className="text-sm text-gray-600">Recovery Test</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'instructions'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Instructions</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'test'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Take Test</span>
              </div>
            </button>
            {results && (
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'results'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Results</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'instructions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                {getTestIcon(activeTest)}
                <span className="ml-2">Test Instructions</span>
              </h2>
              <div className="space-y-4">
                {getTestData().instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {instruction.Step}
                    </div>
                    <p className="text-gray-700 pt-1">{instruction.Instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formula/Additional Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Target className="h-6 w-6 mr-2" />
                {activeTest === 'stepTest' ? 'Scoring Information' : 'VO2 Max Formula'}
              </h2>
              <div className="space-y-4">
                {getTestData().formula.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-800">{item.Component}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.Details}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">About This Test</h3>
                <p className="text-blue-700 text-sm">
                  {getTestData().description}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'test' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                Test Data Input
              </h2>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age (years)
                      </label>
                      <input
                        type="number"
                        value={baseData.age}
                        onChange={(e) => setBaseData({...baseData, age: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={baseData.gender}
                        onChange={(e) => setBaseData({...baseData, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={baseData.weight}
                        onChange={(e) => setBaseData({...baseData, weight: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="70"
                      />
                    </div>
                  </div>
                </div>

                {/* Test-Specific Inputs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Test Results</h3>
                  
                  {activeTest === 'rockport' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Walk Time - Minutes
                        </label>
                        <input
                          type="number"
                          value={rockportData.walkTimeMinutes}
                          onChange={(e) => setRockportData({...rockportData, walkTimeMinutes: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="15"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Walk Time - Seconds
                        </label>
                        <input
                          type="number"
                          value={rockportData.walkTimeSeconds}
                          onChange={(e) => setRockportData({...rockportData, walkTimeSeconds: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="30"
                          min="0"
                          max="59"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heart Rate (bpm) - Immediately after finishing
                        </label>
                        <input
                          type="number"
                          value={rockportData.heartRate}
                          onChange={(e) => setRockportData({...rockportData, heartRate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="140"
                        />
                      </div>
                    </div>
                  )}

                  {activeTest === 'cooper12' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Distance Covered (miles)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={cooper12Data.distanceMiles}
                        onChange={(e) => setCooper12Data({...cooper12Data, distanceMiles: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1.5"
                      />
                    </div>
                  )}

                  {activeTest === 'mile15' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Run Time - Minutes
                        </label>
                        <input
                          type="number"
                          value={mile15Data.runTimeMinutes}
                          onChange={(e) => setMile15Data({...mile15Data, runTimeMinutes: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Run Time - Seconds
                        </label>
                        <input
                          type="number"
                          value={mile15Data.runTimeSeconds}
                          onChange={(e) => setMile15Data({...mile15Data, runTimeSeconds: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="30"
                          min="0"
                          max="59"
                        />
                      </div>
                    </div>
                  )}

                  {activeTest === 'stepTest' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recovery Heart Rate (bpm) - 1 minute after test
                      </label>
                      <input
                        type="number"
                        value={stepTestData.recoveryHeartRate}
                        onChange={(e) => setStepTestData({...stepTestData, recoveryHeartRate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="120"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={calculateAssessment}
                  disabled={!isFormValid()}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Calculate Results
                </button>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Timer className="h-6 w-6 mr-2" />
                Quick Reference
              </h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Important Notes</h4>
                      <div className="text-sm text-yellow-700 mt-2">
                        <p className="mb-2">{getTestData().description}</p>
                        {activeTest === 'stepTest' && cardiovascularData.stepTest3Minute.notes && (
                          <ul className="space-y-1">
                            {cardiovascularData.stepTest3Minute.notes.slice(0, 3).map((note: any, index: number) => (
                              <li key={index}>• {note.Details}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Typical Performance Ranges</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600">Excellent:</span>
                      <span className="font-medium">Top 20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Good:</span>
                      <span className="font-medium">Above Average</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-600">Average:</span>
                      <span className="font-medium">50th Percentile</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Below Average:</span>
                      <span className="font-medium">Bottom 30%</span>
                    </div>
                  </div>
                </div>

                {activeTest === 'stepTest' && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Step Test Tips</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use a 12-inch high step or bench</li>
                      <li>• Maintain 24 steps per minute (96 beats/min)</li>
                      <li>• Step pattern: up-up-down-down</li>
                      <li>• Take pulse exactly 1 minute after finishing</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Results Display */}
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

              {/* Score Display */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {results.vo2Max || results.fitnessScore}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    {results.vo2Max ? 'VO2 Max (ml/kg/min)' : 'Fitness Score'}
                  </div>
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mt-3 ${getStatusColor(results.status)}`}>
                    {getStatusIcon(results.status)}
                    <span className="font-medium">{results.fitnessCategory}</span>
                  </div>
                </div>
              </div>

              {/* Test Summary */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Test Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {results.testSpecificData && Object.entries(results.testSpecificData).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <div className="font-medium">{String(value)}</div>
                    </div>
                  ))}
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <div className="font-medium">{baseData.age} years</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <div className="font-medium">{baseData.weight} kg</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">{results.description}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Activity className="h-6 w-6 mr-2" />
                Personalized Recommendations
              </h2>
              
              <div className="space-y-4">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>

              {/* Age Group Standards */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">
                  {(() => {
                    const getStandardsTitle = () => {
                      switch (activeTest) {
                        case 'rockport':
                          return `VO2 Max Standards for ${baseData.gender === 'male' ? 'Men' : 'Women'} (Age ${getAgeRange(parseInt(baseData.age), activeTest)})`;
                        case 'stepTest':
                          return `Recovery HR Standards for ${baseData.gender === 'male' ? 'Men' : 'Women'} (Age ${getAgeRange(parseInt(baseData.age), activeTest)})`;
                        case 'cooper12':
                          return `Distance (miles) Standards for ${baseData.gender === 'male' ? 'Men' : 'Women'} (Age ${getAgeRange(parseInt(baseData.age), activeTest)})`;
                        case 'mile15':
                          return `VO2 Max Standards for ${baseData.gender === 'male' ? 'Men' : 'Women'} (Age ${getAgeRange(parseInt(baseData.age), activeTest)})`;
                        default:
                          return `Standards for ${baseData.gender === 'male' ? 'Men' : 'Women'} (Age ${getAgeRange(parseInt(baseData.age), activeTest)})`;
                      }
                    };
                    return getStandardsTitle();
                  })()}
                </h3>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const testData = getTestData();
                    const standards = baseData.gender === 'male' 
                      ? testData.maleStandards 
                      : testData.femaleStandards;
                    const ageGroup = standards.find(group => group["Age Range"] === getAgeRange(parseInt(baseData.age), activeTest));
                    
                    if (!ageGroup) return <p className="text-gray-500">No standards available for this age group.</p>;
                    
                    return Object.entries(ageGroup).filter(([key]) => key !== "Age Range").map(([category, value]) => (
                      <div key={category} className="flex justify-between">
                        <span className={`${
                          category === 'Excellent' ? 'text-green-600' :
                          category === 'Good' || category === 'Above Average' ? 'text-blue-600' :
                          category === 'Average' || category === 'Below Average' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {category}:
                        </span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Important Disclaimer</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      This assessment provides an estimate of cardiovascular fitness and should not replace professional medical advice. 
                      Consult with a healthcare provider before starting any new exercise program.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Guidelines Popup */}
        {showGuidelines && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <HelpCircle className="h-6 w-6 mr-2 text-blue-600" />
                  General Testing Guidelines
                </h2>
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cardiovascularData.generalGuidelines.map((guideline, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {guideline.Topic}
                      </h3>
                      <p className="text-gray-700 text-sm">{guideline.Details}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800">Important Safety Notice</h4>
                      <p className="text-sm text-red-700 mt-1">
                        These assessments involve physical exertion. If you experience chest pain, dizziness, 
                        shortness of breath, or any other concerning symptoms during testing, stop immediately 
                        and consult a healthcare professional. Always warm up properly before testing and cool 
                        down afterward.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800">About These Tests</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        All cardiovascular fitness tests provided are scientifically validated and widely used 
                        by fitness professionals. Results provide estimates of cardiovascular fitness and should 
                        be used as general guidance. For comprehensive health assessment, consult with qualified 
                        healthcare or fitness professionals.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowGuidelines(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardiovascularAssessment;