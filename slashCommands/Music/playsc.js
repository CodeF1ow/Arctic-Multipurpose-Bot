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
  name: `playsc`,
  category: `🎶 Music`,
  aliases: [`psc`, `playsoundcloud`],
  description: `Reproduce una canción de soundcloud`,
  usage: `playsc <Song / URL>`,
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
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      
      let args = [interaction?.options.getString("what_song")]
      if(!args[0]) args = [interaction?.options.getString("song")]
      //if no args return error
      if (!args[0])
        return interaction?.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["playsc"]["variable1"]))
        ]});
      //play the song as SOUNDCLOUD
      playermanager(client, message, args, `song:soundcloud`, interaction);
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["playsc"]["variable2"]))
      ]});
    }
  }
};
