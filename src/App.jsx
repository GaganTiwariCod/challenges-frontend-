import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import MyChallenges from './pages/MyChallenges';
import CreateChallenge from './pages/CreateChallenge';
import ChallengeDetail from './pages/ChallengeDetail';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen once per session
    const seen = sessionStorage.getItem('challenge_splash_seen');
    return !seen;
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('challenge_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/challenges" element={<MyChallenges />} />
          <Route path="/challenges/create" element={<CreateChallenge />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </>
  );
}
