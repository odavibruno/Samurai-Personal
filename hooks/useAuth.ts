import { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { Student, UserProfile } from '../types';
import { INITIAL_USER_DATA } from '../constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, passwordInput: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, passwordInput);
      
      // Fetch user profile data to return consistent object structure expected by App.tsx
      // Note: App.tsx will eventually rely mostly on useUserProfile, but for now we return the profile
      const userRef = doc(db, 'users', email);
      const docSnap = await getDoc(userRef);
      
      let userProfileData: Partial<UserProfile>;
      
      if (docSnap.exists()) {
          userProfileData = docSnap.data() as UserProfile;
      } else {
          // Fallback if firestore doc doesn't exist yet (shouldn't happen for valid users)
          userProfileData = { ...INITIAL_USER_DATA, email };
      }
      
      return userProfileData;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
};
