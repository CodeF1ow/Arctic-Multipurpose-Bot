const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { swap_pages } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "showblacklist",
  category: "🔰 Info",
  aliases: ["blacklist", "blacklistedwords", "bwords"],
  cooldown: 2,
  usage: "showblacklist",
  description: "Muestra todas las palabras de la lista negra!",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let words = client.blacklist.get(message.guild.id, "words");
      if(!words || words.length <= 0) words = ["Todavía no se han añadido palabras a la lista negra!"]
      return swap_pages(client, message, `${words.map(word => `\`${word}\``.split("`").join("\`"))}`, `${message.guild.name} | ${client.la[ls].cmds.info.showblacklist.info}`)
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}

