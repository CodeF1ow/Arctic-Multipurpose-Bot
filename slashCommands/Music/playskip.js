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
  name: `playskip`,
  description: `Reproduce una canción al instante desde youtube, lo que significa que salta la pista actual y reproduce la siguiente canción`,
  parameters: {
    "type": "music",
    "activeplayer": false,
    "check_dj": true,
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
        interaction?.reply({content: `⏭️ Buscar e intentar reproducir: **${args[0]}** from <:youtube:973239272045944892> \`Youtube\`!`})
        //play the SONG from YOUTUBE
        playermanager(client, message, args, `skiptrack:youtube`, interaction);
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};
