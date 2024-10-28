import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import indexRouter from './routers/index.js';

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kandirdim';

await mongoose.connect(MONGODB_URI);

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());

app.use('/', indexRouter);

const server = app.listen(PORT);

console.log(`> http://localhost:${PORT}`);

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  // user id:
  console.log(socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
