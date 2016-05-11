# heroku-node-telegram-bot
Starter pack for running telegram bot on the Heroku using Node.js

#Step-by-step

###Try bot locally

1. Create your own bot using Telegram's [BotFather](https://core.telegram.org/bots#3-how-do-i-create-a-bot) and grab your TOKEN.
2. Clone or download and unpack this repo.
3. Go to the app's folder using `cd ~/heroku-node-telegram-bot`
4. Run `npm install` (in some cases you will need to run this with sudo, you know, just the permissions).
5. Rename .env_example file into .env and set TOKEN to the value, you've got from the BotFather.
5. Run `npm run set_env` to set the environment variables from the .env file.
6. Run `npm start` and send smth to your bot.
7. After it says "hello" to you, open your first bottle of beer :beer:

Feel your awesomeness? :sunglasses:

###Deploy your bot to the heroku

1. Create the [Heroku account](https://heroku.com) and install the [Heroku Toolbelt](https://toolbelt.heroku.com/).
2. Login to your Heroku account using `heroku login`.
3. Go to the app's folder using `cd ~/heroku-node-telegram-bot`
4. Run `heroku create` to prepare the Heroku environment.
5. Run `heroku config:set TOKEN=SET HERE THE TOKEN YOU'VE GOT FROM THE BOTFATHER` and `heroku config:set HEROKU_URL=$(heroku info -s | grep web-url | cut -d= -f2)` to configure environment variables on the server.
6. Run `git add -A && git commit -m "Ready to run on heroku" && git push heroku master` to deploy your bot to the Heroku server.
7. Send smth to the bot to check out if it works ok.
8. Now you r twice awesome, open the second bottle of beer :beer:

###Going further

Now when you r a bit drunk, you may wish to add other functionality to your bot and here you can face some problems. The reason is that in development mode your bot works using [polling](https://en.wikipedia.org/wiki/Push_technology#Long_polling) and on the heroku server it uses the [webhook](https://core.telegram.org/bots/api#setwebhook), because heroku will shut down the web-server after a period of inactivity that will result in your polling loop to shut down too. Once webhook was enabled, telegram will return an error `{"ok":false,"error_code":409,"description":"Error: Conflict: another webhook is active"}` when you will try to use polling again, and it's actually ok.

To go back to development mode, you will need to run `npm run switch_to_dev`. This script will disable current webhook and start your local server. Don't be afraid - when you will finish with the changes you may simply push your bot to heroku using `git push heroku master`. It will set the webhook again.

###Possible OS issues

As i work on MacOS and sometimes on Ubuntu, you may face some problems with my npm scripts, so let's figure out how they work.

1. `npm run set_env` runs `export $(cat .env | xargs)` which actually set key-value pairs from the .env file to the environment.
2. `npm run switch_to_dev` runs `export $(cat .env | xargs) && wget --spider https://api.telegram.org/bot$TOKEN/setWebhook?url= --delete-after && node index.js` which is actually `npm run set_env` + API call which will reset webhook + `npm start`. If wget don't work (or is not installed) on your OS, you can simply open the `https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=` in your browser, but don't forget to replace YOUR_TOKEN with the token, you've got from the BotFather.

If your bot is not responding locally, in most cases, you will need to reset the environment variables running `npm run set_env`.

###Links and references

Actually, this repo is created because I've faced problems when I was trying to run the bot using [mvalipour's article](http://mvalipour.github.io/node.js/2015/12/06/telegram-bot-webhook-existing-express/) and [this PR](https://github.com/mvalipour/telegram-bot-webhook/pull/3) to his repo. Still, theese links will be very usefull for the beginners. 

The solution relies on the [node-telegram-bot-api wrapper](https://github.com/yagop/node-telegram-bot-api) by the @yagop, so you can find more info there.

Also check out [official API docs](https://core.telegram.org/bots/api) by Telegram team, it may be helpfull.

Good luck, BotCoder!

P.S. If you see that something is not working, please, open an [issue](https://github.com/volodymyrlut/heroku-node-telegram-bot/issues) or send me a PR if you've managed to make code better.

Created with great passion for bots.
In case of any bot development propositions, contact me [here](http://lut.rocks).
