# heroku-node-telegram-bot
Starter pack for running telegram bot on the Heroku using Node.js

#Step-by-step

###Try bot locally

1. Create your own bot using Telegram's [BotFather](https://core.telegram.org/bots#3-how-do-i-create-a-bot) and grab your TOKEN.
2. Clone or download and unpack this repo.
3. Run `npm install` (in some cases you will need to run this with sudo, you know, just the permissions).
4. Rename .env_example file into .env and set TOKEN to the value, you've got from the BotFather.
5. Run `export $(cat .env | xargs)` to set environment variables from the .env file.
6. Run `npm start` and send smth to your bot.
6. After it says "hello" to you, open first bottle of beer :beer:

Feel your awesomness? :sunglasses:

###Deploy your bot to the heroku

###Switching between production/development modes.

Actually, in development mode bot works using [pooling](), 
