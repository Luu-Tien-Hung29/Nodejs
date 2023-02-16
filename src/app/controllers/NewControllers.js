class NewCotroller {
  // [get]/news
  index(req, res) {
    res.render('news');
  }
  // [get]/news/:slug
  show(req, res) {
    res.send('send news Detail !!');
  }
}

module.exports = new NewCotroller();
