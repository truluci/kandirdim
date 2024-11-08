export default (_req, res) => {
  res.render('index/about', {
    page: 'index/about',
    title: 'bilgi',
    includes: {
      js: ['page'],
      css: ['header', 'page', 'general']
    }
  });
};
