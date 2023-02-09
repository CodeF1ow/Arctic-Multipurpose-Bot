const math = require('math-expression-evaluator');
const ms = require("ms");
const moment = require("moment")
const {
  MessageEmbed,
  MessageAttachment
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { MessageButton, MessageActionRow } = require('discord.js')
const { Calculator } = require('weky');
module.exports = {
  name: "calculator",
  aliases: ["ti82", "taschenrechner"],
  category: "🏫 Comandos Escolares",
  description: "Permite utilizar una calculadora",
  usage: "calc",
  type: "math",
   run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if(!client.settings.get(message.guild.id, "SCHOOL")){
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    await Calculator({
			message: message,
			embed: {
				title: 'Calculator',
				color: es.color,
        footer: es.footertext,
				timestamp: false,
			},
			disabledQuery: 'La calculadora se deshabilitó!',
			invalidQuery: 'La ecuación proporcionada no es válida!',
			othersMessage: 'Sólo <@{{author}}> puede utilizar los botones!',
		});
  }
};