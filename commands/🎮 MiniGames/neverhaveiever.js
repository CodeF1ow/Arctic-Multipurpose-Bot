const { NeverHaveIEver } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "neverhaveiever",
    category: "🎮 Minijuegos",
    description: "Plays a Game",
    aliases: ["neverever"],
    usage: "neverhaveiever --> Juega el juego",
    type: "buttons",
     run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        await NeverHaveIEver({
          message: message,
          embed: {
            title: 'Nunca he hecho nada',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          thinkMessage: 'Estoy pensando',
          othersMessage: 'Sólo <@{{author}}> puede utilizar los botones!',
          buttons: { optionA: 'Si', optionB: 'No' },
        });
        
    }
  }