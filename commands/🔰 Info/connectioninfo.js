const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser, handlemsg
} = require(`${process.cwd()}/handlers/functions`)
const fetch = require("node-fetch")
module.exports = {
  name: "connectioninfo",
  aliases: ["coinfo"],
  category: "🔰 Info",
  description: "Obtenga información de su conexión",
  usage: "connectioninfo",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    
		try {
      var user;
      if(args[0]){
        try {
          if(args[1] && args[1].toLowerCase() == "global"){
            args.pop()
            user = await GetGlobalUser(message, args)
          } else {
            user = await GetUser(message, args)
          }
        } catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          return message.reply(client.la[ls].common.usernotfound)
        }
      } else{
        user = message.author;
      }
      let member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id).catch(() => {}) || false;
      
      if(!member) return message.reply(":x: **Este usuario no es miembro de este servidor!**")
      if(!member.voice || !member.voice.channel) return message.reply(":x: **Este usuario no está conectado a un canal de voz!**")
      

      const embed = new Discord.MessageEmbed()
        .setTitle(`Información de conexión de: \`${user.tag}\``)
        .addField('➡️​ **Canal**', `> **${member.voice.channel.name}** ${member.voice.channel}`, true)
        .addField('➡️​ **Canal-ID**', `> \`${member.voice.channel.id}\``, true)
        .addField('➡️​ **Los miembros de allí**', `> \`${member.voice.channel.members.size} total Members\``, true)
        .addField('➡️​ **Canal completo?**', `> ${member.voice.channel.full ? "✅" : "❌"}`, true)
        .addField('➡️​ **Bitrate**', `> ${member.voice.channel.bitrate}`, true)
        .addField('➡️​ **Límite de entradas de usuarios**', `> \`${member.voice.channel.userLimit != 0 ? member.voice.channel.userLimit : "Sin límite!"}\``, true)
      
      message.reply({
        embeds: [embed]
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

