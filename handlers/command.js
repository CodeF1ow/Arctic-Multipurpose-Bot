const {
  readdirSync
} = require("fs");
const { MessageEmbed } = require("discord.js")
const Enmap = require("enmap");
const serialize = require('serialize-javascript');
const ee = require(`${process.cwd()}/botconfig/embed.json`);
console.log("Hola yo soy Arctic /--/ Desarollado por Kiri /--/ Discord: Kiri86#8565".yellow);
module.exports = (client) => {
  let dateNow = Date.now();
  console.log(`${String("[x] :: ".magenta)}Cargando los Comandos ...`.brightGreen)
  try {
    readdirSync("./commands/").forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
      for (let file of commands) {
        try{
          let pull = require(`../commands/${dir}/${file}`);
          if (pull.name) {
            client.commands.set(pull.name, pull);
            //console.log(`    | ${file} :: Ready`.brightGreen)
          } else {
            //console.log(`    | ${file} :: error -> missing a help.name,or help.name is not a string.`.brightRed)
            continue;
          }
          if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        }catch(e){
          console.log(String(e.stack).grey.bgRed)
        }
      }
    });
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }

  client.backupDB = new Enmap({ name: 'backups', dataDir: "./databases" });
 
  const { GiveawaysManager } = require('discord-giveaways');
  client.giveawayDB = new Enmap({ name: 'giveaways', dataDir: "./databases" });
  const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
        return client.giveawayDB.fetchEverything().array();
    }
    async saveGiveaway(messageId, giveawayData) {
        client.giveawayDB.set(messageId, giveawayData);
        return true;
    }
    async editGiveaway(messageId, giveawayData) {
        client.giveawayDB.set(messageId, giveawayData);
        return true;
    }
    async deleteGiveaway(messageId) {
        client.giveawayDB.delete(messageId);
        return true;
    }
  };
  
  const manager = new GiveawayManagerWithOwnDatabase(client, {
      default: {
          botsCanWin: false,
          embedColor: ee.color,
          embedColorEnd: ee.wrongcolor,
          reaction: '🎉'
      }
  });
  // We now have a giveawaysManager property to access the manager everywhere!
  client.giveawaysManager = manager;
  client.giveawaysManager.on("giveawayReactionAdded", async (giveaway, member, reaction) => {
    try {
      const isNotAllowed = await giveaway.exemptMembers(member);
      if (isNotAllowed) {
        member.send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setThumbnail(member.guild.iconURL({dynamic: true}))
              .setAuthor(`No cumples con los requisitos`, `https://cdn.discordapp.com/emojis/906917501986820136.png?size=128`)
              .setDescription(`> **No está cumpliendo los requisitos para [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), por favor, asegúrese de cumplirlos!.**\n\n> Volver al Canal: <#${giveaway.channelId}>`)
              .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
          ]
        }).catch(() => {});
        reaction.users.remove(member.user).catch(() => {});
        return;
      }
      let BonusEntries = await giveaway.checkBonusEntries(member.user).catch(() => {}) || 0;
      if(!BonusEntries) BonusEntries = 0;
      member.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setThumbnail(member.guild.iconURL({dynamic: true}))
            .setAuthor(`Entrada al Sorteo confirmada`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
            .setDescription(`> **Su entrada para [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) se ha confirmado.**\n\n**PremioPremio:**\n> ${giveaway.prize}\n\n**Cantidad de ganadores:**\n> \`${giveaway.winnerCount}\`\n\n**Sus entradas de bonificación**\n> \`${BonusEntries}\`\n\n> Volver al Canal: <#${giveaway.channelId}>`)
            .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
        ]
      }).catch(() => {});
      console.log(`${member.user.tag} entró en el sorteo #${giveaway.messageId} (${reaction.emoji?.name})`);
    } catch (e) {
      console.log(e);
    }
  });
  client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    try {
      member.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setThumbnail(member.guild.iconURL({dynamic: true}))
            .setAuthor(`Fuera del sorteo!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
            .setDescription(`> **Fuiste rechazado del sorteo [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) y ya no estás participando.**\n\n> Volver al Canal: <#${giveaway.channelId}>`)
            .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
        ]
      }).catch(() => {});
      console.log(`${member.user.tag} fuera del sorteo #${giveaway.messageId} (${reaction.emoji?.name})`);
    } catch (e) {
      console.log(e);
    }
  });
  client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    for(const winner of winners) {
      winner.send({
        contents: `Enhorabuena, **${winner.user.tag}**! Ha ganado el Sorteo.`,
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setThumbnail(winner.guild.iconURL({dynamic: true}))
            .setAuthor(`Sorteo ganado!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
            .setDescription(`> **Usted ganó [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), felicidades!**\n\n> Ve al canal: <#${giveaway.channelId}>\n\n**Premio:**\n> ${giveaway.prize}`)
            .setFooter(winner.guild.name, winner.guild.iconURL({dynamic: true}))
        ]
      }).catch(() => {});
    }
    console.log(`Sorteo #${giveaway.messageId} terminado! Ganadores: ${winners.map((member) => member.user.username).join(', ')}`);
  });
  // This can be used to add features such as a congratulatory message per DM
  manager.on('giveawayRerolled', (giveaway, winners) => {
    for(const winner of winners) {
      winner.send({
        contents: `Enhorabuena, **${winner.user.tag}**! Ha ganado el Sorteo a través de un \`reroll\`.`,
        embeds: [
          new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setThumbnail(winner.guild.iconURL({dynamic: true}))
            .setAuthor(`Sorteo ganado!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
            .setDescription(`> **Usted ganó [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), felicidades!**\n\n> Ir al canal: <#${giveaway.channelId}>\n\n**Premio:**\n> ${giveaway.prize}`)
            .setFooter(winner.guild.name, winner.guild.iconURL({dynamic: true}))
        ]
      }).catch(() => {});
    }
  })
  console.log(`[x] :: `.magenta + `CARGADOS ${client.commands.size} COMANDOS después de: `.brightGreen + `${Date.now() - dateNow}ms`.green)
};



