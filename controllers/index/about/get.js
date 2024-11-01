export default (_req, res) => {
  res.render('index/about', {
    page: 'index/about',
    title: 'about',
    includes: {
      js: ['page'],
      css: ['header', 'about']
    }
  });
};