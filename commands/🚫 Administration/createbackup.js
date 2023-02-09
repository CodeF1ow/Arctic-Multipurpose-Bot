const Discord = require("discord.js");
const {MessageEmbed, Permissions} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
const ms = require("ms");
const {
    databasing
} = require(`${process.cwd()}/handlers/functions`);
const backup = require("discord-backup");
module.exports = {
    name: "createbackup",
    aliases: ["create-backup", "cbackup", "backup"],
    category: "🚫 Administracion",
    description: "Crear una copia de seguridad del servidor",
    usage: "createbackup",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix) => {
    
        if(!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply("❌​ **Me falta el permiso de ADMINISTRADOR!**")
        }
        let owner = await message.guild.fetchOwner().catch(e=>{
            return message.reply("No se ha podido conseguir el propietario del Servidor de destino")
        })
        if(owner.id != cmduser.id) {
            return message.reply(`❌​ **Tiene que ser el propietario de este servidor!**`)
        }
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        let adminroles = client.settings.get(message.guild.id, "adminroles")
        let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.createbackup")
        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (message.guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (message.guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    
                    //console.log(r)
                    client.settings.remove(message.guild.id, r, `cmdadminroles.createbackup`)
                }
            }
        }
        if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
            return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable1"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable2"]))
            ]});
        client.backupDB.ensure(message.guild.id, {
            backups: [ ]
        })
        message.channel.send({
            content: `⚠️ **ESTO GUARDARÁ TODOS LOS DATOS** ⚠️\n> Si hay más de 6 copias de seguridad, se borrará la más antigua!\n\n> *Has probado: \`${prefix}setup-autobackup\`, para habilitar las copias de seguridad automáticas?*`,
            components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setStyle("DANGER").setLabel("Continue").setCustomId("verified")])]
        }).then(msg => {
            //Create the collector
            const collector = msg.createMessageComponentCollector({ 
                filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                time: 90000
            })
            //Menu Collections
            collector.on('collect', button => {
                if (button?.user.id === cmduser.id) {
                    collector.stop();
                    button?.reply({content: `<a:Loading:833101350623117342> **Ahora guarda la copia de seguridad!**\nEsto puede tardar hasta 2 minutos (pertenece a su cantidad de datos)`}).catch(() => {})
                    // Create the backup
                    backup.create(message.guild, {
                        maxMessagesPerChannel: 10,
                        jsonSave: false,
                        saveImages: "base64",
                        jsonBeautify: true
                    }).then((backupData) => {
                        let backups = client.backupDB.get(message.guild.id, "backups")
                        backups.push(backupData);
                        backups = backups.sort((a,b)=>b?.createdTimestamp - a.createdTimestamp)
                        if(backups.length > 5) backups = backups.slice(0, 5);
                        client.backupDB.set(message.guild.id, backups, "backups")
                        // And send informations to the backup owner
                        message.author.send(`​✔️ **Copia de seguridad creada con éxito.**\n\n**Para cargarlo escriba:**\n> \`${prefix}loadbackup ${message.guild.id} 1\` ... nota 1 es la última copia de seguridad, cuanto más alto sea el número más antiguo (5 es el más alto) \`${prefix}listbackups ${message.guild.id}\`!\n\n> *Has probado?: \`${prefix}setup-autobackup\`, para habilitar las copias de seguridad automáticas?*`).catch(e=>{
                            message.channel.send(`​✔️ **Copia de seguridad creada con éxito.**\n\n**Para cargarlo escriba:**\n> \`${prefix}loadbackup ${message.guild.id} 1\` ... nota 1 es la última copia de seguridad, cuanto más alto sea el número, más antigua será (5 es la más alta) \`${prefix}listbackups ${message.guild.id}\`!\n\n> *Has probado?: \`${prefix}setup-autobackup\`, para habilitar las copias de seguridad automáticas?*`);
                        }).then(()=>{
                            message.channel.send(`​✔️ **Copia de seguridad creada con éxito.** El ID de la copia de seguridad se envió en dm!\n\n> *Has probado: \`${prefix}setup-autobackup\`, para habilitar las copias de seguridad automáticas?*`);
                        })
                    }).catch(e=>{
                        console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                }
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
                msg.edit({components: [], content: msg.content}).catch(() => {})
            });
        })

        if(client.settings.get(message.guild.id, `adminlog`) != "no"){
            try{
              var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
              if(!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
              channel.send({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
                .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable49"]))
                .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
               .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
                .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
              ]})
            }catch (e){
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
            }
          } 
    }
}

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}