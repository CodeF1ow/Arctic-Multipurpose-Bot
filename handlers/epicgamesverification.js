const Discord = require("discord.js")
const Platforms = {
    "pc": "PC",
    "psn": "Playstation",
    "xbl": "Xbox"
};
const fortnite = require("fortnite");
const Enmap = require("enmap");
module.exports = async client => {
    client.epicgamesDB = new Enmap({
        name: "epicgamesDB",
        dataDir: "./databases/settings"
    });
    
    client.on("interactionCreate", async interaction => {
        if(!interaction.isButton()) return;
        if(interaction.message.author.id != client.user.id) return;
        if(!interaction.customId.includes("epicgamesverify")) return;
        let { user, guildId } = interaction;
        client.epicgamesDB.ensure(user.id, { 
            epic: "",
            user: user.id,
            guild: guildId,
            Platform: "",
            InputMethod: "",
        });
        client.epicgamesDB.ensure(guildId, { 
            logChannel: "",
            verifychannel: "",
        });
        const guild = client.guilds.cache.get(guildId);
        let data = client.epicgamesDB.get(user.id);
        let guilddata = client.epicgamesDB.get(guildId);
        if(guilddata.verifychannel == interaction.channelId && interaction.customId == "epicgamesverify" && data.epic && data.epic.length > 5) {
            interaction.reply({
                content: `:question: **Ya has conectado tu cuenta de EpicGames a __${guild.name}__**\n> Quieres cambiarlo??\n**Nombre:** \`${data.epic}\`\n**Plataforma:** \`${Platforms[data.Platform]}\`\n**Método de entrada:** \`${data.InputMethod}\``,
                ephemeral: true,
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        [
                            new Discord.MessageButton().setStyle("PRIMARY").setEmoji("✋").setLabel("Sí, Cámbialo!").setCustomId("epicgamesverify_f"),
                            new Discord.MessageButton().setStyle("SECONDARY").setEmoji("✋").setLabel("No, quiero conservarlo.!").setCustomId("no"),
                        ]
                    )
                ]
            });
        } else {
            
        //else force Create it!  
        user.send({
            content: `:question: **Seleccione su plataforma**\n> Dónde juegas en?`,
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    [
                        new Discord.MessageSelectMenu().setMaxValues(1).setMinValues(1).setPlaceholder("Seleccione la plataforma").setCustomId("Platform").addOptions([
                            {
                                label: "PC | Ordenador",
                                value: "pc",
                                description: "Si juegas en el Ordenador/Portátil",
                                emoji: "840608514648047666"
                            },
                            {
                                label: "Playstation",
                                value: "psn",
                                description: "Si juegas en Playstation",
                                emoji: "840608342040117249"
                            },
                            {
                                label: "Xbox",
                                value: "xbl",
                                description: "Si juegas en XBOX",
                                emoji: "840608097701330996"
                            },
                            {
                                label: "Others",
                                value: "others",
                                description: "Si juegas en otra plataforma..",
                            }
                        ])
                    ]
                )
            ]
        }).then(async msg => {
            interaction.reply({
                content: "👍 **Revisa tus Mensajes DIRECTOS! Y responda a mis preguntas**",
                ephemeral: true,
            })
            let Platform = await msg.channel.awaitMessageComponent({ filter: (i) => i.user.id === user.id, time: 120_000, max: 1, errors: ['time'] }).then(i => {i.deferUpdate().catch(()=>{}); return i.values[0]}).catch(() => {}) || false;
            if(!Platform) {
                return user.send(":x: Cancelado, debido a la falta de reacción en menos de 2 minutos!")
            }
            user.send(`:question: **Cuál es su nombre de usuario de EPIC GAMES?**\n> Asegúrate de enviar sólo el nombre de usuario y envíalo 1:1 como es \`Epicgames.com\``)
            let Username = await msg.channel.awaitMessages({ filter: (m) => m.author.id === user.id, time: 120_000, max: 1, errors: ['time'] }).then(c => c.first()?.content).catch(() => {}) || false;
            if(!Username) {
                return user.send(":x: Cancelado, por no enviar el nombre de usuario en menos de 2 minutos!")
            }
            let others = client.epicgamesDB.find(d => d.guild && d.guild == guildId && d.epic && d.epic == Username);
            if(others && others.length > 0) return user.send(`:x: **Alguien con el ID de usuario: \`${others.user}\` Vincular su cuenta con este nombre de Epic Games!**`) 
            let fortniteClient = new fortnite("e032828b-886d-4ed6-9aa1-0e2e725592a8");
            let tdata = await fortniteClient.user(Username, Platform == "others" ? "pc" : Platform).catch(() => {}) || false;
            if(!tdata || tdata.code === 404) {
                return user.send(":x: No se ha podido encontrar tu cuenta de Epic Games, por favor, inténtalo de nuevo y asegúrate de enviar el nombre correcto!")
            }
            client.epicgamesDB.set(user.id, Username, "epic");
            client.epicgamesDB.set(user.id, Platform, "Platform");
            user.send({
                content: `:question: **Seleccione su plataforma**\n> Dónde juegas en?`,
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        [
                            new Discord.MessageSelectMenu().setMaxValues(1).setMinValues(1).setPlaceholder("Seleccione la plataforma").setCustomId("Platform").addOptions([
                                {
                                    label: "Teclado y ratón",
                                    value: "kbm",
                                    description: "Si juegas con teclado y ratón",
                                    emoji: "⌨️"
                                },
                                {
                                    label: "Mando",
                                    value: "controller",
                                    description: "Si juegas con un mando",
                                    emoji: "🎮"
                                },
                                {
                                    label: "Tactil",
                                    value: "touch",
                                    description: "Si juegas en un dispositivo táctil",
                                    emoji: "📱"
                                },
                                {
                                    label: "Otros",
                                    value: "others",
                                    description: "Si juegas en otros dispositivos..",
                                }
                            ])
                        ]
                    )
                ]
            }).then(async msg => {
                let InputMethod = await msg.channel.awaitMessageComponent({ filter: (i) => i.user.id === user.id, time: 120_000, max: 1, errors: ['time'] }).then(i => {i.deferUpdate().catch(()=>{}); return i.values[0]}).catch(() => {}) || false;
                if(!InputMethod) {
                    client.epicgamesDB.set(user.id, "others", "InputMethod");
                    user.send("Establecer el método de entrada por defecto debido a la falta de reacción en menos de 2 minutos!");
                } else {
                    client.epicgamesDB.set(user.id, InputMethod, "InputMethod");
                }
                user.send("✋ **Vinculación exitosa de su cuenta!**").catch(() => {});
                let logChannel = guild.channels.cache.get(guilddata.logChannel) || await guild.channels.fetch(guilddata.logChannel).catch(() => {}) || false
                if(guilddata.logChannel && guilddata.logChannel.length > 5 && logChannel && logChannel.id) { 
                    logChannel.send({
                        embeds: [
                            new Discord.MessageEmbed().setColor("GREEN")
                                .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
                                .setTitle(`Vincular/Actualizar su cuenta EPIC GAMES!`)
                                .addField("**Nombre de Epic Games:**", `\`\`\`${Username}\`\`\``)
                                .addField("**Plataforma:**", `\`\`\`${Platform}\`\`\``)
                                .addField("**Método de entrada:**", `\`\`\`${InputMethod}\`\`\``)
                                .setFooter(client.getFooter("ID: " + user.id, user.displayAvatarURL({dynamic: true})))
                        ]
                    }).catch(() => {})
                }
            })
        }).catch((e) => {
            console.log(e)
            interaction.reply({
                content: "❌ **No puedo enviarte un mensaje... Por favor, habilite su DMS primero!**",
                ephemeral: true,
            })
        });
        }
    });
}