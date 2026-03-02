import { useState, useEffect } from 'react';
import { Student, Workout } from '../types';
import { db, firebaseConfig } from '../services/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const INITIAL_MASTER: Student = { 
  id: 'master-01', 
  name: 'Warllley Samurai', 
  email: 'w.samurai.fitness@gmail.com', 
  goal: 'Liderança Suprema', 
  level: 'Xogum (Mestre)', 
  birthDate: '1990-01-01', 
  gender: 'Masculino', 
  weight: 88, 
  height: 182, 
  waterIntake: 4.0, 
  date: '2024-01-01', 
  phone: '(11) 99999-9999',
  isLider: true, 
  workouts: [],
  password: 'admin' 
};

export const useClan = () => {
  const [clanMembers, setClanMembers] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to users collection
  useEffect(() => {
    const q = collection(db, 'users');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const members: Student[] = [];
      querySnapshot.forEach((doc) => {
        members.push(doc.data() as Student);
      });
      
      setClanMembers(members);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching clan members:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Ensure Master exists on first load if collection is empty
  useEffect(() => {
    if (!loading && clanMembers.length === 0) {
        setDoc(doc(db, 'users', INITIAL_MASTER.email), INITIAL_MASTER)
            .catch(err => console.error("Error creating initial master:", err));
    }
  }, [loading, clanMembers.length]);

  const createStudent = async (newStudent: Student) => {
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);

    try {
        // Define default password if not provided
        // Use birthdate (DDMMAA) as default password if available?
        let password = newStudent.password;
        if (!password) {
            if (newStudent.birthDate) {
                // Format: DDMMAA
                const parts = newStudent.birthDate.split('-'); // YYYY-MM-DD
                if (parts.length === 3) {
                    password = `${parts[2]}${parts[1]}${parts[0].slice(2)}`;
                } else {
                    password = 'samuraifitness';
                }
            } else {
                password = 'samuraifitness';
            }
        }

        await createUserWithEmailAndPassword(secondaryAuth, newStudent.email, password);
        
        // Save to Firestore
        // Use email as ID for the document to match existing pattern
        // Ensure the student object has the password field saved (optional, but legacy code uses it)
        const studentToSave = { ...newStudent, password };
        
        await setDoc(doc(db, 'users', newStudent.email), studentToSave);
        
        await signOut(secondaryAuth);
        await deleteApp(secondaryApp);
        
        return true;
    } catch (error: any) {
        console.error("Error creating student:", error);
        await deleteApp(secondaryApp); 
        throw error;
    }
  };

  const updateStudent = async (updatedStudent: Student) => {
    try {
      // Use email as document ID
      // Important: We only update the main document fields (profile).
      // Workouts and History are subcollections and should not be overwritten by this call
      // if updatedStudent contains them as arrays.
      
      const { workouts, ...profileData } = updatedStudent as any;
      
      await setDoc(doc(db, 'users', updatedStudent.email), profileData, { merge: true });
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Erro ao salvar estudante. Verifique o console.");
    }
  };

  const deleteStudent = async (id: string) => {
    const studentToDelete = clanMembers.find(m => m.id === id);
    if (!studentToDelete) return;

    try {
      await deleteDoc(doc(db, 'users', studentToDelete.email));
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Erro ao excluir estudante.");
    }
  };

  const updateStudentWorkouts = async (studentEmail: string, workouts: Workout[]) => {
      try {
          const userRef = doc(db, 'users', studentEmail);
          const workoutsRef = collection(userRef, 'workouts');
          
          // 1. Get existing IDs
          const snapshot = await getDocs(workoutsRef);
          const existingIds = snapshot.docs.map(d => d.id);
          const newIds = workouts.map(w => w.id);
          
          // 2. Delete removed workouts
          const toDelete = existingIds.filter(id => !newIds.includes(id));
          const batch = writeBatch(db);
          
          toDelete.forEach(id => {
              batch.delete(doc(workoutsRef, id));
          });
          
          // 3. Set/Update new workouts
          workouts.forEach(w => {
              batch.set(doc(workoutsRef, w.id), w);
          });
          
          await batch.commit();
          
      } catch (error) {
          console.error("Error updating workouts:", error);
          throw error;
      }
  };

  return {
    clanMembers,
    setClanMembers, // Keep for compatibility if needed, but changes should go through updateStudent
    updateStudent,
    deleteStudent,
    updateStudentWorkouts,
    createStudent,
    loading
  };
};
