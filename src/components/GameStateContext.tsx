import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface GameState {
    xp: number;
    completedMissions: string[];
    correctAnswers: number;
    totalQuestions: number;
    unlockedMissionsCount: number;
    missionScores: Record<string, { score: number, total: number }>;
    chatTranscripts: Record<string, { timestamp: any, messages: { role: string, content: string }[], status: 'won' | 'lost' }>;

    addXP: (amount: number) => void;
    completeMission: (chapterId: string, score?: number, total?: number) => void;
    saveChatTranscript: (personaId: string, messages: { role: string, content: string }[], status: 'won' | 'lost') => void;
    recordAnswer: (isCorrect: boolean) => void;
    resetGame: () => void;
    isFirebaseConfigured: boolean;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode, userId?: string }> = ({ children, userId }) => {
    const [xp, setXp] = useState(0);
    const [completedMissions, setCompletedMissions] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [missionScores, setMissionScores] = useState<Record<string, { score: number, total: number }>>({});
    const [chatTranscripts, setChatTranscripts] = useState<Record<string, { timestamp: any, messages: { role: string, content: string }[], status: 'won' | 'lost' }>>({});
    const [isStateLoaded, setIsStateLoaded] = useState(false);
    const [loadedUserId, setLoadedUserId] = useState<string | undefined>(undefined);
    const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

    useEffect(() => {
        // Check if real config is provided (not dummy)
        const isConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY && 
                             import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyDummyKeyForDevelopment12345";
        setIsFirebaseConfigured(isConfigured);
        if (!isConfigured) {
            console.warn("Firebase is NOT configured with real keys. Data will not persist to the cloud.");
        }
    }, []);

    const resetGame = () => {
        setXp(0);
        setCompletedMissions([]);
        setCorrectAnswers(0);
        setTotalQuestions(0);
        setMissionScores({});
        setChatTranscripts({});
    };

    useEffect(() => {
        const fetchState = async () => {
            setIsStateLoaded(false); // Lock sync while fetching new user data
            if (!userId) {
                resetGame();
                setIsStateLoaded(true);
                return;
            }

            try {
                // First try Firestore (Source of Truth)
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setXp(data.xp || 0);
                    setCompletedMissions(data.completedMissions || []);
                    setCorrectAnswers(data.correctAnswers || 0);
                    setTotalQuestions(data.totalQuestions || 0);
                    setMissionScores(data.quizResults || {});
                    setChatTranscripts(data.chatTranscripts || {});
                } else {
                    // Fallback to localStorage if Firestore is empty (legacy users)
                    const savedStateStr = localStorage.getItem(`condense_state_${userId}`);
                    if (savedStateStr) {
                        const state = JSON.parse(savedStateStr);
                        setXp(state.xp || 0);
                        setCompletedMissions(state.completedMissions || []);
                        setCorrectAnswers(state.correctAnswers || 0);
                        setTotalQuestions(state.totalQuestions || 0);
                        setMissionScores(state.missionScores || {});
                        setChatTranscripts(state.chatTranscripts || {});
                    } else {
                        resetGame();
                    }
                }
            } catch (err) {
                console.error("Failed to fetch game state from Firestore", err);
                // Last ditch fallback to local storage
                const savedStateStr = localStorage.getItem(`condense_state_${userId}`);
                if (savedStateStr) {
                    try {
                        const state = JSON.parse(savedStateStr);
                        setXp(state.xp || 0);
                        setCompletedMissions(state.completedMissions || []);
                        setCorrectAnswers(state.correctAnswers || 0);
                        setTotalQuestions(state.totalQuestions || 0);
                        setMissionScores(state.missionScores || {});
                        setChatTranscripts(state.chatTranscripts || {});
                    } catch (e) {
                        console.error("Local storage fallback failed", e);
                    }
                }
            } finally {
                setLoadedUserId(userId);
                setIsStateLoaded(true);
            }
        };

        fetchState();
    }, [userId]);

    useEffect(() => {
        if (!userId || !isStateLoaded || loadedUserId !== userId) return;

        const stateToSave = {
            xp,
            completedMissions,
            correctAnswers,
            totalQuestions,
            missionScores,
            chatTranscripts
        };
        localStorage.setItem(`condense_state_${userId}`, JSON.stringify(stateToSave));

        // Sync to Firebase for Admin Telemetrics
        const syncToFirebase = async () => {
            try {
                // Ensure the user doc exists/updates with the latest stats
                const userRef = doc(db, 'users', userId);
                await setDoc(userRef, {
                    username: userId,
                    xp: xp,
                    accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
                    correctAnswers: correctAnswers,
                    totalQuestions: totalQuestions,
                    completedMissions: completedMissions,
                    modulesCompleted: completedMissions.length,
                    lastActive: serverTimestamp(),
                    quizResults: missionScores,
                    chatTranscripts: chatTranscripts,
                }, { merge: true });
                console.log("Cloud sync successful for user:", userId);
            } catch (err) {
                // Silently fail if Firebase isn't configured yet
                console.warn("Firestore sync skipped (check Firebase config):", err);
            }
        };

        syncToFirebase();
    }, [userId, isStateLoaded, xp, completedMissions, correctAnswers, totalQuestions, missionScores, chatTranscripts]);

    const unlockedMissionsCount = completedMissions.length + 1; // Always unlock next one

    const addXP = (amount: number) => setXp(prev => prev + amount);

    const completeMission = (chapterId: string, score?: number, total?: number) => {
        if (score !== undefined && total !== undefined) {
            setMissionScores(prev => ({
                ...prev,
                [chapterId]: { score: Math.max(prev[chapterId]?.score || 0, score), total }
            }));
        }
        
        setCompletedMissions(prev => {
            if (!prev.includes(chapterId)) {
                return [...prev, chapterId];
            }
            return prev;
        });
    };
    
    const saveChatTranscript = (personaId: string, messages: { role: string, content: string }[], status: 'won' | 'lost') => {
        setChatTranscripts(prev => ({
            ...prev,
            [personaId]: {
                timestamp: new Date().toISOString(),
                messages,
                status
            }
        }));
    };

    const recordAnswer = (isCorrect: boolean) => {
        setTotalQuestions(prev => prev + 1);
        if (isCorrect) setCorrectAnswers(prev => prev + 1);
    };

    return (
        <GameContext.Provider value={{
            xp,
            completedMissions,
            correctAnswers,
            totalQuestions,
            unlockedMissionsCount,
            missionScores,
            chatTranscripts,
            addXP,
            completeMission,
            saveChatTranscript,
            recordAnswer,
            resetGame,
            isFirebaseConfigured
        }}>
            {children}
        </GameContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameState = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameProvider');
    }
    return context;
};
