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
  name: "color",
  aliases: ["hexcolor"],
  category: "🔰 Info",
  description: "Obtener información sobre el color hexadecimal",
  usage: "color <HEX CODE> | Ejemplo: color #ee33ff",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    
		try {
      let userinfo = false;
      if(!args[0]){
        userinfo = true;
        args[0] = message.member.roles.highest.hexColor || "#000000";
      }
      const url = (`https://api.popcat.xyz/color/${args[0].includes("#") ? args[0].split("#")[1] : args[0] }`)
      let json;
      try {
        json = await fetch(url).then(res => res.json())
        console.log(json)
      } catch (e) {
        return message.reply({content: `${e.message ? e.message : e}`,
          codeBlock: "js"
        })
      }
      if (json.error) return message.reply({content: client.la[ls].cmds.info.color.invalid + `\n${json.error}`,
        codeBlock: "js"
      })
      const embed = new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["info"]["color"]["variable1"]))
        .addField('➡️​ **Name**', "```"+json.name+"```", true)
        .addField("➡️​ **Hex**",  "```"+json.hex+"```", true)
        .addField("➡️​ **RGB**",  "```"+json.rgb+"```", true)
        .addField(`➡️​ **${client.la[ls].cmds.info.color.brightershade}**`,  "```"+json.brightened +"```", true)
        .setThumbnail(json.color_image)
        .setColor(json.hex)
      if(userinfo) embed.addField("Color ==  su rol más importante!", `> Uso: \`${prefix}color ${args[0]}\``);
      message.reply({
        embeds: [embed]
      })
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

