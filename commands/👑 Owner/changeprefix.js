const { MessageEmbed } = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fs = require("fs")
module.exports = {
    name: `changeprefix`,
    category: `👑 Dueño`,
    type: "bot",
    description: `Le permite cambiar el prefijo del BOT GLOBALMENTE (A menos que un servidor tenga una configuración diferente)`,
    usage: `changeprefix <NEW PREFIX>`,
    memberpermissions: [`ADMINISTRATOR`],
    run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["changename"]["variable2"]) + `\n\nSi desea cambiar la configuración de **este servidor**, escriba el botón \`${prefix}prefix <newprefix>\` Command`)
        ]});
    try {
    //if no args return error
    if (!args[0])
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable1"]))
        .setDescription(`prefix global actual: \`${config.prefix}\``)
      ]});
    //if there are multiple arguments
    if (args[1])
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable3"]))
      ]});
    //if the prefix is too long
    if (args[0].length > 5)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable4"]))
      ]});
    let status = config;
    status.prefix = args[0];
    fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
      if (e) {
        console.log(e.stack ? String(e.stack).dim : String(e).dim);
        return message.channel.send({embeds: [new MessageEmbed()
          .setFooter(client.getFooter(es))
          .setColor(es.wrongcolor)
          .setTitle(`❌​ Algo salió mal`)
          .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
        ]})
      }
      return message.channel.send({embeds: [new MessageEmbed()
        .setFooter(client.getFooter(es))
        .setColor(es.color)
        .setTitle(`​✔️ Ha cambiado con éxito el prefix`)
        .setDescription(`**Para cambiarlo en este Servidor utilice el botón: \`${prefix}prefix <newprefix>\` Command!**`)
        ]})
    });
  } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable6"]))
      ]});
  }
  }
};

