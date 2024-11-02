import '/socket.io/socket.io.js';

const socket = io();

let ROOM_ID = null;

socket.on('match', (room_id) => {
  console.log(room_id)

  ROOM_ID = room_id;

  socket.emit('message', {
    room_id: ROOM_ID,
    message: 'Hello, World!'
  });
});

socket.on('message', (message) => {
  console.log(message);

  // setTimeout(() => {

  //   socket.emit('message', {
  //     room_id: ROOM_ID,
  //     message: 'Hello, World!'
  //   });
  // }, 1000);
});

socket.on('time_up', () => {
  console.log('Time is up!');

  ROOM_ID = null;
});

socket.emit('match_request');

function renderGame() {
  const pregameWrapper = document.querySelector('.pregame-wrapper');
  const gameWrapper = document.querySelector('.game-wrapper');

  if (pregameWrapper && gameWrapper) {
    gameWrapper.classList.remove('display-none');
    pregameWrapper.classList.add('display-none');
  }

  setTimeout(() => {
    const decisionWrapper = document.querySelector('.decision-wrapper');

    if (decisionWrapper) {
      decisionWrapper.classList.remove('display-none');
      gameWrapper.classList.add('display-none'); // blurlayabiliriz
    }
  }, 1000); // 1 second delay
}

function addChatMessageSelf() {
  const chatInput = document.querySelector('#chat-text-input');
  const chatBox = document.querySelector('.body-wrapper-chat-box');

  if (chatInput && chatBox && chatInput.value.trim() !== '') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message-self'); // Optional: Add a class for styling
    messageDiv.textContent = chatInput.value;
    
    chatBox.appendChild(messageDiv); 
    chatInput.value = ''; 

    // Scroll to the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function addChatMessageOpponent() {
  const chatInput = document.querySelector('#chat-text-input');
  const chatBox = document.querySelector('.body-wrapper-chat-box');

  if (chatInput && chatBox && chatInput.value.trim() !== '') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message-opponent');
    messageDiv.textContent = chatInput.value;
    
    chatBox.appendChild(messageDiv);
    chatInput.value = '';

    // Scroll to the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

window.addEventListener('load', () => {
  document.addEventListener('click', (event) => {
    if (event.target.id === 'start-game-button') {
      renderGame();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.id === 'chat-text-input') {
      console.log(event.target);
      addChatMessageSelf();
    }
  });
  
  document.addEventListener('click', (event) => {
    if (event.target.id === 'chat-send-button') {
      addChatMessageOpponent();
    }
  });
});
