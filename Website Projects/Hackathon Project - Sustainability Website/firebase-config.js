/* ===========================================
   EcoQuest Firebase Configuration
   Replace the config object with your actual Firebase config
   =========================================== */

// TODO: Replace this with your actual Firebase config from Step 1
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id-here"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('🔥 Firebase initialized successfully for EcoQuest!');