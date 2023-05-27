// Import the functions you need from the SDKs you need
import { initializeApp } from "./node_modules/firebase/app";
import { getAnalytics } from "./node_modules/firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCWMa7w0zQVAOL_74546qvBxYLCD8x1NY0",
    authDomain: "activityfinder-166ea.firebaseapp.com",
    projectId: "activityfinder-166ea",
    storageBucket: "activityfinder-166ea.appspot.com",
    messagingSenderId: "773489635924",
    appId: "1:773489635924:web:5cd54047a4194d9fae73c1",
    measurementId: "G-ZLH25KN9WW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);