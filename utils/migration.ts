import { db } from '../services/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteField, writeBatch } from 'firebase/firestore';

export const migrateUserDataToSubcollections = async () => {
  console.log("Iniciando migração de dados...");
  
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    let migratedCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userRef = doc(db, 'users', userDoc.id);
      const batch = writeBatch(db);
      let needsMigration = false;

      // 1. Migrar Workouts
      if (Array.isArray(userData.workouts) && userData.workouts.length > 0) {
        console.log(`Migrando ${userData.workouts.length} treinos para ${userDoc.id}...`);
        for (const workout of userData.workouts) {
          const workoutRef = doc(collection(userRef, 'workouts'), workout.id);
          batch.set(workoutRef, workout);
        }
        // Remove array antigo
        batch.update(userRef, { workouts: deleteField() });
        needsMigration = true;
      }

      // 2. Migrar History (TrainingLogs)
      if (Array.isArray(userData.history) && userData.history.length > 0) {
        console.log(`Migrando ${userData.history.length} logs para ${userDoc.id}...`);
        for (const log of userData.history) {
          const logId = log.id || crypto.randomUUID();
          const logRef = doc(collection(userRef, 'history'), logId);
          batch.set(logRef, log);
        }
        batch.update(userRef, { history: deleteField() });
        needsMigration = true;
      }

      // 3. Migrar Messages
      if (Array.isArray(userData.messages) && userData.messages.length > 0) {
        console.log(`Migrando ${userData.messages.length} mensagens para ${userDoc.id}...`);
        for (const msg of userData.messages) {
          const msgId = msg.id || crypto.randomUUID();
          const msgRef = doc(collection(userRef, 'messages'), msgId);
          batch.set(msgRef, msg);
        }
        batch.update(userRef, { messages: deleteField() });
        needsMigration = true;
      }

      if (needsMigration) {
        await batch.commit();
        migratedCount++;
        console.log(`Usuário ${userDoc.id} migrado com sucesso.`);
      }
    }
    
    console.log(`Migração concluída! ${migratedCount} usuários atualizados.`);
    return true;
  } catch (error) {
    console.error("Erro na migração:", error);
    return false;
  }
};
