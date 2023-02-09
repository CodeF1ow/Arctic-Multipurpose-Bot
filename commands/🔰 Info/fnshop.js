const Discord = require("discord.js");
const Canvas = require("discord-canvas");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "fnshop",
  aliases: ["fortniteshop", "fshop"],
  category: "🔰 Info",
  description: "Muestra la tienda actual de Fortnite",
  usage: "fnshop",
  type: "games",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let themsg = await message.reply("🔋 Obtención de los datos de la tienda")
      const shop = new Canvas.FortniteShop();
      const image = await shop.setToken(process.env.fnbr || config.fnbr).setBackground("#23272A").toAttachment();
      let attachment = new Discord.MessageAttachment(image, "FortniteShop.png");
      themsg.edit({content: "Tienda Fortnite de hoy:", files: [attachment]}).catch(()=>{

      })
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
