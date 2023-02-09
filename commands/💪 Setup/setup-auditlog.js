var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-auditlog",
  category: "💪 Configurar",
  aliases: ["setupauditlog", "auditlog-setup", "auditlogsetup"],
  cooldown: 5,
  usage: "setup-auditlog  --> Sigue los pasos",
  description: "Activar un Logger que registre todas las acciones de su Servidor que puedan ser críticas!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      message.reply(`Redirigir a: \`setup-logger\` ...`).then((msg)=>{
        setTimeout(()=>{msg.delete().catch(() => {})}, 3000)
      }).catch(() => {})
      require("./setup-logger").run(client, message, args, cmduser, text, prefix);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable13"]))]
      });
    }
  },
};

