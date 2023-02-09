const {
  MessageEmbed,
  MessageButton,
  MessageActionRow
} = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `stop`,
  category: `🎶 Musica`,
  aliases: [`leave`, "dis", "disconnect", "votestop", "voteleave", "votedis", "votedisconnect", "vstop", "vleave", "vdis", "vdisconnect"],
  description: `Detiene la pista actual y abandona el canal`,
  usage: `stop`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //if there is no current track error
      if (!player) {
        if (message.guild.me.voice.channel) {
          message.guild.me.voice.disconnect()
          return message.reply({embeds : [new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["music"]["stop"]["variable1"]))
            .setColor(es.color)

          ]});
        } else {
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["music"]["stop"]["variable2"]))
          ]});
        }
        return
      }

      if (player.queue && !player.queue.current) {
        if (message.guild.me.voice.channel) {
          try {
            message.guild.me.voice.disconnect();
          } catch {}
          try {
            player.destroy();
          } catch {}
          return message.react("⏹️").catch((e) => {})
        } else {
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["music"]["stop"]["variable3"]))
          ]});
        }
        return
      }
      //stop playing
      try {
        player.destroy();
      } catch {}
      //React with the emoji
      return message.react(emoji?.react.stop).catch((e) => {})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["stop"]["variable4"]))
      ]});
    }
  }
};

