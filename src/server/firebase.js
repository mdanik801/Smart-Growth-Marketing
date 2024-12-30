// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore"; // Import Firestore functions
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyDubZjrcsliSi1OAanf0xsHWKqIJjdIUy8",
   authDomain: "company-website-5864b.firebaseapp.com",
   projectId: "company-website-5864b",
   storageBucket: "company-website-5864b.appspot.com",
   messagingSenderId: "997795295705",
   appId: "1:997795295705:web:d3c2a1793a3aeb39b669c8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app); // Authentication service
export const db = getFirestore(app); // Firestore service
export const storage = getStorage(app); // Cloud Storage service

// Export Firestore functions you need
export { doc, setDoc, collection }; // Export doc, setDoc, collection from Firestore

export default app; // Optional export of the app instance
