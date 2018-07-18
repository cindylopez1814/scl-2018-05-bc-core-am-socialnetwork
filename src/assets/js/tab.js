// mensajes
/* const newPost = {
  creationTime: firebase.database.ServerValue.TIMESTAMP,
  creator: window.user.uid,
  message: messageTextArea.value,
  creatorAvatar: window.user.photoURL,
  creatorName: user.displayName
};*/

const createUser = (user) => {
  const database = firebase.database();
  const newUser = {
    id: user.uid,
    name: user.displayName,
    email: user.emailVerified,
    avatar: user.photoURL,
  };
  const newUserKey = user.uid;
  database.ref(`/users/${newUserKey}`).update(newUser);
};


firebase.database().ref('messages')
  .limitToLast(5) // Filtro para no obtener todos los mensajes
  .once('value')
  .then((messages) => {
    console.log('Mensajes > ' + JSON.stringify(messages));
  })
  .catch((error) => {
    console.log('Error > ' + error);
  });

// Acá comenzamos a escuchar por ${newMessage.creatorAvatar} va en img src
// on child_added
firebase.database().ref('messages')
  .limitToLast(5)
  .on('child_added', (newMessage) => {
    messageContainer.innerHTML = `
      <div class="card w-75">
        <div class="card-body">
          <div class="col-12 avatar">
            <img class="img-fluid img-rounded" src="${newMessage.creatorAvatar || '../img/Facebook-no-profile-picture-icon-620x389.jpg'}">
          </div>
        <div class="card-footer text-muted">
          <i class="fab fa-earlybirds" data-id="${newMessage.key}" onclick="addStar(event)"></i>
          <p id="birdCounter" data-id="${newMessage.key}"></p>
          <i class="fas fa-edit" data-id="${newMessage.key}" onclick="editButton(event)"></i>
          <i id="saveBtn" class="far fa-save d-none" data-id="${newMessage.key}" onclick="updateTxt()"></i>
          <i class="fas fa-trash" data-id="${newMessage.key}" onclick="deleteButton(event)"></i>
        </div>
      </div>
      ` + messageContainer.innerHTML;
  });

// Usaremos una colección para guardar los mensajes, llamada messages
function sendPost() {
  const currentUser = firebase.auth().currentUser;
  const messageAreaText = messageArea.value;

  // Para tener una nueva llave en la colección messages
  const newMessageKey = firebase.database().ref().child('messages').push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
    creator: currentUser.uid,
    creatorName: currentUser.displayName,
    text: messageAreaText,
    creatorAvatar: currentUser.photoURL,
    starsCount: 0
  });
  messageArea.value = '';
}

function deleteButton(event) {
  event.stopPropagation();
  const messagesId = event.target.getAttribute('data-id');
  console.log(messagesId);
  const messagesRef = firebase.database().ref('messages').child(messagesId);
  console.log(messagesId);
  messagesRef.remove();
  messageContainer.removeChild(messageContainer.childNodes[0] && messageContainer.childNodes[1]);
}

function editButton(event) {
  event.target.removeAttribute('readonly');
  saveBtn.classList.remove('d-none');
}

function updateTxt(event) {
  let messageToChange = messageTxt.value;
  const messageId = event.target.getAttribute('data-id');
  if (messageToChange.keyCode === 13) {
    firebase.database().ref(`messages/${messageId}`).update({
      text: messageToChange
    });
    event.target.attr('readonly', true);
  }
}

function addStar(event) {
  event.stopPropagation();
  const messageId = event.target.getAttribute('data-id');
  firebase.database().ref(`messages/${messageId}`).once('value', function(message) {
    let result = (message.val().starsCount + 1);
    console.log(result);
    event.target.innerHTML = result;
    firebase.database().ref('messages').child(messageId).update({
      starsCount: result
    });

  });
}

/*
function toggleStar(event) {
  event.stopPropagation();
  const messageId = event.target.getAttribute('edit-id');
  console.log(messageId);
  const messageRef = firebase.database().ref('messages').child(messageId);
  console.log(messageRef);
  firebase.database().ref(`messages/${messageRef}`).update({
    starsCount: newMessage.val().starsCount + 1
  });
};
*/
// newMessage.val().starsCount;
