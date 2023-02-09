var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, isValidURL
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "botfilename",
  category: "👑 Dueño",
  aliases: ["originalbotname"],
  cooldown: 5,
  usage: "botfilename",
  type: "info",
  description: "Si te preguntamos por el nombre del Bot Original o cuando lo pediste puedes ejecutar este Comando para averiguarlo!",
  run: async (client, message, args, cmduser, text, prefix) => {
  
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["botfilename"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["botfilename"]["variable2"]))
        ]});
    try {
      let clientapp = client.application ? await client.application.fetch().catch(e=>false) : false;
      let guild = client.guilds.cache.get("773668217163218944")
      message.channel.send({content : `> **Path:**
\`\`\`yml
${process.cwd()}
\`\`\`
> **Servidor:**
\`\`\`yml
${String(Object.values(require(`os`).networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i?.family===`IPv4` && !i?.internal && i?.address || []), [])), [])).split(".")[3]}
\`\`\`
> **Comando:**
\`\`\`yml
pm2 list | grep "${String(String(process.cwd()).split("/")[String(process.cwd()).split("/").length - 1]).toLowerCase()}" --ignore-case
\`\`\`
${clientapp ? `
> **Información sobre la solicitud:**
\`\`\`yml
Link: https://discord.com/developers/applications/${client.user.id}
Name: ${clientapp.name} 
${clientapp.owner.discriminator ? "Owner: " + clientapp.owner.tag : "Team: " + clientapp.owner.name + "\n |-> Members: " + clientapp.owner.members.map(uid=>`${uid.user.tag}`).join(", ")  + "\n |-> Team-Owner: " + `${guild.members.cache.get(clientapp.owner.ownerId) && guild.members.cache.get(clientapp.owner.ownerId).user ? guild.members.cache.get(clientapp.owner.ownerId).user.tag : clientapp.owner.ownerId }`} 
Icono: ${clientapp.iconURL()}
Bot-Public: ${clientapp.botPublic ? "✅": "❌"} (Invite able)
\`\`\`
> **About me:**
\`\`\`yml
${clientapp.description ? clientapp.description : "❌ AÚN NO HAY DESCRIPCIÓN!"}
\`\`\``
: ""}
`})
          } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["botfilename"]["variable3"]))
      ]});
    }
  },
};
