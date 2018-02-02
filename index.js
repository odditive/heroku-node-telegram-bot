require("dotenv").config();

var bot = require('./bot');
require('./web')(bot);
