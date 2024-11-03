import '/socket.io/socket.io.js';
import serverRequest from '../functions/serverRequest.js';

const socket = io();

socket.room_id = null;

socket.on('match', room_id => {
  console.log(room_id)

  socket.room_id = room_id;

  renderGameWrapper();
});
socket.on('message', message => {
  console.log(message);

  addChatMessageOpponent(message);
});
socket.on('time_up', () => {
  console.log('Time is up!');

  renderDecisionWrapper();
});

function setTimer() {
  const timerInterval = setInterval(() => {
    const timeString = document.querySelector('.body-wrapper-chat-text-input-wrapper-timer').innerText;

    if (timeString === '00:00')
      return clearInterval(timerInterval);

    const [minutes, seconds] = timeString.split(':').map(Number);

    const totalSeconds = minutes * 60 + seconds - 1;

    const newMinutes = Math.floor(totalSeconds / 60);
    const newSeconds = totalSeconds % 60;

    const formattedMinutes = String(newMinutes).padStart(2, '0');
    const formattedSeconds = String(newSeconds).padStart(2, '0');

    document.querySelector('.body-wrapper-chat-text-input-wrapper-timer').innerText = `${formattedMinutes}:${formattedSeconds}`;
  }, 1000);
};

function renderWaitingForGame() {
  const startButton = document.querySelector('.body-wrapper-content-button');

  document.querySelector('.body-wrapper-content-button-text').classList.add('display-none');
  document.querySelector('.body-wrapper-content-button-loading').classList.remove('display-none');

  startButton.disabled = true;

  socket.emit('match_request');
};
function renderGameWrapper() {
  const pregameWrapper = document.querySelector('.pregame-wrapper');
  const gameWrapper = document.querySelector('.game-wrapper');

  gameWrapper.classList.remove('display-none');
  pregameWrapper.classList.add('display-none');

  setTimer();
};
function renderDecisionWrapper() {
  const decisionWrapper = document.querySelector('.decision-wrapper');
  const chatInput = document.querySelector('.body-wrapper-chat-text-input-wrapper-input');

  decisionWrapper.classList.remove('display-none');

  chatInput.blur();
};
function renderWaitingForResult() {
  const decisionWrapperButtons = document.querySelector('.decision-wrapper-buttons');
  const decisionWrapperButtonLoading = document.querySelector('.decision-wrapper-buttons-loading');

  decisionWrapperButtons.classList.add('display-none');
  decisionWrapperButtonLoading.classList.remove('display-none');
};
function renderResultWrapper(result) {
  const gameWrapper = document.querySelector('.game-wrapper');
  const resultWrapper = document.querySelector('.result-wrapper');
  const resultText = resultWrapper.querySelector('.result-text');

  gameWrapper.classList.add('display-none');
  resultWrapper.classList.remove('display-none');

  let resultString = '';

  if (result.guess_success) {
    resultString = 'Tebrikler, doğru tahmin!';
  } else {
    resultString = 'Üzgünüm, yanlış tahmin!';
  };

  if (result.is_opponent_human) {
    if (result.opponent_guess_success) {
      resultString += ' Karşıdaki doğru tahmin!';
    } else {
      resultString += ' Karşıdaki yanlış tahmin!';
    };
  } else {
    resultString += ' Karşıdaki bir bot!';
  };

  resultString += ` Puanınız: ${result.points}`;

  resultText.innerText = resultString;
};

function createMessageBoxAndAddToChat(className, message) {
  const messageDiv = document.createElement('div');
  const chatBox = document.querySelector('.body-wrapper-chat-box');

  messageDiv.classList.add(className);
  messageDiv.innerText = message;

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
};
function addChatMessageSelf() {
  const chatInput = document.querySelector('#chat-text-input');

  if (!chatInput.value.trim()) return;

  createMessageBoxAndAddToChat('chat-message-self', chatInput.value);

  socket.emit('message', {
    room_id: socket.room_id,
    message: chatInput.value
  });

  chatInput.value = '';
};
function addChatMessageOpponent(message) {
  createMessageBoxAndAddToChat('chat-message-opponent', message);
};

window.addEventListener('load', () => {
  document.addEventListener('click', (event) => {
    if (event.target.closest('#start-game-button') && !event.target.closest('#start-game-button').disabled)
      renderWaitingForGame();

    if (event.target.closest('#chat-send-button'))
      addChatMessageSelf();

    if (event.target.closest('.decision-wrapper-button')) {
      const selectedButton = event.target.closest('.decision-wrapper-button');

      const messages = [];

      for (const message of document.querySelectorAll('.chat-message-self, .chat-message-opponent'))
        messages.push({
          user: message.classList.contains('chat-message-self') ? 'self' : 'opponent',
          message: message.innerText
        });
      
      renderWaitingForResult();
      serverRequest('/result', 'POST', {
        room_id: socket.room_id,
        messages: messages,
        guess: selectedButton.id.replace('decision-button-', '')
      }, (err, res) => {
        if (err)
          return console.error(err);

        renderResultWrapper(res);
      });
    };
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.closest('#chat-text-input'))
      addChatMessageSelf();
  });
});
