const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "shit",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGEN CMD",
  usage: "shit <TEXT>",
  type: "text",
  options: [
    { "String": { name: "text", description: "Qué debo enviar?? [ +n+ = Newline ]", required: true } }, //to use in the code: interacton.getString("title")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {

    if (GuildSettings.FUN === false) {
      return interaction?.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.disabled.title)
          .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, { prefix: prefix }))
        ], ephemeral: true
      });
    }
    await interaction?.deferReply({ephemeral: false});
    //get the additional text
    const text = interaction?.options.getString("text"); //same as in StringChoices //RETURNS STRING 
    //If no text added, return error
    if (!text) return interaction?.editReply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["fun"]["shit"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["shit"]["variable3"]))
      ]
    }).catch(() => null)

    //get the memer image
    client.memer.shit(text).then(image => {
      //make an attachment
      var attachment = new MessageAttachment(image, "shit.png");
      //send new Message
      interaction?.editReply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setAuthor(`Meme por: ${message.author.tag}`, message.author.displayAvatarURL())
          .setImage("attachment://shit.png")
        ], files: [attachment], ephemeral: true
      }).catch(() => null)
    })

  }
}
