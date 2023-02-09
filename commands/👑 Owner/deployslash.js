const {
  MessageEmbed,
  splitMessage
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fs = require('fs');
var {
  databasing,
  isValidURL
} = require(`${process.cwd()}/handlers/functions`);
const {
  inspect
} = require(`util`);
module.exports = {
  name: `deployslash`,
  type: "info",
  category: `👑 Dueño`,
  aliases: [`deployslash`, "deploy", "loadslash", "deployslashcommands", "deployslashcmds", "loadslashcommands", "loadslashcmds"],
  description: `Despliega y habilita los comandos de este Bot! Ya sea de forma global o para un solo grupo.`,
  usage: `deployslash [GUILDID]`,
  cooldown: 360,
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed"); let ls = client.settings.get(message.guild.id, "language")
    if (message.author.id != "275930607702245376")
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.user.username, es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL())
          .setTitle("Sólo Kiri86 puede desplegar el SLASH-COMMANDS")
          .setDescription(`Ir a [Discord-Server](https://arcticbot.xyz/discord), abrir un Ticket!`)
        ]
      });
    try {
      let loadSlashsGlobal = true;
      let guildId = args[0];
      if(guildId){
        let guild = client.guilds.cache.get(guildId);
        if(guild){
          loadSlashsGlobal = false;
          guildId = guild.id;
        }
      }
      if(loadSlashsGlobal){
        let themsg = await message.reply(`🔋 **Al intentar establecer los comandos de Slash global en \`${client.guilds.cache.size} Servidores\`...**`)
        client.application.commands.set(client.allCommands)
          .then(slashCommandsData => {
            themsg.edit(`**\`${slashCommandsData.size} Slash-Commands\`** (\`${slashCommandsData.map(d => d.options).flat().length} Subcommands\`) cargado para todos **posibles servidores**\n> Esos servidores son los que me invitaron con el **LINK DE INVITACIÓN** de \`${prefix}invite\`\n> *Debido a que está utilizando la Configuración Global, puede tardar hasta 1 hora para que cambien los Comandos!*`); 
          }).catch(() => {});
      } else {
        let guild = client.guilds.cache.get(guildId);
        let themsg = await message.reply(`🔋 **Intentando establecer los comandos de GUILD Slash en \`${guild.name}\`...**`)
        await guild.commands.set(client.allCommands).then((slashCommandsData) => {
          themsg.edit(`**\`${slashCommandsData.size} Slash-Commands\`** (\`${slashCommandsData.map(d => d.options).flat().length} Subcommands\`) cargado para todos **${guild.name}**\n> Esos servidores son los que me invitaron con el **LINK DE INVITACIÓN** de \`${prefix}invite\`\n> *Debido a que está utilizando la Configuración Global, puede tardar hasta 1 hora para que cambien los Comandos!*`); 
        }).catch((e) => {
          console.log(e)
          themsg.edit(`**No se han podido cargar los comandos de Slahs para ${guild.name}**\n\n**Me invitaste con este Link en ese Servidor?**\n> $https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot%20applications.commands`)
        });
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable6"]))
      ]});
    }
  },
};

