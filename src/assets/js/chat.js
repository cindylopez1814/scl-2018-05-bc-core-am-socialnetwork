firebase.database().ref('chat')
  .limitToLast(20)
  .once('value')
  .then((messages) => {
    const month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dateNow = new Date();
    titleChat.innerHTML += `
    <div class="chat-name">${firebase.auth().currentUser.displayName}</div>
    <div class="chat-num">${dateNow.getDate()} de ${month[dateNow.getMonth()]}</div>
    `;
  })
  .catch(() => { });

firebase.database().ref('chat')
  .limitToLast(20)
  .on('child_added', (newMessage) => {
    const time = new Date(newMessage.val().time);
    messagesContainer.innerHTML += `
      <div class="message-data">
      <span class="message-data-name">${newMessage.val().creatorName}</span>
      <span class="message-data-time">${time.getHours()}:${time.getMinutes()}</span>
      </div>
      <div class="message my-message">${newMessage.val().text}</div>
      `;
    avatarPic.src = newMessage.val().creatorAvatar;
  });

function sendMessage(event) {
  send.disabled = true;
  const currentUser = firebase.auth().currentUser;
  const textMessage = messageInput.value;
  if (textMessage.length > 0) {
    send.disabled = false
    const newMessageKey = firebase.database().ref().child('chat').push().key;
    firebase.database().ref(`chat/${newMessageKey}`).set({
      creator: currentUser.uid,
      creatorName: currentUser.displayName,
      text: textMessage,
      creatorAvatar: currentUser.photoURL,
      time: Date.now()
    });
    messageInput.value = '';
  }
  else {
    send.disabled = true;
  }
};

function presenceUsers() {
  const uid = firebase.auth().currentUser.uid;
  // Referencia a un usuario especifico
  // Guardar usuario online/offline online/offline.
  const userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
  //offline
  const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };
  const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };
  //Retornara true para online y false para offline
  firebase.database().ref('.info/connected').on('value', function(snapshot) {
    if (snapshot.val() == false) {
        return;
    };
    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase)
    .then(() => {
        userStatusDatabaseRef.set(isOnlineForDatabase);
    });
});
}

function usersApp(user) {
  const newUser = {
    id: user.uid,
    name: user.displayName,
    avatar: user.photoURL,
  };
  const newUserKey = use.uid;
  firebase.database.ref(`/userss/${newUserKey}`).update(newUser);
}