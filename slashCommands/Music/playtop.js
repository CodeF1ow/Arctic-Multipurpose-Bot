const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `playtop`,
  category: `Song`,
  aliases: [`ptop`, `pt`],
  description: `Añade una canción con el nombre/url dado en la parte superior de la cola`,
  usage: `playtop <link/query>`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  options: [ 
		{"String": { name: "what_song", description: "Qué canción/lista de reproducción desea reproducir? <LINK/SEARCH-QUERY>", required: true }}, 
	],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {
    
    //
    if(GuildSettings.MUSIC === false) {
      return interaction?.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try{
      let args = [interaction?.options.getString("what_song")]
      if(!args[0]) args = [interaction?.options.getString("song")]
      //Send information
      interaction?.reply({content: `Buscar e intentar reproducir: **${args[0]}** from <:youtube:973239272045944892> \`Youtube\`!`})
      //Play the song from youtube
      return playermanager(client, message, args, `playtop:youtube`, interaction);
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};
