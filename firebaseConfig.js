// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "react-signin-29f77.firebaseapp.com",
    projectId: "react-signin-29f77",
    storageBucket: "react-signin-29f77.appspot.com",
    messagingSenderId: "864947260890",
    appId: "1:864947260890:web:b510b6fadd0bfa425f44e3",
    measurementId: "G-CGTF8X6MV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider()