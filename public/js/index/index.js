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
