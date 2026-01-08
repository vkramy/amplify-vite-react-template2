import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { 
  Dumbbell, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Download,
  Calculator,
  Target,
  Activity,
  HelpCircle,
  X
} from 'lucide-react';
import strengthDataRaw from '../AppData/Strength_Fitness_Assessments.json';

const strengthData = strengthDataRaw as any;

type TestType = 'benchPress' | 'legPress' | 'pushUp';

interface BaseAssessmentData {
  age: string;
  gender: string;
  weight: string;
}

interface BenchPressData extends BaseAssessmentData {
  oneRepMax: string;
  reps: string;
  weightLifted: string;
  testMethod: 'direct' | 'calculated';
  notes: string;
}

interface LegPressData extends BaseAssessmentData {
  oneRepMax: string;
  reps: string;
  weightLifted: string;
  testMethod: 'direct' | 'calculated';
  notes: string;
}

interface PushUpData extends BaseAssessmentData {
  maxPushUps: string;
  notes: string;
}

interface AssessmentResults {
  ratio?: number;
  maxReps?: number;
  fitnessCategory: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  recommendations: string[];
  testSpecificData?: any;
}

const StrengthAssessment = () => {
  const { user } = useAuth();
  const [activeTest, setActiveTest] = useState<TestType>('benchPress');
  const [activeTab, setActiveTab] = useState<'instructions' | 'test' | 'results'>('instructions');
  
  // Base data shared across all tests
  const [baseData, setBaseData] = useState<BaseAssessmentData>({
    age: '',
    gender: 'male',
    weight: ''
  });

  // Test-specific data
  const [benchPressData, setBenchPressData] = useState<BenchPressData>({
    ...baseData,
    oneRepMax: '',
    reps: '',
    weightLifted: '',
    testMethod: 'calculated',
    notes: ''
  });

  const [legPressData, setLegPressData] = useState<LegPressData>({
    ...baseData,
    oneRepMax: '',
    reps: '',
    weightLifted: '',
    testMethod: 'calculated',
    notes: ''
  });

  const [pushUpData, setPushUpData] = useState<PushUpData>({
    ...baseData,
    maxPushUps: '',
    notes: ''
  });

  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  useEffect(() => {
    // Update all test data when base data changes
    setBenchPressData(prev => ({ ...prev, ...baseData }));
    setLegPressData(prev => ({ ...prev, ...baseData }));
    setPushUpData(prev => ({ ...prev, ...baseData }));
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
  // 1RM Calculation Functions
  const calculateOneRepMax = (weight: number, reps: number, formula: string = 'epley'): number => {
    switch (formula) {
      case 'epley':
        return weight * (1 + reps / 30);
      case 'brzycki':
        return weight * (36 / (37 - reps));
      case 'lombardi':
        return weight * Math.pow(reps, 0.1);
      default:
        return weight * (1 + reps / 30); // Default to Epley
    }
  };

  const getAgeRange = (age: number): string => {
    if (age >= 20 && age <= 29) return "20-29";
    if (age >= 30 && age <= 39) return "30-39";
    if (age >= 40 && age <= 49) return "40-49";
    if (age >= 50 && age <= 59) return "50-59";
    if (age >= 60) return "60+";
    return "20-29"; // Default
  };

  const parseRange = (range: string) => {
    if (range.includes('>')) return { min: parseFloat(range.replace('>', '').trim()), max: Infinity };
    if (range.includes('<')) return { min: -Infinity, max: parseFloat(range.replace('<', '').trim()) };
    if (range.includes('+')) return { min: parseFloat(range.replace('+', '').trim()), max: Infinity };
    const [min, max] = range.split('-').map(s => parseFloat(s.trim()));
    return { min: min || 0, max: max || min };
  };

  // Bench Press Assessment
  const assessBenchPress = () => {
    const age = parseFloat(benchPressData.age);
    const weight = parseFloat(benchPressData.weight);
    let oneRepMax: number;

    if (benchPressData.testMethod === 'direct') {
      oneRepMax = parseFloat(benchPressData.oneRepMax);
    } else {
      const weightLifted = parseFloat(benchPressData.weightLifted);
      const reps = parseFloat(benchPressData.reps);
      oneRepMax = calculateOneRepMax(weightLifted, reps);
    }

    const ratio = oneRepMax / weight;
    const ageRange = getAgeRange(age);
    
    const standards = benchPressData.gender === 'male' 
      ? strengthData.benchPressBenchmarking.standards.men 
      : strengthData.benchPressBenchmarking.standards.women;

    // Find the appropriate rating
    let category = 'Unknown';
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';

    for (const standard of standards) {
      const ageRangeValue = standard.ageRanges[ageRange as keyof typeof standard.ageRanges];
      if (ageRangeValue) {
        const range = parseRange(ageRangeValue);
        if (ratio >= range.min && (range.max === Infinity || ratio <= range.max)) {
          category = standard.rating;
          status = standard.rating === 'Excellent' ? 'excellent' : 
                  standard.rating === 'Good' ? 'good' : 
                  standard.rating === 'Average' ? 'fair' : 
                  standard.rating === 'Fair' ? 'fair' : 'poor';
          break;
        }
      }
    }

    return {
      ratio: parseFloat(ratio.toFixed(2)),
      fitnessCategory: category,
      status,
      description: `Your bench press strength ratio is ${ratio.toFixed(2)}, which falls in the ${category.toLowerCase()} range for your age and gender.`,
      recommendations: generateStrengthRecommendations(status, 'benchPress'),
      testSpecificData: {
        oneRepMax: `${oneRepMax.toFixed(1)} lbs`,
        ratio: ratio.toFixed(2),
        method: benchPressData.testMethod === 'direct' ? 'Direct 1RM Test' : 'Calculated from reps'
      }
    };
  };
  // Leg Press Assessment
  const assessLegPress = () => {
    const age = parseFloat(legPressData.age);
    const weight = parseFloat(legPressData.weight);
    let oneRepMax: number;

    if (legPressData.testMethod === 'direct') {
      oneRepMax = parseFloat(legPressData.oneRepMax);
    } else {
      const weightLifted = parseFloat(legPressData.weightLifted);
      const reps = parseFloat(legPressData.reps);
      oneRepMax = calculateOneRepMax(weightLifted, reps);
    }

    const ratio = oneRepMax / weight;
    const ageRange = getAgeRange(age);
    
    const standards = legPressData.gender === 'male' 
      ? strengthData.legPressBenchmarking.standards.men 
      : strengthData.legPressBenchmarking.standards.women;

    // Find the appropriate rating
    let category = 'Unknown';
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';

    for (const standard of standards) {
      const ageRangeValue = standard.ageRanges[ageRange as keyof typeof standard.ageRanges];
      if (ageRangeValue) {
        const range = parseRange(ageRangeValue);
        if (ratio >= range.min && (range.max === Infinity || ratio <= range.max)) {
          category = standard.rating;
          status = standard.rating === 'Excellent' ? 'excellent' : 
                  standard.rating === 'Good' ? 'good' : 
                  standard.rating === 'Average' ? 'fair' : 
                  standard.rating === 'Fair' ? 'fair' : 'poor';
          break;
        }
      }
    }

    return {
      ratio: parseFloat(ratio.toFixed(2)),
      fitnessCategory: category,
      status,
      description: `Your leg press strength ratio is ${ratio.toFixed(2)}, which falls in the ${category.toLowerCase()} range for your age and gender.`,
      recommendations: generateStrengthRecommendations(status, 'legPress'),
      testSpecificData: {
        oneRepMax: `${oneRepMax.toFixed(1)} lbs`,
        ratio: ratio.toFixed(2),
        method: legPressData.testMethod === 'direct' ? 'Direct 1RM Test' : 'Calculated from reps'
      }
    };
  };

  // Push-Up Assessment
  const assessPushUp = () => {
    const age = parseFloat(pushUpData.age);
    const maxPushUps = parseFloat(pushUpData.maxPushUps);
    const ageRange = getAgeRange(age);
    
    const standards = pushUpData.gender === 'male' 
      ? strengthData.pushUpBenchmarking.standards.men 
      : strengthData.pushUpBenchmarking.standards.women;

    // Find the appropriate rating
    let category = 'Unknown';
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    let percentile = '';

    for (const standard of standards) {
      const ageRangeValue = standard.ageRanges[ageRange as keyof typeof standard.ageRanges];
      if (ageRangeValue) {
        const range = parseRange(ageRangeValue);
        if (maxPushUps >= range.min && (range.max === Infinity || maxPushUps <= range.max)) {
          category = standard.rating;
          percentile = standard.percentile || '';
          status = standard.rating === 'Excellent' ? 'excellent' : 
                  standard.rating === 'Above Average' ? 'good' : 
                  standard.rating === 'Average' ? 'fair' : 
                  standard.rating === 'Below Average' ? 'fair' : 'poor';
          break;
        }
      }
    }

    return {
      maxReps: maxPushUps,
      fitnessCategory: category,
      status,
      description: `You completed ${maxPushUps} push-ups, which falls in the ${category.toLowerCase()} range${percentile ? ` (${percentile} percentile)` : ''} for your age and gender.`,
      recommendations: generateStrengthRecommendations(status, 'pushUp'),
      testSpecificData: {
        maxPushUps: maxPushUps.toString(),
        percentile: percentile || 'N/A'
      }
    };
  };
  const generateStrengthRecommendations = (status: string, testType: TestType): string[] => {
    const recommendations: string[] = [];

    if (status === 'poor' || status === 'fair') {
      if (testType === 'benchPress') {
        recommendations.push('Start with bodyweight exercises like push-ups to build foundational strength.');
        recommendations.push('Focus on proper bench press form with lighter weights before increasing load.');
        recommendations.push('Include accessory exercises like dumbbell press and tricep work.');
      } else if (testType === 'legPress') {
        recommendations.push('Begin with bodyweight squats and lunges to build leg strength.');
        recommendations.push('Focus on full range of motion and proper form in leg press.');
        recommendations.push('Include single-leg exercises to address muscle imbalances.');
      } else if (testType === 'pushUp') {
        recommendations.push('Start with modified push-ups (knee push-ups) if needed.');
        recommendations.push('Practice incline push-ups using a bench or wall.');
        recommendations.push('Focus on building core strength to support proper push-up form.');
      }
      recommendations.push('Train 2-3 times per week with adequate rest between sessions.');
    } else if (status === 'good') {
      recommendations.push('Maintain current strength levels with consistent training.');
      recommendations.push('Consider progressive overload by gradually increasing weight or reps.');
      recommendations.push('Include variety in your training with different exercises and rep ranges.');
    } else {
      recommendations.push('Excellent strength! Focus on maintaining your current level.');
      recommendations.push('Consider advanced training techniques like periodization.');
      recommendations.push('You may benefit from sport-specific or performance-oriented training.');
    }

    recommendations.push('Always prioritize proper form over lifting heavier weights.');
    recommendations.push('Allow 48-72 hours of rest between training the same muscle groups.');
    recommendations.push('Retest every 8-12 weeks to track your progress.');

    return recommendations;
  };

  const calculateAssessment = () => {
    let results: AssessmentResults;

    switch (activeTest) {
      case 'benchPress':
        results = assessBenchPress();
        break;
      case 'legPress':
        results = assessLegPress();
        break;
      case 'pushUp':
        results = assessPushUp();
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
      benchPress: 'Bench Press Strength Assessment',
      legPress: 'Leg Press Strength Assessment',
      pushUp: 'Push-Up Endurance Assessment'
    };

    // Get current test data and notes
    const getCurrentTestData = () => {
      switch (activeTest) {
        case 'benchPress': return benchPressData;
        case 'legPress': return legPressData;
        case 'pushUp': return pushUpData;
        default: return null;
      }
    };

    const currentTestData = getCurrentTestData();
    const notes = currentTestData?.notes || '';

    const reportContent = `
STRENGTH FITNESS ASSESSMENT REPORT - BitFit Pro
Generated on: ${new Date().toLocaleDateString()}
Test: ${testNames[activeTest]}

PARTICIPANT INFORMATION:
========================
Age: ${baseData.age} years
Gender: ${baseData.gender}
Weight: ${baseData.weight} kg

TEST RESULTS:
=============
${results.ratio ? `Strength Ratio: ${results.ratio}` : ''}
${results.maxReps ? `Maximum Repetitions: ${results.maxReps}` : ''}
Fitness Category: ${results.fitnessCategory}
Status: ${results.status.toUpperCase()}
Description: ${results.description}

${results.testSpecificData ? Object.entries(results.testSpecificData).map(([key, value]) => `${key}: ${value}`).join('\n') : ''}

${notes ? `NOTES:
======
${notes}

` : ''}PERSONALIZED RECOMMENDATIONS:
============================
${results.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

DISCLAIMER:
===========
This assessment is for informational purposes only and should not replace professional medical advice. 
Please consult with a healthcare provider or certified fitness professional for comprehensive evaluation and personalized recommendations.

© BitFit Pro - Your Partner in Health and Fitness
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Strength-Assessment-${testNames[activeTest].replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTestData = () => {
    switch (activeTest) {
      case 'benchPress': return strengthData.benchPressBenchmarking;
      case 'legPress': return strengthData.legPressBenchmarking;
      case 'pushUp': return strengthData.pushUpBenchmarking;
      default: return strengthData.benchPressBenchmarking;
    }
  };

  const isFormValid = () => {
    if (!baseData.age || !baseData.weight) return false;
    
    switch (activeTest) {
      case 'benchPress':
        return benchPressData.testMethod === 'direct' 
          ? benchPressData.oneRepMax 
          : benchPressData.weightLifted && benchPressData.reps;
      case 'legPress':
        return legPressData.testMethod === 'direct' 
          ? legPressData.oneRepMax 
          : legPressData.weightLifted && legPressData.reps;
      case 'pushUp':
        return pushUpData.maxPushUps;
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
              <div className="bg-orange-100 p-4 rounded-full">
                <Dumbbell className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Strength Fitness Assessment</h1>
                <p className="text-gray-600">Comprehensive strength testing and benchmarking</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            <button
              onClick={() => {setActiveTest('benchPress'); setActiveTab('instructions'); setResults(null);}}
              className={`p-6 text-center transition-colors ${
                activeTest === 'benchPress' 
                  ? 'bg-orange-50 border-b-2 border-orange-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full ${activeTest === 'benchPress' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <Dumbbell className={`h-6 w-6 ${activeTest === 'benchPress' ? 'text-orange-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Bench Press</h3>
                  <p className="text-sm text-gray-600">Upper Body Strength</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {setActiveTest('legPress'); setActiveTab('instructions'); setResults(null);}}
              className={`p-6 text-center transition-colors ${
                activeTest === 'legPress' 
                  ? 'bg-orange-50 border-b-2 border-orange-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full ${activeTest === 'legPress' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <Target className={`h-6 w-6 ${activeTest === 'legPress' ? 'text-orange-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Leg Press</h3>
                  <p className="text-sm text-gray-600">Lower Body Strength</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {setActiveTest('pushUp'); setActiveTab('instructions'); setResults(null);}}
              className={`p-6 text-center transition-colors ${
                activeTest === 'pushUp' 
                  ? 'bg-orange-50 border-b-2 border-orange-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full ${activeTest === 'pushUp' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <Activity className={`h-6 w-6 ${activeTest === 'pushUp' ? 'text-orange-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Push-Up Test</h3>
                  <p className="text-sm text-gray-600">Muscular Endurance</p>
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
                  ? 'border-b-2 border-orange-600 text-orange-600 bg-orange-50' 
                  : 'text-gray-600 hover:text-orange-600'
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
                  ? 'border-b-2 border-orange-600 text-orange-600 bg-orange-50' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Take Test</span>
              </div>
            </button>
            {results && (
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'results'
                    ? 'border-b-2 border-orange-600 text-orange-600 bg-orange-50' 
                    : 'text-gray-600 hover:text-orange-600'
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

        {/* Tab Content */}
        {activeTab === 'instructions' && (
          <InstructionsTab 
            activeTest={activeTest}
            testData={getTestData()}
          />
        )}

        {activeTab === 'test' && (
          <TestTab 
            activeTest={activeTest}
            baseData={baseData}
            setBaseData={setBaseData}
            benchPressData={benchPressData}
            setBenchPressData={setBenchPressData}
            legPressData={legPressData}
            setLegPressData={setLegPressData}
            pushUpData={pushUpData}
            setPushUpData={setPushUpData}
            calculateAssessment={calculateAssessment}
            isFormValid={isFormValid}
          />
        )}

        {activeTab === 'results' && results && (
          <ResultsTab 
            results={results}
            activeTest={activeTest}
            downloadReport={downloadReport}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}

        {/* Guidelines Modal */}
        {showGuidelines && (
          <GuidelinesModal 
            onClose={() => setShowGuidelines(false)}
          />
        )}
      </div>
    </div>
  );
};
// Instructions Tab Component
const InstructionsTab = ({ activeTest, testData }: any) => {
  const getInstructions = () => {
    switch (activeTest) {
      case 'benchPress':
        return strengthData.benchPressBenchmarking.instructions;
      case 'legPress':
        return strengthData.legPressBenchmarking.instructions;
      case 'pushUp':
        return strengthData.pushUpBenchmarking.instructions;
      default:
        return strengthData.benchPressBenchmarking.instructions;
    }
  };

  const instructions = getInstructions();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{testData.title}</h2>
      
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">{testData.description}</p>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{instructions.title}</h3>
          
          {activeTest === 'legPress' ? (
            <div className="space-y-6">
              {/* Seated Leg Press */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Seated Leg Press</h4>
                <ol className="space-y-2">
                  {instructions.seatedLegPress.steps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Lying Leg Press */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Lying Leg Press</h4>
                <ol className="space-y-2">
                  {instructions.lyingLegPress.steps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : activeTest === 'pushUp' ? (
            <div className="space-y-6">
              {/* Standard Push-Up */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Standard Push-Up</h4>
                <ol className="space-y-2">
                  {instructions.standardPushUp.steps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Testing Protocol */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">{instructions.testingProtocol.title}</h4>
                <ol className="space-y-2">
                  {instructions.testingProtocol.steps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <ol className="space-y-2">
              {instructions.steps.map((step: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Safety Tips */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Safety Tips
          </h4>
          <ul className="space-y-1">
            {instructions.safetyTips.map((tip: string, index: number) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-red-700">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 1RM Information (for bench press and leg press) */}
        {(activeTest === 'benchPress' || activeTest === 'legPress') && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3">One Rep Max (1RM) Information</h4>
            <p className="text-green-700 mb-3">{testData.oneRepMax.description}</p>
            <div className="space-y-2">
              {testData.oneRepMax.formulas.map((formula: any, index: number) => (
                <div key={index} className="bg-white p-3 rounded border border-green-200">
                  <div className="font-medium text-green-800">{formula.name}</div>
                  <div className="text-sm text-green-600 font-mono">{formula.formula}</div>
                  <div className="text-sm text-green-700">{formula.description}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-green-700 bg-green-100 p-2 rounded">
              <strong>Note:</strong> {testData.oneRepMax.note}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// Test Tab Component
const TestTab = ({ 
  activeTest, 
  baseData, 
  setBaseData, 
  benchPressData, 
  setBenchPressData,
  legPressData,
  setLegPressData,
  pushUpData,
  setPushUpData,
  calculateAssessment, 
  isFormValid 
}: any) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {activeTest === 'benchPress' ? 'Bench Press Test' : 
         activeTest === 'legPress' ? 'Leg Press Test' : 
         'Push-Up Test'}
      </h2>

      <div className="space-y-6">
        {/* Base Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age (years)
              </label>
              <input
                type="number"
                value={baseData.age}
                onChange={(e) => setBaseData({...baseData, age: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Weight (lbs)
              </label>
              <input
                type="number"
                value={baseData.weight}
                onChange={(e) => setBaseData({...baseData, weight: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="180"
              />
            </div>
          </div>
        </div>

        {/* Test-Specific Inputs */}
        {activeTest === 'benchPress' && (
          <BenchPressInputs 
            data={benchPressData}
            setData={setBenchPressData}
          />
        )}

        {activeTest === 'legPress' && (
          <LegPressInputs 
            data={legPressData}
            setData={setLegPressData}
          />
        )}

        {activeTest === 'pushUp' && (
          <PushUpInputs 
            data={pushUpData}
            setData={setPushUpData}
          />
        )}

        {/* Calculate Button */}
        <button
          onClick={calculateAssessment}
          disabled={!isFormValid()}
          className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Calculate Strength Assessment
        </button>
      </div>
    </div>
  );
};

// Bench Press Inputs Component
const BenchPressInputs = ({ data, setData }: any) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Bench Press Assessment</h3>
    
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Test Method
      </label>
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="calculated"
            checked={data.testMethod === 'calculated'}
            onChange={(e) => setData({...data, testMethod: e.target.value})}
            className="mr-2"
          />
          <span>Calculate from reps (Recommended)</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="direct"
            checked={data.testMethod === 'direct'}
            onChange={(e) => setData({...data, testMethod: e.target.value})}
            className="mr-2"
          />
          <span>Direct 1RM test</span>
        </label>
      </div>
    </div>

    {data.testMethod === 'calculated' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight Lifted (lbs)
          </label>
          <input
            type="number"
            value={data.weightLifted}
            onChange={(e) => setData({...data, weightLifted: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="185"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repetitions Completed
          </label>
          <input
            type="number"
            value={data.reps}
            onChange={(e) => setData({...data, reps: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="5"
          />
        </div>
      </div>
    ) : (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          One Rep Max (1RM) in lbs
        </label>
        <input
          type="number"
          value={data.oneRepMax}
          onChange={(e) => setData({...data, oneRepMax: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="225"
        />
      </div>
    )}

    <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
      <p className="text-sm text-yellow-700">
        <strong>Safety Note:</strong> For safety, we recommend using the calculated method with 3-8 reps rather than attempting a true 1RM test.
      </p>
    </div>

    {/* Notes Field */}
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notes (Optional)
      </label>
      <textarea
        value={data.notes}
        onChange={(e) => setData({...data, notes: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Add any notes about your test conditions, equipment used, or observations..."
        rows={3}
      />
      <p className="text-xs text-gray-500 mt-1">
        Example: "Used Olympic barbell, felt strong today, gym was crowded"
      </p>
    </div>
  </div>
);

// Leg Press Inputs Component  
const LegPressInputs = ({ data, setData }: any) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Leg Press Assessment</h3>
    
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Test Method
      </label>
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="calculated"
            checked={data.testMethod === 'calculated'}
            onChange={(e) => setData({...data, testMethod: e.target.value})}
            className="mr-2"
          />
          <span>Calculate from reps (Recommended)</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="direct"
            checked={data.testMethod === 'direct'}
            onChange={(e) => setData({...data, testMethod: e.target.value})}
            className="mr-2"
          />
          <span>Direct 1RM test</span>
        </label>
      </div>
    </div>

    {data.testMethod === 'calculated' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight Pressed (lbs)
          </label>
          <input
            type="number"
            value={data.weightLifted}
            onChange={(e) => setData({...data, weightLifted: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repetitions Completed
          </label>
          <input
            type="number"
            value={data.reps}
            onChange={(e) => setData({...data, reps: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="8"
          />
        </div>
      </div>
    ) : (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          One Rep Max (1RM) in lbs
        </label>
        <input
          type="number"
          value={data.oneRepMax}
          onChange={(e) => setData({...data, oneRepMax: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="400"
        />
      </div>
    )}

    <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
      <p className="text-sm text-blue-700">
        <strong>Note:</strong> Results may vary between seated and lying leg press machines. Use the same machine type for consistent tracking.
      </p>
    </div>

    {/* Notes Field */}
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notes (Optional)
      </label>
      <textarea
        value={data.notes}
        onChange={(e) => setData({...data, notes: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Add any notes about your test conditions, machine type, or observations..."
        rows={3}
      />
      <p className="text-xs text-gray-500 mt-1">
        Example: "Used seated leg press machine, full range of motion, felt good"
      </p>
    </div>
  </div>
);

// Push-Up Inputs Component
const PushUpInputs = ({ data, setData }: any) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Push-Up Endurance Test</h3>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Maximum Consecutive Push-Ups
      </label>
      <input
        type="number"
        value={data.maxPushUps}
        onChange={(e) => setData({...data, maxPushUps: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="25"
      />
    </div>

    <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg">
      <p className="text-sm text-green-700">
        <strong>Instructions:</strong> Perform as many consecutive push-ups as possible with proper form. 
        Stop when you can no longer maintain proper technique or need to rest.
      </p>
    </div>

    {/* Notes Field */}
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notes (Optional)
      </label>
      <textarea
        value={data.notes}
        onChange={(e) => setData({...data, notes: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Add any notes about your test conditions, form modifications, or observations..."
        rows={3}
      />
      <p className="text-xs text-gray-500 mt-1">
        Example: "Standard push-ups, maintained good form throughout, tested after warm-up"
      </p>
    </div>
  </div>
);
// Results Tab Component
const ResultsTab = ({ results, activeTest, downloadReport, getStatusColor, getStatusIcon }: any) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Assessment Results</h2>
      <button
        onClick={downloadReport}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="h-4 w-4" />
        <span>Download Report</span>
      </button>
    </div>

    {/* Main Result */}
    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-orange-600 mb-2">
          {results.ratio ? results.ratio : results.maxReps}
          {results.ratio ? '' : ' reps'}
        </div>
        <div className="text-lg font-semibold text-gray-700">
          {results.ratio ? 'Strength Ratio' : 'Maximum Push-Ups'}
        </div>
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mt-3 ${getStatusColor(results.status)}`}>
          {getStatusIcon(results.status)}
          <span className="font-medium">{results.fitnessCategory}</span>
        </div>
      </div>
    </div>

    {/* Description */}
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
      <p className="text-blue-800">{results.description}</p>
    </div>

    {/* Test Specific Data */}
    {results.testSpecificData && (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Test Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(results.testSpecificData).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="font-medium text-gray-800">{value as string}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Recommendations */}
    <div className="bg-orange-50 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
      <ul className="space-y-2">
        {results.recommendations.map((recommendation: string, index: number) => (
          <li key={index} className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">{recommendation}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Progression Tips */}
    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
      <h3 className="font-semibold text-green-800 mb-3">Progression Tips</h3>
      <ul className="space-y-1 text-sm text-green-700">
        {activeTest === 'benchPress' && strengthData.benchPressBenchmarking.progressionTips.map((tip: string, index: number) => (
          <li key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>{tip}</span>
          </li>
        ))}
        {activeTest === 'legPress' && strengthData.legPressBenchmarking.progressionTips.map((tip: string, index: number) => (
          <li key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>{tip}</span>
          </li>
        ))}
        {activeTest === 'pushUp' && strengthData.pushUpBenchmarking.progressionTips.map((tip: string, index: number) => (
          <li key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>{tip}</span>
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
            Please consult with a healthcare provider or certified fitness professional for comprehensive evaluation and personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Guidelines Modal Component
const GuidelinesModal = ({ onClose }: any) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">General Guidelines & Safety</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-3">Safety First</h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• Always warm up thoroughly before testing</li>
              <li>• Use a spotter for bench press and leg press tests</li>
              <li>• Stop immediately if you experience pain or discomfort</li>
              <li>• Consult a healthcare provider before testing if you have any medical conditions</li>
              <li>• Ensure proper form over maximum weight or reps</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">Before You Begin</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Get adequate rest (avoid testing when fatigued)</li>
              <li>• Stay hydrated but avoid eating large meals 2 hours before testing</li>
              <li>• Wear appropriate workout clothing and footwear</li>
              <li>• Familiarize yourself with the equipment and proper form</li>
              <li>• Consider testing with a qualified fitness professional</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">Interpreting Results</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Results are based on age and gender-specific norms</li>
              <li>• Individual factors may affect performance (training history, body type, etc.)</li>
              <li>• Use results as a baseline for tracking progress over time</li>
              <li>• Focus on improvement rather than comparing to others</li>
              <li>• Retest every 8-12 weeks to monitor progress</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-3">When NOT to Test</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• If you're recovering from illness or injury</li>
              <li>• Within 48 hours of intense training</li>
              <li>• If you're experiencing joint pain or muscle soreness</li>
              <li>• Without proper supervision for 1RM tests</li>
              <li>• If you're new to resistance training (build base fitness first)</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default StrengthAssessment;