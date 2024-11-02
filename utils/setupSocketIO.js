import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';

const randomQueueName = 'randomQueue';

export default (server) => {
  const io = new Server(server);
  const redis = new Redis();

  io.on('connection', (socket) => {
    socket.on('match_request', () => {
      redis.lpush(randomQueueName, socket.id)
        .then(() => redis.llen('randomQueue'))
        .then((randomQueueLength) => {
          if (randomQueueLength < 2) return [];

          return redis.lpop('randomQueue', 2);
        })
        .then(([user_1_socket_id, user_2_socket_id]) => {
          if (!user_1_socket_id || !user_2_socket_id) return;

          const room_id = `${user_1_socket_id}-${user_2_socket_id}`;

          const user_1_socket = io.sockets.sockets.get(user_1_socket_id);
          const user_2_socket = io.sockets.sockets.get(user_2_socket_id);

          if (!user_1_socket && !user_2_socket) return;

          if (!user_1_socket || !user_2_socket)
            return redis.lpush(randomQueueName, user_1_socket_id || user_2_socket_id);

          user_1_socket.join(room_id);
          user_2_socket.join(room_id);

          user_1_socket.emit('match', room_id);
          user_2_socket.emit('match', room_id);
        })
        .catch(console.error);
    });

    socket.on("message", data => {
      socket.to(data.room_id).emit("message", data.message);
    });
  });
};
