const { MessageEmbed } = require("discord.js");
module.exports = async client => {
    let messageIds = new Map();
    client.on("messageCreate", (message) => {
        if(!message.guild || message.guild.available === false) return;
        client.settings.ensure(message.guild.id, {
            ghost_ping_detector: false,
            ghost_ping_detector_max_time: 10000,
        })
        let data = client.settings.get(message.guild.id)
        if(data.ghost_ping_detector && message.mentions && ((message.mentions.users && message.mentions.users.size > 0)))
        {
            messageIds.set(message.id, Date.now());
            setTimeout(() => {
                if(messageIds.has(message.id)){
                    messageIds.delete(message.id);
                }
            }, data.ghost_ping_detector_max_time)
        }
    })
    client.on("messageDelete", async (message) => {
        if(!message.guild || message.guild.available === false) return;
        client.settings.ensure(message.guild.id, {
            ghost_ping_detector: false,
            ghost_ping_detector_max_time: 10000,
        })
        client.settings.ensure(message.guild.id,{
            autowarn: {
                antispam: false,
                antiselfbot: false,
                antimention: false,
                antilinks: false,
                antidiscord: false,
                anticaps: false,
                blacklist: false,
                ghost_ping_detector: false,
            }
        })
        let autowarn = client.settings.get(message.guild.id, "autowarn");
        let data = client.settings.get(message.guild.id)
        if(data.ghost_ping_detector && messageIds.has(message.id) && Date.now() - messageIds.get(message.id) <= data.ghost_ping_detector_max_time){
           
            if(autowarn.ghost_ping_detector){
                client.userProfiles.ensure(message.author.id, {
                    id: message.author.id,
                    guild: message.guild.id,
                    totalActions: 0,
                    warnings: [],
                    kicks: []
                    });
                    const newActionId = client.modActions.autonum;
                    client.modActions.set(newActionId, {
                        user: message.author.id,
                        guild: message.guild.id,
                        type: 'warning',
                        moderator: message.author.id,
                        reason: "Autoaviso del detector de ping fantasma",
                        when: new Date().toLocaleString(`de`),
                        oldhighesrole: message.member.roles ? message.member.roles.highest : `No tenia ningun Rol`,
                        oldthumburl: message.author.displayAvatarURL({
                            dynamic: true
                        })
                    });
                    // Push the action to the user's warnings
                    client.userProfiles.push(message.author.id, newActionId, 'warnings');
                    client.userProfiles.inc(message.author.id, 'totalActions');
                    client.stats.push(message.guild.id+message.author.id, new Date().getTime(), "warn"); 
                    const warnIDs = client.userProfiles.get(message.author.id, 'warnings')
                    const warnData = warnIDs.map(id => client.modActions.get(id));
                    let warnings = warnData.filter(v => v.guild == message.guild.id);
                    message.channel.send({
                        embeds: [
                            new MessageEmbed().setAuthor(client.getAuthor(message.author.tag, message.member.displayAvatarURL({dynamic: true})))
                            .setColor("ORANGE").setFooter(client.getFooter("ID: "+ message.author.id, message.author.displayAvatarURL({dynamic:true})))
                            .setDescription(`> <@${message.author.id}> **recibió un aviso autogenerado - \`Detector de pings fantasma\`**!\n\n> **Ahora tiene \`${warnings.length} Advertencias\`**`)
                        ]
                    });
                    let warnsettings = client.settings.get(message.guild.id, "warnsettings")
                    if(warnsettings.kick && warnsettings.kick == warnings.length){
                    if (!message.member.kickable)
                        message.channel.send({embeds :[new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable8"]))
                        ]});
                    else {
                        try{
                        message.member.send({embeds : [new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable9"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable10"]))
                        ]});
                        } catch{
                        return message.channel.send({embeds :[new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable11"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable12"]))
                        ]});
                        }
                        try {
                        message.member.kick({
                            reason: `Alcanzado ${warnings.length} Advertencias`
                        }).then(() => {
                            message.channel.send({embeds :[new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                            ]});
                        });
                        } catch (e) {
                        console.log(e.stack ? String(e.stack).grey : String(e).grey);
                        message.channel.send({embeds : [new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(client.la[ls].common.erroroccur)
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
                        ]});
                        }
                    }
                        
                    }
                    if(warnsettings.ban && warnsettings.ban == warnings.length){
                    if (!message.member.bannable)
                        message.channel.send({embeds : [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable16"]))
                        ]});
                        else {
                        try{
                        message.member.send({embeds :[new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable17"]))
                        ]});
                        } catch {
                        message.channel.send({embeds :[new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable18"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable19"]))
                        ]});
                        }
                        try {
                        message.member.ban({
                            reason: `Alcanzado ${warnings.length} Advertencias`
                        }).then(() => {
                            message.channel.send({embeds :[new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                            ]});
                        });
                        } catch (e) {
                        console.log(e.stack ? String(e.stack).grey : String(e).grey);
                        message.channel.send({embeds :[new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable22"]))
                            .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable23"]))
                        ]});
                        }}
                    }
                    for(const role of warnsettings.roles){
                    if(role.warncount == warnings.length){
                        if(!message.member.roles.cache.has(role.roleid)){
                        message.member.roles.add(role.roleid).catch((O)=>{})
                        }
                    }
                    }
            }
            let channel = message.guild.channels.cache.get(data.ghost_ping_detector);
            if(!channel) channel = await message.guild.channels.fetch(data.ghost_ping_detector).catch(()=>{}) || false;
            if(!channel) return client.settings.set(message.guild.id, false, "ghost_ping_detector");
            channel.send({embeds: [
                new MessageEmbed()
                .setFooter(client.getFooter("ID:" + message.author.id, message.member.displayAvatarURL({dynamic: true})))
                .setColor("ORANGE").setTitle("DETECTOR DE PINGS FANTASMA").setDescription(`**Autor del Mensaje:**\n> ${message.author} | ${message.author.tag} (\`${message.author.id}\`)\n**Canal:**\n> ${message.channel} | ${message.channel.name} (\`${message.channel.id}\`)\n**Tiempo de eliminación:**\n> \`${Math.floor((Date.now() - messageIds.get(message.id)) / 1000)} Segundos\`\n\n**[${message.mentions.users.size}] Ping${message.mentions.users.size == 1 ? "" : "s"}:**\n> ${message.mentions.users.map(p => `${p}`).join(", ")}`.substring(0, 2048)).setTimestamp()
            ]}).catch(console.log);
            if(messageIds.has(message.id)){
                messageIds.delete(message.id);
            }
        }
    })
}