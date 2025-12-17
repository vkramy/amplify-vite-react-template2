import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import WeightLoss from './pages/WeightLoss.tsx';
import MuscleBuild from './pages/MuscleBuild.tsx';
import StressRelief from './pages/StressRelief.tsx';
import ExercisesAnywhere from './pages/ExercisesAnywhere.tsx';
import './App.css';

function App() {

  
  return (
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;