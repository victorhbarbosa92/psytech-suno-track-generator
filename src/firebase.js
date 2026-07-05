// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgyHA7scqhZELC7eLg9K20I2HWi4fQdK0",
  authDomain: "psytech-suno-generator-1.firebaseapp.com",
  projectId: "psytech-suno-generator-1",
  storageBucket: "psytech-suno-generator-1.firebasestorage.app",
  messagingSenderId: "1018667808413",
  appId: "1:1018667808413:web:793d6ab64cd9c9a9ac8674"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
