// const trash = document.getElementsByClassName('fa-trash');

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
      <div class="card">
        <div class="card-header">
          <img class="img-fluid avatar" src="${newMessage.creatorAvatar || '/src/assets/img/penguin-glasses.png'}">
          <h6 class="card-title">${newMessage.val().creatorName}</h6>
        </div>
        <div class="card-body">
          <textarea class="card-text textArea" data-id="${newMessage.text}" readonly>${newMessage.val().text}</textarea>
        </div>
        <div class="card-footer text-muted">
          <i class="fas fa-star" data-id="${newMessage.key}" onclick="addStar(event)">
            <span>${newMessage.val().starsCount}</span>
          </i>
          <i class="fas fa-edit d-none" data-id="${newMessage.key}" onclick="editButton()"></i>
          <i id="saveBtn" class="far fa-save" data-id="${newMessage.key}" onclick="updateTxt()"></i>
          <i class="fas fa-trash" data-id="${newMessage.key}" onclick="deleteButton(event)"></i>
        </div>
      </div>
      ` + messageContainer.innerHTML;
  /*  if (newMessage.creator === firebase.auth().currentUser.uid) {
      document.getElementsByClassName('fa-edit').style.display = 'inline';
      trash.style.display = 'inline';
    } else {
      document.getElementsByClassName('fa-edit').style.display = 'none';
      trash.style.display = 'none';
    } */
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
  const messagesRef = firebase.database().ref('messages').child(messagesId);
  messagesRef.remove();
  messageContainer.removeChild(messageContainer.childNodes[0] && messageContainer.childNodes[1]);
}

function editButton() {
  document.getElementsByClassName('textArea').readOnly = false;
  saveBtn.classList.remove('d-none');
}

function updateTxt(event) {
  let messageToChange = 'mdf vd fm';
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
  event.target.style.color = '#f3f170';
  const messageId = event.target.getAttribute('data-id');
  firebase.database().ref(`messages/${messageId}`).once('value', function(message) {   
    let result = (message.val().starsCount || 1);
    console.log(result);
    firebase.database().ref('messages').child(messageId).update({
      starsCount: result + 1
    });
    event.target.innerHTML = result;
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
