import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC46a9ssHlWb0zL3ykIMJEr4eejKKQ3BHk",
    authDomain: "theplaystation-89769.firebaseapp.com",
    projectId: "theplaystation-89769",
    storageBucket: "theplaystation-89769.appspot.com",
    messagingSenderId: "390442493002",
    appId: "1:390442493002:web:e79e8b17f01bce7a6df2b3",
    measurementId: "G-QCJ70LPKV5"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
  
export { storage, firebase as default } ;