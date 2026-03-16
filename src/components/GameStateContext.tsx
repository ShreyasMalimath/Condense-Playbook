import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameState {
    xp: number;
    completedMissions: string[];
    correctAnswers: number;
    totalQuestions: number;
    unlockedMissionsCount: number;
    missionScores: Record<string, { score: number, total: number }>;

    addXP: (amount: number) => void;
    completeMission: (chapterId: string, score?: number, total?: number) => void;
    recordAnswer: (isCorrect: boolean) => void;
    resetGame: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode, userId?: string }> = ({ children, userId }) => {
    const [xp, setXp] = useState(0);
    const [completedMissions, setCompletedMissions] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [missionScores, setMissionScores] = useState<Record<string, { score: number, total: number }>>({});
    const [isStateLoaded, setIsStateLoaded] = useState(false);

    const resetGame = () => {
        setXp(0);
        setCompletedMissions([]);
        setCorrectAnswers(0);
        setTotalQuestions(0);
        setMissionScores({});
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!userId) {
                resetGame();
                setIsStateLoaded(true);
                return;
            }

            const savedStateStr = localStorage.getItem(`condense_state_${userId}`);
            if (savedStateStr) {
                try {
                    const state = JSON.parse(savedStateStr);
                    setXp(state.xp || 0);
                    setCompletedMissions(state.completedMissions || []);
                    setCorrectAnswers(state.correctAnswers || 0);
                    setTotalQuestions(state.totalQuestions || 0);
                    setMissionScores(state.missionScores || {});
                } catch (err) {
                    console.error("Failed to parse saved game state", err);
                }
            } else {
                resetGame();
            }
            setIsStateLoaded(true);
        }, 0);
        return () => clearTimeout(timer);
    }, [userId]);

    useEffect(() => {
        if (!userId || !isStateLoaded) return;

        const stateToSave = {
            xp,
            completedMissions,
            correctAnswers,
            totalQuestions,
            missionScores
        };
        localStorage.setItem(`condense_state_${userId}`, JSON.stringify(stateToSave));
    }, [userId, isStateLoaded, xp, completedMissions, correctAnswers, totalQuestions, missionScores]);

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
            addXP,
            completeMission,
            recordAnswer,
            resetGame
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
