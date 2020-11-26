import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDEgFbO-ncOAuj34amRbsMzGrFYaAozBDU",
    authDomain: "react-instagram-clone-77677.firebaseapp.com",
    databaseURL: "https://react-instagram-clone-77677.firebaseio.com",
    projectId: "react-instagram-clone-77677",
    storageBucket: "react-instagram-clone-77677.appspot.com",
    messagingSenderId: "965438445607",
    appId: "1:965438445607:web:172f98f72df968e707d602",
    measurementId: "G-QK34QKN7GT"
});

const db = firebaseApp.firestore();
const auth =  firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };