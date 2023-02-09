const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { duration, handlemsg } = require(`${process.cwd()}/handlers/functions`)
const { Collection, MessageActionRow, MessageSelectMenu } = require("discord.js");
module.exports = {
    name: "botfaq",
    description: "Preguntas frecuentes, sobre mí!",
    run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {
      //things u can directly access in an interaction!
      const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
      const { guild } = member;
		try{
      let kiridc = client.guilds.cache.get("422166931823394817")
      let kirimembers = await kiridc.members.fetch().catch(() => null) || new Collection();
      let partnercount = kirimembers.filter(m => m?.roles?.cache?.has("536999145026748424") || false)
      partnercount = partnercount.map(m=> m?.id).length || 0;
      
      let menuoptions = [
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[0].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[0].description,
          replymsg: client.la[ls].cmds.info.botfaq.menuoptions[0].replymsg,
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[1].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[1].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[1].replymsg, {
            commandcount: client.commands.map(a=>a).length,
            guildcount: client.guilds.cache.size,
            uptime: duration(client.uptime).map(i=> `\`${i}\``).join(", "),
            ping: Math.floor(client.ws.ping)
          }),
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[2].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[2].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[2].replymsg, {
            prefix: prefix,
            commandcount: client.commands.map(a=>a).length,
          }),
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[3].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[3].description,
          replymsg: client.la[ls].cmds.info.botfaq.menuoptions[3].replymsg,
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[4].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[4].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[4].replymsg, {
            partnercount: partnercount
          }),
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[5].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[5].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[5].replymsg, {
            prefix: prefix
          }),
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[6].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[6].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[6].replymsg, {
            prefix: prefix,
            clientusertag: client.user.tag
          }),
        },
      ]
      //define the selection
      let Selection = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
          .setCustomId("Botfaq-SlashCmd")
          .setPlaceholder(client.la[ls].cmds.info.botfaq.placeholder)
          .addOptions(menuoptions.map(o => {
            let Obj = {}; 
            Obj.value = o.value.substring(0, 25);
            Obj.label = o.value.substring(0, 25);
            Obj.description = o.description.substring(0, 50);
            Obj.emoji = o.emoji;
            return Obj;
          }))
        );
      //define the embed
      let MenuEmbed = new Discord.MessageEmbed()
      .setColor(es.color)
      .setAuthor(client.getAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://discord.gg/milrato"))
      .setDescription(client.la[ls].cmds.info.botfaq.menuembed.description)
      //send the menu msg
      await interaction?.reply({embeds: [MenuEmbed], components: [Selection], ephemeral: true})
      //function to handle the menuselection
      function menuselection(interaction) {
        let menuoptiondata = menuoptions.find(v=>v.value.substring(0, 25) == interaction?.values[0])
        interaction?.reply({embeds: [new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor(client.getAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://discord.gg/milrato"))
        .setDescription(menuoptiondata.replymsg)], ephemeral: true});
      }
      //Event
      client.on('interactionCreate', (interaction) => {
        if (!interaction?.isSelectMenu()) return;
        if (interaction?.customId === "Botfaq-SlashCmd" && interaction?.applicationId == client.user.id) {
          menuselection(interaction);
        }
      });
    } catch (e) {
        console.error(e)
    }
  },
};
