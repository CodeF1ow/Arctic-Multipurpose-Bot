const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  swap_pages
} = require(`${process.cwd()}/handlers/functions`)
const moment = require("moment");
module.exports = {
  name: "latestquotes",
  aliases: ["lastquotes", "latestquote", "lastquote"],
  category: "🔰 Info",
  description: "Muestra las últimas citas que se han guardado en este usuario/tú",
  usage: "latestquotes [@USER]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      //"HELLO"
      var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      var user = member ? member.user : message.author;
      if(user.id != message.author.id) {
        args.shift();
      }
      client.afkDB.ensure(user.id, {
        quotes: [
          /*
          { by: "id", text: "", image: null, at: Date.now(), }
          */
        ]
      })
      let data = client.afkDB.get(user.id, "quotes")
      if(args[0] && !isNaN(args[0])){
        if(Number(args[0]) < 0 || Number(args[0]) > data.length - 1 || !data[Number(args[0])] || !data[Number(args[0])].text){
          return message.reply(`:x: **ID de cotización inválido!**\n> Utilice uno entre \`0\` y \`${data.length - 1}\``)
        }
        let embed = new MessageEmbed()
          .setColor(es.color)
          .setFooter(user.id, user.displayAvatarURL({dynamic: true}))
          .addField("**Cuota de:**", `<@${data[Number(args[0])].by}>`)
          .addField("**Cuota en:**", `\`\`\`${moment(data[Number(args[0])].at).format("DD/MM/YYYY HH:mm")}\`\`\``)
          .setTitle("**Texto de cuota:**")
          .setDescription(`${String(data[Number(args[0])].text).substring(0, 2000)}`)
        if(data[Number(args[0])].image){
          embed.setImage(data[Number(args[0])].image)
        }
        return message.reply({embeds: [
          embed
        ]})
      }
      if(!data || data.length == 0) return message.reply({content: ":x: **Este usuario aún no tiene Cuotas en este servidor!**"})
      var datas = data.sort((a,b)=> b?.at - a.at).map((data, index) => 
        `\` ${index}. \` Por: <@${data.by}> | En: \`${moment(data.at).format("DD/MM/YYYY HH:mm")}\` \n> ${String(data.text).length > 80 ? String(data.text).substring(0, 75) + " ..." : String(data.text)}\n`
        );
      swap_pages(client, message, datas, `Últimas Cuotas de **\`${user.tag}\`** in **\`${message.guild.name}\`**\nPara más detalles, escriba:\n> \`${prefix}latestquotes ${user.id} [ID]\``);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["avatar"]["variable1"]))
      ]});
    }
  }
}

