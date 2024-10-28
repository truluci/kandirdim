import '/socket.io/socket.io.js';

const socket = io();

socket.on('connect', () => {
  console.log('connected');
});

socket.on('disconnect', () => {
  console.log('disconnected');
});
