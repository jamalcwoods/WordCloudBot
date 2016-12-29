function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeid()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

var Canvas = require("canvas");
var fs = require('fs')   
const Discord = require("discord.js");
const client = new Discord.Client();
var channelList = []


client.on('ready', () => {
  var connectedChannels = client.channels.array();
  for (var i = connectedChannels.length - 1; i >= 0; i--) {
    if(connectedChannels[i].type == 'text'){
    console.log("Cloud bot is now running on " + connectedChannels[i].name)
    var obj = {
      'channel':connectedChannels[i],
      'words':[],
      'ratings':[]
    };
    channelList.push(obj);
  }
  };
});

client.on('message', message => { 
      var input = message.content.split(" ");
    if(input[0] == '!wordcloud'){
      if(input.length == 1){
        for (var i = channelList.length - 1; i >= 0; i--) {
          if(channelList[i].channel == message.channel){
            makeImage(channelList[i].words,channelList[i].ratings,message.channel);
          }
      }
      } else {
        if(input.length == 2){
          if(input[1] == 'clear'){
            for (var i = channelList.length - 1; i >= 0; i--) {
              if(channelList[i].channel == message.channel){
                channelList[i].words = []
                channelList[i].rating = []
              }
            }
            message.channel.sendMessage("The cloud has been cleared!")
          }
        }
      }
    }
    else if(message.author.username != client.user.username){
      var arrMessage = message.content.split(" ");
      for (var i = channelList.length - 1; i >= 0; i--) {
        if(channelList[i].channel == message.channel){
          for (var x = arrMessage.length - 1; x >= 0; x--) {
            if(channelList[i].words.indexOf(arrMessage[x]) == -1){
              channelList[i].words.push(arrMessage[x]);
              channelList[i].ratings.push(1);
            } else {
              var z = channelList[i].words.indexOf(arrMessage[x])
              channelList[i].ratings[z] += 1;
            }
         };
        }
      };
    }
});

client.login('MjYzNDkwNjEwMzI4MTA5MDU2.C0SyQw.691xyCxhZul1hmZXwUDwZwFT5rs');

function makeImage(words,ratings,channel){
    var numofWords = 0;
    for (var i = ratings.length - 1; i >= 0; i--) {
      if(ratings[i] > numofWords){
        numofWords = ratings[i]
      }
    };
    var imageID = makeid();
    var out = fs.createWriteStream(imageID + '.jpg')
    var canvas = new Canvas(4000, 4000)
    var stream = canvas.pngStream();
    var ctx = canvas.getContext('2d');
    for (var i = words.length - 1; i >= 0; i--) {
    ctx.fillStyle = getRandomColor();
    ctx.font = ratings[i]/numofWords * 720 + 'px Impact';
    ctx.fillText(words[i],Math.floor(Math.random() * canvas.width/2) + canvas.width/6,Math.floor(Math.random() * canvas.height/2) + canvas.height/3);
    };

    stream.on('data', function(chunk){
      out.write(chunk);
    });
     
    stream.on('end', function(){
      out.end(function(){
        channel.sendFile(imageID + '.jpg',"file.jpg ","Here is the most recent word cloud: ");
      })
    });
}



 