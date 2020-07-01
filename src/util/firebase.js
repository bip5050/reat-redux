import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Config from '../config';

let Auth        = false;
firebase.initializeApp( Config.firebase);
// firebase auth
if(Auth === false){
  //console.log(' Auth Called ');
  firebase.auth().signInAnonymously();
  Auth = true;
}
// create a firebase database object
export const database     = firebase.firestore();
export const firestore    = firebase.firestore;