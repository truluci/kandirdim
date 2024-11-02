import Game from '../../../models/game/Game';

export default (req, res) => {
  if (!req.body || typeof req.body != 'object')
    return res.json({ error: 'bad_request' });

  if (!req.body.room_id || typeof req.body.room_id != 'string' || req.body.room_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return res.json({ error: 'bad_request' });

  if (!req.body.messages || !Array.isArray(req.body.messages))
    return res.json({ error: 'bad_request' });

  for (const message of req.body.messages)
    if (!message || typeof message != 'object' || !message.user || typeof message.user != 'string' || message.user.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH || !message.message || typeof message.message != 'string' || message.message.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      return res.json({ error: 'bad_request' });

  // messagelardaki user'larin user_ids'de olup olmadigini kontrol et

  Game.endGameByRoomIdWithMessages(req.body.room_id, {
    messages: req.body.messages
  }, (err, _game) => {
    if (err)
      return res.json({ error: err });

    // burada random oyun sonucu gonder
    res.json({});
  });
};
