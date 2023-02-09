const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require('moment');
const { GetUser, GetGlobalUser, handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "serverbanner",
  aliases: ["sbanner"],
  category: "🔰 Info",
  description: "Obtener el estandarte del servidor",
  usage: "serverbanner",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {   
      if(message.guild.banner) {
        let embed = new Discord.MessageEmbed()
          .setTitle(`**➡️​ BANNER DEL SERVIDOR:**`)
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setDescription(`[Enlace de descarga](${message.guild.bannerURL({size: 1024})})${message.guild.discoverySplash ? ` | [Enlace de la imagen del descubrimiento](${message.guild.discoverySplashURL({size: 4096})})`: ""}\n> Esta es la imagen que se muestra en la esquina superior izquierda de este servidor, donde se ven los canales!`)
          .setImage(message.guild.bannerURL({size: 4096}))
        message.reply({embeds: [embed]})
      } else {
        let embed = new Discord.MessageEmbed()
          .setTitle(`❌​ **Este servidor no tiene Banner!**`)
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        message.reply({embeds: [embed]})
      }
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

