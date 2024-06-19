import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDi8sp2O952SLnGzjOnb2hQJ3X_nOb9ymw",
    authDomain: "primerproyecto-5d54e.firebaseapp.com",
    projectId: "primerproyecto-5d54e",
    storageBucket: "primerproyecto-5d54e.appspot.com",
    messagingSenderId: "202283008769",
    appId: "1:202283008769:web:0431bcac3bc7f00f649100",
    measurementId: "G-3TXCLT66M0"
};
firebase.initializeApp(firebaseConfig);

export default firebase