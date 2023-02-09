var {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "setup-serverstats",
  category: "💪 Configurar",
  aliases: ["setupserverstats", "serverstats-setup", "serverstatssetup", "setup-serverstatser", "setupserverstatser"],
  cooldown: 5,
  usage: "setup-serverstats  --> Sigue los pasos",
  description: "Esta configuración le permite especificar un Canal cuyo Nombre debe ser renombrado cada 10 Minutos a un Contador de Miembros de Bots, Usuarios o Miembros",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      message.reply(`Redirecting to: \`setup-membercount\` ...`).then((msg)=>{
        setTimeout(()=>{msg.delete().catch(() => {})}, 3000)
      }).catch(() => {})
      require("./setup-membercount").run(client, message, args, cmduser, text, prefix);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable15"]))
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
        ]
      });
    }
  },
};
