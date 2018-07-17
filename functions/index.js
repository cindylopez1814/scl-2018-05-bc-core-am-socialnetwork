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

// Keeps track of the length of the 'likes' child list in a separate property.
admin.initializeApp();
exports.countlikechange = functions.database.ref('/posts/{postid}/likes/{likeid}').onWrite(
  (change) => {
    const collectionRef = change.after.ref.parent;
    const countRef = collectionRef.parent.child('likes_count');

    let increment;
    if (change.after.exists() && !change.before.exists()) {
      increment = 1;
    } else if (!change.after.exists() && change.before.exists()) {
      increment = -1;
    } else {
      return null;
    }

    // Return the promise from countRef.transaction() so our function
    // waits for this async event to complete before it exits.
    return countRef.transaction((current) => {
      return (current || 0) + increment;
    }).then(() => {
      return console.log('Counter updated.');
    });
  });

// If the number of likes gets deleted, recount the number of likes
exports.recountlikes = functions.database.ref('/posts/{postid}/likes_count').onDelete((snap) => {
const counterRef = snap.ref;
const collectionRef = counterRef.parent.child('likes');

// Return the promise from counterRef.set() so our function
// waits for this async event to complete before it exits.
return collectionRef.once('value')
    .then((messagesData) => counterRef.set(messagesData.numChildren()));
});