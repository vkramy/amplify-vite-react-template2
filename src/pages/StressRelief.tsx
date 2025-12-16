import { Download, Heart, Smile, Brain } from 'lucide-react';

const StressRelief = () => {
  const handleDownload = () => {
    const guideContent = `
STRESS RELIEF PROGRAM - FitCoach Pro

OVERVIEW:
This comprehensive stress relief program combines physical exercise, mindfulness practices, and lifestyle modifications to help you manage stress, improve mental wellness, and enhance overall quality of life.

PROGRAM STRUCTURE:
- Duration: 8 weeks
- Frequency: Daily practices (15-60 minutes)
- Focus: Mind-body connection and stress reduction
- Approach: Holistic wellness integration

THE SCIENCE OF STRESS RELIEF:
Exercise releases endorphins, natural mood elevators that combat stress hormones like cortisol. Regular physical activity combined with mindfulness practices creates a powerful stress-reduction system.

WEEK 1-2: FOUNDATION PHASE
Daily Schedule:
Morning (15 minutes):
- 5 minutes gentle stretching
- 5 minutes deep breathing
- 5 minutes positive affirmations

Evening (20 minutes):
- 10 minutes yoga flow
- 10 minutes meditation

Weekend (45 minutes):
- 30 minutes nature walk
- 15 minutes journaling

WEEK 3-4: BUILDING PHASE
Daily Schedule:
Morning (20 minutes):
- 10 minutes yoga sequence
- 5 minutes breathing exercises
- 5 minutes mindfulness practice

Midday (10 minutes):
- Stress-relief breathing break
- Progressive muscle relaxation

Evening (25 minutes):
- 15 minutes gentle cardio (walking, cycling)
- 10 minutes meditation

WEEK 5-6: INTEGRATION PHASE
Daily Schedule:
Morning (25 minutes):
- 15 minutes yoga or tai chi
- 10 minutes meditation

Afternoon (15 minutes):
- Mindful movement break
- Stress-check and breathing

Evening (30 minutes):
- 20 minutes moderate exercise
- 10 minutes relaxation techniques

WEEK 7-8: MASTERY PHASE
Daily Schedule:
Morning (30 minutes):
- 20 minutes dynamic yoga
- 10 minutes mindfulness meditation

Throughout Day:
- Micro-meditation breaks (2-3 minutes)
- Mindful transitions between activities

Evening (35 minutes):
- 25 minutes preferred exercise
- 10 minutes deep relaxation

STRESS-RELIEF EXERCISES:

1. BREATHING TECHNIQUES:
Box Breathing:
- Inhale for 4 counts
- Hold for 4 counts
- Exhale for 4 counts
- Hold for 4 counts
- Repeat 10 cycles

4-7-8 Breathing:
- Inhale for 4 counts
- Hold for 7 counts
- Exhale for 8 counts
- Repeat 4 cycles

2. YOGA SEQUENCES:
Morning Sun Salutation (5 minutes):
- Mountain Pose
- Forward Fold
- Half Lift
- Low Lunge
- Downward Dog
- Child's Pose

Evening Wind-Down (10 minutes):
- Cat-Cow Pose
- Seated Forward Fold
- Supine Twist
- Legs Up the Wall
- Savasana

3. CARDIO FOR STRESS RELIEF:
Low-Impact Options:
- Brisk walking (20-30 minutes)
- Swimming (15-25 minutes)
- Cycling (20-30 minutes)
- Dancing (15-20 minutes)

High-Impact Options:
- Jogging (15-20 minutes)
- HIIT workouts (10-15 minutes)
- Kickboxing (20 minutes)
- Jump rope (10-15 minutes)

4. STRENGTH TRAINING FOR STRESS:
Circuit Training (20 minutes):
- Bodyweight squats (1 minute)
- Push-ups (1 minute)
- Plank hold (30 seconds)
- Mountain climbers (1 minute)
- Rest (30 seconds)
- Repeat 3-4 rounds

MINDFULNESS PRACTICES:

1. MEDITATION TECHNIQUES:
Focused Attention:
- Choose an object (breath, sound, mantra)
- Maintain focus for set duration
- Gently return attention when mind wanders

Body Scan:
- Lie down comfortably
- Focus on each body part sequentially
- Notice sensations without judgment
- Release tension as you go

Loving-Kindness:
- Send good wishes to yourself
- Extend to loved ones
- Include neutral people
- Embrace difficult relationships

2. MINDFUL MOVEMENT:
Walking Meditation:
- Walk slowly and deliberately
- Focus on each step
- Notice surroundings mindfully
- Coordinate with breathing

Tai Chi Basics:
- Slow, flowing movements
- Coordinate with breath
- Focus on balance and grace
- Practice daily for 10-15 minutes

LIFESTYLE MODIFICATIONS:

1. SLEEP HYGIENE:
- Consistent sleep schedule
- 7-9 hours nightly
- Cool, dark environment
- No screens 1 hour before bed
- Relaxation routine

2. NUTRITION FOR STRESS:
Foods to Include:
- Omega-3 rich fish
- Dark leafy greens
- Berries and antioxidants
- Nuts and seeds
- Herbal teas (chamomile, lavender)

Foods to Limit:
- Caffeine (especially afternoon)
- Processed foods
- Excessive sugar
- Alcohol
- Heavy meals before bed

3. STRESS MANAGEMENT TOOLS:
Time Management:
- Prioritize tasks
- Break large projects into steps
- Use calendars and planners
- Set realistic deadlines
- Learn to say no

Social Support:
- Connect with friends and family
- Join support groups
- Practice open communication
- Seek professional help when needed

TRACKING YOUR PROGRESS:
Daily Stress Scale (1-10):
- Rate stress level morning and evening
- Note triggers and patterns
- Track improvement over time

Weekly Assessments:
- Sleep quality
- Energy levels
- Mood stability
- Physical symptoms
- Overall well-being

EMERGENCY STRESS RELIEF:
When overwhelmed, use these quick techniques:

5-Minute Reset:
- 2 minutes deep breathing
- 2 minutes gentle stretching
- 1 minute positive self-talk

10-Minute Recovery:
- 5 minutes walking
- 3 minutes breathing exercises
- 2 minutes gratitude practice

BUILDING LONG-TERM RESILIENCE:
- Regular exercise routine
- Consistent sleep schedule
- Healthy nutrition habits
- Strong social connections
- Ongoing mindfulness practice
- Professional support when needed

Remember: Stress relief is a skill that improves with practice. Be patient with yourself and celebrate small victories along the way.

For personalized stress management coaching and mental wellness support, consult with our certified wellness professionals.

© FitCoach Pro - Your Partner in Holistic Wellness
    `;

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Stress-Relief-Program-FitCoach-Pro.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Stress Relief Program</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Reduce stress and improve mental wellness through targeted fitness routines, mindfulness practices, and lifestyle modifications.
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Find Your Inner Peace</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our stress relief program combines the power of physical exercise with mindfulness practices to help you 
                manage stress, improve mental clarity, and enhance your overall well-being.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Mind-Body Connection</h3>
                    <p className="text-gray-600">Integrate physical movement with mental wellness practices.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Smile className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Holistic Approach</h3>
                    <p className="text-gray-600">Address stress from multiple angles for lasting results.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Program Benefits</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Reduced stress and anxiety</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Improved sleep quality</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Enhanced mental clarity</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Better emotional regulation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Increased energy levels</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Program Components */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Program Components</h2>
            <p className="text-xl text-gray-600">A comprehensive approach to stress management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Mindful Movement</h3>
              <p className="text-gray-600 mb-6">
                Gentle exercises that combine physical activity with mindfulness, including yoga, tai chi, and walking meditation.
              </p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Yoga sequences</li>
                <li>• Tai chi basics</li>
                <li>• Walking meditation</li>
                <li>• Stretching routines</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Breathing Techniques</h3>
              <p className="text-gray-600 mb-6">
                Powerful breathing exercises that activate your body's relaxation response and reduce stress hormones.
              </p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Box breathing</li>
                <li>• 4-7-8 technique</li>
                <li>• Diaphragmatic breathing</li>
                <li>• Progressive relaxation</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smile className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Lifestyle Integration</h3>
              <p className="text-gray-600 mb-6">
                Practical strategies to incorporate stress-relief practices into your daily routine for lasting change.
              </p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Sleep optimization</li>
                <li>• Nutrition guidance</li>
                <li>• Time management</li>
                <li>• Social support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Progression */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">8-Week Progression</h2>
            <p className="text-xl text-gray-600">Gradual build-up for sustainable stress management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-green-600">1-2</span>
                </div>
                <h3 className="text-lg font-bold">Foundation</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Basic breathing</li>
                <li>• Gentle stretching</li>
                <li>• Short meditations</li>
                <li>• Habit building</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-green-600">3-4</span>
                </div>
                <h3 className="text-lg font-bold">Building</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Yoga sequences</li>
                <li>• Longer practices</li>
                <li>• Stress awareness</li>
                <li>• Routine establishment</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-green-600">5-6</span>
                </div>
                <h3 className="text-lg font-bold">Integration</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Advanced techniques</li>
                <li>• Lifestyle changes</li>
                <li>• Stress triggers</li>
                <li>• Coping strategies</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-green-600">7-8</span>
                </div>
                <h3 className="text-lg font-bold">Mastery</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Personalized practice</li>
                <li>• Long-term planning</li>
                <li>• Resilience building</li>
                <li>• Maintenance mode</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download Guide Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Download Your Complete Guide</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get instant access to our comprehensive stress relief guide with exercises, meditation techniques, and lifestyle strategies.
          </p>
          
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-8 rounded-xl text-white">
            <Download className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Complete Stress Relief Guide</h3>
            <p className="mb-6">
              Includes: 8-week program, breathing exercises, yoga sequences, meditation guides, and stress management tools.
            </p>
            <button 
              onClick={handleDownload}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Download Free Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StressRelief;