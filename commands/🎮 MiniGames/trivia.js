const { Trivia } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
    name: "trivia",
    category: "🎮 Minijuegos",
    description: "Permite reproducir un Game1",
    usage: "trivia --> Juega el juego",
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
        await Trivia({
          message: message,
          embed: {
            title: 'Trivia',
            description: 'Sólo tienes **{{time}}** para adivinar la respuesta!',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          difficulty: 'medium',
          thinkMessage: 'Estoy pensando',
          winMessage:
            'GG, Fue **{{answer}}**. Ha dado la respuesta correcta en **{{time}}**.',
          loseMessage: 'Mejor suerte la próxima vez! La respuesta correcta era **{{answer}}**.',
          emojis: {
            one: '1️⃣',
            two: '2️⃣',
            three: '3️⃣',
            four: '4️⃣',
          },
          othersMessage: 'Sólo <@{{author}}> puede utilizar los botones!',
          returnWinner: false,
        });
        
         
    }
  }