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
  name: "fnstats",
  aliases: ["fortnitestats", "fstats"],
  category: "🔰 Info",
  description: "Muestra las estadísticas de Fortnite de un usuario",
  usage: "fnstatns @USER | fnstats <platform> <Epic> | Las menciones de usuario sólo funcionarán si la verificación del usuario está configurada",
  type: "games",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let usermention = message.mentions.users.first();
      let Epic, platform;
      if(!usermention){
        if(!args[0] || !args[1]) {
          client.epicgamesDB.ensure(message.author.id, { 
            epic: "",
            user: message.author.id,
            guild: message.guild.id,
            Platform: "",
            InputMethod: "",
          });
          let data = client.epicgamesDB.get(message.author.id);
          if(!data.epic || data.epic.length < 5) return message.reply(`❌ **Su cuenta no está vinculada!**\nPor favor, introduzca un nombre de Epic Games para la búsqueda individual!\n>Uso: \`fnstats <platform> <Epic>\``)
          Epic = data.epic;
          platform = data.Platform;
        } else {
          Epic = args.slice(1).join(" ");
          if(!Epic) return message.reply("Por favor, introduce un nombre de Epic Games!\n>Uso: `fnstats <platform> <Epic>`")
          platform = String(args[0]).toLowerCase() || "PC".toLowerCase();
          if (platform !== "pc" && platform !== "xbl" && platform !== "psn") return message.channel.send("Por favor, introduzca una plataforma válida\n> Plataformas válidas: `xbl, psn, pc`\n> Uso: `fnstats <platform> <Epic>`")
        }
      } else {
        client.epicgamesDB.ensure(message.author.id, { 
          epic: "",
          user: message.author.id,
          guild: message.guild.id,
          Platform: "",
          InputMethod: "",
        });
        let data = client.epicgamesDB.get(message.author.id);
        if(!data.epic || data.epic.length < 5) return message.reply(`❌ **${message.author.tag}** no verificó/conectó su cuenta de Epic Games`)
        Epic = data.epic;
        platform = data.Platform;
      }
      try{
        if (platform !== "pc" && platform !== "xbl" && platform !== "psn") platform = "pc";
        let themsg = await message.reply(`🔋 Obtener las estadísticas de Fortnite de ${Epic}`)
        const stats = new Canvas.FortniteStats()
        const image = await stats.setToken(
          process.env.fortnitetracker || config.fortnitetracker)
          .setUser(Epic)
          .setPlatform(platform.toLowerCase())
          .toAttachment();
        if (!image) return message.channel.send("Usuario no encontrado / Epic Invalido")
        let attachment = new Discord.MessageAttachment(image.toBuffer(), "FortniteStats.png");
        themsg.edit({content: `Estadísticas de: \`${Epic}\` on \`${platform}\``, files: [attachment]});
      }catch (e){
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        message.channel.send("EPIC INVÁLIDO")
      }
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
