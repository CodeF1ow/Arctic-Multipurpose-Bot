const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  format,
  arrayMove
} = require(`${process.cwd()}/handlers/functions`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `moveme`,
  category: `🎶 Musica`,
  aliases: [`mm`, "mvm", "my", "mvy", "moveyou"],
  description: `Te mueve al BOT, si estás jugando algo`,
  usage: `move`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false,
    "notsamechannel": true
  },
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      let channel = message.member.voice.channel;
      let botchannel = message.guild.me.voice.channel;
      if (!botchannel)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable1"]))
        ]});
      if (!channel)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable2"]))
        ]});
      if (botchannel.userLimit >= botchannel.members.length)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable3"]))
        ]});
      if (botchannel.id == channel.id)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable4"]))
        ]});
      message.member.voice.setChannel(botchannel);
      message.react("👌").catch(e => {});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["moveme"]["variable5"]))
      ]});
    }
  }
};
