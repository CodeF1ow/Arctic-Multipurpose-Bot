const {MessageEmbed} = require("discord.js");
const moment = require('moment');
module.exports = {
  name: "roleinfo",
  description: "Obtener información sobre un papel",
  options: [ 
		{"Role": { name: "what_role", description: "De qué función desea obtener información?", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {
    //things u can directly access in an interaction!
    const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    try {   
      var role = options.getRole("what_role");;
      if(!role || role == null || role.id == null || !role.id) return interaction?.reply(client.la[ls].common.rolenotfound)
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor(client.la[ls].cmds.info.roleinfo.author + " " + role.name, guild.iconURL({ dynamic: true }), "https://arcticbot.xyz/discord")
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field1,`\`${role.name}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field2,`\`${role.id}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field3,`\`${role.hexColor}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field4, "\`"+moment(role.createdAt).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(role.createdAt).format("hh:mm:ss") + "\`",true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field5,`\`${role.rawPosition}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field6,`\`${role.members.size} Los Miembros lo tienen\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field7,`\`${role.hoist ? "✔️" : "❌"}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field8,`\`${role.mentionable ? "✔️" : "❌"}\``,true)
        embeduserinfo.addField(client.la[ls].cmds.info.roleinfo.field9,`${role.permissions.toArray().map(p=>`\`${p}\``).join(", ")}`)
        embeduserinfo.setColor(role.hexColor)
        embeduserinfo.setFooter(client.getFooter(es))
        //send the EMBED
        interaction?.reply({ephemeral: true, embeds: [embeduserinfo]})

      
    } catch (e) {
      console.error(e)
    }
  }
}

