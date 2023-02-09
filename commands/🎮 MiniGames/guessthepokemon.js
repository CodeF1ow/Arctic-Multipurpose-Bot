const { GuessThePokemon } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "guessthepokemon",
    category: "🎮 Minijuegos",
    description: "Juega a un juego",
    aliases: ["guesspokemon"],
    usage: "guessthepokemon --> Juega el juego",
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
        await GuessThePokemon({
          message: message,
          embed: {
            title: 'Adivina el Pokémon',
            description:
              '**Tipo:**\n{{type}}\n\n**Habilidades:**\n{{abilities}}\n\nSólo tienes **{{time}}** para adivinar el pokémon.',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          thinkMessage: 'Estoy pensando',
          othersMessage: 'Sólo <@{{author}}> puede utilizar los botones!',
          winMessage:
            'GG, Fue un **{{answer}}**. Lo has hecho bien en **{{time}}**.',
          loseMessage: 'Mejor suerte la próxima vez! Fue un **{{answer}}**.',
          time: 60000,
          incorrectMessage: "No {{author}}! El pokémon no es `{{answer}}`",
          buttonText: 'Cancelar',
        });
        
        
    }
  }