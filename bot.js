const Discord = require("discord.js");
var request = require('request');
const client = new Discord.Client();
var http = require('http');
var fs = require('fs');

var BOT_TOKEN = process.env.BOT_TOKEN;

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
        var soundDir = `./sounds/${message.content.replace('h@', '')}`;
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            fs.stat(soundDir, function (err, stat) {
                if (err == null) {
                    var soundFiles = fs.readdirSync(soundDir);
                    var soundFile = soundDir + "/" + soundFiles[Math.floor(Math.random() * soundFiles.length)];
                    message.member.voiceChannel.join()
                        .then(connection => { // Connection is an instance of VoiceConnection
                            let stream = fs.createReadStream(soundFile);
                            //let dispatcher = connection.playFile(__rname + "/" + soundFile);
                            let dispatcher = connection.playStream(stream);
                            dispatcher.on('end', () => {
                                message.member.voiceChannel.leave();
                            }, 3000);
                        }).catch((err) => {
                            console.log(err);
                        });
                } else if (err.code == 'ENOENT') {
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
        console.log(sounds);
        var msg = "```" + sounds.join(' \n') + "```";
        message.reply(msg);
    }
});

client.on('disconnect', () => {
    client.login(BOT_TOKEN);
});


http.createServer(function (request, response) {
    response.writeHead(200);
    response.end("Hello World!", 'utf-8');
}).listen(process.env.PORT || 5000);

client.login(BOT_TOKEN);

setInterval(() => {
    request.get('https://hibike.herokuapp.com/').then(
        (err, res, body) => {
            console.log(body);
        }
    )
}, 60000);