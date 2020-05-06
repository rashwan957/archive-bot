const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('misc/config.json'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildCreate', guild => {
  guild.channels.create("archive-bot-category", {type: "category"}).then( cat => {
    guild.channels.create("logs-ban", {parent: cat, topic: "banList, by who, reason",
      reason: "needed a new channel",position: 1});
    guild.channels.create("logs-warn", {parent: cat, topic: "warnList, by who, reason",
      reason: "needed a new channel", position: 2});
    //guild.channels.create("logs-warn", {parent: cat, topic: "warnList, by who, reason",
    //reason: "needed a new channel"});
  })
});

client.on('message', msg => {
  if (msg.content.startsWith(config.prefix)) {
    const msgNoPrefix = msg.content.substr(2,msg.content.length);
    const cmd = msgNoPrefix.split(" ");

    switch (cmd[0]) {
      case "ping":
        msg.channel.send("Pong! `" + (Date.now() - msg.createdTimestamp) + " ms`");
        break;
      // le kick ban
      case "kick":
      case "ban":
        cmd.forEach((element, i, array) => {
          if (element.startsWith('-')) {
              const action = element.split('')[1];
              switch (action) {
                  case 'r':
                      let str = '';
                      let j = i + 1;
                      while ((array.length >  j ) && !array[j].startsWith('-')) {
                          str += array[j] + " ";
                          j++;
                      }
                      msg.mentions.users.forEach(usr => {
                        if (cmd[0] == "ban"){
                          msg.guild.member(usr).ban({ reason: str });
                        } else {
                          msg.guild.member(usr).kick({ reason: str });
                        }
                      });
                      break;
                  default:
                      msg.reply("error.");
                      break;
                }
          }
        });
        break;
      // le rename
      case "rename":
        let phraseRename = "";
        let isMention = 2;
        if (msg.mentions.user.size == 0){
          isMention = 1;
        }
        for (isMention; i < cmd.length; i++)
          phraseRename += cmd[i] + " ";
        if (msg.mentions.users.size == 1 ){
          msg.guild.member(msg.mentions.users.first()).setNickname(isMention);
        } else if (msg.mentions.users.size == 0 ) {
          msg.guild.member(msg.author).setNickname(isMention);
        } else {
          msg.channel.send("Syntax Error, use this : `a!rename [@user] <newName>`");
        }
        break;
      // dedicace kouine pour cette commande
      case "cbt":
        const msgCBT = "cock and ball torture for you ";
        if(msg.mentions.users.size != 1){
          msg.channel.send("Syntax Error, use this : `a!cbt [@user]`");
        } else {
          msg.channel.send(msgCBT + '<@'+msg.mentions.users.first()+'>' );
        }
        break;
      default:
        msg.reply("Syntax Error, use is : `a!<command> [args] [...]`");
    }
}
});

client.login(config.token);
