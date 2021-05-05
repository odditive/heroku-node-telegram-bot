const token = process.env.TOKEN;
const https = require("https");
const date= require('date-and-time');
const kerala_ids=require('./kerala_dist_ids.json');
console.log(kerala_ids);
const Bot = require('node-telegram-bot-api');
let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
};

let todaysDate=new Date();
let tommorowsDate=date.addDays(todaysDate,1);
tommorowsDate=date.format(tommorowsDate,'DD-MM-YYYY');
console.log(todaysDate);
console.log(tommorowsDate);


bot.onText(/\/help/,(msg)=>{
   const chatID = msg.chat.id;
    let helpText="Type /slots <district_id> eg: /slots 115 to get the avliable slots for that disctrict. if District_ID is not entered the slots for defualt Kozhikode will be fetched."
    bot.sendMessage(chatID,helpText);

});

bot.onText(/\/slots/, (msg, match) => {

  const chatId = msg.chat.id;
  let addonText=match.input.split(' ')[1];
   console.log(addonText);

let district_id=305;

if(addonText===undefined) botMain()
else
{
 district_id=parseInt(addonText);
 if(!(Number.isNaN(addonText)) )
    botMain();
else {getIDfromDistrictName(addonText);
     botMain(district_id);
  }

}
//todo: replace with switch.


  function getIDfromDistrictName(dist_name){
     let formatedString = str => str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
     console.log(formatedString)
     let arr=kerala_ids.districts;

     for(let i=0;i<arr.length;i++)
     {
         if(arr[i].district_name==formatedString)
            { district_id=arr[i].district_id;
              console.log(district_id);
             break;
            }

     }




  };





function botErromsg(n){
    console.log("err")
    let sendText=n? 'include a valied district_id' : 'ultra_error'
    bot.sendMessage(chatId,sendText);
    return;
    }

function botMain(district_id){
  test(district_id,(err,val)=>{
      if(err) return console.log(err);

      console.log(val);

      let arr=val.sessions;
      let finalString='';
      if(val.sessions.length!=0){
      arr.forEach((item) => {
        finalString+=item.name+'-'+item.block_name+'-Ozhiv:'+item.available_capacity+'-'+item.fee_type;
        finalString+='\n'+'**'+'\n';
      });
    }
    else
      finalString='NO VACCANCIES';



     console.log(finalString);
    bot.sendMessage(chatId,finalString);

    });
   };


});



bot.on("polling_error", (err) => console.log(err));





const byPin="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=673612&date=05-05-2021";
const byDistrictID="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=305&date=05-05-2021";
const accessToken="1787534913:AAEaQ0nIdQ5t9YJs6uTtVFtyus7WpLSwoEI";

const goaAllDistrictSlots=function(id=305){
   let api="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+id+"&date="+tommorowsDate;
   return api;
}




function test(dist_id,callback){
https.get(goaAllDistrictSlots(dist_id),(response) => {

  console.log('statusCode:', response.statusCode);
  //console.log('headers:', res.headers);
   let data='';
  response.on('data', (chunk) => {
      data+=chunk;});
   let finalVal;
  response.on('end',() => {
     finalVal=JSON.parse(data);
    // console.log(finalVal);
     callback(null,finalVal);
  });

}).on('error', (e) => {
  console.error(e);
});

};


module.exports=bot;











// console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');
//
// bot.on('message', (msg) => {
//   const name = msg.from.first_name;
//   bot.sendMessage(msg.chat.id, 'another, ' + name + '!').then(() => {
//     // reply sent!
//   });
// });
//
// module.exports = bot;
