export default (_req, res) => {
  res.render('index/index', {
    page: 'index/index',
    name: 'Hey',
    title: 'Hello, World!',
    includes: {
      js: ['socket.io', 'page'],
      css: ['header', 'index']
    }
  });
};
