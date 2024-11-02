export default (_req, res) => {
    res.render('play/play', {
      page: 'play/play',
      name: 'Hey',
      title: 'kandirdim',
      includes: {
        js: ['socket.io', 'page'],
        css: ['header', 'play']
      }
    });
  };