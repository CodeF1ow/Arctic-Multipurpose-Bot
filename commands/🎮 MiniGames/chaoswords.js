const { ChaosWords } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
    name: "chaoswords",
    category: "🎮 Minijuegos",
    description: "Juega a un juego",
    usage: "chaoswords [wordcount] --> Play the Game",
    type: "buttons",
    run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        //executes if fun commands are disabled
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        var randomWords = require('random-words');
        const words = randomWords(args[0] && !isNaN(args[0]) && Number(args[0]) > 0 ? Number(args[0]) : 3) // generating 3 words
        await ChaosWords({
          message: message,
          embed: {
              title: 'ChaosWords',
              footer: es.footertext,
              description: 'Usted tiene **{{time}}** para encontrar las palabras ocultas en la siguiente frase.',
              color: es.color,
              field1: 'Sentencia:',
              field2: 'Palabras encontradas/palabras restantes:',
              field3: 'Palabras encontradas:',
              field4: 'Palabras:',
              timestamp: true
          },
          winMessage: 'GG, has ganado! Lo hiciste en **{{time}}**.',
          loseMessage: 'Mejor suerte la próxima vez!',
          wrongWordMessage: 'Adivina mal! Usted tiene **{{remaining_tries}}** trata de la izquierda.',
          correctWordMessage: 'GG, **{{word}}** era correcto. Tienes que encontrar **{{remaining}}** más palabras.',
          time: 60000,
          words: words,
          charGenerated: 17,
          maxTries: 10,
          buttonText: 'Cancel',
          othersMessage: 'Sólo <@{{author}}> puede utilizar los botones!'
      });
    }
  }