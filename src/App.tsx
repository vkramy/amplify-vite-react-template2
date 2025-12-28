import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home.tsx';
import WeightLoss from './pages/WeightLoss';
import MuscleBuild from './pages/MuscleBuild';
import StressRelief from './pages/StressRelief';
import ExercisesAnywhere from './pages/ExercisesAnywhere';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import BodyAssessment from './pages/BodyAssessment';
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
            <Route path="/stress-relief" element={<StressRelief />} />
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;