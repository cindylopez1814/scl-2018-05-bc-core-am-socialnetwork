firebase.database().ref('chat')
  .limitToLast(20)
  .once('value')
  .then((messages) => {
    const month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dateNow = new Date();
    titleChat.innerHTML += `
    <div class="chat-name">${firebase.auth().currentUser.displayName}</div>
    <div class="chat-num">${dateNow.getDate()} - ${month[dateNow.getMonth()]} ${dateNow.getHours()}:${dateNow.getMinutes()}</div>
    `;
  })
  .catch(() => {
  });

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
  avatarPic.src=  newMessage.val().creatorAvatar
  });

function sendMessage(event) {
  if(event.keyCode === 13 || !event.key){
  const currentUser = firebase.auth().currentUser;
  const textMessage = messageInput.value;
  const newMessageKey = firebase.database().ref().child('chat').push().key;
  firebase.database().ref(`chat/${newMessageKey}`).set({
    creator: currentUser.uid,
    creatorName: currentUser.displayName,
    text: textMessage,
    creatorAvatar:currentUser.photoURL,
    time: Date.now()
  });
  messageInput.value = '';
  }
};

function usersApp () {
  const newUser = {
    id: user.uid,
    name: user.displayName,
    avatar: user.photoURL,
  }
}