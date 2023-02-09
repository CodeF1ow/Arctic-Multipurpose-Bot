
const request = require('request'),
 Discord = require('discord.js'),
 CronJob = require('cron').CronJob,
 config = require(`../social_log/streamconfig.json`),
 fs = require('fs');
const { databasing, delay } = require('../handlers/functions');
const moment = require(`moment`)
module.exports = async client => {
  //function that will run the checks

  client.Joblivelog = new CronJob('0 */7 * * * *', async function() {
    await delay(1 * 60 * 1000)
    console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} ::  Comprobando Cuentas - ${moment().format(`LLLL`)}`.magenta)
    var guilds = client.social_log.filterArray((v) => (v.twitch && v.twitch.channels && v.twitch.channels.length > 0) && (v.twitch&&v.twitch.channelId&&v.twitch.channelId.length > 1)).map(v => v.twitch)
    for(const g of guilds){
      var guild = client.guilds.cache.get(g.DiscordServerId);
      if(!guild) continue;
      getStreams(guild);
      await delay(1500);
    }
  }, null, true, 'America/Los_Angeles');

  //update the authorization key every hour
  client.Joblivelog2 = new CronJob('0 * * * *', function() {
    UpdateAuthConfig();
  }, null, true, 'America/Los_Angeles');

  client.on('ready', async () => {
      client.Joblivelog.start();
      client.Joblivelog2.start();
      UpdateAuthConfig();
  });



  function getStreams(guild){
    client.social_log.ensure(guild.id, {
      twitch: {
        DiscordServerId: guild.id,
        channelId: ``,
        roleID_PING: ``,
        roleID_GIVE: ``,
        channels: [],
      }
    })
    const tempData = client.social_log.get(guild.id, `twitch`)
    if(!tempData.channels) return console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  SIN DATOS DE TWITCH (CANALES TW)`.magenta)
    if(!tempData.channelId || tempData.channelId == undefined || tempData.channelId.length != 18) return console.log(`NO HAY DATOS DE TWITCH (DISCORD CHANNEL)`.magenta)
    tempData.channels.map(async function (chan, i) {
        if (!chan.ChannelName) return console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  NO SE HA ENCONTRADO EL NOMBRE DEL CANAL :C`.magenta);
        let member = await guild.members.fetch(chan.DISCORD_USER_ID).catch(() => {});;
        if(!member) return console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  MIEMBRO NO ENCONTRADO!`.magenta)
        
        let StreamData = await getStreamData(chan.ChannelName, process.env.twitch_clientID || config.twitch_clientID, config.authToken);
        if(!StreamData) return console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  No hay datos del Stream`.magenta)
        if(!StreamData.data || StreamData.data.length == 0)  {
          if(tempData.roleID_GIVE && guild.roles.cache.has(tempData.roleID_GIVE) && member.roles.cache.has(tempData.roleID_GIVE))
            member.roles.remove(tempData.roleID_GIVE).catch(e=>console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  ELIMINAR EL ROL | prevented bug`.gray)); 
          return console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  NO HAY DATOS DE STREAM AKA RETORNO`.magenta);
        }

        StreamData = StreamData.data[0]

        //ADD / REMOVE ROLE
        if(chan.DISCORD_USER_ID) {  
          if(StreamData.type.toLowerCase() === `live` && tempData.roleID_GIVE && guild.roles.cache.has(tempData.roleID_GIVE)) { 
             member.roles.add(tempData.roleID_GIVE).catch(e=>console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  AÑADIR ROL | error impedido`.gray))
          }
          else if(tempData.roleID_GIVE && guild.roles.cache.has(tempData.roleID_GIVE) && member.roles.cache.has(tempData.roleID_GIVE)){
            member.roles.remove(tempData.roleID_GIVE).catch(e=>console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  ELIMINAR ROL | evitó un error`.gray))
          }
        }
        
        //get the channel data for the thumbnail image
        const ChannelData = await getChannelData(chan.ChannelName, process.env.twitch_clientID || config.twitch_clientID, config.authToken)
        if (!ChannelData) return console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  NO SE HA ENCONTRADO INFORMACIÓN SOBRE LOS DATOS DEL CANAL DE TWITCH`.magenta)
        

        //structure for the embed
        var embed = new Discord.MessageEmbed()
        .setColor(`BLUE`)
        .setURL(`https://www.twitch.tv/${StreamData.user_login}`)
        .setDescription(StreamData.title ? StreamData.title : `\u200b`)
        .setTitle(`🔴 ${StreamData.user_name} is now live`)
        .addField(`Jugando a:`, `\`${StreamData.game_name ? StreamData.game_name : `Unknown Game`}\``, true)
        .addField(`Espectadores:`, `${StreamData.viewer_count ? `\`${StreamData.viewer_count}\`` : `~~\`0\`~~`}`, true)
        .addField(`Twitch:`,`[Ver la transmisión](https://www.twitch.tv/${StreamData.user_login})`, true)
        .setFooter(client.getFooter(`Vea su Stream ;)`))
        .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${StreamData.user_login}-640x360.jpg?cacheBypass=${(Math.random()).toString()}`)
        .setThumbnail(ChannelData.thumbnail_url)
        .setTimestamp()
        //get the assigned channel
        client.channels.fetch(tempData.channelId).then(ch => {
          if (chan.twitch_stream_id != StreamData.id) {
            const channelObj = tempData.channels[i]
            member.roles.add(tempData.roleID_GIVE).catch(e=>console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  AÑADIR ROL | error impedido`.gray))
            ch.send({content: `${channelObj.message.length > 0 ? channelObj.message.substr(0, 2000) : `\u200b`}`, embeds: [embed]}).then(msg => {
                channelObj.twitch_stream_id = StreamData.id
                if(tempData.roleID_PING && tempData.roleID_PING.length > 2){
                  ch.send({content: `<@&${tempData.roleID_PING}>`}).then(msg=>msg.delete().catch(e=>console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  Error eliminación evitada`.gray))).catch(e=>console.log(`impidió que se enviara el rol de error`.gray))
                }
                client.social_log.set(ch.guild.id, tempData, `twitch`)
                console.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  NOTIFICACIÓN ENVIADA: https://www.twitch.tv/${StreamData.user_login}`.magenta)
                //fs.writeFileSync('./social_log/streamconfig.json', JSON.stringify(tempData, null, 3))
            }).catch(e=>{cconsole.log(` [TWITCH] | ${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")} | ${guild.name} ::  Evitar el error de envío Embed`.gray)})
          }
        }).catch(() => {});
    })
  }

  async function getStreamData(channelName, clientID, authkey) {
    return new Promise((resolve, reject) => {
      var headers = {
        'Client-Id': clientID,
        'Authorization': `Bearer ${authkey}`
      };
      request.get(
        `https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
          headers: headers
        },
        (error, res, body) => {
          if (error) {
            return console.error(error)
          }
          try {
            resolve(JSON.parse(body))
          } catch (e) {
            reject(e)
          }
        }
      )
    });
  }

  async function getChannelData(channelName, clientID, authkey) {
    return new Promise((resolve, reject) => {
      var headers = {
        'client-id': clientID,
        'Authorization': `Bearer ${authkey}`
      };
      request.get(
        `https://api.twitch.tv/helix/search/channels?query=${channelName}`, {
          headers: headers
        },
        (error, res, body) => {
          if (error) {
            return console.error(error)
          }
          try {
            resolve(JSON.parse(body).data[0])
          } catch (e) {
            reject(e)
          }
        }
      )
    });
  }

  async function getKey(clientID, clientSecret) {
    return new Promise((resolve, reject) => {
      request.post(
        `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`,
        (error, res, body) => {
          if (error) {
            return console.error(error)
          }
          try {
            resolve(JSON.parse(body).access_token)
          } catch (e) {
            reject(e)
          }
        }
      )
    });
  }

  async function UpdateAuthConfig(){
    let tempData = JSON.parse(fs.readFileSync('./social_log/streamconfig.json'));
    const authKey = await getKey(process.env.twitch_clientID || tempData.twitch_clientID, process.env.twitch_secret || tempData.twitch_secret);
    if (!authKey) return console.log(`NO AUTH`);
    var tempConfig = JSON.parse(fs.readFileSync('./social_log/streamconfig.json'));
    tempConfig.authToken = authKey;
    fs.writeFileSync('./social_log/streamconfig.json', JSON.stringify(tempConfig, null, 3));
  }
}
