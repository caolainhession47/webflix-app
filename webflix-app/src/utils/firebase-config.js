import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// My apps Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOSrT75M4tlp-oQjpvOoyF9zNrWQ3n4Gc",
  authDomain: "webflix-fyp.firebaseapp.com",
  projectId: "webflix-fyp",
  storageBucket: "webflix-fyp.appspot.com",
  messagingSenderId: "600256543611",
  appId: "1:600256543611:web:4850690fb2172a72001bde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);