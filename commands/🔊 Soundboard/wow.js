const Discord = require('discord.js');
const {MessageEmbed} = require('discord.js');
const path = require('path');
const fs = require("fs")
const CmdName = path.parse(__filename).name;
const {joinVoiceChannel, createAudioPlayer, createAudioResource} = require('@discordjs/voice');
module.exports = {
	name: `${CmdName}`,
	description: `Plays the ${CmdName} Soundboard Sound`,
	category: "🔊 Soundboard",
	cooldown: 5,
	usage: `${CmdName}`,
	run: async (client, message, args, cmduser, text, prefix) => {
		const es = client.settings.get(message.guild.id, "embed");
		const ls = client.settings.get(message.guild.id, "language")
		if (!client.settings.get(message.guild.id, "SOUNDBOARD")) {return message.reply({embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(client.getFooter(es)).setTitle(client.la[ls].common.disabled.title).setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))]});}
		const { channel } = message.member.voice;
		const botchannel = message.guild.me.voice.channel;
		if (!channel) {return message.reply({embeds: [new MessageEmbed().setTitle('❌​ Tienes que unirte a un canal de voz').setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		if(!channel.permissionsFor(message.guild.me).has("CONNECT")){return message.reply({embeds: [new MessageEmbed().setTitle(":x: Me falta el permiso para unirme a su canal de voz").setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		if(!channel.permissionsFor(message.guild.me).has("SPEAK")){return message.reply({embeds: [new MessageEmbed().setTitle(":x: Me falta el permiso para hablar en su canal de voz").setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		if(channel.userLimit != 0 && channel.full){return message.reply({embeds: [new MessageEmbed().setTitle(":x: Su canal de voz está lleno!").setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		if (botchannel) {return message.reply({embeds: [new MessageEmbed().setTitle(`❌​ Ya estoy conectado en: \`${botchannel.name}\``).setFooter(client.getFooter(es))]});}
		const e = await message.react('🎙️').catch(e => console.log(String(e).grey))
		let VoiceConnection = joinVoiceChannel({channelId: channel.id,guildId: channel.guild.id,adapterCreator: channel.guild.voiceAdapterCreator}); 
		let file = path.join(__dirname + `/audio/${CmdName}.mp3`);
		if(!file || !fs.existsSync(file)) {
			file = path.join(__dirname + `/audio/${CmdName}.m4a`);
		}
		if(!file || !fs.existsSync(file)) {
			file = path.join(__dirname + `/audio/${CmdName}.mov`);
		}
		if(!file || !fs.existsSync(file)){return message.reply({embeds: [new MessageEmbed().setTitle(":x: No se puede encontrar el AUDIO").setColor(es.wrongcolor).setFooter(client.getFooter(es))]});}
		const resource = createAudioResource(file, {inlineVolume: true});
		resource.volume.setVolume(0.2);
		const player = createAudioPlayer();
		VoiceConnection.subscribe(player);
		player.play(resource);
		player.on("idle", () => {
			try {player.stop();} catch (e) {console.log(String(e).grey)}
			try {VoiceConnection.destroy();} catch (e) {console.log(String(e).grey)}
			e.remove().catch(e => console.log(String(e).grey))
		});
	}
}

