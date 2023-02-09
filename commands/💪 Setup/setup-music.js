var { MessageEmbed } = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var radios = require(`../../botconfig/radiostations.json`);
var playermanager = require(`../../handlers/playermanager`);
var { stations, databasing } = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
    name: "setup-music",
    category: "💪 Configurar",
    aliases: ["setupmusic"],
    cooldown: 10,
    usage: "setup-music #Channel",
    description: "Configurar un canal de petición de música",
    memberpermissions: ["ADMINISTRATOR"],
    type: "fun",
    run: async (client, message, args, cmduser, text, prefix) => {
    
      let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
      try{
        //I AM NOW MAKING A MUSIC REQUEST SYSTEM FOR A BOT!
        client.musicsettings.ensure(message.guild.id, {
          "channel": "",
          "message": ""
        })
        //first declare all embeds
        var embeds = [
          new MessageEmbed()
            .setColor(es.color)
            .setTitle(`📃 Cola de __${message.guild.name}__`)
            .setDescription(`**Actualmente hay __0 canciones__ en la cola**`)
            .setThumbnail(message.guild.iconURL({dynamic: true})),
          new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setImage(message.guild.banner ? message.guild.bannerURL({size: 4096}) : "https://imgur.com/jLvYdb4.png")
            .setTitle(`Comience a escuchar música, conectándose a un canal de voz y enviando el **Enlace de la canción** o el **Nombre de la canción** en este canal!`)
            .setDescription(`> *Soporto 📺​ Youtube, 🎶​ Spotify, 🎵 Soundcloud y enlaces directos en MP3!*`)
        ]
        //now we add the components!
        var components = [
          new MessageActionRow().addComponents([
            new MessageButton().setStyle('SUCCESS').setCustomId('Join').setEmoji(`👌`).setLabel(`Unir`).setDisabled(false),
            new MessageButton().setStyle('DANGER').setCustomId('Leave').setEmoji(`👋`).setLabel(`Salir`).setDisabled(),
          ]),
          new MessageActionRow().addComponents([
            new MessageButton().setStyle('PRIMARY').setCustomId('Skip').setEmoji(`⏭`).setLabel(`Saltar`).setDisabled(),
            new MessageButton().setStyle('DANGER').setCustomId('Stop').setEmoji(`🏠`).setLabel(`Parar`).setDisabled(),
            new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('⏸').setLabel(`Pausar`).setDisabled(),
            new MessageButton().setStyle('SUCCESS').setCustomId('Autoplay').setEmoji('🔁').setLabel(`Auto-play`).setDisabled(),
            new MessageButton().setStyle('PRIMARY').setCustomId('Shuffle').setEmoji('🔀').setLabel(`Barajar`).setDisabled(),
          ]),
          new MessageActionRow().addComponents([
            new MessageButton().setStyle('SUCCESS').setCustomId('Song').setEmoji(`🔁`).setLabel(`Cancion`).setDisabled(),
            new MessageButton().setStyle('SUCCESS').setCustomId('Queue').setEmoji(`🔂`).setLabel(`Cola`).setDisabled(),
            new MessageButton().setStyle('PRIMARY').setCustomId('Forward').setEmoji('⏩').setLabel(`+10 Seg`).setDisabled(),
            new MessageButton().setStyle('PRIMARY').setCustomId('Rewind').setEmoji('⏪').setLabel(`-10 Seg`).setDisabled(),
            new MessageButton().setStyle('PRIMARY').setCustomId('Lyrics').setEmoji('📝').setLabel(`Letras`).setDisabled(),
          ]),
        ]
        let channel = message.mentions.channels.first();
        if(!channel) return message.reply(":x: **Olvidaste hacer un ping a un canal de texto!**")
        //send the data in the channel
        channel.send({embeds, components}).then(msg => {
          client.musicsettings.set(message.guild.id, channel.id, "channel");
          client.musicsettings.set(message.guild.id, msg.id, "message");
          //send a success message
          return message.reply(`✅ **Configurado con éxito el Sistema de Música en:** <#${channel.id}>`)
        });
        } catch (e) {
            console.log(String(e.stack).grey.bgRed)
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
    						.setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable9"]))
            ]});
        }
    },
};

