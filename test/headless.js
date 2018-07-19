global.window = global;
global.assert = require('chai').assert;

global.firebase = require('firebase');
require("../src/model");

var config = {
  apiKey: "AIzaSyDDPfdzZ-OL-5U1ZFgYEJd40Di3WdR36Wc",
  authDomain: "social-network-d7373.firebaseapp.com",
  databaseURL: "https://social-network-d7373.firebaseio.com",
  projectId: "social-network-d7373",
  storageBucket: "social-network-d7373.appspot.com",
  messagingSenderId: "188592192471"
};
firebase.initializeApp(config);