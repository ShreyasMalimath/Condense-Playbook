import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// IMPORTANT: The user must replace these values with their actual Firebase project config 
// after creating a free project at https://console.firebase.google.com/
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment12345",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "condense-playbook.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "condense-playbook",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "condense-playbook.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
