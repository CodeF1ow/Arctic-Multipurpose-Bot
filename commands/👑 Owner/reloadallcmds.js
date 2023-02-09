var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
const fs = require('fs');
var {
  databasing,
  isValidURL
} = require(`../../handlers/functions`);
module.exports = {
  name: `reloadallcmds`,
  category: `👑 Dueño`,
  type: "info",
  aliases: [`reloadallcommands`],
  description: `Recarga todos los comandos`,
  usage: `reloadallcmds`,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    
    
    if (!config.ownerIDS.includes(message.author.id))
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.user.username, es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL())
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable1"]))
      ]});
    try {
      let t = await message.reply("Ahora recargando todos los comandos, puede tomar hasta 10 segundos!");
      client.commands.clear();
      client.aliases.clear()
      const {
        readdirSync
      } = require("fs");
      readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
          try{
            delete require.cache[require.resolve(`../../commands/${dir}/${file}`)] 
            let pull = require(`../../commands/${dir}/${file}`);
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
      await t.edit(`Loaded ${client.commands.size} Commands!`)
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable6"]))
      ]});
    }
  },
};

