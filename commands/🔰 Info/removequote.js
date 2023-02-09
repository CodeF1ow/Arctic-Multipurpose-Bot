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
  name: "removequote",
  aliases: ["rquote", "removequotes"],
  category: "🔰 Info",
  description: "Elimina una cuota de un usuario/tú",
  usage: "removequote <@USER> <ID>",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      //"HELLO"
      var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if(member){
        args.shift();
      } else {
        member = message.member;
      }
      var { user } = member;
      if(user.id != message.author.id) {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR))  
        {
          return message.reply(":x: **Sólo los administradores pueden añadir cuotas a otros usuarios!**")
        }
      }
      client.afkDB.ensure(user.id, {
        quotes: [
          /*
          { by: "id", text: "", image: null, at: Date.now(), }
          */
        ]
      })
      let data = client.afkDB.get(user.id, "quotes")
      data = data.sort((a,b) => a.at - b?.at);
      let id = String(args[0]);
      if(!id || !isNaN(id))
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(":x: Comando incorrecto Utilización!")
          .setDescription(`\`${prefix}removequote ${user.id} <QuoteId (E.G: 0 ... First Quote)>\``)
        ]});
        
      if(Number(id) < 0 || Number(id) > data.length - 1 || !data[Number(id)] || !data[Number(id)].text){
        return message.reply(`:x: **ID de cotización inválido!**\n> Utilice uno entre \`0\` and \`${data.length - 1}\`\nPara ver todas las cuotas escriba: \`${prefix}quotes ${user.id}\``)
      }
      let embed = new MessageEmbed()
        .setColor(es.color)
        .setFooter(user.id, user.displayAvatarURL({dynamic: true}))
        .addField("**Cuota por:**", `<@${data[Number(id)].by}>`)
        .addField("**Cuota de:**", `\`\`\`${moment(data[Number(id)].at).format("DD/MM/YYYY HH:mm")}\`\`\``)
        .setTitle("**Texto de la Cuota:**")
        .setDescription(`${String(data[Number(id)].text).substring(0, 2000)}`)
      if(data[Number(id)].image){
        embed.setImage(data[Number(id)].image)
      }
      //remove the data
      data.splice(Number(id), 1);
      //set the new data
      client.afkDB.set(user.id, data, "quotes")
      //send information message
      return message.reply({embeds: [
        embed,
        new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(`🗑️ Eliminado lo mostrado anteriormente cuota de \`${user.tag}\``)
        .setDescription(`**${user.username}** ahora tiene **\`${data.length} Cuotas\`**!`)
      ]})
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

