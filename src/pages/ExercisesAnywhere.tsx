import { Download, MapPin, Clock, Zap } from 'lucide-react';

const ExercisesAnywhere = () => {
  const handleDownload = () => {
    const guideContent = `
EXERCISES ANYWHERE GUIDE - BitFit Pro

OVERVIEW:
This comprehensive bodyweight exercise program is designed to help you stay fit anywhere, anytime. No equipment needed - just your body weight and a small space to move. Perfect for travel, home workouts, or when gym access is limited.

PROGRAM PHILOSOPHY:
Bodyweight exercises are the foundation of functional fitness. They improve strength, flexibility, coordination, and cardiovascular health while requiring minimal space and zero equipment.

PROGRAM STRUCTURE:
- Duration: Ongoing (adaptable routines)
- Equipment: None required
- Space needed: 6x6 feet minimum
- Time commitment: 15-60 minutes per session
- Frequency: 3-7 days per week

EXERCISE CATEGORIES:

1. UPPER BODY EXERCISES:

Push-Up Variations:
- Standard Push-ups
- Wide-grip Push-ups
- Diamond Push-ups
- Incline Push-ups (feet elevated)
- Decline Push-ups (hands elevated)
- Pike Push-ups
- Single-arm Push-ups
- Archer Push-ups

Pull Exercises (using furniture/doorway):
- Door Frame Rows
- Towel Door Pulls
- Table Rows
- Wall Handstand Push-ups

2. LOWER BODY EXERCISES:

Squat Variations:
- Bodyweight Squats
- Jump Squats
- Single-leg Squats (Pistol Squats)
- Sumo Squats
- Cossack Squats
- Wall Sits
- Bulgarian Split Squats

Lunge Variations:
- Forward Lunges
- Reverse Lunges
- Lateral Lunges
- Walking Lunges
- Jump Lunges
- Curtsy Lunges

Single-leg Exercises:
- Single-leg Glute Bridges
- Single-leg Calf Raises
- Single-leg Romanian Deadlifts
- Step-ups (using stairs/chair)

3. CORE EXERCISES:

Plank Variations:
- Standard Plank
- Side Planks
- Plank Up-downs
- Plank Jacks
- Mountain Climbers
- Plank to Downward Dog

Abdominal Exercises:
- Crunches
- Bicycle Crunches
- Russian Twists
- Leg Raises
- Dead Bug
- Hollow Body Hold

Dynamic Core:
- Burpees
- Bear Crawls
- Crab Walks
- High Knees
- Butt Kickers

4. FULL-BODY EXERCISES:

High-Intensity Movements:
- Burpees
- Mountain Climbers
- Jumping Jacks
- High Knees
- Squat Thrusts
- Star Jumps

Flow Movements:
- Sun Salutation (Yoga)
- Turkish Get-ups (modified)
- Bear Crawl to Downward Dog
- Inchworms

WORKOUT ROUTINES:

BEGINNER ROUTINE (15-20 minutes):
Warm-up (3 minutes):
- Arm circles: 30 seconds
- Leg swings: 30 seconds
- Jumping jacks: 1 minute
- Dynamic stretching: 1 minute

Main Workout (12 minutes):
Circuit 1 (repeat 3 times):
- Squats: 30 seconds
- Push-ups: 30 seconds
- Plank: 30 seconds
- Rest: 30 seconds

Circuit 2 (repeat 3 times):
- Lunges: 30 seconds
- Wall sits: 30 seconds
- Mountain climbers: 30 seconds
- Rest: 30 seconds

Cool-down (5 minutes):
- Static stretching
- Deep breathing

INTERMEDIATE ROUTINE (25-30 minutes):
Warm-up (5 minutes):
- Dynamic movements
- Joint mobility

Main Workout (20 minutes):
Circuit 1 (4 rounds):
- Jump squats: 45 seconds
- Push-ups: 45 seconds
- Plank jacks: 45 seconds
- Rest: 15 seconds

Circuit 2 (4 rounds):
- Burpees: 45 seconds
- Single-leg glute bridges: 45 seconds
- Russian twists: 45 seconds
- Rest: 15 seconds

Cool-down (5 minutes):
- Stretching and relaxation

ADVANCED ROUTINE (35-45 minutes):
Warm-up (5 minutes):
- Full-body dynamic warm-up

Main Workout (30-35 minutes):
Strength Circuit (5 rounds):
- Single-leg squats: 1 minute
- Archer push-ups: 1 minute
- Single-arm planks: 1 minute
- Rest: 1 minute

HIIT Circuit (5 rounds):
- Burpees: 30 seconds
- Jump lunges: 30 seconds
- Mountain climbers: 30 seconds
- High knees: 30 seconds
- Rest: 30 seconds

Core Finisher (3 rounds):
- Hollow body hold: 45 seconds
- Side planks: 45 seconds each side
- Rest: 30 seconds

Cool-down (5-10 minutes):
- Comprehensive stretching

TRAVEL-FRIENDLY ROUTINES:

HOTEL ROOM WORKOUT (20 minutes):
- Bodyweight squats: 2 minutes
- Push-ups: 2 minutes
- Lunges: 2 minutes
- Plank variations: 2 minutes
- Burpees: 2 minutes
- Rest and repeat 2x

AIRPLANE/OFFICE STRETCHES (10 minutes):
- Neck rolls
- Shoulder shrugs
- Seated spinal twists
- Ankle circles
- Calf raises
- Seated leg extensions

PARK/OUTDOOR WORKOUT (30 minutes):
- Use benches for incline/decline exercises
- Tree branches for pull-ups
- Hills for cardio intervals
- Open space for dynamic movements

PROGRESSION STRATEGIES:

Increase Difficulty:
1. Add more repetitions
2. Increase time under tension
3. Reduce rest periods
4. Add plyometric elements
5. Combine exercises (compound movements)
6. Increase range of motion

Weekly Progression:
Week 1: Master basic movements
Week 2: Increase repetitions by 20%
Week 3: Add advanced variations
Week 4: Combine exercises into flows
Week 5+: Create personalized routines

NUTRITION FOR BODYWEIGHT TRAINING:

Pre-Workout (30-60 minutes before):
- Banana with almond butter
- Oatmeal with berries
- Greek yogurt with honey

Post-Workout (within 30 minutes):
- Protein shake with fruit
- Chocolate milk
- Greek yogurt with nuts

Hydration:
- 16-20 oz water 2 hours before
- 6-8 oz every 15-20 minutes during
- 16-24 oz for every pound lost after

RECOVERY AND FLEXIBILITY:

Daily Stretching Routine (10 minutes):
- Hip flexor stretch: 1 minute each leg
- Hamstring stretch: 1 minute each leg
- Chest doorway stretch: 1 minute
- Shoulder cross-body stretch: 30 seconds each
- Spinal twist: 1 minute each side
- Child's pose: 2 minutes

Foam Rolling Alternatives:
- Tennis ball for feet
- Lacrosse ball for trigger points
- Towel for IT band stretching
- Wall for calf stretching

TRACKING PROGRESS:

Fitness Tests (monthly):
- Maximum push-ups in 2 minutes
- Plank hold duration
- Single-leg squat progression
- Burpee test (5 minutes)

Measurements:
- Body weight
- Body measurements
- Progress photos
- Energy levels
- Sleep quality

COMMON MISTAKES TO AVOID:
1. Skipping warm-up
2. Poor form for more repetitions
3. Not progressing difficulty
4. Ignoring rest days
5. Inconsistent routine
6. Comparing to others
7. Not listening to your body

MOTIVATION TIPS:
- Set specific, achievable goals
- Track your workouts
- Find an accountability partner
- Celebrate small victories
- Mix up routines regularly
- Focus on how you feel, not just appearance
- Remember: consistency beats perfection

EMERGENCY WORKOUTS:

5-Minute Energy Booster:
- Jumping jacks: 1 minute
- Squats: 1 minute
- Push-ups: 1 minute
- Mountain climbers: 1 minute
- Stretching: 1 minute

10-Minute Stress Buster:
- Warm-up: 2 minutes
- Bodyweight circuit: 6 minutes
- Cool-down stretching: 2 minutes

Remember: The best workout is the one you'll actually do. Start where you are, use what you have, and do what you can. Consistency is key to long-term success.

For personalized bodyweight training programs and form coaching, consult with our certified fitness professionals.

© BitFit Pro - Fitness Freedom Anywhere, Anytime
    `;

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Exercises-Anywhere-Guide-BitFit-Pro.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <MapPin className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Exercises Anywhere</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Stay fit with bodyweight exercises you can do anywhere, anytime. No equipment needed - just your body and determination.
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Fitness Freedom</h2>
              <p className="text-lg text-gray-600 mb-8">
                Break free from gym limitations with our comprehensive bodyweight training program. 
                Whether you're traveling, at home, or in a small space, you can maintain your fitness routine anywhere.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Time Efficient</h3>
                    <p className="text-gray-600">Effective workouts in as little as 15 minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No Equipment</h3>
                    <p className="text-gray-600">Use your body weight for resistance and strength building.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Program Features</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Zero equipment required</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Minimal space needed</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Scalable difficulty levels</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Travel-friendly routines</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Full-body workouts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Exercise Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Exercise Categories</h2>
            <p className="text-xl text-gray-600">Comprehensive bodyweight movements for total fitness</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💪</span>
                </div>
                <h3 className="text-xl font-bold">Upper Body</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Push-up variations</li>
                <li>• Pike push-ups</li>
                <li>• Handstand progressions</li>
                <li>• Tricep dips</li>
                <li>• Plank variations</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🦵</span>
                </div>
                <h3 className="text-xl font-bold">Lower Body</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Squat variations</li>
                <li>• Lunge patterns</li>
                <li>• Single-leg exercises</li>
                <li>• Glute bridges</li>
                <li>• Calf raises</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold">Core</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Plank progressions</li>
                <li>• Mountain climbers</li>
                <li>• Russian twists</li>
                <li>• Leg raises</li>
                <li>• Dead bugs</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold">Cardio</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Burpees</li>
                <li>• Jumping jacks</li>
                <li>• High knees</li>
                <li>• Bear crawls</li>
                <li>• Jump squats</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workout Routines */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready-to-Use Routines</h2>
            <p className="text-xl text-gray-600">Choose the perfect workout for your time and fitness level</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-xl">
              <div className="text-center mb-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold">Quick Blast</h3>
                <p className="text-purple-600 font-semibold">15 minutes</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Perfect for busy schedules</li>
                <li>• High-intensity circuits</li>
                <li>• Full-body activation</li>
                <li>• Energy boosting</li>
              </ul>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Sample:</strong> 3 rounds of squats, push-ups, mountain climbers, and planks (45 sec each, 15 sec rest)
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-xl">
              <div className="text-center mb-6">
                <Zap className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold">Power Session</h3>
                <p className="text-purple-600 font-semibold">30 minutes</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Balanced strength & cardio</li>
                <li>• Progressive difficulty</li>
                <li>• Comprehensive training</li>
                <li>• Skill development</li>
              </ul>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Sample:</strong> Strength circuit + HIIT rounds + core finisher with proper warm-up and cool-down
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-xl">
              <div className="text-center mb-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold">Travel Friendly</h3>
                <p className="text-purple-600 font-semibold">20 minutes</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Hotel room compatible</li>
                <li>• Minimal space required</li>
                <li>• Quiet movements</li>
                <li>• Jet lag recovery</li>
              </ul>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Sample:</strong> Low-impact exercises focusing on mobility, strength, and gentle cardio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Bodyweight Training?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Ultimate Convenience</h3>
              <p className="text-gray-600">Work out anywhere - home, office, hotel, park, or beach. No gym membership required.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Functional Strength</h3>
              <p className="text-gray-600">Build real-world strength that translates to daily activities and sports performance.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Cost Effective</h3>
              <p className="text-gray-600">Zero equipment costs. Your body is the only tool you need for a complete workout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Guide Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Download Your Complete Guide</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get instant access to our comprehensive bodyweight exercise guide with routines, progressions, and travel-friendly workouts.
          </p>
          
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 rounded-xl text-white">
            <Download className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Complete Exercises Anywhere Guide</h3>
            <p className="mb-6">
              Includes: Exercise library, workout routines, progression plans, travel workouts, and form instructions.
            </p>
            <button 
              onClick={handleDownload}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Download Free Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExercisesAnywhere;