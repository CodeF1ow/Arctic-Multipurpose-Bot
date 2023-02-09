const Discord = require("discord.js");
const {MessageEmbed, Permissions} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
const ms = require("ms");
const {
    databasing, swap_pages
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
    name: "giveaway",
    aliases: ["g"],
    category: "🚫 Administracion",
    description: "Gestor de sorteos",
    usage: "giveaway <start/end/reroll/edit/delete/list>",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix) => {
    
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        let adminroles = client.settings.get(message.guild.id, "adminroles")
        let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.giveaway")
        var cmdrole = []
        if (cmdroles.length > 0) {
            for (const r of cmdroles) {
                if (message.guild.roles.cache.get(r)) {
                    cmdrole.push(` | <@&${r}>`)
                } else if (message.guild.members.cache.get(r)) {
                    cmdrole.push(` | <@${r}>`)
                } else {
                    
                    //console.log(r)
                    client.settings.remove(message.guild.id, r, `cmdadminroles.giveaway`)
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
        if (!args[0]) return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable3"]))
            .setDescription(`> \`${prefix}giveaway start\` ... para iniciar un nuevo sorteo

> \`${prefix}giveaway end <G-Id>\` ... para finalizar un sorteo específico

> \`${prefix}giveaway reroll <G-Id> [winneramount]\` ... para volver a lanzar un sorteo específico

> \`${prefix}giveaway pause <G-Id>\` ... para poner en pausa un sorteo específico

> \`${prefix}giveaway resume <G-Id>\` ... para reanudar un sorteo específico

> \`${prefix}giveaway edit <G-Id>\` ... para editar un sorteo específico

> \`${prefix}giveaway delete <G-Id>\` ... para eliminar un sorteo específico

> \`${prefix}giveaway list [server/all]\` ... para hacer una lista de regalos aquí / en todo el mundo

:warning: **A VECES LOS SORTEOS NO TERMINAN** :warning:
> Aquí hay algo que puede hacer:
> \`${prefix}giveaway winner <G-Id>\`
> Esto enviará al ganador o ganadores del sorteo, recibido de la base de datos`)
        ]})
        var originalowner = message.author.id
        if (args[0].toLowerCase() === "start") {
            try{
                let giveawayChannel;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable5"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable6"]))
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                var channel = collected.first().mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(collected.first().content);
                if(!channel) throw { message: "No ha mencionado un canal válido, en el que debería empezar el sorteo!" }
                giveawayChannel = channel;


                let giveawayDuration;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable11"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable12"]))
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                gargs = collected.first().content.split("+");
                giveawayDuration = 0;
                for(const a of gargs){
                    giveawayDuration += ms(a.split(" ").join(""))
                }
                if(!giveawayDuration || isNaN(giveawayDuration)) throw { message: "Ha añadido una Hora no válida!" };


                let giveawayNumberWinners;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable17"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable18"]))
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                giveawayNumberWinners = collected.first().content;
                if(!giveawayNumberWinners || isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) throw { message: "Ha añadido una cantidad no válida de Ganadores" };

            
                let giveawayPrize;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable23"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable24"]))
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                giveawayPrize = collected.first().content;
                
                giveawayNumberWinners = parseInt(giveawayNumberWinners);
                if(giveawayNumberWinners <= 0) giveawayNumberWinners = 1;
                let options = {
                    time: giveawayDuration,
                    duration: giveawayDuration,
                    prize: `🎉​ ${giveawayPrize} 🎉​`,
                    winnerCount: giveawayNumberWinners,
                    hostedBy: message.author,
                    thumbnail: es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null,
                    botsCanWin: false,
                    embedColor: require("discord.js").Util.resolveColor(es.color) ? require("discord.js").Util.resolveColor(es.color) : 3932049,
                    embedColorEnd: require("discord.js").Util.resolveColor(es.wrongcolor) ? require("discord.js").Util.resolveColor(es.wrongcolor) : 16731451,
                    reaction: '1017503732549812364',
                    lastChance: {
                        enabled: true,
                        content: '⚠️ **ÚLTIMA OPORTUNIDAD PARA PARTICIPAR!** ⚠️',
                        threshold: 60000,
                        embedColor: '#FEE75C'
                    },
                    pauseOptions: {
                        isPaused: false,
                        content: '⏸️ **ESTE SORTEO ESTÁ EN PAUSA!** ⏸️',
                        unPauseAfter: null,
                        embedColor: '#582812'
                    },
                    bonusEntries: [],
                    messages: {
                        inviteToParticipate: "***Reaccione con 🎉​ para participar!***\n",
                        drawing: "> Finaliza: {timestamp}\n",
                        hostedBy: "**Organizado por:** {this.hostedBy}",
                        dropMessage: "Sea el primero en reaccionar con 🎉​",
                        noWinner: "\n**Sorteo cancelado!**\n> No hay participaciones válidas. :cry:",
                        endedAt: "Termina en", 
                        giveaway: '🎉​ **SORTEO INICIADO** 🎉​',
                        giveawayEnded: '🎉​ **SORTEO FINALIZADO** 🎉​',
                        winMessage: '**Felicidades** {winners}!\n> Usted ganó **{this.prize}**!\n> **Saltar:** {this.messageURL}\nOrganizado por: {this.hostedBy}',
                        embedFooter: '{this.winnerCount} Ganador{this.winnerCount > 1 ? "s" : ""}'
                    },
                }





                let bonusentriesdata;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`Desea añadir Roles de Entrada de Bonos?`)
                    .setDescription(`Tipo: \`no\` o \`0\` Entradas de bonificación, si no quiere tener ninguna!\n\nPara añadir entradas de bonificación, **Haga ping a un rol y después escriba la cantidad de entradas!**\n\n**Ejemplo:**\n> \`@ROL 3\`\n\n> *Si quiere añadir múltiples entradas de bonificación haga algo así:*\nEjemplo:\n> \`@Rol 2, @Rol 2, @Rol5\``)
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                bonusentriesdata = collected.first();
                if(bonusentriesdata.mentions.roles.size > 0){
                    let args = bonusentriesdata.content.split(",").map(i => i?.trim());
                    if(bonusentriesdata.mentions.roles.size > 1){
                        if(!args[0]) return message.reply(":x: Entrada inválida de múltiples funciones de bonificación, compruebe el EJEMPLO!")
                        options.messages.giveaway += "\n\n**FUNCIONES DE ENTRADA DE LA BONIFICACIÓN:**\n";
                        options.messages.giveawayEnded += "\n\n**FUNCIONES DE ENTRADA DE LA BONIFICACIÓN:**\n";
                        [ ...bonusentriesdata.mentions.roles.values() ].forEach((role, index) => {
                            let curData = args[index].split(" ");
                            let Amount = Math.floor(Number(curData[1]) || null) || null
                            var roleid = role.id;
                            options.bonusEntries.push({
                                // Members who have the "Nitro Boost" role get 2 bonus entries
                                bonus: new Function('member', `return member && member.roles && member.roles.cache.size > 1 && member.roles.cache.some((r) => r.id === \'${roleid}\') ? \'${Amount}\' ? \'${Amount}\' : 1 : null`),
                                cumulative: true
                            })
                            options.messages.giveaway += `> <@&${role.id}> | \`${Amount ? Amount : 1} Puntos\`\n`
                            options.messages.giveawayEnded += `> <@&${role.id}> | \`${Amount ? Amount : 1} PuntosPuntos\`\n`
                        })
                    }
                    //One Bonus entrie
                    else {
                        options.bonusEntries.push({
                            // Members who have the "Nitro Boost" role get 2 bonus entries
                            bonus: new Function('member', `return member && member.roles && member.roles.cache.size > 1 && member.roles.cache.some((r) => r.id === \'${bonusentriesdata.mentions.roles.first().id}\') ? Math.floor(Number(\'${bonusentriesdata.content.split(" ")[1]}\')) ? Math.floor(Number(\'${bonusentriesdata.content.split(" ")[1]}\')) : 1 : null`),
                            cumulative: true
                        })
                        options.messages.giveaway += `\n\n**ROL DE ENTRADA DE LA BONIFICACIÓN:**\n> <@&${bonusentriesdata.mentions.roles.first().id}> | \`${Math.floor(Number(bonusentriesdata.content.split(" ")[1])) ? Math.floor(Number(bonusentriesdata.content.split(" ")[1])) : 1} Puntos\`\n`
                        options.messages.giveawayEnded += `\n\n**ROL DE ENTRADA DE LA BONIFICACIÓN:**\n> <@&${bonusentriesdata.mentions.roles.first().id}> | \`${Math.floor(Number(bonusentriesdata.content.split(" ")[1])) ? Math.floor(Number(bonusentriesdata.content.split(" ")[1])) : 1} Puntos\`\n`
                    }
                }



                let requiredroles;
                await message.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                    .setFooter(client.getFooter(es))
                    .setTitle(`¿Desea un rol requerido?`)
                    .setDescription(`Tipo: \`no\` o \`0\` Roles requeridos, si no quiere tener ninguno!\n\nPara añadir Roles Requeridos, **Ping a todos los Roles** que debe ser **requerido (los usuarios sólo necesitan al menos uno de ellos)**\n\n**EjemploEjemplo:**\n> \`@ROL1 @ROL2\` (1 El rol también es suficiente)\n\n**NOTA:**\n> *Los usuarios sin el Rol, pueden reaccionar, pero __no se participa__!*`)
                ]})
                var collected = await message.channel.awaitMessages({filter: m=>m.author.id == originalowner,  max: 1, time: 60e3, errors: ['time'] })
                requiredroles = collected.first();
                if(requiredroles.mentions.roles.size >= 1){
                    let theRoles = [...requiredroles.mentions.roles.values()];
                    options.messages.giveaway += `\n\n**ROLES REQUERIDOS:**\n${[...theRoles].map(r=>`> <@&${r.id}>`).join("\n")}`;
                    options.messages.giveawayEnded += `\n\n**REQUIRED ROLES:**\n${[...theRoles].map(r=>`> <@&${r.id}>`).join("\n")}`;
                    theRoles = theRoles.map(r => r.id);
                    options.exemptMembers = new Function('member', `return !member || !member.roles ||!member.roles.cache.some((r) => \'${theRoles}\'.includes(r.id))`)
                }
                options.messages.giveaway = options.messages.giveaway.substring(0, 2000)
                options.messages.giveawayEnded = options.messages.giveawayEnded.substring(0, 2000)
                //role requirements
                client.giveawaysManager.start(giveawayChannel, options);

                message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable27"])});
            } catch (error){ 
                console.log(error)
                return message.reply({embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable25"]))
                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable26"]))
                ]})
            }
            // And the giveaway has started!
        } else if (args[0].toLowerCase() === "end") {
            args.shift();
            if (!args[0]) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable28"])});
            }
            let giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);

            if (!giveaway) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable29"])});
            }

            client.giveawaysManager.edit(giveaway.messageId, {
                    setEndTimestamp: Date.now()
                })
                .then(() => {
                    message.reply({content : "El sorteo terminará en menos de 10 segundos!"});
                })
                .catch((e) => {
                    if (e.startsWith(`Regalo con mensaje Id ${giveaway.messageId} ya ha terminado.`)) {
                        message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable31"])});
                    } else {
                        console.error(e);
                        message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable32"])});
                    }
                });
        } else if (args[0].toLowerCase() === "reroll") {
            args.shift();
            if (!args[0]) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable33"])});
            }
            let rerollamount = parseInt(args[1]);
            let giveaway =
                client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);
            if (!giveaway) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable34"])});
            }
            client.giveawaysManager.reroll(giveaway.messageId, { winnerCount: !isNaN(args[1]) ? Number(args[1]) : 1})
                .then(() => {
                    message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable35"]) + "Tipp!\nAñada al final la cantidad de ganadores de las tiradas!"});
                })
                .catch((e) => {
                    if (e.startsWith(`Sorteo con mensaje Id ${giveaway.messageId} no se termina.`)) {
                        message.reply(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable36"]));
                    } else {
                        console.error(e);
                        message.reply({content : '❌​ **Se ha producido un error...**```' + String(e.message).substring(0, 1900) + "```"});
                    }
                });


        } else if (args[0].toLowerCase() === "pause") {
            args.shift();
            if (!args[0]) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable33"])});
            }
            let giveaway = client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);
            if (!giveaway) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable34"])});
            }
            client.giveawaysManager.pause(giveaway.messageId)
                .then(() => {
                    message.reply( { content : "Con éxito! Pausa en el sorteo" } );
                })
                .catch((e) => {
                    if (e.startsWith(`Sorteo con mensaje Id ${giveaway.messageId} no se termina.`)) {
                        message.reply(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable36"]));
                    } else {
                        console.error(e);
                        message.reply({content : '❌​ **Se ha producido un error...**```' + String(e.message).substring(0, 1900) + "```"});
                    }
                });
        } else if (args[0].toLowerCase() === "unpause" || args[0].toLowerCase() === "resume") {
            args.shift();
            if (!args[0]) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable33"])});
            }
            let giveaway =
                client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
                client.giveawaysManager.giveaways.find((g) => g.messageId === args[0]);
            if (!giveaway) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable34"])});
            }
            client.giveawaysManager.unpause(giveaway.messageId)
                .then(() => {
                    message.reply( { content : "Exito! El sorteo ya no esta en pausa!" } );
                })
                .catch((e) => {
                    if (e.startsWith(`Sorteo con mensaje Id ${giveaway.messageId} no se ha terminado.`)) {
                        message.reply(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable36"]));
                    } else {
                        console.error(e);
                        message.reply({content : '❌​ **Se ha producido un error...**```' + String(e.message).substring(0, 1900) + "```"});
                    }
                });
        } else if (args[0].toLowerCase() === "edit") {
            args.shift();
            let messageId = args[0];
            if (!messageId) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable37"])});
            }
            let giveawayPrize = args.slice(1).join(' ');
            if (!giveawayPrize) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable38"])});
            }
            client.giveawaysManager.edit(messageId, {
                newWinnerCount: 3,
                newPrize: giveawayPrize,
                addTime: 5000
            }).then(() => {
                // here, we can calculate the time after which we are sure that the lib will update the giveaway
                const numberOfSecondsMax = client.giveawaysManager.options.updateCountdownEvery / 1000;
                message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable39"])});
            }).catch((err) => {
                message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable40"])});
            });
        } else if (args[0].toLowerCase() === "delete") {
            args.shift();
            let messageId = args[0];
            if (!messageId) {
                return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable41"])});
            }
            client.giveawaysManager.delete(messageId).then(() => {
                    message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable42"])});
                })
                .catch((err) => {
                    message.reply({content : eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable43"])});
                });
        } else if (args[0].toLowerCase() === "list") {
            args.shift();
            if (args[0] && args[0].toLowerCase() === "server") {
                let allGiveaways = client.giveawaysManager.giveaways.filter((g) => g.guildId === message.guild.id && !g.ended); // [ {Giveaway}, {Giveaway} ]
                buffer = [];
                for (let i = 0; i < allGiveaways.length; i++) {
                    try{
                    buffer.push(`> Prize: ${allGiveaways[i].prize}\n> Duración: \`${ms(new Date() - allGiveaways[i].startAt)}\` | [\`JUMP TO IT\`](https://discord.com/channels/${allGiveaways[i].guildId}/${allGiveaways[i].channelId}/${allGiveaways[i].messageId})\n`)
                }catch{}
                }
                if(buffer.length < 1) return message.reply("No hay sorteos disponibles!")
                return swap_pages(client, message, buffer, eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable45"]));
            } else {
                let allGiveaways = client.giveawaysManager.giveaways.filter((g) => !g.ended); // [ {Giveaway}, {Giveaway} ]
                buffer = [];
                for (let i = 0; i < allGiveaways.length; i++) {
                    try{
                    let invite = client.guilds.cache.get(allGiveaways[i].guildId).invites.cache.size > 0 ? client.guilds.cache.get(allGiveaways[i].guildId).invites.cache.map(invite => invite.url)[0] : client.guilds.cache.get(allGiveaways[i].guildId).channels.cache.first().permissionsFor(message.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE) ? await client.guilds.cache.get(allGiveaways[i].guildId).channels.cache.first().createInvite() : "";
                    buffer.push(`> Guild: [\`${client.guilds.cache.get(allGiveaways[i].guildId).name}\`](${invite})\n> Prize: ${allGiveaways[i].prize}\n> Duration: \`${ms(new Date() - allGiveaways[i].startAt)}\` | [\`JUMP TO IT\`](https://discord.com/channels/${allGiveaways[i].guildId}/${allGiveaways[i].channelId}/${allGiveaways[i].messageId})\n`)
                }catch{}
                }
                if(buffer.length < 1) return message.reply("No hay Sorteos disponibles!")
                return swap_pages(client, message, buffer, eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable46"]));
            }

        } else if (args[0].toLowerCase() === "winner"){
            args.shift();
            if (!args[0]) {
                return message.reply({content : `:x: El uso correcto de este comando es: \`${prefix}giveaway winner <GiveawayId>\` ... Tenga en cuenta que GiveawayId es el MessageId del (Embed) Giveaway-Message`});
            }
            let giveaway = client.giveawayDB.find((g) => g.messageId === args[0]);

            if (!giveaway) {
                return message.reply({content : ":x: No se han encontrado datos de este Sorteo"});
            }
            if(giveaway.messages && giveaway.messages.winMessage && giveaway.messages.winMessage.includes("{winners}")){
                return message.reply({content: `${giveaway.messages.winMessage.replace("{winners}", giveaway.winnerIds.map(d => `<@${d}>`).join(", ")).replace("{this.prize}", giveaway.prize).replace("{this.messageURL}", `https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`).replace("{this.hostedBy}", giveaway.hostedBy).substring(0, 2000)}`})
            }
            return message.reply({content: `El ganador de https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId} ${giveaway.winnerIds.length == 1 ? "es" : "son"} ${giveaway.winnerIds.map(d => `<@${d}>`).join(", ")}`.substring(0, 2000)})

        } else {
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["giveaway"]["variable47"]))
                .setDescription(`> \`${prefix}giveaway start\` ... para iniciar un nuevo sorteo

> \`${prefix}giveaway end <G-Id>\` ... para finalizar un sorteo específico

> \`${prefix}giveaway reroll <G-Id> [winneramount]\` ... para volver a hacer un sorteo específico

> \`${prefix}giveaway pause <G-Id>\` ... para pausar un sorteo específico

> \`${prefix}giveaway resume <G-Id>\` ... para reanudar un sorteo específico

> \`${prefix}giveaway edit <G-Id>\` ... para editar un sorteo específico

> \`${prefix}giveaway delete <G-Id>\` ... para eliminar un sorteo específico

> \`${prefix}giveaway list [server/all]\` ... para listar los sorteos aquí / en todo el mundo

:warning: **a veces los sorteos no terminan** :warning:
> Aquí hay algo que puede hacer:
> \`${prefix}giveaway winner <G-Id>\`
> Esto enviará al ganador o ganadores del Sorteo, recibido de la Base de Datos`)
            ]})
        }

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