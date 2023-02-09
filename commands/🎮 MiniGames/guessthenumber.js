const { GuessTheNumber } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "guessthenumber",
    category: "🎮 Minijuegos",
    description: "Juega a un juego",
    aliases: ["guessnumber"],
    usage: "guessthenumber --> Juega el juego",
    type: "text",
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
        await GuessTheNumber({
          message: message,
          embed: {
            footer: es.footertext,
            title: 'Adivina el número',
            description: 'Usted tiene **{{time}}** para adivinar el número. (1-100)',
            color: es.color,
            timestamp: true,
          },
          publicGame: true,
          number: Math.floor(Math.random() * 100) + 1,
          time: 60000,
          winMessage: {
            publicGame:
              'GG, El número que adiviné fue **{{number}}**. <@{{winner}}> lo hizo en **{{time}}**.\n\n__**Estadísticas del juego:**__\n**Duración**: {{time}}\n**Número de participantes**: {{totalparticipants}} Participantes\n**Participantes**: {{participants}}',
            privateGame:
              'GG, El número que adiviné fue **{{number}}**. Usted lo hizo en **{{time}}**.',
          },
          loseMessage:
            'Mejor suerte la próxima vez! El número que adiviné fue **{{number}}**.',
          bigNumberMessage: 'No {{author}}! Mi número es mayor que **{{number}}**.',
          smallNumberMessage:
            'No {{author}}! Mi número es menor que **{{number}}**.',
          othersMessage: 'Only <@{{author}}> can use the buttons!',
          buttonText: 'Cancelar',
          ongoingMessage:
            "Un juego ya está en marcha en <#{{channel}}>. No puedes empezar uno nuevo!",
          returnWinner: false,
        });
        
    }
  }