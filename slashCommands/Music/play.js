const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `play`,
  description: `Reproduce una canción/lista de reproducción de Youtube`,
  parameters: {
    "type": "music",
    "activeplayer": false,
    "previoussong": false
  }, 
  options: [ 
		{"String": { name: "what_song", description: "Qué canción/lista de reproducción desea reproducir? <LINK/SEARCH-QUERY>", required: true }}, 
	],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {
    
    //
    if(GuildSettings.MUSIC === false) {
      return interaction?.reply({ephemeral: true, embed : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {

      let args = [interaction?.options.getString("what_song")]
      if(!args[0]) args = [interaction?.options.getString("song")]
      //Send information
      interaction?.reply({content: `Buscar reproduccion: **${args[0]}** from <:youtube:973239272045944892> \`Youtube\`!`})
      //play the SONG from YOUTUBE
      playermanager(client, message, args, `song:youtube`, interaction);
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

