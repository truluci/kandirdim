import Game from '../../../models/game/Game.js';

const GUESSES = [ 'human', 'robot' ];
const WAIT_DURATION_MIN = 2000;
const WAIT_DURATION_MAX = 5000;

export default (req, res) => {
  if (!req.body || typeof req.body != 'object')
    return res.json({ err: 'bad_request' });

  if (!req.body.room_id || typeof req.body.room_id != 'string')
    return res.json({ err: 'bad_request' });

  if (!req.body.messages || !Array.isArray(req.body.messages))
    return res.json({ err: 'bad_request' });

  for (const message of req.body.messages)
    if (!message || typeof message != 'object' || !message.user || typeof message.user != 'string' || !message.message || typeof message.message != 'string')
      return res.json({ err: 'bad_request' });

  if (!req.body.guess || typeof req.body.guess != 'string' || !GUESSES.includes(req.body.guess))
    return res.json({ err: 'bad_request' });

  Game.endGameByRoomIdWithMessages(req.body.room_id, {
    messages: req.body.messages
  }, (err, _game) => {
    if (err)
      return res.json({ err: err });

    const randomResult = GUESSES[Math.floor(Math.random() * GUESSES.length)];

    new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (WAIT_DURATION_MAX - WAIT_DURATION_MIN)) + WAIT_DURATION_MIN))
      .then(() => {
        if (randomResult == 'human') {
          const randomOpponentGuessSuccess = Math.random() < 0.5;

          if (req.body.guess == 'human') {
            return res.json({ data: {
              guess_success: true,
              is_opponent_human: true,
              opponent_guess_success: randomOpponentGuessSuccess,
              points: randomOpponentGuessSuccess ? 1 : 2
            }});
          } else {
            return res.json({ data: {
              guess_success: false,
              is_opponent_human: true,
              opponent_guess_success: randomOpponentGuessSuccess,
              points: randomOpponentGuessSuccess ? 0 : 1
            }});
          };
        } else if (randomResult == 'robot') {
          if (req.body.guess == 'robot') {
            return res.json({ data: {
              guess_success: true,
              is_opponent_human: false,
              points: 1
            }});
          } else {
            return res.json({ data: {
              guess_success: false,
              is_opponent_human: false,
              points: 0
            }});
          };
        } else {
          return res.json({ err: 'bad_request' });
        };
      });
  });
};
