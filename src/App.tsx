import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { GamifiedDashboard } from './components/GamifiedDashboard';
import { MissionLearningView } from './components/MissionLearningView';
import { QuizEngine } from './components/QuizEngine';
import { WelcomeWalkthrough } from './components/WelcomeWalkthrough';
import { BossBattle } from './components/BossBattle';
import { AdminDashboard } from './components/AdminDashboard';
import { XPSummaryPopup } from './components/XPSummaryPopup';
import { fullPlaybookData } from './data/full_playbook';
import { GameProvider, useGameState } from './components/GameStateContext';

type ViewState = 'login' | 'welcome' | 'dashboard' | 'learning' | 'quiz' | 'boss' | 'admin';

interface UserInfo {
  name: string;
  company: string;
}

const AdminPasswordModal = ({ onConfirm, onCancel }: { onConfirm: (pass: string) => void, onCancel: () => void }) => {
  const [password, setPassword] = useState('');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#0f172a] border border-slate-700 p-8 rounded-[2rem] shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Admin Access</h3>
            <p className="text-slate-400 text-xs">Enter your security passcode</p>
          </div>
        </div>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onConfirm(password);
            if (e.key === 'Escape') onCancel();
          }}
          placeholder="Passcode"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-6"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(password)}
            className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            Authenticate
          </button>
        </div>
        
        <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-bold">
          Default: admin123
        </p>
      </motion.div>
    </motion.div>
  );
};

function AppContent({ user, setUser }: { user: UserInfo | null, setUser: (u: UserInfo | null) => void }) {
  const { completedMissions, xp } = useGameState();
  const [currentView, setCurrentView] = useState<ViewState>(user ? 'dashboard' : 'login');
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [showXPSummary, setShowXPSummary] = useState(false);
  const [hasShownXPSummary, setHasShownXPSummary] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  const mainChapters = fullPlaybookData.filter(c => c.id.startsWith('ch-'));
  const allMissionsCompleted = mainChapters.every(c => completedMissions.includes(c.id));

  useEffect(() => {
    if (allMissionsCompleted && !hasShownXPSummary && user) {
      // Use a timeout to avoid synchronous setState in effect warning
      const timer = setTimeout(() => {
        setShowXPSummary(true);
        setHasShownXPSummary(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [allMissionsCompleted, hasShownXPSummary, user]);

  const totalPossibleXP = mainChapters.length * 500; // 5 questions * 100 XP per chapter


  const handleLogin = (name: string, company: string, isReturning: boolean) => {
    setUser({ name, company });
    setCurrentView(isReturning ? 'dashboard' : 'welcome');
  };

  const handleLogout = () => {
    localStorage.removeItem('condense_active_session');
    setUser(null);
    setCurrentView('login');
  };

  const handleWelcomeComplete = () => {
    setCurrentView('dashboard');
  };

  const handleSelectMission = (chapterId: string) => {
    if (chapterId === 'boss-battle') {
      setCurrentView('boss');
    } else {
      setActiveChapterId(chapterId);
      setCurrentView('learning');
    }
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleReturnToDashboard = () => {
    setActiveChapterId(null);
    setCurrentView('dashboard');
  };

  if (currentView === 'login' || !user) {
    return <Login onStart={handleLogin} />;
  }

  if (currentView === 'welcome') {
    return (
      <WelcomeWalkthrough
        userName={user.name}
        onComplete={handleWelcomeComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-100 overflow-x-hidden relative selection:bg-emerald-500/30 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[200px] mix-blend-screen opacity-10 bg-emerald-900" />
      </div>

      <Navigation
        user={user}
        onLogout={handleLogout}
        onAdmin={() => setShowAdminAuth(true)}
        onDashboard={handleReturnToDashboard}
        isAdminView={currentView === 'admin'}
      />

      <AnimatePresence>
        {showAdminAuth && (
          <AdminPasswordModal 
            onConfirm={(pass) => {
              const adminPass = (import.meta.env.VITE_ADMIN_PASSWORD || 'admin123').toLowerCase();
              if (pass.toLowerCase() === adminPass) {
                setCurrentView('admin');
                setShowAdminAuth(false);
              } else {
                alert("Incorrect passcode.");
              }
            }}
            onCancel={() => setShowAdminAuth(false)}
          />
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full pt-28">
        {currentView === 'admin' && (
          <AdminDashboard />
        )}
        {currentView === 'dashboard' && (
          <GamifiedDashboard onSelectMission={handleSelectMission} />
        )}
        {currentView === 'learning' && activeChapterId && (
          <MissionLearningView
            chapterId={activeChapterId}
            onBack={handleReturnToDashboard}
            onStartQuiz={handleStartQuiz}
          />
        )}
        {currentView === 'quiz' && activeChapterId && (
          <QuizEngine
            chapterId={activeChapterId}
            onComplete={handleReturnToDashboard}
          />
        )}
        {currentView === 'boss' && (
          <BossBattle
            onComplete={handleReturnToDashboard}
            onBack={handleReturnToDashboard}
          />
        )}
      </main>

      <AnimatePresence>
        {showXPSummary && (
          <XPSummaryPopup 
            totalXp={xp} 
            maxXp={totalPossibleXP} 
            onClose={() => setShowXPSummary(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Auto-login on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const activeSession = localStorage.getItem('condense_active_session');
        if (activeSession) {
          // Verify session still exists/is valid in Firestore
          const { db } = await import('./lib/firebase');
          const { doc, getDoc } = await import('firebase/firestore');
          
          const userRef = doc(db, 'users', activeSession);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({ name: activeSession, company: userData.companyCode });
          } else {
            // Invalid session
            localStorage.removeItem('condense_active_session');
          }
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeUser();
  }, []);


  if (isInitializing) return null;

  return (
    <GameProvider key={user?.name || 'anonymous'} userId={user?.name}>
      <AppContent user={user} setUser={setUser} />
    </GameProvider>
  );
}
