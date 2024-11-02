export default (_req, res) => {
  res.render('index/index', {
    page: 'index/index',
    name: 'Hey',
    title: 'kandirdim',
    includes: {
      js: ['socket.io', 'page'],
      css: ['header', 'page', 'general']
    }
  });
};
