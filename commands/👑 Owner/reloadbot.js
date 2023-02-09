var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, isValidURL, delay
} = require(`${process.cwd()}/handlers/functions`);
const fs = require("fs")
module.exports = {
  name: "reloadbot",
  category: "👑 Dueño",
  aliases: ["botreload"],
  cooldown: 5,
  type: "info",
  usage: "reloadbot",
  description: "Recarga el bot, todos los eventos de comandos, etc..",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable2"]))
      ]});
    try {
      let clientapp = client.application ? await client.application.fetch().catch(e=>false) : false;
      let guild = client.guilds.cache.get("422166931823394817") 
      return message.reply({content : `**❌​ ESTE COMANDO ESTÁ DESACTIVADO, vaya a https://arcticbot.xyz/discord/ y <#1020477879135510600> para que se reinicie!**\n\n\n> **Path:**
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
${clientapp.owner.discriminator ? "Owner: " + clientapp.owner.tag : "Equipo: " + clientapp.owner.name + "\n |-> Miembros: " + clientapp.owner.members.map(uid=>`${uid.user.tag}`).join(", ")  + "\n |-> Propietario del Bot: " + `${guild.members.cache.get(clientapp.owner.ownerId) && guild.members.cache.get(clientapp.owner.ownerId).user ? guild.members.cache.get(clientapp.owner.ownerId).user.tag : clientapp.owner.ownerId }`} 
Icon: ${clientapp.iconURL()}
Bot-Public: ${clientapp.botPublic ? "✅": "❌"} (Invitar a la gente)
\`\`\`
> **Sobre mí:**
\`\`\`yml
${clientapp.description ? clientapp.description : "❌ AÚN NO HAY DESCRIPCIÓN!"}
\`\`\``
      : ""}
      `});
        const index = require("../../index")
        await client.destroy()
      let tempmsg = await message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.color).setFooter(client.getFooter(es))
        .setAuthor(`Reloading ...`, `https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif`,  `https://arcticbot.xyz/discord`)
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable4"]))
      ]})
      //clear the commands collection
      await client.commands.clear();
      //Delete all files from the cache
      await fs.readdirSync("./commands/").forEach((dir) => {
        const commands = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
          try{
            console.log(`SUCCESS :: ../../commands/${dir}/${file}.js`)
            delete require.cache[require.resolve(`../../commands/${dir}/${file}.js`)]
          }catch{ 
          }  
        }
      })
      //WAIT 1 SEC
      await delay(1000);
      //clear all events
      await client.removeAllListeners()
      //wait 1 Sec
      await delay(1000);
      //REMOVE ALL BASICS HANDLERS
      await client.basicshandlers.forEach(handler => {
        try{ delete require.cache[require.resolve(`../../handlers/${handler}`)]; console.log(`SUCCESS :: ../../handlers/${handler}`); }catch (e){ console.log(e.stack ? String(e.stack).dim : String(e).dim) }
      });
      //REMOVE ALL SOCIAL HANDLERS
      await client.socialhandlers.forEach(handler=>{
        try{ delete require.cache[require.resolve(`../../social_log/${handler}`)]; console.log(`SUCCESS :: ../../social_log/${handler}`); }catch (e){ console.log(e.stack ? String(e.stack).dim : String(e).dim) }
      })
      //REMOVE ALL OTHER HANDLERS
      await client.allhandlers.forEach(handler => {
        try{ delete require.cache[require.resolve(`../../handlers/${handler}`)]; console.log(`SUCCESS :: ../../handlers/${handler}`); }catch (e){ console.log(e.stack ? String(e.stack).dim : String(e).dim) }
      });
      client.Joblivelog.stop()
      client.Joblivelog2.stop()
      client.Jobyoutube.stop()
      client.Jobtwitterfeed.stop()
      client.Jobtiktok.stop()

      client.Jobroster.stop()
      client.Jobroster2.stop()
      client.Jobroster3.stop()
      client.Jobmembercount.stop()
      client.JobJointocreate.stop()
      client.JobJointocreate2.stop()
      client.Jobdailyfact.stop()
      client.Jobmute.stop()
      //wait 1 Sec
      await delay(1000);
      //Load the basics, (commands, dbs, events, etc.)
      await index.requirehandlers();
      //LOAD THE SOCIAL LOGS
      await index.requiresociallogs();
      //LOAD ALL OTHER HANDLERS
      await index.requireallhandlers();
      //SEND SUCCESS
      await delay(3000);
      await tempmsg.edit({embeds: [new MessageEmbed()
        .setColor(es.color).setFooter(client.getFooter(es))
        .setAuthor(`Successfully Reloaded:`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?v=1`, `https://arcticbot.xyz/discord`)
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable6"]))
      ]})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["reloadbot"]["variable7"]))
      ]});
    }
  },
};
