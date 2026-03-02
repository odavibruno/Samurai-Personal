import { useState, useEffect } from 'react';
import { UserProfile, Workout, TrainingLog, Message } from '../types';
import { INITIAL_USER_DATA } from '../constants';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';

export const useUserProfile = (firebaseUser: User | null) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_DATA);
  const [loading, setLoading] = useState(false);

  // Helper function to ensure data integrity
  const ensureDataIntegrity = (baseData: any): UserProfile => {
      // ... (mantendo a lógica existente para campos simples)
    if (!baseData.goals) baseData.goals = INITIAL_USER_DATA.goals;
    if (!baseData.statsHistory) baseData.statsHistory = INITIAL_USER_DATA.statsHistory;
    if (!baseData.dailyMeals) baseData.dailyMeals = INITIAL_USER_DATA.dailyMeals;
    if (!baseData.financial) {
        baseData.financial = { status: 'Em dia', plan: 'Mensal', dueDate: new Date().toISOString().split('T')[0], lastPayment: new Date().toISOString().split('T')[0], value: 120, history: [] };
    }
    if (baseData.financial && !baseData.financial.history) {
        baseData.financial.history = INITIAL_USER_DATA.financial?.history || [];
    }
    if (!baseData.schedule) baseData.schedule = [];
    if (baseData.isFirstLogin === undefined) baseData.isFirstLogin = false;
    if (baseData.hasAcceptedTerms === undefined) baseData.hasAcceptedTerms = true;

    // Inicializa arrays vazios, pois serão preenchidos pelas subcoleções
    baseData.workouts = baseData.workouts || [];
    baseData.trainingLogs = baseData.trainingLogs || [];
    baseData.messages = baseData.messages || [];

    return baseData as UserProfile;
  };

  // Load from Firestore with Subcollections
  useEffect(() => {
    if (!firebaseUser || !firebaseUser.email) {
        setLoading(false);
        return;
    }

    const email = firebaseUser.email;

    const loadUser = async () => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', email);
            const docSnap = await getDoc(userRef);
            
            if (docSnap.exists()) {
                const userData = ensureDataIntegrity(docSnap.data());

                // Load Subcollections in parallel
                const workoutsPromise = getDocs(collection(userRef, 'workouts'));
                const historyPromise = getDocs(collection(userRef, 'history'));
                const messagesPromise = getDocs(collection(userRef, 'messages'));

                const [workoutsSnap, historySnap, messagesSnap] = await Promise.all([
                    workoutsPromise,
                    historyPromise,
                    messagesPromise
                ]);

                // Map subcollections to user object state
                userData.workouts = workoutsSnap.docs.map(d => d.data() as Workout);
                userData.trainingLogs = historySnap.docs.map(d => d.data() as TrainingLog);
                userData.messages = messagesSnap.docs.map(d => d.data() as Message);
                
                setUser(userData);
            } else {
                 // Initialize with basic data if document doesn't exist yet
                 setUser({ ...INITIAL_USER_DATA, email });
            }
        } catch (error) {
            console.error("Error loading user profile from Firestore:", error);
        } finally {
            setLoading(false);
        }
    };
    loadUser();
  }, [firebaseUser]);

  // Save Function specialized for Subcollections
  // We need to override the default "save everything to one doc" behavior
  // This hook now exposes specialized updaters or handles the split saving logic

  const saveQuestionnaire = async (answers: { question: string; answer: string }[]) => {
      const email = firebaseUser?.email;
      if (!email) return user;
      
      const questionnaireData = {
          answers,
          answeredAt: new Date().toISOString()
      };

      const updatedUser = { ...user, questionnaire: questionnaireData };
      setUser(updatedUser);
      
      // Save only the profile part to main doc
      await setDoc(doc(db, 'users', email), { questionnaire: questionnaireData }, { merge: true });
      return updatedUser;
  };

  const completeOnboarding = (newPassword: string) => {
     // ... logic remains similar, but saving password to main doc
     const email = firebaseUser?.email;
     if (email) {
        setDoc(doc(db, 'users', email), { 
            password: newPassword, 
            isFirstLogin: false, 
            hasAcceptedTerms: true 
        }, { merge: true });
     }
     
     const updated = { ...user, isFirstLogin: false, hasAcceptedTerms: true };
     setUser(updated);
     return updated;
  };

  // Override the main setUser to handle subcollection updates?
  // Ideally, we should export specific functions to add/update workouts, logs, etc.
  // But for compatibility with existing code that calls setUser, we might need a sync effect
  // HOWEVER, syncing a whole array to subcollections is inefficient (writes N docs every change).
  // Strategy: The app should use specific methods for adding workouts/logs.
  
  // For now, let's keep the main 'user' state as the source of truth for UI,
  // but we need to intercept changes to workouts/logs to save to subcollections.

  // NOTE: This effect below is risky with subcollections. 
  // We should DISABLE the automatic full-user save and only save profile fields.
  useEffect(() => {
    if (!firebaseUser || loading) return;
    const email = firebaseUser.email;
    if (!email) return;

    // Save PROFILE fields only
    const profileData = { ...user };
    // Remove large arrays from the main document save
    delete (profileData as any).workouts;
    delete (profileData as any).trainingLogs;
    delete (profileData as any).messages;

    const saveProfile = async () => {
        try {
             await setDoc(doc(db, 'users', email), profileData, { merge: true });
        } catch (err) {
            console.error("Error saving profile:", err);
        }
    };

    // Debounce this? For now, simple execution.
    if (user.id !== 'guest') {
        saveProfile();
    }
  }, [user, firebaseUser]); // Be careful with dependency loop

  // New Methods for Subcollection Management
  const addWorkout = async (workout: Workout) => {
      const email = firebaseUser?.email;
      if (!email) return;
      
      const updatedWorkouts = [...user.workouts, workout];
      setUser(prev => ({ ...prev, workouts: updatedWorkouts }));
      
      await setDoc(doc(db, 'users', email, 'workouts', workout.id), workout);
  };

  const addTrainingLog = async (log: TrainingLog) => {
      const email = firebaseUser?.email;
      if (!email) return;

      const updatedLogs = [log, ...user.trainingLogs];
      setUser(prev => ({ ...prev, trainingLogs: updatedLogs }));

      await setDoc(doc(db, 'users', email, 'history', log.id), log);
  };

  const updateTrainingLog = async (log: TrainingLog) => {
      const email = firebaseUser?.email;
      if (!email) return;

      const updatedLogs = user.trainingLogs.map(l => l.id === log.id ? log : l);
      setUser(prev => ({ ...prev, trainingLogs: updatedLogs }));

      await setDoc(doc(db, 'users', email, 'history', log.id), log, { merge: true });
  };

  const deleteTrainingLog = async (logId: string) => {
      const email = firebaseUser?.email;
      if (!email) return;

      const updatedLogs = user.trainingLogs.filter(l => l.id !== logId);
      setUser(prev => ({ ...prev, trainingLogs: updatedLogs }));

      await import('firebase/firestore').then(({ deleteDoc }) => 
        deleteDoc(doc(db, 'users', email, 'history', logId))
      );
  };

  const [nextClassAlert, setNextClassAlert] = useState<{ studentName: string, time: string } | null>(null);

  // Alert Scheduler
  useEffect(() => {
    if (!firebaseUser || !user.schedule) return;

    const checkNextClass = () => {
        const now = new Date();
        const currentDateStr = now.toISOString().split('T')[0];
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

        const upcomingClass = user.schedule.find(s => {
            if (s.date !== currentDateStr) return false;
            const [h, m] = s.time.split(':').map(Number);
            const classTimeMinutes = h * 60 + m;
            const diff = classTimeMinutes - currentTimeMinutes;
            return diff >= 0 && diff <= 20; 
        });

        if (upcomingClass) {
            setNextClassAlert({ studentName: upcomingClass.studentName, time: upcomingClass.time });
        } else {
            setNextClassAlert(null); 
        }
    };

    const interval = setInterval(checkNextClass, 60000); 
    checkNextClass(); 

    return () => clearInterval(interval);
  }, [user.schedule, firebaseUser]);

  return { 
      user, 
      setUser, // Warning: setUser won't automatically save subcollections anymore!
      loading,
      nextClassAlert,
      saveQuestionnaire,
      completeOnboarding,
      addWorkout,    // Expose this
      addTrainingLog, // Expose this
      updateTrainingLog,
      deleteTrainingLog
  };
};
