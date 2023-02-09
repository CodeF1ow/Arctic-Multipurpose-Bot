const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "afk",
  category: "⚙️ Ajustes",
  aliases: ["awayfromkeyboard",],
  cooldown: 10,
  usage: "afk [TEXT]",
  description: "Ponerse en AFK",
  type: "user",
  run: async (client, message, args, user, text, prefix, player) => {
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      if(args[0]) client.afkDB.set(message.guild.id+user.id, args.join(" "), "message");
      client.afkDB.set(message.guild.id+user.id, Date.now(), "stamp");
      message.reply(`Ahora estás afk por: ${args.join(" ")}\n> **Tipp:** *Write \`[afk]\` frente a tu Mensaje para permanecer afk pero seguir escribiendo*`);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["afk"]["variable3"]))
      ]});
    }
  }
}

