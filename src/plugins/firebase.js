import firebase from "firebase";
if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyDKEKFVU7Zvo23NtiGUd8_jf3aMAvGdYdY",
    authDomain: "web-1-4032c.firebaseapp.com",
    databaseURL: "https://web-1-4032c.firebaseio.com",
    projectId: "web-1-4032c",
    storageBucket: "",
    messagingSenderId: "1019064153474",
    appId: "1:1019064153474:web:dc85090282a3b99c"
  };
  firebase.initializeApp(config);
}

const db = firebase.database();
export { db };
