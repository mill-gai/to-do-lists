import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Link, Navigate } from 'react-router-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';

import './index.css';
import App from './App';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAF8N84iNOzI7ndZ3eKnQOmBjqr-yaJOjc',
    authDomain: 'todo-list-794e4.firebaseapp.com',
    projectId: 'todo-list-794e4',
    storageBucket: 'todo-list-794e4.appspot.com',
    messagingSenderId: '878248612777',
    appId: '1:878248612777:web:354809c231713402416ab8',
    measurementId: 'G-PVG2V2ZQ1B',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
const analytics = getAnalytics(app);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
