const {
  MessageEmbed, MessageActionRow
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { MessageButton } = require('discord.js')
module.exports = {
  name: "support",
  category: "🔰 Info",
  usage: "invite",
  description: "Le envía el enlace del servidor de soporte",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let button_support_dc = new MessageButton().setStyle('LINK').setLabel('Servidor de soporte').setURL("https://arcticbot.xyz/discord")
      let button_invite = new MessageButton().setStyle('LINK').setLabel('Invitar a este Bot').setURL(`https://discord.com/api/oauth2/authorize?client_id=1015480877658157136&permissions=8&scope=applications.commands%20bot`)
      //array of all buttons
      const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc, button_invite])]
      message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setTitle(client.la[ls].cmds.info.support.title)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["support"]["variable1"]))
          .setFooter('Arctic Bot | by Kiri86', 'https://i.imgur.com/TVpkHP3.png')
          .setURL("https://discord.com/api/oauth2/authorize?client_id=1015480877658157136&permissions=8&scope=applications.commands%20bot")],
        components: allbuttons
      });
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
