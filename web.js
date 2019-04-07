const express = require('express');
const bodyParser = require('body-parser');
const packageInfo = require('./package.json');
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});

var server = app.listen(process.env.PORT, "0.0.0.0", () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Web server started at http://%s:%s', host, port);
});
module.exports = (bot) => {
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/' + bot.token, (req, res) => res.render('pages/index'))
};