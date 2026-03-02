import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug para verificar se as variáveis carregaram
const missingKeys: string[] = [];
if (!firebaseConfig.apiKey) missingKeys.push("VITE_FIREBASE_API_KEY");
if (!firebaseConfig.authDomain) missingKeys.push("VITE_FIREBASE_AUTH_DOMAIN");
if (!firebaseConfig.projectId) missingKeys.push("VITE_FIREBASE_PROJECT_ID");

if (missingKeys.length > 0) {
    console.error(`ERRO CRÍTICO: Variáveis de ambiente faltando: ${missingKeys.join(", ")}. \nVerifique o arquivo .env.local e REINICIE o servidor (npm run dev).`);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
