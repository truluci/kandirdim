export default (_req, res) => {
    res.render('index/howto', {
      page: 'index/howto',
      title: 'nasıl oynanır?',
      includes: {
        js: ['page'],
        css: ['header', 'page', 'general']
      }
    });
  };
  