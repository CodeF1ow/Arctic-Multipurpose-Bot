
const { Fight } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "fight",
    aliases: ["battle"],
    category: "🎮 Minijuegos",
    description: "Juega una pelea con algunos1",
    usage: "fight --> Juega el juego",
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
        const opponent = message.mentions.users.first();
        if (!opponent) return message.reply(eval(client.la[ls]["cmds"]["minigames"]["fight"]["variable1"]));
        await Fight({
          message: message,
          opponent: opponent,
          embed: {
              title: 'Fight',
              color: es.color,
              footer: es.footertext,
              timestamp: true
          },
          buttons: {
            hit: 'Hit',
            heal: 'Heal',
            cancel: 'Stop',
            accept: 'Accept',
            deny: 'Deny'
          },
          acceptMessage: '<@{{challenger}}> ha desafiado <@{{opponent}}> para una pelea!',
          winMessage: 'GG, <@{{winner}}> ganó el combate!',
          endMessage: '<@{{opponent}}> no respondió a tiempo. Así que dejé el juego!',
          cancelMessage: '<@{{opponent}}> se negó a tener una pelea contigo!',
          fightMessage: '{{player}} tú vas primero!',
          opponentsTurnMessage: 'Por favor, espere a que su oponente se mueva!',
          highHealthMessage: 'No puedes curarte si tu HP es superior a 80!',
          lowHealthMessage: 'No puedes cancelar el combate si tu HP está por debajo de 50!',
          returnWinner: false,
          othersMessage: 'Sólo {{author}} puede utilizar los botones!'
      });
      
    }
  }