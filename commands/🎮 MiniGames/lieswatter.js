const { LieSwatter } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
    name: "lieswatter",
    category: "🎮 Minijuegos",
    description: "Juega a un juego",
    usage: "lieswatter --> Juega el juego",
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
        const { LieSwatter } = require("weky")
        await LieSwatter({
          message: message,
          embed: {
            title: 'Matamentiras',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          thinkMessage: 'Estoy pensando',
          winMessage:
            'GG, Fue un **{{answer}}**. Lo has hecho bien en **{{time}}**.',
          loseMessage: 'Mejor suerte la próxima vez! Fue un **{{answer}}**.',
          othersMessage: 'Solo <@{{author}}> puede utilizar los botones!',
          buttons: { true: 'Truth', lie: 'Lie' },
        });
    }
  }