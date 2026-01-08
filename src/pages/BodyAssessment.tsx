import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { uploadData, getUrl } from 'aws-amplify/storage';
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
  Calculator,
  Camera,
  Upload,
  X,
  User,
  Droplets,
  Zap
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
  notes: string;
}

interface BodyCompositionData {
  bodyFatPercentage: string;
  skeletalMuscle: string;
  bodyWater: string;
  visceralFat: string;
  boneMass: string;
  metabolicAge: string;
  notes: string;
}

interface BodyFatCalculatorData {
  height: string;
  neck: string;
  waist: string;
  hip: string; // For females
  age: string;
  gender: 'male' | 'female';
  notes: string;
}

interface PosturePhoto {
  id: string;
  type: 'front' | 'side' | 'back';
  file: File | null;
  url: string | null;
  uploaded: boolean;
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
  const [activeTab, setActiveTab] = useState<'basic' | 'composition' | 'posture'>('basic');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    height: '',
    weight: '',
    waist: '',
    hip: '',
    systolicBP: '',
    diastolicBP: '',
    restingHeartRate: '',
    age: '',
    gender: 'male',
    notes: ''
  });
  const [bodyCompositionData, setBodyCompositionData] = useState<BodyCompositionData>({
    bodyFatPercentage: '',
    skeletalMuscle: '',
    bodyWater: '',
    visceralFat: '',
    boneMass: '',
    metabolicAge: '',
    notes: ''
  });
  const [bodyFatCalculatorData, setBodyFatCalculatorData] = useState<BodyFatCalculatorData>({
    height: '',
    neck: '',
    waist: '',
    hip: '',
    age: '',
    gender: 'male',
    notes: ''
  });
  const [posturePhotos, setPosturePhotos] = useState<PosturePhoto[]>([
    { id: 'front', type: 'front', file: null, url: null, uploaded: false },
    { id: 'side', type: 'side', file: null, url: null, uploaded: false },
    { id: 'back', type: 'back', file: null, url: null, uploaded: false }
  ]);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  // Jackson & Pollock Ideal Body Fat Percentages by age
  const getIdealBodyFatByAge = (age: number, gender: 'male' | 'female'): number => {
    const ageRanges = {
      male: [
        { age: 20, ideal: 8.5 },
        { age: 25, ideal: 10.5 },
        { age: 30, ideal: 12.7 },
        { age: 35, ideal: 13.7 },
        { age: 40, ideal: 15.3 },
        { age: 45, ideal: 16.4 },
        { age: 50, ideal: 18.9 },
        { age: 55, ideal: 20.9 }
      ],
      female: [
        { age: 20, ideal: 17.7 },
        { age: 25, ideal: 18.4 },
        { age: 30, ideal: 19.3 },
        { age: 35, ideal: 21.5 },
        { age: 40, ideal: 22.2 },
        { age: 45, ideal: 22.9 },
        { age: 50, ideal: 25.2 },
        { age: 55, ideal: 26.3 }
      ]
    };

    const ranges = ageRanges[gender];
    
    // Find the appropriate age range
    if (age <= ranges[0].age) return ranges[0].ideal;
    if (age >= ranges[ranges.length - 1].age) return ranges[ranges.length - 1].ideal;
    
    // Interpolate between age ranges
    for (let i = 0; i < ranges.length - 1; i++) {
      if (age >= ranges[i].age && age <= ranges[i + 1].age) {
        const ratio = (age - ranges[i].age) / (ranges[i + 1].age - ranges[i].age);
        return ranges[i].ideal + ratio * (ranges[i + 1].ideal - ranges[i].ideal);
      }
    }
    
    return ranges[Math.floor(ranges.length / 2)].ideal; // fallback
  };

  const calculateBodyFatPercentage = (data: BodyFatCalculatorData) => {
    const height = parseFloat(data.height);
    const neck = parseFloat(data.neck);
    const waist = parseFloat(data.waist);
    const hip = parseFloat(data.hip);
    const age = parseFloat(data.age);

    if (!height || !neck || !waist || !age) return null;

    let bodyFatPercentage: number;

    if (data.gender === 'male') {
      // U.S. Navy formula for males: BFP = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      const log10WaistNeck = Math.log10(waist - neck);
      const log10Height = Math.log10(height);
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * log10WaistNeck + 0.15456 * log10Height) - 450;
    } else {
      // U.S. Navy formula for females: BFP = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      if (!hip) return null;
      const log10WaistHipNeck = Math.log10(waist + hip - neck);
      const log10Height = Math.log10(height);
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * log10WaistHipNeck + 0.22100 * log10Height) - 450;
    }

    // Ensure result is within reasonable bounds
    bodyFatPercentage = Math.max(0, Math.min(50, bodyFatPercentage));

    // Get ideal body fat percentage for age and gender (Jackson & Pollock)
    const idealBodyFat = getIdealBodyFatByAge(age, data.gender);
    const differenceFromIdeal = bodyFatPercentage - idealBodyFat;

    // Categorize based on American Council on Exercise standards
    let category = '';
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';

    if (data.gender === 'male') {
      if (bodyFatPercentage < 2) { category = 'Essential Fat (Too Low)'; status = 'poor'; }
      else if (bodyFatPercentage <= 5) { category = 'Essential Fat'; status = 'poor'; }
      else if (bodyFatPercentage <= 13) { category = 'Athletes'; status = 'excellent'; }
      else if (bodyFatPercentage <= 17) { category = 'Fitness'; status = 'good'; }
      else if (bodyFatPercentage <= 24) { category = 'Average'; status = 'fair'; }
      else { category = 'Obese'; status = 'poor'; }
    } else {
      if (bodyFatPercentage < 10) { category = 'Essential Fat (Too Low)'; status = 'poor'; }
      else if (bodyFatPercentage <= 13) { category = 'Essential Fat'; status = 'poor'; }
      else if (bodyFatPercentage <= 20) { category = 'Athletes'; status = 'excellent'; }
      else if (bodyFatPercentage <= 24) { category = 'Fitness'; status = 'good'; }
      else if (bodyFatPercentage <= 31) { category = 'Average'; status = 'fair'; }
      else { category = 'Obese'; status = 'poor'; }
    }

    // Age-based analysis
    let ageAnalysis = '';
    let recommendations = [];
    
    if (Math.abs(differenceFromIdeal) <= 2) {
      ageAnalysis = `Your body fat percentage is very close to the ideal range for your age (${idealBodyFat.toFixed(1)}%). This indicates excellent body composition for your age group.`;
      recommendations.push('Maintain your current fitness routine and healthy eating habits');
      recommendations.push('Focus on strength training to preserve muscle mass as you age');
    } else if (differenceFromIdeal > 2) {
      ageAnalysis = `Your body fat percentage is ${differenceFromIdeal.toFixed(1)}% above the ideal range for your age (${idealBodyFat.toFixed(1)}%). There is room for improvement through targeted lifestyle changes.`;
      recommendations.push('Incorporate regular cardiovascular exercise (150+ minutes per week)');
      recommendations.push('Add strength training 2-3 times per week to build lean muscle');
      recommendations.push('Focus on a balanced, calorie-controlled diet with adequate protein');
      if (differenceFromIdeal > 5) {
        recommendations.push('Consider consulting with a nutritionist or fitness professional');
      }
    } else {
      ageAnalysis = `Your body fat percentage is ${Math.abs(differenceFromIdeal).toFixed(1)}% below the ideal range for your age (${idealBodyFat.toFixed(1)}%). This is excellent for athletic performance and health.`;
      recommendations.push('Maintain your excellent fitness level with consistent training');
      recommendations.push('Ensure adequate nutrition to support your active lifestyle');
      if (Math.abs(differenceFromIdeal) > 3) {
        recommendations.push('Monitor that body fat doesn\'t drop too low, which can affect health');
      }
    }

    return {
      percentage: parseFloat(bodyFatPercentage.toFixed(1)),
      category,
      status,
      description: `Based on the U.S. Navy method, your estimated body fat percentage is ${bodyFatPercentage.toFixed(1)}%, which falls in the ${category.toLowerCase()} range.`,
      idealBodyFat: parseFloat(idealBodyFat.toFixed(1)),
      differenceFromIdeal: parseFloat(differenceFromIdeal.toFixed(1)),
      ageAnalysis,
      recommendations,
      bodyFatToLose: differenceFromIdeal > 0 ? parseFloat(differenceFromIdeal.toFixed(1)) : 0
    };
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

    const notes = assessmentData.notes || '';

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

${notes ? `NOTES:
======
${notes}

` : ''}PERSONALIZED RECOMMENDATIONS:
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

  const handlePhotoUpload = (photoType: 'front' | 'side' | 'back', file: File) => {
    setPosturePhotos(prev => prev.map(photo => 
      photo.type === photoType 
        ? { ...photo, file, url: URL.createObjectURL(file), uploaded: false }
        : photo
    ));
  };

  const uploadPhotoToS3 = async (photo: PosturePhoto) => {
    if (!photo.file || !user) return;

    try {
      setUploading(true);
      console.log('Starting upload for user:', user);
      console.log('Photo file:', photo.file.name, photo.file.type);
      
      // For Amplify Gen 2 with entity-based access, we need to include the full path
      // The entity_id will be automatically resolved by Amplify
     // const fileName = `posture-photos/{entity_id}/${photo.type}-${Date.now()}.${photo.file.name.split('.').pop()}`;
      const fileName = `posture-photos/${user.userId}/${photo.type}-${Date.now()}.${photo.file.name.split('.').pop()}`;
       
     console.log('Upload key:', fileName);
      
      const result = await uploadData({
        key: fileName,
        data: photo.file,
        options: {
          contentType: photo.file.type,
        }
      }).result;

      console.log('Upload successful:', result);

      // Get the URL for the uploaded file
      const urlResult = await getUrl({ key: result.key });
      console.log('URL generated:', urlResult.url.toString());
      
      setPosturePhotos(prev => prev.map(p => 
        p.type === photo.type 
          ? { ...p, uploaded: true, url: urlResult.url.toString() }
          : p
      ));

      return result.key;
    } catch (error) {
      console.error('Error uploading photo:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (photoType: 'front' | 'side' | 'back') => {
    setPosturePhotos(prev => prev.map(photo => 
      photo.type === photoType 
        ? { ...photo, file: null, url: null, uploaded: false }
        : photo
    ));
  };

  const assessBodyComposition = (data: BodyCompositionData) => {
    const assessments = [];
    
    // Body Fat Assessment
    const bodyFat = parseFloat(data.bodyFatPercentage);
    if (!isNaN(bodyFat)) {
      let category = '';
      let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
      
      if (assessmentData.gender === 'male') {
        if (bodyFat < 6) { category = 'Essential Fat'; status = 'poor'; }
        else if (bodyFat < 14) { category = 'Athletes'; status = 'excellent'; }
        else if (bodyFat < 18) { category = 'Fitness'; status = 'good'; }
        else if (bodyFat < 25) { category = 'Average'; status = 'fair'; }
        else { category = 'Obese'; status = 'poor'; }
      } else {
        if (bodyFat < 10) { category = 'Essential Fat'; status = 'poor'; }
        else if (bodyFat < 21) { category = 'Athletes'; status = 'excellent'; }
        else if (bodyFat < 25) { category = 'Fitness'; status = 'good'; }
        else if (bodyFat < 32) { category = 'Average'; status = 'fair'; }
        else { category = 'Obese'; status = 'poor'; }
      }
      
      assessments.push({
        name: 'Body Fat Percentage',
        value: `${bodyFat}%`,
        category,
        status,
        description: `Your body fat percentage is in the ${category.toLowerCase()} range.`
      });
    }

    // Skeletal Muscle Assessment
    const skeletalMuscle = parseFloat(data.skeletalMuscle);
    if (!isNaN(skeletalMuscle)) {
      let status: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
      if (skeletalMuscle < 30) status = 'poor';
      else if (skeletalMuscle < 35) status = 'fair';
      else if (skeletalMuscle < 40) status = 'good';
      else status = 'excellent';
      
      assessments.push({
        name: 'Skeletal Muscle Mass',
        value: `${skeletalMuscle}%`,
        category: status === 'excellent' ? 'High' : status === 'good' ? 'Normal' : status === 'fair' ? 'Low Normal' : 'Low',
        status,
        description: `Your skeletal muscle mass is ${status === 'excellent' ? 'excellent' : status === 'good' ? 'good' : 'below optimal'}.`
      });
    }

    // Body Water Assessment
    const bodyWater = parseFloat(data.bodyWater);
    if (!isNaN(bodyWater)) {
      let status: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
      if (bodyWater < 45) status = 'poor';
      else if (bodyWater < 50) status = 'fair';
      else if (bodyWater < 65) status = 'good';
      else status = 'excellent';
      
      assessments.push({
        name: 'Body Water Percentage',
        value: `${bodyWater}%`,
        category: status === 'excellent' ? 'Optimal' : status === 'good' ? 'Normal' : 'Low',
        status,
        description: `Your body water percentage is ${status === 'excellent' ? 'optimal' : status === 'good' ? 'normal' : 'below normal'}.`
      });
    }

    return assessments;
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Basic Assessment</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('composition')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'composition'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Body Composition</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('posture')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'posture'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Posture Assessment</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'basic' && (
          <BasicAssessmentTab 
            assessmentData={assessmentData}
            setAssessmentData={setAssessmentData}
            results={results}
            showResults={showResults}
            calculateAssessment={calculateAssessment}
            downloadReport={downloadReport}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}

        {activeTab === 'composition' && (
          <BodyCompositionTab 
            bodyCompositionData={bodyCompositionData}
            setBodyCompositionData={setBodyCompositionData}
            bodyFatCalculatorData={bodyFatCalculatorData}
            setBodyFatCalculatorData={setBodyFatCalculatorData}
            assessBodyComposition={assessBodyComposition}
            calculateBodyFatPercentage={calculateBodyFatPercentage}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}

        {activeTab === 'posture' && (
          <PostureAssessmentTab 
            posturePhotos={posturePhotos}
            handlePhotoUpload={handlePhotoUpload}
            uploadPhotoToS3={uploadPhotoToS3}
            removePhoto={removePhoto}
            uploading={uploading}
          />
        )}
      </div>
    </div>
  );
};

// Basic Assessment Tab Component
const BasicAssessmentTab = ({ 
  assessmentData, 
  setAssessmentData, 
  results, 
  showResults, 
  calculateAssessment, 
  downloadReport, 
  getStatusColor, 
  getStatusIcon 
}: any) => (
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

        {/* Notes Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={assessmentData.notes}
            onChange={(e) => setAssessmentData({...assessmentData, notes: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any notes about measurement conditions, time of day, recent activities, etc..."
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: "Measured in morning, after light breakfast, feeling well"
          </p>
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
            {results.recommendations.map((recommendation: string, index: number) => (
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
);

// Body Composition Tab Component
const BodyCompositionTab = ({ 
  bodyCompositionData, 
  setBodyCompositionData, 
  bodyFatCalculatorData,
  setBodyFatCalculatorData,
  assessBodyComposition, 
  calculateBodyFatPercentage,
  getStatusColor, 
  getStatusIcon 
}: any) => {
  const [compositionResults, setCompositionResults] = useState<any[]>([]);
  const [showCompositionResults, setShowCompositionResults] = useState(false);
  const [bodyFatResult, setBodyFatResult] = useState<any>(null);
  const [showBodyFatResult, setShowBodyFatResult] = useState(false);

  const calculateComposition = () => {
    const results = assessBodyComposition(bodyCompositionData);
    setCompositionResults(results);
    setShowCompositionResults(true);
  };

  const calculateBodyFat = () => {
    const result = calculateBodyFatPercentage(bodyFatCalculatorData);
    if (result) {
      setBodyFatResult(result);
      setShowBodyFatResult(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Adjacent Panels Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Body Fat Calculator Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Calculator className="h-6 w-6 mr-2" />
            Body Fat Calculator (U.S. Navy Method)
          </h2>

          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Important Disclaimer</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This calculator provides an estimate based on the U.S. Navy method and may not be accurate for all individuals. 
                    It should only be used for high-level guidance. For precise body composition analysis, consult with a healthcare 
                    professional or use advanced methods like DEXA scans.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={bodyFatCalculatorData.gender}
                    onChange={(e) => setBodyFatCalculatorData({...bodyFatCalculatorData, gender: e.target.value as 'male' | 'female'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={bodyFatCalculatorData.age}
                    onChange={(e) => setBodyFatCalculatorData({...bodyFatCalculatorData, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFatCalculatorData.height}
                    onChange={(e) => setBodyFatCalculatorData({...bodyFatCalculatorData, height: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="175"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Neck Circumference (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFatCalculatorData.neck}
                    onChange={(e) => setBodyFatCalculatorData({...bodyFatCalculatorData, neck: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="38"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waist Circumference (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFatCalculatorData.waist}
                    onChange={(e) => setBodyFatCalculatorData({...bodyFatCalculatorData, waist: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="85"
                  />
                </div>

                {bodyFatCalculatorData.gender === 'female' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hip Circumference (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={bodyFatCalculatorData.hip}
                      onChange={(e) => setBodyFatCalculatorData({...bodyFatCalculatorData, hip: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="95"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={bodyFatCalculatorData.notes}
                onChange={(e) => setBodyFatCalculatorData({...bodyFatCalculatorData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about measurement technique, conditions, or observations..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: "Measured with tape measure, relaxed state, morning measurement"
              </p>
            </div>

            <button
              onClick={calculateBodyFat}
              disabled={!bodyFatCalculatorData.height || !bodyFatCalculatorData.neck || !bodyFatCalculatorData.waist || !bodyFatCalculatorData.age || (bodyFatCalculatorData.gender === 'female' && !bodyFatCalculatorData.hip)}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Calculate Body Fat Percentage
            </button>
          </div>
        </div>

        {/* Body Composition Input Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2" />
            Body Composition Input
          </h2>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> These measurements are typically obtained from a body composition analyzer 
                (like DEXA scan, BodPod, or bioelectrical impedance scale). Enter the values from your recent assessment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Body Fat Percentage (%)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyCompositionData.bodyFatPercentage}
                    onChange={(e) => setBodyCompositionData({...bodyCompositionData, bodyFatPercentage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Skeletal Muscle Mass (%)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyCompositionData.skeletalMuscle}
                    onChange={(e) => setBodyCompositionData({...bodyCompositionData, skeletalMuscle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="35.2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4" />
                      <span>Body Water Percentage (%)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyCompositionData.bodyWater}
                    onChange={(e) => setBodyCompositionData({...bodyCompositionData, bodyWater: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="55.8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Visceral Fat Level</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyCompositionData.visceralFat}
                    onChange={(e) => setBodyCompositionData({...bodyCompositionData, visceralFat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Scale className="h-4 w-4" />
                      <span>Bone Mass (kg)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyCompositionData.boneMass}
                    onChange={(e) => setBodyCompositionData({...bodyCompositionData, boneMass: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3.2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Metabolic Age (years)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={bodyCompositionData.metabolicAge}
                    onChange={(e) => setBodyCompositionData({...bodyCompositionData, metabolicAge: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="28"
                  />
                </div>
              </div>
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={bodyCompositionData.notes}
                onChange={(e) => setBodyCompositionData({...bodyCompositionData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about the measurement device, conditions, or observations..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: "DEXA scan results, measured at clinic, fasted state"
              </p>
            </div>

            <button
              onClick={calculateComposition}
              disabled={!bodyCompositionData.bodyFatPercentage && !bodyCompositionData.skeletalMuscle && !bodyCompositionData.bodyWater}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Analyze Body Composition
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Body Fat Calculator Results */}
        {showBodyFatResult && bodyFatResult && (
          <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estimated Body Fat Percentage</h3>
            
            {/* Main Result */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-orange-600">{bodyFatResult.percentage}%</div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(bodyFatResult.status)}`}>
                {getStatusIcon(bodyFatResult.status)}
                <span className="text-sm font-medium">{bodyFatResult.status.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">{bodyFatResult.category}</div>
            <div className="text-sm text-gray-700 mb-4">{bodyFatResult.description}</div>

            {/* Age-Based Analysis */}
            <div className="bg-white border border-orange-200 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Age-Based Analysis (Jackson & Pollock)
              </h4>
              <div className="grid grid-cols-1 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Ideal for your age ({bodyFatCalculatorData.age}):</span>
                  <span className="font-semibold text-blue-600 ml-2">{bodyFatResult.idealBodyFat}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Difference from ideal:</span>
                  <span className={`font-semibold ml-2 ${
                    bodyFatResult.differenceFromIdeal > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {bodyFatResult.differenceFromIdeal > 0 ? '+' : ''}{bodyFatResult.differenceFromIdeal}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-3">
                {bodyFatResult.ageAnalysis}
              </div>
              
              {/* Personalized Recommendations */}
              {bodyFatResult.recommendations && bodyFatResult.recommendations.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Personalized Recommendations:</h5>
                  <ul className="space-y-1">
                    {bodyFatResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-blue-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Body Fat to Lose (if applicable) */}
            {bodyFatResult.bodyFatToLose > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-red-800 mb-2">Body Fat Reduction Goal</h4>
                <div className="text-sm text-red-700">
                  To reach the ideal body fat percentage for your age, you would need to reduce your body fat by approximately <strong>{bodyFatResult.bodyFatToLose}%</strong>.
                </div>
                <div className="text-xs text-red-600 mt-2">
                  *This is an estimate. Consult with a fitness professional for a personalized plan.
                </div>
              </div>
            )}

            {/* Reference Standards */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">ACE Standards</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="font-medium text-blue-700">Women:</div>
                  <div>Essential: 10-13%</div>
                  <div>Athletes: 14-20%</div>
                  <div>Fitness: 21-24%</div>
                  <div>Average: 25-31%</div>
                  <div>Obese: 32%+</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-blue-700">Men:</div>
                  <div>Essential: 2-5%</div>
                  <div>Athletes: 6-13%</div>
                  <div>Fitness: 14-17%</div>
                  <div>Average: 18-24%</div>
                  <div>Obese: 25%+</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Body Composition Results */}
        {showCompositionResults && compositionResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Body Composition Analysis
            </h2>

            <div className="space-y-4">
              {compositionResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{result.name}</span>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      <span className="text-sm font-medium">{result.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{result.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{result.category}</div>
                  <div className="text-sm text-gray-700">{result.description}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Body Composition Insights</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Body composition provides more detailed insights than BMI alone</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Focus on maintaining healthy muscle mass and reducing excess body fat</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Regular strength training helps improve body composition</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Posture Assessment Tab Component
const PostureAssessmentTab = ({ 
  posturePhotos, 
  handlePhotoUpload, 
  uploadPhotoToS3, 
  removePhoto, 
  uploading 
}: any) => {
  const handleFileSelect = (photoType: 'front' | 'side' | 'back', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoUpload(photoType, file);
    }
  };

  const handleUploadToS3 = async (photo: PosturePhoto) => {
    try {
      await uploadPhotoToS3(photo);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <Camera className="h-6 w-6 mr-2" />
        Posture Assessment Photos
      </h2>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Photo Guidelines:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Stand against a plain background in good lighting</li>
          <li>• Wear form-fitting clothes or minimal clothing</li>
          <li>• Maintain natural posture (don't pose)</li>
          <li>• Take photos from about 6 feet away</li>
          <li>• Front: Face the camera directly</li>
          <li>• Side: Turn 90 degrees to show your profile</li>
          <li>• Back: Turn around to show your back view</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posturePhotos.map((photo: PosturePhoto) => (
          <div key={photo.id} className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-4 capitalize">{photo.type} View</h3>
              
              {photo.url ? (
                <div className="space-y-4">
                  <img 
                    src={photo.url} 
                    alt={`${photo.type} view`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="flex space-x-2">
                    {!photo.uploaded && (
                      <button
                        onClick={() => handleUploadToS3(photo)}
                        disabled={uploading}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                      >
                        {uploading ? 'Uploading...' : 'Upload to Cloud'}
                      </button>
                    )}
                    {photo.uploaded && (
                      <div className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-lg text-sm font-medium">
                        ✓ Uploaded
                      </div>
                    )}
                    <button
                      onClick={() => removePhoto(photo.type)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(photo.type, e)}
                      className="hidden"
                    />
                    <div className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Select Photo</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-800">Privacy & Security</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Your photos are securely stored in encrypted cloud storage and are only accessible by you and authorized fitness professionals. 
              You can delete your photos at any time from your profile settings.
            </p>
          </div>
        </div>
      </div>

      {posturePhotos.some((photo: PosturePhoto) => photo.uploaded) && (
        <div className="mt-6 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h3>
          <p className="text-gray-700 mb-4">
            Your posture photos have been uploaded successfully. A qualified fitness professional will review your photos and provide:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Detailed posture analysis and assessment</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Identification of muscle imbalances and alignment issues</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Personalized corrective exercise recommendations</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Ergonomic and lifestyle modification suggestions</span>
            </li>
          </ul>
          <p className="text-sm text-gray-600 mt-4">
            You will receive your detailed posture assessment report within 2-3 business days via email.
          </p>
        </div>
      )}
    </div>
  );
};

export default BodyAssessment;