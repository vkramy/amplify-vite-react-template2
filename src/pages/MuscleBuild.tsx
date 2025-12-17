import { Download, Zap, Trophy, TrendingUp } from 'lucide-react';
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";




const MuscleBuild = () => {

  const client = generateClient<Schema>();
const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

 useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt(" New Todo content") });
  }

  const handleDownload = () => {
    const guideContent = `
MUSCLE BUILDING GUIDE - BitFit Pro

OVERVIEW:
This comprehensive muscle building program is designed to help you gain lean muscle mass, increase strength, and improve overall body composition through progressive resistance training and optimal nutrition.

PROGRAM STRUCTURE:
- Duration: 16 weeks
- Frequency: 4-6 days per week
- Expected muscle gain: 0.5-1 lb per week
- Focus: Progressive overload and compound movements

NUTRITION FOR MUSCLE GROWTH:
1. Caloric surplus of 300-500 calories per day
2. Protein: 1.6-2.2g per kg of body weight
3. Carbohydrates: 4-7g per kg of body weight
4. Fats: 0.8-1.2g per kg of body weight
5. Meal timing: Protein every 3-4 hours

TRAINING PRINCIPLES:
- Progressive Overload: Gradually increase weight, reps, or sets
- Compound Movements: Focus on multi-joint exercises
- Time Under Tension: Control the eccentric (lowering) phase
- Rest Periods: 2-3 minutes between sets for strength
- Frequency: Train each muscle group 2-3 times per week

PHASE 1: FOUNDATION (Weeks 1-4)
Training Split: Upper/Lower (4 days)
- Day 1: Upper Body
- Day 2: Lower Body
- Day 3: Rest
- Day 4: Upper Body
- Day 5: Lower Body
- Day 6-7: Rest

Key Exercises:
Upper: Bench Press, Rows, Overhead Press, Pull-ups
Lower: Squats, Deadlifts, Lunges, Hip Thrusts

PHASE 2: GROWTH (Weeks 5-8)
Training Split: Push/Pull/Legs (6 days)
- Day 1: Push (Chest, Shoulders, Triceps)
- Day 2: Pull (Back, Biceps)
- Day 3: Legs (Quads, Hamstrings, Glutes, Calves)
- Day 4: Push
- Day 5: Pull
- Day 6: Legs
- Day 7: Rest

PHASE 3: STRENGTH (Weeks 9-12)
Training Split: Upper/Lower Power (5 days)
- Focus on heavier weights (3-6 rep range)
- Emphasis on compound movements
- Power and explosive movements

PHASE 4: PEAK (Weeks 13-16)
Training Split: Body Part Specialization
- Target lagging muscle groups
- Advanced techniques (drop sets, supersets)
- Peak strength and size

SAMPLE MEAL PLAN (2500 calories):
Breakfast: 3 eggs + 2 egg whites, oatmeal with banana
Snack: Protein shake with berries
Lunch: 6oz chicken breast, rice, mixed vegetables
Pre-workout: Banana with peanut butter
Post-workout: Protein shake with milk
Dinner: 6oz lean beef, sweet potato, broccoli
Evening: Greek yogurt with nuts

SUPPLEMENTATION:
Essential:
- Whey Protein Powder (25-30g post-workout)
- Creatine Monohydrate (5g daily)
- Multivitamin

Optional:
- Beta-Alanine (3-5g daily)
- Citrulline Malate (6-8g pre-workout)
- Fish Oil (2-3g daily)

RECOVERY PROTOCOLS:
- Sleep: 7-9 hours per night
- Hydration: 3-4 liters of water daily
- Active Recovery: Light cardio on rest days
- Stretching: 10-15 minutes post-workout
- Massage: Weekly deep tissue massage

TRACKING PROGRESS:
- Body weight: Weekly
- Body measurements: Bi-weekly
- Progress photos: Monthly
- Strength logs: Every workout
- Body fat percentage: Monthly

COMMON MISTAKES TO AVOID:
1. Not eating enough calories
2. Skipping compound exercises
3. Training too frequently without rest
4. Not progressively overloading
5. Ignoring proper form for heavier weights
6. Inadequate protein intake
7. Not getting enough sleep

ADVANCED TECHNIQUES:
- Drop Sets: Reduce weight and continue reps
- Supersets: Back-to-back exercises
- Rest-Pause: Brief rest then continue set
- Tempo Training: Control lifting speed
- Cluster Sets: Mini-rests within a set

INJURY PREVENTION:
- Always warm up properly (10-15 minutes)
- Focus on mobility and flexibility
- Use proper form over heavy weight
- Listen to your body
- Include deload weeks every 4-6 weeks

Remember: Muscle building is a slow process that requires consistency, patience, and dedication. Focus on progressive overload and proper nutrition for best results.

For personalized training programs and form coaching, consult with our certified strength trainers.

© BitFit Pro - Your Partner in Strength and Muscle Growth
    `;

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Muscle-Building-Guide-BitFit-Pro.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Zap className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Muscle Building Program</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Build lean muscle mass and increase strength with our progressive resistance training program designed for maximum muscle growth.
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Build Your Best Physique</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our muscle building program combines progressive resistance training with optimal nutrition to help you 
                gain lean muscle mass, increase strength, and transform your physique.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Progressive Overload</h3>
                    <p className="text-gray-600">Systematically increase training stimulus for continuous muscle growth.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Proven Methods</h3>
                    <p className="text-gray-600">Science-based training protocols used by professional athletes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Program Features</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>16-week progressive program</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Compound movement focus</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Nutrition optimization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Recovery protocols</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Form coaching videos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Training Phases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Training Phases</h2>
            <p className="text-xl text-gray-600">Structured progression for maximum muscle growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-bold">Foundation</h3>
                <p className="text-sm text-gray-600">Weeks 1-4</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Upper/Lower split</li>
                <li>• Form mastery</li>
                <li>• Base strength</li>
                <li>• Movement patterns</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-lg font-bold">Growth</h3>
                <p className="text-sm text-gray-600">Weeks 5-8</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Push/Pull/Legs</li>
                <li>• Volume increase</li>
                <li>• Hypertrophy focus</li>
                <li>• Time under tension</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg font-bold">Strength</h3>
                <p className="text-sm text-gray-600">Weeks 9-12</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Heavy compounds</li>
                <li>• Power development</li>
                <li>• Lower rep ranges</li>
                <li>• Strength gains</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">4</span>
                </div>
                <h3 className="text-lg font-bold">Peak</h3>
                <p className="text-sm text-gray-600">Weeks 13-16</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Specialization</li>
                <li>• Advanced techniques</li>
                <li>• Peak performance</li>
                <li>• Body composition</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Exercises */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Core Exercises</h2>
            <p className="text-xl text-gray-600">Master these fundamental movements for maximum muscle growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Upper Body</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Bench Press</li>
                <li>• Pull-ups/Chin-ups</li>
                <li>• Overhead Press</li>
                <li>• Barbell Rows</li>
                <li>• Dips</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Lower Body</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Squats</li>
                <li>• Deadlifts</li>
                <li>• Bulgarian Split Squats</li>
                <li>• Hip Thrusts</li>
                <li>• Romanian Deadlifts</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Accessories</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Bicep Curls</li>
                <li>• Tricep Extensions</li>
                <li>• Lateral Raises</li>
                <li>• Face Pulls</li>
                <li>• Calf Raises</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

       {/* TO DO - List Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Create your TO DO LIST </h2>
                <h1>My New todos</h1>

            <button onClick={createTodo}>+ new</button>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>{todo.content}</li>
              ))}
            </ul>
            <div>
              🥳 App successfully hosted. Try creating a new todo.
              <br />
              <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                Review next step of this tutorial.
              </a>
            </div>
         
        </div>
      </section>

      {/* Download Guide Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Download Your Complete Guide</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get instant access to our comprehensive muscle building guide with workout plans, nutrition protocols, and expert tips.
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-xl text-white">
            <Download className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Complete Muscle Building Guide</h3>
            <p className="mb-6">
              Includes: 16-week training program, nutrition guidelines, supplement protocols, exercise demonstrations, and progress tracking tools.
            </p>
            <button 
              onClick={handleDownload}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Download Free Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MuscleBuild;