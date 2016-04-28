var token = process.env.TOKEN;

var Bot = require('node-telegram-bot-api');
var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(/^\/s/, function (msg, match) {
  var name = match[1];
  bot.sendMessage(msg.chat.id, 'Hello, ' + name + '!').then(function () {
    // reply sent!
  });
});

module.exports = bot;
