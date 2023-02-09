const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "toggledisabled",
  aliases: [ "toggleshowdisabled" ],
  category: "⚙️ Ajustes",
  description: "Alterna si el mensaje de ayuda del Bot debe mostrar los comandos deshabilitados o no [DEFAULT: true]",
  usage: "toggledisabled",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {

      client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "showdisabled"), `showdisabled`);
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(`​✔️ ${client.settings.get(message.guild.id, "showdisabled") ? "Habilitado": "Deshabilitado"} Disabled-Cmds Showing`)
        .setDescription(`${client.settings.get(message.guild.id, "showdisabled") ? "Ahora mostraré los comandos desactivados en el menú de ayuda" : "No mostraré los comandos desactivados en el menú de ayuda"}`.substring(0, 2048))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggleunknowncommandinfo"]["variable2"]))
       ]} );
    }
  }
};
