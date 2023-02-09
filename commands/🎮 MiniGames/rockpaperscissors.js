const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageAttachment
} = require('discord.js')
function disableButtons(components) {
  for (let x = 0; x < components.length; x++) {
    for (let y = 0; y < components[x].components.length; y++) {
      components[x].components[y].disabled = true;
    }
  }
  return components;
}
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
class RPSGame {
  constructor(options = {}) {
      if (!options.message) throw new TypeError('NO_MESSAGE: Por favor, proporcione un argumento del mensaje')
      if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: Se ha proporcionado un objeto de mensaje de discord no válido.')
      if(!options.opponent) throw new TypeError('NO_OPPONENT: Por favor, proporcione un argumento de oposición')
      if (typeof options.opponent !== 'object') throw new TypeError('INVALID_OPPONENT: Se ha proporcionado un objeto de usuario de discord no válido.')
      if (!options.slash_command) options.slash_command = false;
      if (typeof options.slash_command !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: El comando Slash debe ser un booleano.')


      if (!options.embed) options.embed = {};
      if (typeof options.embed !== 'object') throw new TypeError('INVALID_EMBED_OBJECT: Embed el argumento debe ser un objeto.')
      if (!options.embed.title) options.embed.title = 'Piedra, papel o tijera';
      if (typeof options.embed.title !== 'string')  throw new TypeError('INVALID_TITLE: Embed El título debe ser una cadena.')
      if (!options.embed.description) options.embed.description = 'Pulse un botón de abajo para hacer una elección!';
      if (typeof options.embed.description !== 'string')  throw new TypeError('INVALID_TITLE: Embed El título debe ser una cadena.')
      if (!options.embed.color) options.embed.color = '#5865F2';
      if (typeof options.embed.color !== 'string')  throw new TypeError('INVALID_COLOR: Embed El color debe ser una cadena.')


      if (!options.buttons) options.buttons = {};
      if (!options.buttons.rock) options.buttons.rock = 'Rock';
      if (typeof options.buttons.rock !== 'string')  throw new TypeError('INVALID_BUTTON: Rock Button debe ser una cadena.')
      if (!options.buttons.paper) options.buttons.paper = 'Paper';
      if (typeof options.buttons.paper !== 'string')  throw new TypeError('INVALID_BUTTON: El botón de papel debe ser una cadena.')
      if (!options.buttons.scissors) options.buttons.scissors = 'Scissors';
      if (typeof options.buttons.scissors !== 'string')  throw new TypeError('INVALID_BUTTON: Tijeras El botón debe ser una cuerda.')


      if (!options.emojis) options.emojis = {};
      if (!options.emojis.rock) options.emojis.rock = '🌑';
      if (typeof options.emojis.rock !== 'string')  throw new TypeError('INVALID_EMOJI: Rock Emoji debe ser una cadena.')
      if (!options.emojis.paper) options.emojis.paper = '📃';
      if (typeof options.emojis.paper !== 'string')  throw new TypeError('INVALID_EMOJI: El Emoji de papel debe ser una cadena.')
      if (!options.emojis.scissors) options.emojis.scissors = '✂️';
      if (typeof options.emojis.scissors !== 'string')  throw new TypeError('INVALID_EMOJI: Tijeras El emoji debe ser una cadena.')

  
      if (!options.askMessage) options.askMessage = 'Hey {opponent}, {challenger} te retó a una partida de piedra, papel o tijera!';
      if (typeof options.askMessage !== 'string')  throw new TypeError('ASK_MESSAGE: Ask Messgae debe ser una cadena.')
      if (!options.cancelMessage) options.cancelMessage = 'Parece que se negaron a tener un juego de Piedra Papel Tijeras. \:(';
      if (typeof options.cancelMessage !== 'string')  throw new TypeError('CANCEL_MESSAGE: El mensaje de cancelación debe ser una cadena.')
      if (!options.timeEndMessage) options.timeEndMessage = 'Como el oponente no respondió, abandoné el juego!';
      if (typeof options.timeEndMessage !== 'string')  throw new TypeError('TIME_END_MESSAGE: Hora de finalización El mensaje debe ser una cadena.')
      
      
      if (!options.othersMessage) options.othersMessage = 'No está permitido utilizar botones para este mensaje!';
      if (typeof options.othersMessage !== 'string') throw new TypeError('INVALID_OTHERS_MESSAGE: Otros El mensaje debe ser una cadena.')
      if (!options.chooseMessage) options.chooseMessage = 'Tú eliges {emoji}!';
      if (typeof options.chooseMessage !== 'string') throw new TypeError('INVALID_CHOOSE_MESSAGE: Elegir Mensaje debe ser una cadena.')
      if (!options.noChangeMessage) options.noChangeMessage = 'No puede cambiar su selección!';
      if (typeof options.noChangeMessage !== 'string') throw new TypeError('INVALID_NOCHANGE_MESSAGE: noChange El mensaje debe ser una cadena.')
      

      if (!options.gameEndMessage) options.gameEndMessage = 'El juego quedó inconcluso :(';
      if (typeof options.gameEndMessage !== 'string')  throw new TypeError('GAME_END_MESSAGE: El mensaje de fin de juego debe ser una cadena.')
      if (!options.winMessage) options.winMessage = '{winner} ganó el partido!';
      if (typeof options.winMessage !== 'string')  throw new TypeError('WIN_MESSAGE: Win El mensaje debe ser una cadena.')
      if (!options.drawMessage) options.drawMessage = 'It was a draw!';
      if (typeof options.drawMessage !== 'string')  throw new TypeError('DRAW_MESSAGE: Dibujar El mensaje debe ser una cadena.')


      this.inGame = false;
      this.options = options;
      this.opponent = options.opponent;
      this.message = options.message;
  }


  sendMessage(content) {
      if (this.options.slash_command) return this.message.editReply(content)
      else return this.message.channel.send(content)
  }


  async startGame() {
      if (this.options.slash_command) {
          if (!this.message.deferred) await this.message.deferReply({ephemeral: false});
          this.message.author = this.message.user;
      }

      if (this.opponent.bot) return this.sendMessage('No se puede jugar con bots!')
      if (this.opponent.id === this.message.author.id) return this.sendMessage('No puedes jugar contigo mismo!')

      const check = await verify(this.options)

      if (check) {
          this.RPSGame();
      }
  }


  async RPSGame() {
      this.inGame = true;

      const emojis = this.options.emojis;
      const choice = { r: emojis.rock, p: emojis.paper, s: emojis.scissors};

      const embed = new MessageEmbed()
  .setTitle(this.options.embed.title)
   .setDescription(this.options.embed.description)
      .setColor(this.options.embed.color)
      

      const rock = new MessageButton().setCustomId('r_rps').setStyle('PRIMARY').setLabel(this.options.buttons.rock).setEmoji(emojis.rock)
      const paper = new MessageButton().setCustomId('p_rps').setStyle('PRIMARY').setLabel(this.options.buttons.paper).setEmoji(emojis.paper)
      const scissors = new MessageButton().setCustomId('s_rps').setStyle('PRIMARY').setLabel(this.options.buttons.scissors).setEmoji(emojis.scissors)
      const row = new MessageActionRow().addComponents(rock, paper, scissors)

      const msg = await this.sendMessage({ embeds: [embed], components: [row] })


      let challenger_choice;
      let opponent_choice;
      const filter = m => m;
      const collector = msg.createMessageComponentCollector({
          filter,
          time: 60000,
      }) 


      collector.on('collect', async btn => {
          if (btn.user.id !== this.message.author.id && btn.user.id !== this.opponent.id) {
              const authors = this.message.author.tag + 'and' + this.opponent.tag;
              return btn.reply({ content: this.options.othersMessage.replace('{author}', authors),  ephemeral: true })
          }


          if (btn.user.id == this.message.author.id) {
              if (challenger_choice) {
                  return btn.reply({ content: this.options.noChangeMessage,  ephemeral: true })
              }
              challenger_choice = choice[btn.customId.split('_')[0]];

              btn.reply({ content: this.options.chooseMessage.replace('{emoji}', challenger_choice),  ephemeral: true })

              if (challenger_choice && opponent_choice) {
                  collector.stop()
                  this.getResult(msg, challenger_choice, opponent_choice)
              }
          }
          else if (btn.user.id == this.opponent.id) {
              if (opponent_choice) {
                  return btn.reply({ content: this.options.noChangeMessage,  ephemeral: true })
              }
              opponent_choice = choice[btn.customId.split('_')[0]];

              btn.reply({ content: this.options.chooseMessage.replace('{emoji}', opponent_choice),  ephemeral: true })

              if (challenger_choice && opponent_choice) {
                  collector.stop()
                  this.getResult(msg, challenger_choice, opponent_choice)
              }
          }
      })

      collector.on('end', async(c, r) => {
          if (r === 'time' && this.inGame == true) {
              const endEmbed = new MessageEmbed()
              .setTitle(this.options.embed.title)
              .setColor(this.options.embed.color)
              .setDescription(this.options.gameEndMessage)
              .setTimestamp()

              return msg.edit({ embeds: [endEmbed], components: disableButtons(msg.components) })
          }
      })
  }

  getResult(msg, challenger, opponent) {
      let result;
      const { rock, paper, scissors } = this.options.emojis;

      if (challenger === opponent) {
          result = this.options.drawMessage;
      } else if (
          (opponent === scissors && challenger === paper) || 
          (opponent === rock && challenger === scissors) || 
          (opponent === paper && challenger === rock)
      ) {
          result = this.options.winMessage.replace('{winner}', this.opponent.toString())
      } else {
          result = this.options.winMessage.replace('{winner}', this.message.author.toString())
      }

      const finalEmbed = new MessageEmbed()
      .setTitle(this.options.embed.title)
      .setColor(this.options.embed.color)
      .setDescription(result)
      .addField(this.message.author.username, challenger, true)
      .addField(this.opponent.username, opponent, true)
      .setTimestamp()


      return msg.edit({ embeds: [finalEmbed], components: disableButtons(msg.components) })
  }
}
module.exports = {
    name: "rockpaperscissors",
    aliases: ["rpc"],
    category: "🎮 Minijuegos",
    description: "Permite jugar a un juego de piedra, papel o tijera",
    usage: "rockpaperscissors --> Juega el juego",
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
        const opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!opponent) return message.reply(eval(client.la[ls]["cmds"]["minigames"]["rockpaperscissors"]["variable1"]));

        new RPSGame({
          message: message,
          slash_command: false,
          opponent: opponent.user,
          embed: {
            title: 'Piedra, papel o tijera',
            description: 'Pulse un botón de abajo para hacer una elección!',
            color: es.color,
          },
          buttons: {
            rock: 'Piedra',
            paper: 'Papel',
            scissors: 'Tijera',
          },
          emojis: {
            rock: '🌑',
            paper: '📃',
            scissors: '✂️',
          },
          othersMessage: 'YNo está permitido utilizar botones para este mensaje!',
          chooseMessage: 'Tú eliges {emoji}!',
          noChangeMessage: 'No puede cambiar su selección!',
          askMessage: 'Hey {opponent}, {challenger} te retó a una partida de piedra, papel o tijera!',
          cancelMessage: 'Parece que se negaron a tener un juego de Piedra Papel Tijeras. \:(',
          timeEndMessage: 'Como el oponente no respondió, abandoné el juego!',
          drawMessage: 'Fue un empate!',
          winMessage: '{winner} ganó el partido!',
          gameEndMessage: 'El juego quedó inconcluso :(',
        }).startGame();
        
    }
  }

  async function verify(options) {
    return new Promise(async (res, rej) => {
        const message = options.message;
    	const opponent = options.opponent;

    
        const askEmbed = new MessageEmbed()
        .setTitle(options.embed.askTitle || options.embed.title)
        .setDescription(options.askMessage
            .replace('{challenger}', message.author.toString()).replace('{opponent}', opponent.toString())
        )
        .setColor(options.colors?.green || options.embed.color)
    
        const btn1 = new MessageButton().setLabel(options.buttons?.accept || 'Accept').setStyle('SUCCESS').setCustomId('accept')
        const btn2 = new MessageButton().setLabel(options.buttons?.reject || 'Reject').setStyle('DANGER').setCustomId('reject')
        const row = new MessageActionRow().addComponents(btn1, btn2);
    
    
    	let askMsg;
    	if (options.slash_command) askMsg = await message.editReply({ embeds: [askEmbed], components: [row] })
        else askMsg = await message.channel.send({ embeds: [askEmbed], components: [row] })
    
        const filter = (interaction) => interaction === interaction;
        const interaction = askMsg.createMessageComponentCollector({
            filter, time: 30000
        })
    
        
        await interaction?.on('collect', async (btn) => {
            if (btn.user.id !== opponent.id) return btn.reply({ content: options.othersMessage.replace('{author}', opponent.tag),  ephemeral: true })
    
            await btn.deferUpdate();
            interaction?.stop(btn.customId)
        });
    
    
        await interaction?.on('end', (_, r) => {
            if (r === 'accept') {
                if (!options.slash_command) askMsg.delete().catch();
                return res(true)
            }

            const cancelEmbed = new MessageEmbed()
            .setTitle(options.embed.cancelTitle || options.embed.title)
            .setDescription(options.cancelMessage
                .replace('{challenger}', message.author.toString()).replace('{opponent}', opponent.toString())
            )
            .setColor(options.colors?.red || options.embed.color)

            if (r === 'time') {
                cancelEmbed.setDescription(options.timeEndMessage
                    .replace('{challenger}', message.author.toString()).replace('{opponent}', opponent.toString())
                )
            }


            res(false)
            return askMsg.edit({ embeds: [cancelEmbed], components: disableButtons(askMsg.components) });
        });
    })
}
