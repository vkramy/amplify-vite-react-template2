import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home.tsx';
import WeightLoss from './pages/WeightLoss';
import MuscleBuild from './pages/MuscleBuild';
import ExercisesAnywhere from './pages/ExercisesAnywhere';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import BodyAssessment from './pages/BodyAssessment';
import CardiovascularAssessment from './pages/CardiovascularAssessment';
import StrengthAssessment from './pages/StrengthAssessment';
import CalorieCalculator from './pages/CalorieCalculator';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50" style={{
          minHeight: '100vh',
          backgroundColor: '#fbfaf9ff'
        }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weight-loss" element={<WeightLoss />} />
            <Route path="/muscle-build" element={<MuscleBuild />} />
            <Route path="/exercises-anywhere" element={<ExercisesAnywhere />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/body-assessment" element={
              <ProtectedRoute>
                <BodyAssessment />
              </ProtectedRoute>
            } />
            <Route path="/cardiovascular-assessment" element={
              <ProtectedRoute>
                <CardiovascularAssessment />
              </ProtectedRoute>
            } />
            <Route path="/strength-assessment" element={
              <ProtectedRoute>
                <StrengthAssessment />
              </ProtectedRoute>
            } />
            <Route path="/calorie-calculator" element={
              <ProtectedRoute>
                <CalorieCalculator />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;