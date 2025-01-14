// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDoc, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase project configuration
const firebaseConfig = {
   apiKey: "AIzaSyDubZjrcsliSi1OAanf0xsHWKqIJjdIUy8",
   authDomain: "company-website-5864b.firebaseapp.com",
   projectId: "company-website-5864b",
   storageBucket: "company-website-5864b.appspot.com",
   messagingSenderId: "997795295705",
   appId: "1:997795295705:web:d3c2a1793a3aeb39b669c8",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize individual Firebase services
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore database
export const storage = getStorage(app); // Cloud storage

// Re-export commonly used Firestore functions for convenience
export { doc, setDoc, getDoc, addDoc, collection };

// Optional: Export the initialized Firebase app (if needed elsewhere)
export default app;
