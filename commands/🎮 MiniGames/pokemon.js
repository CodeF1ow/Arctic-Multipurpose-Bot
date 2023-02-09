
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
class GuessThePokemon {
	constructor(options = {}) {
		if (!options.message) throw new TypeError('NO_MESSAGE: Please provide a message arguement')
		if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: Se ha proporcionado un objeto de mensaje de discord no válido.')
		if (!options.slash_command) options.slash_command = false;
		if (typeof options.slash_command !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: El comando Slash debe ser un booleano.')
		

		if (!options.embed) options.embed = {};
		if (typeof options.embed !== 'object') throw new TypeError('INVALID_EMBED_OBJECT: Embed argumento debe ser un objeto.')
		if (!options.embed.title) options.embed.title = 'Who\'s Este Pokemon?';
		if (typeof options.embed.title !== 'string') throw new TypeError('INVALID_TITLE: Embed El título debe ser una cadena.')
		if (!options.embed.footer) options.embed.footer = 'You have only 1 chance!';
		if (typeof options.embed.footer !== 'string')  throw new TypeError('INVALID_FOOTER: Embed El pie de página debe ser una cadena.')
		if (!options.embed.color) options.embed.color = '#5865f2';
		if (typeof options.embed.color !== 'string')  throw new TypeError('INVALID_COLOR: Embed El color debe ser una cadena.')


		if (!options.winMessage) options.winMessage = 'Bien! El pokémon era **{pokemon}**';
		if (typeof options.winMessage !== 'string')  throw new TypeError('WIN_MESSAGE: Win El mensaje debe ser una cadena.')
		if (!options.stopMessage) options.stopMessage = 'Mejor suerte la próxima vez! Fue un **{pokemon}**';
		if (typeof options.stopMessage !== 'string')  throw new TypeError('STOP_MESSAGE: El mensaje de parada debe ser una cadena.')
		if (!options.incorrectMessage) options.incorrectMessage = 'No! El pokémon era **{pokemon}**';
		if (typeof options.incorrectMessage !== 'string')  throw new TypeError('INCORRECT_MESSAGE: InCorrect El mensaje debe ser una cadena.')
		

		if (!options.time) options.time = 60000;
		if (parseInt(options.time) < 10000) throw new TypeError('TIME_ERROR: El tiempo no puede ser inferior a 10 segundos en ms (i?.e 10000 ms)!')
		if (typeof options.time !== 'number') throw new TypeError('INVALID_TIME: El tiempo debe ser un número!')
		if (!options.thinkMessage) options.thinkMessage = '**Pensando en...**';
		if (typeof options.thinkMessage !== 'string') throw new TypeError('INVALID_THINK_MESSAGE: Piensa que el mensaje debe ser una cadena.')


		this.options = options;
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

		let thinkMsg;

		if (!this.options.slash_command) thinkMsg = await this.message.channel.send({ embeds: [
			new MessageEmbed().setDescription(this.options.thinkMessage).setColor(this.options.embed.color)
		]})

		const { data } = await fetch('https://api.aniketdev.cf/pokemon').then(res => res.json())
		const attachment = new MessageAttachment(data.hiddenImage, 'question-image.png')


		const embed = new MessageEmbed()
		.setColor(this.options.embed.color)
		.setTitle(this.options.embed.title)
		.setImage('attachment://question-image.png')
		.setFooter(this.options.embed.footer)
		.addField('Type(s)', data.types.join(', ') || 'No data.')
		.addField('Abilities', data.abilities.join(', ') || 'No data.')
		.setAuthor(this.message.author.tag, this.message.author.displayAvatarURL({ dynamic: true}))


		if (thinkMsg && !thinkMsg.deleted) thinkMsg.delete().catch();
		const msg = await this.sendMessage({ embeds: [embed], files: [attachment] })

		const filter = (m) => m.author.id === this.message.author.id;
		const collector = this.message.channel.createMessageCollector({
			filter, 
			time: this.options.time,
		})


		collector.on('collect', (message) => {
			collector.stop();
			if (!message.content || message.content.toLowerCase() === 'stop') {
				return msg.edit({ content: this.options.stopMessage.replace('{pokemon}', data.name), attachments: [], embeds: [] })
			}
			

			if (message.content.toLowerCase() === data.name.toLowerCase()) {
				const attachment2 = new MessageAttachment(data.image, 'answer-image.png')

				const editEmbed = new MessageEmbed()
				.setColor(this.options.embed.color)
    		.setTitle(this.options.embed.title)
				.setImage('attachment://answer-image.png')
				.addField('Pokemon Name', data.name, false)
    		.addField('Type(s)', data.types.join(', ') || 'No data.')
    		.addField('Abilities', data.abilities.join(', ') || 'No data.')
    		.setAuthor(this.message.author.tag, this.message.author.displayAvatarURL({ dynamic: true}))

				return msg.edit({ content: this.options.winMessage.replace('{pokemon}', data.name), embeds: [editEmbed], files: [attachment2], attachments: [] })
			
			}	else {
				return msg.edit({ content: this.options.incorrectMessage.replace('{pokemon}', data.name), embeds: [], attachments: [] })
			}
		})


		collector.on('end', (c, r) => {
			if (r == 'time') return msg.edit({ content: this.options.stopMessage.replace('{pokemon}', data.name), embeds: [], attachments: [] })
		});
		
	}
}
module.exports = {
    name: "pokemon",
    category: "🎮 Minijuegos",
    description: "Allows you to play a Game",
    usage: "pokemon --> Juega el juego",
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
        new GuessThePokemon({
            message: message,
            slash_command: false,
            embed: {
              title: 'Quién es este Pokemon?',
              footer: 'Sólo tienes una oportunidad',
              color: es.color,
            },
            time: 60000,
            thinkMessage: '**Pensando en...**',
            winMessage: 'Bien! El pokémon era **{pokemon}**',
            stopMessage: 'Mejor suerte la próxima vez! Fue un **{pokemon}**',
            incorrectMessage: 'No! El pokémon era **{pokemon}**',
          }).startGame();
    }
  }