// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// We don't need getAnalytics for this project, but it doesn't hurt to have.

// Your web app's Firebase configuration
// This is public information and is safe to commit to GitHub.
const firebaseConfig = {
  apiKey: "AIzaSyCh1nFnb-Z_eV8M5eCzHJAN5TI1xz4pjLk",
  authDomain: "samplepack-1bf22.firebaseapp.com",
  databaseURL: "https://samplepack-1bf22-default-rtdb.firebaseio.com",
  projectId: "samplepack-1bf22",
  storageBucket: "samplepack-1bf22.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "855893608928",
  appId: "1:855893608928:web:d3aec9e14eba6e63e98385",
  measurementId: "G-XQ2Y5DEHJ3"
};

// Initialize Firebase for the frontend
const app = initializeApp(firebaseConfig);

// You can export the app instance to be used by other parts of your application
export { app };

