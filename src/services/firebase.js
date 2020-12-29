import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyAgCmNhfkTaIXIcuyRtl59WpxfCzLyAIn0",
    authDomain: "tests-6a601.firebaseapp.com",
    databaseURL: "https://tests-6a601-default-rtdb.europe-west1.firebasedatabase.app/"
  };
  firebase.initializeApp(config);
  export const auth = firebase.auth;
  export const db = firebase.database();