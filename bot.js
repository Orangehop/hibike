const Discord = require("discord.js");
var request = require('request');
const client = new Discord.Client();
var fs = require('fs');

var BOT_TOKEN = process.env.BOT_TOKEN;
var STREAMABLE_USER = process.env.STREAMABLE_USER;
var STREAMABLE_PASSWORD = process.env.STREAMABLE_PASSWORD;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

client.on('message', message => {
    if (message.content.indexOf('h@') != -1) {
        var soundFile = `./sounds/${message.content.replace('h@', '')}.mp4`
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            fs.stat(soundFile, function(err, stat) {
                if(err == null) {
                    message.member.voiceChannel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection
                        var stream = fs.createReadStream(soundFile);
                        var dispatcher = connection.playStream(stream);
                        dispatcher.on('end', () => {
                            message.member.voiceChannel.leave();
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                } else if(err.code == 'ENOENT') {
                    message.reply('That sound doesn\'t exist!');
                } else {
                    message.reply('Something weird happened...');
                }
            });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    if (message.content === 'h!sounds') {
        var sounds = fs.readdirSync('./sounds');
        var msg = "```" + sounds.join('\n') + "```";
        message.reply(msg);
    }
});

client.login(BOT_TOKEN);