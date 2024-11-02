import mongoose from 'mongoose';

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 100;

const GameSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  user_ids: {
    type: [String],
    required: true,
    minlength: 2,
    maxlength: 2
  },
  is_finished: {
    type: Boolean,
    default: false,
    required: false
  },
  messages: {
    type: [{
      user: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

GameSchema.statics.createGame = function (data, callback) {
  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.room_id || typeof data.room_id != 'string' || data.room_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.user_ids || !Array.isArray(data.user_ids) || data.user_ids.length != 2)
    return callback('bad_request');

  for (const user_id of data.user_ids)
    if (!user_id || typeof user_id != 'string' || user_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      return callback('bad_request');

  if ('is_finished' in data && typeof data.is_finished != 'boolean')
    return callback('bad_request');

  if (!data.messages || !Array.isArray(data.messages))
    return callback('bad_request');

  for (const message of data.messages)
    if (!message || typeof message != 'object' || !message.user || typeof message.user != 'string' || message.user.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH || !message.message || typeof message.message != 'string' || message.message.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      return callback('bad_request');

  const newGame = new Game({
    room_id: data.room_id,
    user_ids: data.user_ids,
    is_finished: !!data.is_finished,
    messages: data.messages
  });

  newGame.save()
    .then(game => callback(null, game))
    .catch(err => {
      if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
        return callback('duplicated_unique_field');

      if (err)
        return callback('database_error');
    });
};

GameSchema.statics.endGameByRoomIdWithMessages = function (room_id, data, callback) {
  if (!room_id || typeof room_id != 'string' || room_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.messages || !Array.isArray(data.messages))
    return callback('bad_request');

  for (const message of data.messages)
    if (!message || typeof message != 'object' || !message.user || typeof message.user != 'string' || message.user.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH || !message.message || typeof message.message != 'string' || message.message.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      return callback('bad_request');

  Game.findOneAndUpdate({ room_id: room_id }, {
    is_finished: true,
    messages: data.messages
  }, {
    new: true
  })
    .then(game => {
      if (!game)
        return callback('document_not_found');

      return callback(null, game);
    })
    .catch(_err => callback('database_error'));
};

const Game = mongoose.model('Game', GameSchema);

export default Game;
