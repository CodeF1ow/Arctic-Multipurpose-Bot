const { ShuffleGuess } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var randomWords = require('random-words');

module.exports = {
    name: "shuffleguess",
    aliases: ["sg"],
    category: "🎮 Minijuegos",
    description: "Permite jugar a un Juego1",
    usage: "shuffleguess --> Juega el juego",
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
        const word = randomWords();

        await ShuffleGuess({
          message: message,
          embed: {
            title: 'Shuffle Guess',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          word: ['Milrato'],
          button: { cancel: 'Cancelar', reshuffle: 'Reshuffle' },
          startMessage:
            'He barajado una palabra que es **`{{word}}`**. Usted tiene **{{time}}** para encontrar la palabra correcta!',
          winMessage:
            'GG, Fue **{{word}}**! Ha dado la respuesta correcta en **{{time}}.**',
          loseMessage: 'Mejor suerte la próxima vez! La respuesta correcta era **{{answer}}**.',
          incorrectMessage: "No {{author}}! La palabra no es `{{answer}}`",
          othersMessage: 'Only <@{{author}}> puede utilizar los botones!',
          time: 60000,
        });
        
    }
  }