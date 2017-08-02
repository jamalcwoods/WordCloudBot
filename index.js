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
var inv = "https://discordapp.com/oauth2/authorize?client_id=263490610328109056&scope=bot&permissions=3072"


client.on('ready', () => {
  var connectedChannels = client.channels.array();
  for (var i = connectedChannels.length - 1; i >= 0; i--) {
    if(connectedChannels[i].type == 'text'){
    var obj = {
      'channel':connectedChannels[i],
      'words':[],
      'ratings':[]
    };
    channelList.push(obj);
  }
  };
});

client.on('guildCreate', guild => {
	console.log("Joined " + guild.name)
	finalMessage = "```"
	finalMessage += "Thank your for adding Word Cloud Bot to your server! \n"
	finalMessage += "This bot is made to create word clouds based on words said in specific channels\n"
	finalMessage += "Type cl! help to view all of the commands \n"
	finalMessage += "```"
	guild.defaultChannel.sendMessage(finalMessage)
	for (var i = guild.channels.array().length - 1; i >= 0; i--) {
		if(guild.channels.array().type == 'text'){
		    var obj = {
		      'channel':guild.channels.array(),
		      'words':[],
		      'ratings':[]
		    };
		    channelList.push(obj);
		  }
	}
});

client.on('message', message => { 
      var input = message.content.split(" ");
    if(input[0] == 'cl!'){
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
                channelList[i].ratings = []
              }
            }
            message.channel.sendMessage("The cloud has been cleared!")
          } else if(input[1] == 'invite'){
          	message.channel.sendMessage("My invite link!: <" + inv + ">")
          } else if(input[1] == 'help'){
          	var finalMessage = ""
          	finalMessage = "```"
			finalMessage += "To get an invite link for this bot -> cl! invite \n"
			finalMessage += "To summon a word cloud -> cl!\n"
			finalMessage += "To clear words in a channel's word cloud -> cl! clear\n"
			finalMessage += "To report an error -> cl! report (text here) \n"
			finalMessage += "```"
			message.channel.sendMessage(finalMessage)
	       } else if (input[1] == "report"){
				if(input.length >= 3){
					var finalMessage = message.author.username + ": " + message.content.split("cl! report")[1]
					var	messageReply = "```"
					messageReply += "Thank you for reporting a problem you found, The Word Cloud Bot team apologizes for any inconvenience you have experienced! \n"
					messageReply += "```"
					message.channel.sendMessage(messageReply)
					bot.fetchUser('163809334852190208').then(user => 
						user.createDM().then(dm => {
								dm.sendMessage(finalMessage)
							}
						)
					)
				}
			}
        }
      }
    }
    else if(!message.author.bot){
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
    var imageID = String(channel.id);
    var out = fs.createWriteStream(imageID + '.jpg')
    var canvas = new Canvas(400, 400)
    var stream = canvas.pngStream();
    var ctx = canvas.getContext('2d');
    for (var i = words.length - 1; i >= 0; i--) {
    ctx.fillStyle = getRandomColor();
    ctx.font = ratings[i]/numofWords * 72 + 'px Impact';
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



 
