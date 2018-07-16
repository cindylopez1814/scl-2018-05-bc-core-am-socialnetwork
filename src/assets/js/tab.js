//mensajes
/*const newPost = {
    creationTime: firebase.database.ServerValue.TIMESTAMP,
    creator: window.user.uid,
    message: messageTextArea.value,
    creatorAvatar: window.user.photoURL,
    creatorName: user.displayName
};*/

const createUser = (user) => {
    // debugger
    const database = firebase.database();

    const newUser = {
        id: user.uid,
        name: user.displayName,
        email: user.emailVerified,
        avatar: user.photoURL,
    };

    const newUserKey = user.uid;
    database.ref(`/users/${newUserKey}`).update(newUser);
}


firebase.database().ref('messages')
        .limitToLast(5) // Filtro para no obtener todos los mensajes
        .once('value')
        .then((messages)=>{
            console.log("Mensajes > "+JSON.stringify(messages));
        })
        .catch(()=>{

        });

//Acá comenzamos a escuchar por ${newMessage.creatorAvatar} va en img src
//on child_added
firebase.database().ref('messages')
    .limitToLast(5)
    .on('child_added', (newMessage)=>{
        messageContainer.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="col-1 avatar">
                    <img class="img-fluid img-rounded" src>
                </div>
                <h6 class="card-title">Nombre : ${newMessage.val().creatorName}</h6>
                <p class="card-text">${newMessage.val().text}</p>
            </div>
            <div class="card-footer text-muted">
            <i class="fab fa-earlybirds"onclick="toggleStar()"></i><i class="fas fa-comment"></i><i class="fas fa-edit"edit-id="${newMessage.key}" onclick="editButton(event)"></i><i class="fas fa-trash" data-id="${newMessage.key}" onclick="deleteButton(event)"></i>
            </div>
        </div>
        ` + messageContainer.innerHTML;
    });
// Usaremos una colección para guardar los mensajes, llamada messages
function sendMessage(){
        const currentUser = firebase.auth().currentUser;
        const messageAreaText = messageArea.value;
    
        //Para tener una nueva llave en la colección messages
        const newMessageKey = firebase.database().ref().child('messages').push().key;
    
        firebase.database().ref(`messages/${newMessageKey}`).set({
            creator : currentUser.uid,
            creatorName : currentUser.displayName,
            text : messageAreaText
        });
    }

function deleteButton(event) {
    event.stopPropagation();
    const messagesId = event.target.getAttribute('data-id');
    const messagesRef = firebase.database().ref('messages').child(messagesId);
    messagesRef.remove();
    cont.removeChild(cont.childNodes[0] && cont.childNodes[1]);
}
    
function editButton(event) {

}

var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
starCountRef.on('value', function(snapshot) {
  updateStarCount(postElement, snapshot.val());
});

function toggleStar(event) {
    messagesRef.transaction(function(messages) {
      if (messages) {
        if (messages.stars && messages.stars[uid]) {
          messages.starCount--;
          messages.stars[uid] = null;
        } else {
          messages.starCount++;
          if (!messages.stars) {
            messages.stars = {};
          }
          messages.stars[uid] = true;
        }
      }
      return messages;
    });
  }