import { useState, useEffect } from 'react';
import { ActiveWorkoutSession, Workout } from '../types';
import { db } from '../services/firebase';
import { doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

export const useWorkoutSession = (user: User | null) => {
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);
  const [loading, setLoading] = useState(false);
  
  const isAuthenticated = !!user;

  // Subscribe to active session in Firestore
  useEffect(() => {
    if (!user || !user.email) {
        setActiveSession(null);
        return;
    }

    const email = user.email;
    
    setLoading(true);
    // Storing active session in a separate collection: 'active_sessions'
    // Document ID = user email
    const docRef = doc(db, 'active_sessions', email);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setActiveSession(docSnap.data() as ActiveWorkoutSession);
      } else {
        setActiveSession(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching active session:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Alerta de treino incompleto
  useEffect(() => {
    // Adicionamos um check para evitar alerta duplicado se o hook for recriado
    const hasAlerted = sessionStorage.getItem('has_alerted_session');
    // Check if session exists and is NOT paused (or maybe even if paused?)
    // The original logic was if activeSession exists.
    if (isAuthenticated && activeSession && !hasAlerted && !loading) {
       setTimeout(() => {
           // Simple alert for now
           // alert("⚠️ ATENÇÃO GUERREIRO!\n\nVocê tem uma batalha incompleta.\nComplete seu treino agora para manter a honra.");
           // Commented out to avoid annoying alerts during dev/testing, but logic is here.
           sessionStorage.setItem('has_alerted_session', 'true');
       }, 500);
    }
  }, [isAuthenticated, activeSession, loading]);

  const saveSession = async (session: ActiveWorkoutSession | null) => {
    const email = user?.email;
    if (!email) return;

    try {
        if (session) {
            await setDoc(doc(db, 'active_sessions', email), session);
        } else {
            await deleteDoc(doc(db, 'active_sessions', email));
        }
    } catch (error) {
        console.error("Error saving workout session:", error);
    }
  };

  const startSession = (workout: Workout) => {
    const newSession: ActiveWorkoutSession = {
      workoutId: workout.id,
      workoutTitle: workout.title,
      startTime: new Date().toISOString(),
      lastResumeTime: new Date().toISOString(),
      accumulatedDuration: 0,
      isPaused: false,
      currentExerciseIndex: 0,
      sessionData: {}
    };
    // Optimistic update
    setActiveSession(newSession);
    saveSession(newSession);
    sessionStorage.removeItem('has_alerted_session'); 
  };

  const pauseSession = () => {
    if (!activeSession || activeSession.isPaused) return;
    
    const now = new Date();
    const lastResume = activeSession.lastResumeTime ? new Date(activeSession.lastResumeTime) : now;
    const additionalTime = (now.getTime() - lastResume.getTime()) / 1000; // Segundos

    const updatedSession = {
      ...activeSession,
      isPaused: true,
      lastResumeTime: null,
      accumulatedDuration: activeSession.accumulatedDuration + additionalTime
    };
    
    setActiveSession(updatedSession);
    saveSession(updatedSession);
  };

  const resumeSession = () => {
    if (!activeSession || !activeSession.isPaused) return;

    const updatedSession = {
      ...activeSession,
      isPaused: false,
      lastResumeTime: new Date().toISOString()
    };

    setActiveSession(updatedSession);
    saveSession(updatedSession);
  };

  const updateSessionData = (exerciseId: string, setIndex: number, data: { weight: number, reps: string, done: boolean }) => {
    if (!activeSession) return;
    
    const newSessionData = { ...activeSession.sessionData };
    if (!newSessionData[exerciseId]) newSessionData[exerciseId] = {};
    newSessionData[exerciseId][setIndex] = data;

    const updatedSession = {
      ...activeSession,
      sessionData: newSessionData
    };

    setActiveSession(updatedSession);
    saveSession(updatedSession); // This might be too frequent? Maybe debounce?
    // For now, direct save is safer to avoid data loss.
  };

  const finishSession = () => {
    setActiveSession(null);
    saveSession(null);
    sessionStorage.removeItem('has_alerted_session');
  };

  return {
    activeSession,
    startSession,
    pauseSession,
    resumeSession,
    updateSessionData,
    finishSession,
    loading
  };
};
