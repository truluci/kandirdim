import { CHAT_DURATION_IN_SECONDS } from '../../../utils/setupSocketIO.js';
import { secondsToMMSS } from '../../../utils/secondsToMMSS.js';

export default (_req, res) => {
  res.render('index/index', {
    page: 'index/index',
    name: 'Hey',
    title: 'kandirdim',
    includes: {
      js: ['page'],
      css: ['header', 'page', 'general', 'loading']
    },
    chat_duration_in_seconds: secondsToMMSS(CHAT_DURATION_IN_SECONDS)
  });
};
