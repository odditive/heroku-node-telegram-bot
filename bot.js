var token = '199175048:AAGB19TwOMC1z5kTBYatq0IibKyyRowQgAs';

var Bot = require('node-telegram-bot-api'),
var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook('https://my-web-root.com/' + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

bot.setWebHook('https://thawing-reaches-93361.herokuapp.com/' + bot.token);

console.log('bot server started...');

bot.onText(/^\/say_hello (.+)$/, function (msg, match) {
  var name = match[1];
  bot.sendMessage(msg.chat.id, 'Hello ' + name + '!').then(function () {
    // reply sent!
  });
});
