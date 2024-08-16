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

// Habilitar persistencia offline
firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Este código se ejecuta si múltiples pestañas están abiertas con la misma app
      console.error('Failed precondition: multiple tabs open', err);
    } else if (err.code === 'unimplemented') {
      // Este código se ejecuta si el navegador no soporta algunas funcionalidades
      console.error('Persistence is not available in this browser', err);
    }
  });
  
export default firebase
