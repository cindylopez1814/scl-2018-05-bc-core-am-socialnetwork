/*
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Crea objetos usuario en la database
admin.initializeApp(functions.config().firebase);
functions.auth.user().onCreate(event => {
  const user = event.data;
  var userObject = {
    displayName: user.displayName,
    email: user.email,
    role: student,
    photoUrl: user.photoURL,
    createdOn: user.metadata.createdAt
  };
  admin.database().ref('users/' + user.uid).set(userObject);
});

*/

