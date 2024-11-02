import { Server } from 'socket.io';
import Redis from 'ioredis';
import { v4 } from 'uuid';
import Game from '../models/game/Game.js';

export const CHAT_DURATION_IN_SECONDS = 2;
const RANDOM_QUEUE_NAME = 'randomQueue';

export default server => {
  const io = new Server(server);
  const redis = new Redis();

  io.on('connection', (socket) => {
    socket.on('match_request', () => {
      redis.lpush(RANDOM_QUEUE_NAME, socket.id)
        .then(() => redis.llen('randomQueue'))
        .then((randomQueueLength) => {
          if (randomQueueLength < 2) return [];

          return redis.lpop('randomQueue', 2);
        })
        .then(([user_1_socket_id, user_2_socket_id]) => {
          if (!user_1_socket_id || !user_2_socket_id) return;

          const room_id = v4();

          const user_1_socket = io.sockets.sockets.get(user_1_socket_id);
          const user_2_socket = io.sockets.sockets.get(user_2_socket_id);

          if (!user_1_socket && !user_2_socket)
            return;

          if (!user_1_socket || !user_2_socket)
            return redis.lpush(RANDOM_QUEUE_NAME, user_1_socket_id || user_2_socket_id);

          user_1_socket.join(room_id);
          user_2_socket.join(room_id);

          user_1_socket.emit('match', room_id);
          user_2_socket.emit('match', room_id);

          Game.createGame({
            room_id: room_id,
            user_ids: [user_1_socket_id, user_2_socket_id],
            is_finished: false,
            messages: [],
            created_at: new Date()
          }, (err, _game) => {
            if (err)
              return console.error(err);

            setTimeout(() => {
              io.to(room_id).emit('time_up');

              user_1_socket.leave(room_id);
              user_2_socket.leave(room_id);
            }, CHAT_DURATION_IN_SECONDS * 1000);
          });
        })
        .catch(console.error);
    });

    socket.on("message", data => {
      socket.to(data.room_id).emit("message", data.message);
    });
  });
};
