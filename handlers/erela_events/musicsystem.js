const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const { check_if_dj, autoplay, escapeRegex, format, duration, createBar } = require("../functions");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`../playermanager`);
//we need to create the music system, somewhere...
module.exports = client => {
    client.on("interactionCreate", async (interaction) => {
        if(!interaction?.isButton()) return;
        var { guild, message, channel, member, user } = interaction;
        if(!guild) guild = client.guilds.cache.get(interaction?.guildId);
        if(!guild) return;
        client.musicsettings.ensure(guild.id, {
            "channel": "",
            "message": ""
        })
        var data = client.musicsettings.get(guild.id);
        var musicChannelId = data.channel;
        var musicChannelMessage = data.message;
        //if not setupped yet, return
        if(!musicChannelId || musicChannelId.length < 5) return;
        if(!musicChannelMessage || musicChannelMessage.length < 5) return;
        //if the channel doesnt exist, try to get it and the return if still doesnt exist
        if(!channel) channel = guild.channels.cache.get(interaction?.channelId);
        if(!channel) return;
        //if not the right channel return
        if(musicChannelId != channel.id) return;
        //if not the right message, return
        if(musicChannelMessage != message.id) return;

        if(!member) member = guild.members.cache.get(user.id);
        if(!member) member = await guild.members.fetch(user.id).catch(() => {});
        if(!member) return;
        //if the member is not connected to a vc, return
        if(!member.voice.channel) return interaction?.reply({ephemeral: true, content: ":x: **Conéctese primero a un canal de voz!**"})
        //now its time to start the music system
        if (!member.voice.channel)
            return interaction?.reply({
                content: `❌​ **Por favor, únase primero a un canal de voz!**`,
                ephemeral: true
            })      
            
        var player = client.manager.players.get(interaction?.guild.id);
        if (interaction?.customId != "Join" && interaction?.customId != "Leave" && (!player || !player.queue || !player.queue.current))
            return interaction?.reply({content: "❌​ Todavía no hay nada sonando", ephemeral: true})
                        
        //if not connected to the same voice channel, then make sure to connect to it!
        if (player && member.voice.channel.id !== player.voiceChannel)
            return interaction?.reply({
                content: `❌​ **Por favor, únete primero a mi canal de voz! <#${player.voiceChannel}>**`,
                ephemeral: true
            })
        //here i use my check_if_dj function to check if he is a dj if not then it returns true, and it shall stop!
        if(player && interaction?.customId != `Join` && interaction?.customId != `Lyrics` && check_if_dj(client, member, player.queue.current)) {
                return interaction?.reply({embeds: [new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter({text: `${ee.footertext}`, iconURL: `${ee.footericon}`})
                  .setTitle(`❌​ **Usted no es un DJ y no es el solicitante de la canción!**`)
                  .setDescription(`**DJ-ROLES:**\n${check_if_dj(client, interaction?.member, player.queue.current)}`)
                ],
                ephemeral: true});
        }
        let es = client.settings.get(guild.id, "embed")
        let ls = client.settings.get(guild.id, "language")
        switch(interaction?.customId){
            case "Join": {
                //create the player
                var player = await client.manager.create({
                    guild: guild.id,
                    voiceChannel: member.voice.channel.id,
                    textChannel: channel.id,
                    selfDeafen: config.settings.selfDeaf,
                });
                await player.connect();
                await player.stop();
                 interaction?.reply({embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTitle(client.la[ls].cmds.music.join.title)
                    .setDescription(`Canal: <#${member.voice.channel.id}>`)]
                });
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Leave": {
                //Stop the player
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`:wave: **Abandonó el canal**`)
                  .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                }) 
                if(player){
                    await player.destroy();
                    //edit the message so that it's right!
                    var data = generateQueueEmbed(client, guild.id, true)
                    message.edit(data).catch((e) => {
                      //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                } else {
                    //edit the message so that it's right!
                    var data = generateQueueEmbed(client, guild.id, true)
                    message.edit(data).catch((e) => {
                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                }
            }break;
            case "Skip": {
                //if ther is nothing more to skip then stop music and leave the Channel
                if (!player.queue || !player.queue.size || player.queue.size === 0) {
                    //if its on autoplay mode, then do autoplay before leaving...
                    if(player.get("autoplay")) return autoplay(client, player, "skip");
                    interaction?.reply({
                        embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`⏹ **Dejó de jugar y abandonó el Canal**`)
                        .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                    await player.destroy()
                    //edit the message so that it's right!
                    var data = generateQueueEmbed(client, guild.id, true)
                    message.edit(data).catch((e) => {
                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                    return
                }
                //skip the track
                await player.stop();
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏭ **Salto a la siguiente Canción!**`)
                  .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Stop": {
                //Stop the player
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏹ **Ha dejado de jugar y ha abandonado el canal**`)
                  .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                }) 
                await player.destroy()
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id, true)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Pause": {
                if (!player.playing){
                    player.pause(false);
                    interaction?.reply({
                      embeds: [new MessageEmbed()
                      .setColor(ee.color)
                      .setTimestamp()
                      .setTitle(`▶️ **Reanudado!**`)
                      .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                  } else{
                    //pause the player
                    player.pause(true);

                    interaction?.reply({
                      embeds: [new MessageEmbed()
                      .setColor(ee.color)
                      .setTimestamp()
                      .setTitle(`⏸ **En pausa!**`)
                      .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                  }
                  //edit the message so that it's right!
                  var data = generateQueueEmbed(client, guild.id)
                  message.edit(data).catch((e) => {
                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  })
            }break;
            case "Autoplay": {
                //pause the player
                player.set(`autoplay`, !player.get(`autoplay`))
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.get(`autoplay`) ? `​✔️ **Habilitada la reproducción automática**`: `❌​ **Reproducción automática deshabilitada**`}`)
                  .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Shuffle": {
                //set into the player instance an old Queue, before the shuffle...
                player.set(`beforeshuffle`, player.queue.map(track => track));
                //shuffle the Queue
                player.queue.shuffle();
                //Send Success Message
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`🔀 **Barajado ${player.queue.length} Canciones!**`)
                    .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Song": {
                //if there is active queue loop, disable it + add embed information
                if (player.queueRepeat) {
                  player.setQueueRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setTrackRepeat(!player.trackRepeat);
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.trackRepeat ? `​✔️ **Bucle de canciones habilitado**`: `❌​ **Bucle de canciones deshabilitadas**`}`)
                  .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Queue": {
                //if there is active queue loop, disable it + add embed information
                if (player.trackRepeat) {
                  player.setTrackRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setQueueRepeat(!player.queueRepeat);
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.queueRepeat ? `​✔️ **Bucle de cola habilitado**`: `❌​ **Bucle de cola deshabilitado**`}`)
                  .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Forward": {
                //get the seektime variable of the user input
                var seektime = Number(player.position) + 10 * 1000;
                //if the userinput is smaller then 0, then set the seektime to just the player.position
                if (10 <= 0) seektime = Number(player.position);
                //if the seektime is too big, then set it 1 sec earlier
                if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
                //seek to the new Seek position
                await player.seek(Number(seektime));
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`⏩ **Reenvió la canción en \`10 Segundos\`!**`)
                    .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Rewind": {
                var seektime = player.position - 10 * 1000;
                if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
                  seektime = 0;
                }
                //seek to the new Seek position
                await player.seek(Number(seektime));
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`⏪ **Rebobina la canción en \`10 Segundos\`!**`)
                    .setFooter(client.getFooter(`💢 Acción por: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Lyrics": {
                
            }break;
        }
        
    })
    //this was step 1 now we need to code the REQUEST System...

    client.on("messageCreate", async message => {
        if(!message.guild) return;
        client.musicsettings.ensure(message.guild.id, {
            "channel": "",
            "message": ""
        })
        var data = client.musicsettings.get(message.guild.id);
        var musicChannelId = data.channel;
        //if not setupped yet, return
        if(!musicChannelId || musicChannelId.length < 5) return;
        //if not the right channel return
        if(musicChannelId != message.channel.id) return;
        //Delete the message once it got sent into the channel, bot messages after 5 seconds, user messages instantly!
        if (message.author.id === client.user.id) 
            setTimeout(()=>{
              try{
                message.delete().catch(() => {
                  setTimeout(()=>{
                    try{message.delete().catch((e) => {console.log(e)});}catch(e){ console.log(e)}}, 5000)});}catch(e){setTimeout(()=>{try{message.delete().catch((e) => {console.log(e)});}catch(e){ console.log(e)}}, 5000)}}, 5000)
        else 
            {
              try{message.delete().catch(() => {setTimeout(()=>{try{message.delete().catch(() => {});}catch(e){ }}, 5000)});}catch(e){setTimeout(()=>{try{message.delete().catch(() => {});}catch(e){ }}, 5000)}
            }
        if (message.author.bot) return; // if the message  author is a bot, return aka ignore the inputs
        var prefix = client.settings.get(message.guild.id, "prefix")
        //get the prefix regex system
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`); //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
        var args;
        var cmd;
        if (prefixRegex.test(message.content)) {
            //if there is a attached prefix try executing a cmd!
            const [, matchedPrefix] = message.content.match(prefixRegex); //now define the right prefix either ping or not ping
            args = message.content.slice(matchedPrefix.length).trim().split(/ +/); //create the arguments with sliceing of of the rightprefix length
            cmd = args.shift().toLowerCase(); //creating the cmd argument by shifting the args by 1
            if (cmd || cmd.length === 0) return// message.reply("❌​ **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)})
        
            var command = client.commands.get(cmd); //get the command from the collection
            if (!command) command = client.commands.get(client.aliases.get(cmd)); //if the command does not exist, try to get it by his alias
            if (command) //if the command is now valid
            {
                return// message.reply("❌​ **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)})
            }
        }
        //getting the Voice Channel Data of the Message Member
        const {
          channel
        } = message.member.voice;
        //if not in a Voice Channel return!
        if (!channel) return message.reply("❌​ **Por favor, únase primero a un canal de voz!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 5000)})
        //get the lavalink erela.js player information
        const player = client.manager.players.get(message.guild.id);
        //if there is a player and the user is not in the same channel as the Bot return information message
        if (player && channel.id !== player.voiceChannel) return message.reply(`❌​ **Por favor, únete primero a mi canal de voz! <#${player.voiceChannel}>**`).then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)})

        
        else {
            return playermanager(client, message, message.content.trim().split(/ +/), "request:song");
        }
    })


}
function generateQueueEmbed(client, guildId, leave){
    let guild = client.guilds.cache.get(guildId)
    if(!guild) return;
    let es = client.settings.get(guild.id, "embed")
    let ls = client.settings.get(guild.id, "language")
    var embeds = [
      new MessageEmbed()
        .setColor(es.color)
        .setTitle(`📃 Cola de __${guild.name}__`)
        .setDescription(`**Actualmente hay __0 canciones__ en la cola**`)
        .setThumbnail(guild.iconURL({dynamic: true})),
      new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setImage(guild.banner ? guild.bannerURL({size: 4096}) : "https://imgur.com/jLvYdb4.png")
        .setTitle(`Comience a escuchar música, conectándose a un canal de voz y enviando el **Enlace de la canción** o el **Nombre de la canción** en este canal!`)
        .setDescription(`> *Soporte para 📺​ Youtube, 🎶​ Spotify, 🎵 Soundcloud y enlaces directos en MP3!*`)
    ]
    const player = client.manager.players.get(guild.id);
    if(!leave && player && player.queue && player.queue.current){
        embeds[1].setImage(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
            .setFooter(client.getFooter(`Solicitado por: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({dynamic: true})))
            .addField(`${emoji?.msg.time} Duración: `, `\`${format(player.queue.current.duration).split(" | ")[0]}\` | \`${format(player.queue.current.duration).split(" | ")[1]}\``, true)
            .addField(`${emoji?.msg.song_by} Canción de: `, `\`${player.queue.current.author}\``, true)
            .addField(`${emoji?.msg.repeat_mode} Longitud de la cola: `, `\`${player.queue.length} Canciones\``, true)
            .setAuthor(`${player.queue.current.title}`, "https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif", player.queue.current.uri)
        delete embeds[1].description;
        delete embeds[1].title;
        //get the right tracks of the current tracks
        const tracks = player.queue;
        var maxTracks = 10; //tracks / Queue Page
        //get an array of quelist where 10 tracks is one index in the array
        var songs = tracks.slice(0, maxTracks);
        embeds[0] = new MessageEmbed()
        .setTitle(`📃 Cola de __${guild.name}__  -  [ ${player.queue.length} Pistas ]`)
        .setColor(es.color)
        .setDescription(String(songs.map((track, index) => `**\` ${++index}. \` ${track.uri ? `[${track.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${track.uri})` : track.title}** - \`${track.isStream ? `TRANSMISIÓN EN VIVO` : format(track.duration).split(` | `)[0]}\`\n> *Solicitado por: __${track.requester.tag}__*`).join(`\n`)).substring(0, 2048));
        if(player.queue.length > 10)
          embeds[0].addField(`**\` N. \` *${player.queue.length > maxTracks ? player.queue.length - maxTracks : player.queue.length} Otras pistas ...***`, `\u200b`)
        embeds[0].addField(`**\` 0. \` __PISTA ACTUAL__**`, `**${player.queue.current.uri ? `[${player.queue.current.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${player.queue.current.uri})`:player.queue.current.title}** - \`${player.queue.current.isStream ? `TRANSMISIÓN EN VIVO` : format(player.queue.current.duration).split(` | `)[0]}\`\n> *Solicitado por: __${player.queue.current.requester.tag}__*`)
            
    }
    var joinbutton = new MessageButton().setStyle('SUCCESS').setCustomId('Join').setEmoji(`👌`).setLabel(`Entrar`).setDisabled(false);
    var leavebutton = new MessageButton().setStyle('DANGER').setCustomId('Leave').setEmoji(`👋`).setLabel(`Dejar`).setDisabled();
    var stopbutton = new MessageButton().setStyle('DANGER').setCustomId('Stop').setEmoji(`🏠`).setLabel(`Stop`).setDisabled()
    var skipbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Skip').setEmoji(`⏭`).setLabel(`Saltar`).setDisabled();
    var shufflebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Shuffle').setEmoji('🔀').setLabel(`Shuffle`).setDisabled();
    var pausebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('⏸').setLabel(`Pausa`).setDisabled();
    var autoplaybutton = new MessageButton().setStyle('SUCCESS').setCustomId('Autoplay').setEmoji('🔁').setLabel(`Autoplay`).setDisabled();
    var songbutton = new MessageButton().setStyle('SUCCESS').setCustomId('Song').setEmoji(`🔁`).setLabel(`Canciones`).setDisabled();
    var queuebutton = new MessageButton().setStyle('SUCCESS').setCustomId('Queue').setEmoji(`🔂`).setLabel(`Cola`).setDisabled();
    var forwardbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Forward').setEmoji('⏩').setLabel(`+10 Seg`).setDisabled();
    var rewindbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Rewind').setEmoji('⏪').setLabel(`-10 Seg`).setDisabled();
    var lyricsbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Lyrics').setEmoji('📝').setLabel(`Letras`).setDisabled();
    if(!leave && player && player.queue && player.queue.current){
        skipbutton = skipbutton.setDisabled(false);
        shufflebutton = shufflebutton.setDisabled(false);
        stopbutton = stopbutton.setDisabled(false);
        songbutton = songbutton.setDisabled(false);
        queuebutton = queuebutton.setDisabled(false);
        forwardbutton = forwardbutton.setDisabled(false);
        rewindbutton = rewindbutton.setDisabled(false);
        autoplaybutton = autoplaybutton.setDisabled(false)
        pausebutton = pausebutton.setDisabled(false)
        if (player.get("autoplay")) {
            autoplaybutton = autoplaybutton.setStyle('SECONDARY')
        }
        if (!player.playing) {
            pausebutton = pausebutton.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
        }
        if (!player.queueRepeat && !player.trackRepeat) {
            songbutton = songbutton.setStyle('SUCCESS')
            queuebutton = queuebutton.setStyle('SUCCESS')
        }
        if (player.trackRepeat) {
            songbutton = songbutton.setStyle('SECONDARY')
            queuebutton = queuebutton.setStyle('SUCCESS')
        }
        if (player.queueRepeat) {
            songbutton = songbutton.setStyle('SUCCESS')
            queuebutton = queuebutton.setStyle('SECONDARY')
        }
    }
    if(player){
        joinbutton = joinbutton.setDisabled()
        leavebutton = leavebutton.setDisabled(false);
    }
    if(leave){
        joinbutton = joinbutton.setDisabled(false)
        leavebutton = leavebutton.setDisabled(true);
    }
    //now we add the components!
    var components = [
      new MessageActionRow().addComponents([
        joinbutton,
        leavebutton,
      ]),
      new MessageActionRow().addComponents([
        skipbutton,
        stopbutton,
        pausebutton,
        autoplaybutton,
        shufflebutton,
      ]),
      new MessageActionRow().addComponents([
        songbutton,
        queuebutton,
        forwardbutton,
        rewindbutton,
        lyricsbutton,
      ]),
    ]
    return {
      embeds, 
      components
    }
}
module.exports.generateQueueEmbed = generateQueueEmbed;