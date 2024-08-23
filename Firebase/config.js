import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    //Paste Your firebase config here
   
    apiKey: "AIzaSyBfR-iygah0AIRL1fT_I3_JurJbmtl--YM",
    authDomain: "satta-62100.firebaseapp.com",
    projectId: "satta-62100",
    storageBucket: "satta-62100.appspot.com",
    messagingSenderId: "1041564761929",
    appId: "1:1041564761929:web:90132c5ea7bff1150ae498"
    
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth =firebase.auth();
export const firestore =getFirestore();

export { firebase }



