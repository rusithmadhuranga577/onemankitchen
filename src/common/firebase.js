import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";

  if(!firebase.apps.length){
    var firebaseConfig = {
        apiKey: "AIzaSyDTzNF8mdK9k2AZSdgfPgmpS1qRZqNgJ_0",
        authDomain: "one-man-kitchen-f30ad.firebaseapp.com",
        databaseURL: "https://one-man-kitchen-f30ad.firebaseio.com",
        projectId: "one-man-kitchen-f30ad",
        storageBucket: "one-man-kitchen-f30ad.appspot.com",
        messagingSenderId: "60889075223",
        appId: "1:60889075223:android:4c19d8a14e03bdb9ee5652",
    };
    firebase.initializeApp(firebaseConfig);
    firebase.firestore();
  }else{
    firebase.app();
  }


export default firebase;