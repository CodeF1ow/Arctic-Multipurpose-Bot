const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const fetch = require("node-fetch");
module.exports = {
  name: "chat",
  category: "🕹️ Diversion",
  aliases: ["ai", "aichat", "ai-chat"],
  cooldown: 2,
  usage: "chat <TEXT>",
  description: "Te permite chatear con el Bot a través de cmd",
  type: "text",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "FUN")) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      if (!args[0])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["fun"]["chat"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["fun"]["chat"]["variable2"]))
        ]});
      if (message.content)
        message.content = args.join(" ")
      if (message.attachments.size > 0)
        return message.reply({content : "Mira esto también...", files : "https://cdn.discordapp.com/attachments/816645188461264896/826736269509525524/I_CANNOT_READ_FILES.png"})
      fetch(`http://api.brainshop.ai/get?bid=153861&key=0ZjvbPWKAxJvcJ96&uid=1&msg=${encodeURIComponent(message)}`).
      then(res => res.json())
        .then(data => {
          message.reply({content : data.cnt}).catch(e => console.log("ERROR | " + e.stack));
        })
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["chat"]["variable3"]))
      ]});
    }
  }
}

