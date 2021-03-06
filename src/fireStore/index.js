// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";


// Add the Firebase services that you want to use
import "firebase/firestore";
import "firebase/auth";
import  'firebase/database'


import firebaseConfig from "./config";

firebase.initializeApp(firebaseConfig);

export const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

export const google = new firebase.auth.GoogleAuthProvider();
export const email = new firebase.auth.EmailAuthProvider()
export const auth = firebase.auth();

export const db = firebase.firestore();

export default firebase;
