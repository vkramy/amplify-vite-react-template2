import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import { User, Target, Activity, Award, Edit2, Save, X, TrendingUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfile {
  name: string;
  email: string;
  age?: string;
  height?: string;
  weight?: string;
  fitnessGoal?: string;
  activityLevel?: string;
  membershipType?: string;
  joinDate?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const attributes = await fetchUserAttributes();
      
      // Try to load from localStorage as fallback for custom attributes
      const localProfile = user?.userId ? localStorage.getItem(`profile_${user.userId}`) : null;
      const savedProfile = localProfile ? JSON.parse(localProfile) : {};
      
      // Initialize membership type if not set
      let membershipType = attributes['custom:membership_type'] || savedProfile.membershipType || 'FREE';
      
      setProfile({
        name: attributes.name || savedProfile.name || '',
        email: attributes.email || '',
        age: attributes['custom:age'] || savedProfile.age || '',
        height: attributes['custom:height'] || savedProfile.height || '',
        weight: attributes['custom:weight'] || savedProfile.weight || '',
        fitnessGoal: attributes['custom:fitness_goal'] || savedProfile.fitnessGoal || '',
        activityLevel: attributes['custom:activity_level'] || savedProfile.activityLevel || '',
        membershipType: membershipType,
        joinDate: new Date(user.signInDetails?.loginId || Date.now()).toLocaleDateString(),
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      
      // Fallback to localStorage only
      try {
        const localProfile = user?.userId ? localStorage.getItem(`profile_${user.userId}`) : null;
        if (localProfile) {
          const savedProfile = JSON.parse(localProfile);
          setProfile({
            name: savedProfile.name || '',
            email: user.signInDetails?.loginId || '',
            age: savedProfile.age || '',
            height: savedProfile.height || '',
            weight: savedProfile.weight || '',
            fitnessGoal: savedProfile.fitnessGoal || '',
            activityLevel: savedProfile.activityLevel || '',
            membershipType: savedProfile.membershipType || 'FREE',
            joinDate: new Date(user.signInDetails?.loginId || Date.now()).toLocaleDateString(),
          });
        } else {
          // Set default profile
          setProfile({
            name: '',
            email: user.signInDetails?.loginId || '',
            membershipType: 'FREE',
            joinDate: new Date().toLocaleDateString(),
          });
        }
      } catch (localErr) {
        console.error('Error loading from localStorage:', localErr);
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Save to localStorage as fallback
      const profileData = {
        name: profile.name,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        fitnessGoal: profile.fitnessGoal,
        activityLevel: profile.activityLevel,
        membershipType: profile.membershipType,
      };
      
      if (user?.userId) {
        localStorage.setItem(`profile_${user.userId}`, JSON.stringify(profileData));
      }

      // Try to save to Cognito (will work once backend is deployed)
      try {
        await updateUserAttributes({
          userAttributes: {
            name: profile.name,
            'custom:age': profile.age || '',
            'custom:height': profile.height || '',
            'custom:weight': profile.weight || '',
            'custom:fitness_goal': profile.fitnessGoal || '',
            'custom:activity_level': profile.activityLevel || '',
          },
        });
      } catch (cognitoError) {
        console.warn('Could not save to Cognito (custom attributes not deployed yet):', cognitoError);
        // Continue with localStorage save
      }

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
    loadUserProfile(); // Reset to original values
  };

  const calculateBMI = () => {
    if (profile.height && profile.weight) {
      const heightM = parseFloat(profile.height) / 100; // Convert cm to m
      const weightKg = parseFloat(profile.weight);
      const bmi = weightKg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{profile.name || 'User Profile'}</h1>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Temporary Notice */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          <p className="text-sm">
            <strong>Note:</strong> Profile data is currently stored locally. Once the backend is fully deployed, 
            your profile will be automatically synced to the cloud for permanent storage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 py-2">{profile.name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-800 py-2">{profile.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                ) : (
                  <p className="text-gray-800 py-2">{profile.age || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your height"
                  />
                ) : (
                  <p className="text-gray-800 py-2">{profile.height ? `${profile.height} cm` : 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your weight"
                  />
                ) : (
                  <p className="text-gray-800 py-2">{profile.weight ? `${profile.weight} kg` : 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fitness Goal
                </label>
                {isEditing ? (
                  <select
                    value={profile.fitnessGoal}
                    onChange={(e) => setProfile({ ...profile, fitnessGoal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a goal</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
        
                    <option value="General Fitness">Endurance</option>
                    <option value="strength">Strength</option>
                  </select>
                ) : (
                  <p className="text-gray-800 py-2">{profile.fitnessGoal || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                {isEditing ? (
                  <select
                    value={profile.activityLevel}
                    onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly-active">Lightly Active</option>
                    <option value="moderately-active">Moderately Active</option>
                    <option value="very-active">Very Active</option>
                    <option value="extremely-active">Extremely Active</option>
                  </select>
                ) : (
                  <p className="text-gray-800 py-2">{profile.activityLevel || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Type
                </label>
                <div className="flex items-center py-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.membershipType === 'Premium' 
                      ? 'bg-purple-100 text-purple-800' 
                      : profile.membershipType === 'Monthly'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.membershipType || 'FREE'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <p className="text-gray-800 py-2">{profile.joinDate}</p>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats & BMI */}
          <div className="space-y-6">
            {/* BMI Card */}
            {bmi && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  BMI Calculator
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{bmi}</div>
                  <div className={`text-sm font-medium ${bmiInfo?.color}`}>
                    {bmiInfo?.category}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Account Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membership</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.membershipType === 'Premium' 
                      ? 'bg-purple-100 text-purple-800' 
                      : profile.membershipType === 'Monthly'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.membershipType || 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Programs Enrolled</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Workouts Completed</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Active</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Current Goals
              </h3>
              <div className="space-y-3">
                {profile.fitnessGoal ? (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800 capitalize">
                      {profile.fitnessGoal.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-blue-600">Primary Goal</div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No goals set yet</p>
                )}
              </div>
            </div>

            {/* Body Assessment Link */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Health Assessment
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get a comprehensive analysis of your body composition and health metrics.
              </p>
              <Link
                to="/body-assessment"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Activity className="h-4 w-4" />
                <span>Take Assessment</span>
              </Link>
            </div>

            {/* Cardiovascular Assessment Link */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Cardiovascular Fitness
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Assess your aerobic fitness with the Rockport 1-mile walk test and get your VO2 max estimation.
              </p>
              <Link
                to="/cardiovascular-assessment"
                className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span>Take Cardio Test</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;