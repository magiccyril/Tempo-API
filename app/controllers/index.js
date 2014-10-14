
/*
 * GET home page.
 */

exports.index = function (req, res) {
  res.render('index', { title: 'Tempo API' });
};

/*
 *  GET robots.txt
 */
exports.robotstxt = function (req, res) {
  res.type('text/plain')
  res.send("User-agent: *\nDisallow: /");
}