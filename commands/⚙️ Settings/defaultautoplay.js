const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "defaultautoplay",
  category: "⚙️ Ajustes",
  aliases: ["default-autoplay", "defaultap", "default-ap"],
  cooldown: 10,
  usage: "defaultautoplay",
  description: "Activa o desactiva la reproducción automática por defecto! [Default: true]",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      client.settings.ensure(message.guild.id, {
        defaultap: true,
      });
      
      client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "defaultap"), "defaultap");
      
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["defaultautoplay"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["defaultautoplay"]["variable2"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["defaultautoplay"]["variable3"]))
      ]});
    }
  }
}

