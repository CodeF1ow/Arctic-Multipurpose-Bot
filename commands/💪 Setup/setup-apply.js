var {
  MessageEmbed
} = require("discord.js");
var Discord = require("discord.js");
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emojis = require("../../botconfig/emojis.json");
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-apply",
  category: "💪 Configurar",
  aliases: ["setupapply", "apply-setup", "applysetup", "setup-application", "setupapplication"],
  cooldown: 5,
  usage: "setup-apply --> seguir los pasos",
  description: "Gestionar 25 sistemas de aplicación diferentes",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let theemoji = "📜";
    let ArcticGuild = client.guilds.cache.get("422166931823394817");
    if (ArcticGuild) theemoji = "1021557680730558464";
    let allbuttons = [new MessageActionRow().addComponents([new MessageButton().setStyle('SUCCESS').setEmoji(theemoji).setCustomId("User_Apply").setLabel("Aplicar")])]
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    let apply_for_here = client.apply;
    let pre;
    let temptype = 0;
    let errored = false;
    let timeouterror = false;
    const filter = (reaction, user) => {
      return user.id == cmduser.id
    };
    let guildid = message.guild.id;
    let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
    first_layer()
    async function first_layer() {
      try {
        let menuoptions = []
        for(let i = 1; i<=100;i++) {
          menuoptions.push({
            value: `${i} Aplicar el sistema`,
            description: `Gestionar/editar el ${i} Aplicar la configuración`,
            emoji: NumberEmojiIds[i]
          })
        }
        //define the selection
        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el (los) sistema(s) de aplicación!')
          .addOptions(
            menuoptions.slice(0, 25).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        //define the selection
        let row2 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection2')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el (los) sistema(s) de aplicación!')
          .addOptions(
            menuoptions.slice(25, 50).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )

        //define the selection
        let row3 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection3')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el (los) sistema(s) de aplicación!')
          .addOptions(
            menuoptions.slice(50, 75).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
    
        //define the selection
        let row4 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection4')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el (los) sistema(s) de aplicación!')
          .addOptions(
            menuoptions.slice(75, 100).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
    
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Configuración de la aplicación', 'https://cdn.discordapp.com/emojis/877653386747605032.png?size=96', 'https://arcticbot.xyz/discord'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [
          row1,
          row2,
          row3,
          row4
        ]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(" ")[0]
            if (Number(SetupNumber) >= 1) {
              apply_for_here = client.apply;
              pre = `apply${SetupNumber}` 
            }
            used1 = true;
            temptype = SetupNumber;
            second_layer(SetupNumber, menuoptiondata)
          }
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor).setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable223"]))
          ]
        });
      }
    }
    async function second_layer(SetupNumber, menuoptiondata) {
      try {
        //ensure the database
        apply_for_here.ensure(guildid, {
          "channel_id": "",
          "message_id": "",
          "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

          "QUESTIONS": [{
            "1": "DEFAULT"
          }],

          "TEMP_ROLE": "0",

          "accept": "Has aceptado!",
          "accept_role": "0",

          "deny": "Ten han rechazado!",

          "ticket": "Hey {user}! Tenemos algunas preguntas!",

          "one": {
            "role": "0",
            "message": "Oye, te han aceptado en el equipo 1",
            "image": {
              "enabled": false,
              "url": ""
            }
          },
          "two": {
            "role": "0",
            "message": "Oye, te han aceptado en el equipo 2",
            "image": {
              "enabled": false,
              "url": ""
            }
          },
          "three": {
            "role": "0",
            "message": "Hey, has sido aceptado en el equipo 3",
            "image": {
              "enabled": false,
              "url": ""
            }
          },
          "four": {
            "role": "0",
            "message": "Hey, has sido aceptado en el equipo 4",
            "image": {
              "enabled": false,
              "url": ""
            }
          },
          "five": {
            "role": "0",
            "message": "Hey, has sido aceptado en el equipo 5",
            "image": {
              "enabled": false,
              "url": ""
            }
          }
        }, pre);
        console.log("APLICAR EL NÚMERO DE DB: ".green, pre);
        let menuoptions = [{
            value: "Crear sistema de aplicación",
            description: `Crear/sobreescribir el ${SetupNumber} Aplicar el sistema`,
            emoji: "⚙️"
          },
          {
            value: "Editar el mensaje de aceptación",
            description: `Mensaje cuando se acepta una solicitud`,
            emoji: "🛠"
          },
          {
            value: "Editar mensaje de denegación",
            description: `Mensaje cuando se deniega una solicitud`,
            emoji: "🛠"
          },
          {
            value: "Editar el mensaje del ticket",
            description: `Mensaje cuando una solicitud es redirigida a un Ticket`,
            emoji: "🛠"
          },
          {
            value: "Definir la función de aceptación",
            description: `Rol a añadir cuando un usuario es aceptado`,
            emoji: "🔘"
          },
          {
            value: "Definir la función temporal",
            description: `Rol a añadir cuando un usuario se presenta`,
            emoji: "🔘"
          },
          {
            value: "Gestionar Emoji 1",
            description: `Gestionar la configuración de ese emoji`,
            emoji: "1️⃣"
          },
          {
            value: "Gestionar Emoji 2",
            description: `Gestionar la configuración de los emoji para ese emoji`,
            emoji: "2️⃣"
          },
          {
            value: "Gestionar Emoji 3",
            description: `Administrar la configuración de los emoji para ese emoji`,
            emoji: "3️⃣"
          },
          {
            value: "Gestionar Emoji 4",
            description: `Administrar la configuración de los emoji para ese emoji`,
            emoji: "4️⃣"
          },
          {
            value: "Gestionar Emoji 5",
            description: `Gestionar la configuración de los emoji para ese emoji`,
            emoji: "5️⃣"
          },

          {
            value: "Editar una pregunta",
            description: `Editar una de las preguntas`,
            emoji: "🔴"
          },
          {
            value: "Añadir una pregunta",
            description: `Añadir una pregunta a lista`,
            emoji: "🟣"
          },
          {
            value: "Eliminar una pregunta",
            description: `Eliminar una pregunta de la lista`,
            emoji: "🟡"
          },
          {
            value: "Establecer nuevo canal de Solicitud de Rol",
            description: `Canal/Mensaje donde se inicia la Solicitud`,
            emoji: "🟢"
          },
          {
            value: "Establecer nuevo canal de Log",
            description: `Canal en el que aparecen las solicitudes`,
            emoji: "🔵"
          },
          {
            value: apply_for_here.get(message.guild.id, `${pre}.last_verify`) ? "Habilitar la última verificación" : "Deshabilitar la última verificación",
            description: apply_for_here.get(message.guild.id, `${pre}.last_verify`) ? "Habilitado el último mensaje de verificación para el usuario" : "Deshabilitado último mensaje de verificación para el usuario",
            emoji: "✋"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener el Ticket-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder(`Haga clic en mí para gestionar el ${SetupNumber} sistema de solicitudes de rol!\n\n**Has elegido:**\n> ${menuoptiondata.value}`)
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))

        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(SetupNumber + " Aplicar la configuración", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "https://arcticbot.xyz/discord")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
            menu?.deferUpdate();
            used2 = true;
            handle_the_picks(menu?.values[0], SetupNumber)
          }
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor).setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable223"]))
          ]
        });
      }
    }

    async function handle_the_picks(optionhandletype) {

      try {

        if (optionhandletype == "Crear sistema de aplicación") args = "create"
        if (optionhandletype == "Editar el mensaje de aceptación") args = "acceptmsg"
        if (optionhandletype == "Editar mensaje de denegación") args = "denymsg"
        if (optionhandletype == "Editar el mensaje del billete") args = "ticketmsg"
        if (optionhandletype == "Definir rol de aceptación") args = "acceptrole"
        if (optionhandletype == "Definir la función temporal") args = "temprole"
        if (optionhandletype == "Gestionar Emoji 1") args = "emojione"
        if (optionhandletype == "Gestionar Emoji 2") args = "emojitwo"
        if (optionhandletype == "Gestionar Emoji 3") args = "emojithree"
        if (optionhandletype == "Gestionar Emoji 4") args = "emojifour"
        if (optionhandletype == "Gestionar Emoji 5") args = "emojifive"
        if (optionhandletype == "Editar una pregunta") args = "editquestion"
        if (optionhandletype == "Añadir una pregunta") args = "addquestion"
        if (optionhandletype == "Eliminar una pregunta") args = "removequestion"
        if (optionhandletype == "Establecer nuevo canal de Solicitud de Rol") args = "applychannel"
        if (optionhandletype == "Establecer nuevo canal de Log") args = "finishedapplychannel"
        if (optionhandletype == "Habilitar la última verificación" || optionhandletype == "Deshabilitar la última verificación") args = `${pre}.last_verify`
        switch (args) {
          case "create": {

            var color = "GREEN";
            var desc;
            var userid = cmduser.id;
            let row = new MessageActionRow().addComponents([
              new MessageButton().setStyle("SECONDARY").setCustomId("1").setEmoji("1️⃣"),
              new MessageButton().setStyle("SECONDARY").setCustomId("2").setEmoji("2️⃣")
            ])
            var pickmsg = await message.reply({
              components: [row],
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable6"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable6_1"]))
                .setFooter(client.getFooter(es))
              ]
            })
            var collector = pickmsg.createMessageComponentCollector({filter: (interaction) => interaction?.isButton() && interaction?.message.author.id == client.user.id && interaction?.user.id == cmduser.id,
                max: 1,
                time: 180000,
                erros: ["time"]
            })
            collector.on("collect", interaction => {
                try { interaction?.deferUpdate() } catch (e){ }
                if (interaction?.customId == "1") setup_with_channel_creation()
                if (interaction?.customId == "2") setup_without_channel_creation()
            })
            async function setup_with_channel_creation() {
              var applychannel;
              var f_applychannel;
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                  .setAuthor('Configuración...', 'https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif')
                  .setFooter(client.getFooter(es))
                ]
              })
              message.guild.channels.create("📋 | Solicitudes", {
                type: "GUILD_CATEGORY",
              }).then(ch => {
                ch.guild.channels.create("✔️|Solicitud Finalizadas", {
                  type: "GUILD_TEXT",
                  topic: "Reaccionar ante el Embed, para iniciar el proceso de solicitud",
                  parent: ch.id,
                  permissionOverwrites: [{
                    id: ch.guild.id,
                    deny: ["VIEW_CHANNEL"]
                  }]
                }).then(ch => {
                  f_applychannel = ch.id
                  apply_for_here.set(ch.guild.id, ch.id, pre+".f_channel_id")
                })
                ch.guild.channels.create("✅|Solicitar Rol", {
                  type: "GUILD_TEXT",
                  topic: "Reaccionar ante el Embed, para iniciar el proceso de solicitud",
                  parent: ch.id,
                  permissionOverwrites: [{
                      id: ch.guild.id,
                      allow: ["VIEW_CHANNEL"],
                      deny: ["SEND_MESSAGES"]
                    },
                    {
                      id: client.user.id,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    }
                  ]
                }).then(ch => {
                  var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  message.reply({
                    embeds: [embed
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable9"]))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable9_1"]))
                    ]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                        filter: m => m.author.id === userid,
                        max: 1,
                        time: 180000,
                        errors: ["TIME"]
                      }).then(collected => {
                        var content = collected.first().content;
                        if (!content.startsWith("#") && content.length !== 7) {
                          message.reply({
                            content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable10"])
                          })
                        } else {
                          if (isValidColor(content)) {
                            console.log(content)
                            color = content;
                          } else {
                            message.reply({
                              content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable11"])
                            })
                          }
                        }

                        function isValidColor(str) {
                          return str.match(/^#[a-f0-9]{6}$/i) !== null;
                        }
                      }).catch(error => {

                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable12"]))
                            .setColor(es.wrongcolor)
                            .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      })
                      .then(something => {
                        message.reply({
                          embeds: [embed
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable13"]))
                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable13_1"]))
                          ]
                        }).then(msg => {
                          msg.channel.awaitMessages({
                            filter: m => m.author.id === userid,
                            max: 1,
                            time: 180000,
                            errors: ["TIME"]
                          }).then(collected => {
                            desc = collected.first().content;
                            var setupembed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                              .setColor(color)
                              .setDescription(desc)
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable14"]))
                              .setFooter(client.getFooter(es))
                            ch.send({
                              embeds: [setupembed],
                              components: allbuttons
                            }).then(msg => {
                              apply_for_here.set(msg.guild.id, msg.id, pre+".message_id")
                              apply_for_here.set(msg.guild.id, msg.channel.id, pre+".channel_id")
                              applychannel = msg.channel.id;
                            });
                            var counter = 0;
                            apply_for_here.set(msg.guild.id, [{
                              "1": "DEFAULT"
                            }], pre+".QUESTIONS")
                            ask_which_qu();

                            function ask_which_qu() {
                              counter++;
                              if (counter === 25) {
                                message.reply({
                                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED")
                                    .setAuthor('Has alcanzado la cantidad máxima de preguntas!', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png')
                                  ]
                                })
                                return ask_addrole();
                              }
                              message.reply({
                                embeds: [embed.setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable16"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable17"]))]
                              }).then(msg => {
                                msg.channel.awaitMessages({
                                  filter: m => m.author.id === userid,
                                  max: 1,
                                  time: 180000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  if (collected.first().content.toLowerCase() === "finish") {
                                    return ask_addrole();
                                  }
                                  switch (counter) {
                                    case 1: {
                                      apply_for_here.set(msg.guild.id, [], pre+".QUESTIONS");
                                      apply_for_here.push(msg.guild.id, {
                                        "1": collected.first().content
                                      }, pre+".QUESTIONS");
                                    }
                                    break;
                                  case 2:
                                    apply_for_here.push(msg.guild.id, {
                                      "2": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 3:
                                    apply_for_here.push(msg.guild.id, {
                                      "3": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 4:
                                    apply_for_here.push(msg.guild.id, {
                                      "4": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 5:
                                    apply_for_here.push(msg.guild.id, {
                                      "5": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 6:
                                    apply_for_here.push(msg.guild.id, {
                                      "6": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 7:
                                    apply_for_here.push(msg.guild.id, {
                                      "7": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 8:
                                    apply_for_here.push(msg.guild.id, {
                                      "8": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 9:
                                    apply_for_here.push(msg.guild.id, {
                                      "9": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 10:
                                    apply_for_here.push(msg.guild.id, {
                                      "10": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 11:
                                    apply_for_here.push(msg.guild.id, {
                                      "11": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 12:
                                    apply_for_here.push(msg.guild.id, {
                                      "12": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 13:
                                    apply_for_here.push(msg.guild.id, {
                                      "13": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 14:
                                    apply_for_here.push(msg.guild.id, {
                                      "14": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 15:
                                    apply_for_here.push(msg.guild.id, {
                                      "15": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 16:
                                    apply_for_here.push(msg.guild.id, {
                                      "16": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 17:
                                    apply_for_here.push(msg.guild.id, {
                                      "17": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 18:
                                    apply_for_here.push(msg.guild.id, {
                                      "18": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 19:
                                    apply_for_here.push(msg.guild.id, {
                                      "19": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 20:
                                    apply_for_here.push(msg.guild.id, {
                                      "20": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 21:
                                    apply_for_here.push(msg.guild.id, {
                                      "21": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 22:
                                    apply_for_here.push(msg.guild.id, {
                                      "22": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 23:
                                    apply_for_here.push(msg.guild.id, {
                                      "23": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  case 24:
                                    apply_for_here.push(msg.guild.id, {
                                      "24": collected.first().content
                                    }, pre+".QUESTIONS");
                                    break;
                                  }
                                  ask_which_qu();
                                }).catch(error => {

                                  return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable18"]))
                                      .setColor(es.wrongcolor)
                                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                      .setFooter(client.getFooter(es))
                                    ]
                                  });
                                })
                              })
                            }

                            function ask_addrole() {
                              message.reply({
                                embeds: [embed.setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable19"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable20"]))]
                              }).then(msg => {
                                msg.channel.awaitMessages({
                                  filter: m => m.author.id === userid,
                                  max: 1,
                                  time: 180000,
                                  errors: ["TIME"]
                                }).then(async collected => {
                                  if (collected.first().content.toLowerCase() === "no") {
                                    return message.reply({
                                      embeds: [new Discord.MessageEmbed()
                                        .setFooter(client.getFooter(es))
                                        .setColor(es.color)
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable21"]))
                                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable22"]))
                                      ]
                                    });
                                  } else {
                                    var role = collected.first().mentions.roles.first();
                                    if (!role) return message.reply({
                                      embeds: [new Discord.MessageEmbed()
                                        .setFooter(client.getFooter(es))
                                        .setColor(es.color)
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable23"]))
                                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable24"]))
                                      ]
                                    });
                                    var guildrole = message.guild.roles.cache.get(role.id)

                                    if (!message.guild.me.roles) return message.reply({
                                      embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable25"])).setAuthor("❌​ ERROR | No se pudo acceder al rol", message.author.displayAvatarURL({
                                        dynamic: true
                                      }))]
                                    })

                                    var botrole = message.guild.me.roles.highest
                                    if (guildrole.rawPosition >= botrole.rawPosition) {
                                      message.reply({
                                        content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable26"])
                                      })
                                      return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                          .setFooter(client.getFooter(es))
                                          .setColor(es.color)
                                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable27"]))
                                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable28"]))
                                        ]
                                      });
                                    }
                                    apply_for_here.set(message.guild.id, role.id, pre+".TEMP_ROLE")
                                    return message.reply({
                                      embeds: [new Discord.MessageEmbed()
                                        .setFooter(client.getFooter(es))
                                        .setColor(es.color)
                                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable29"]))
                                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable30"]))
                                      ]
                                    });
                                  }
                                }).catch(error => {
                                  console.log(error)
                                  return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable31"]))
                                      .setColor(es.wrongcolor)
                                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                      .setFooter(client.getFooter(es))
                                    ]
                                  });
                                })
                              })
                            }
                          }).catch(error => {
                            console.log(error)
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable32"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          })
                        })
                      })
                  })
                })
              })

            }

            async function setup_without_channel_creation() {

              var applychannel;
              var f_applychannel;




              pickmsg = await message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable33"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable33_1"]))
                  .setFooter(client.getFooter(es))
                ]
              })
              await pickmsg.channel.awaitMessages({filter: (m) => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  erros: ["time"]
                }).then(collected => {
                  var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                  if (channel) {
                    applychannel = channel.id;
                  } else {
                    message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable34"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable35"]))
                      ]
                    }).then(msg => msg.delete({
                      timeout: 7500
                    }))
                    throw "❌​ ERROR";
                  }
                })
                .catch(e => {
                  errored = e
                })
              if (errored)
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setColor("RED").setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable36"]))
                    .setDescription(`\`\`\`${errored.message}\`\`\``)
                  ]
                }).then(msg => msg.delete({
                  timeout: 7500
                }))




              pickmsg = await message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es))
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable37"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable37_1"]))
                  .setFooter(client.getFooter(es))
                ]
              })
              await pickmsg.channel.awaitMessages({filter: (m) => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  erros: ["time"]
                }).then(collected => {
                  var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                  if (channel) {
                    f_applychannel = channel.id;
                  } else {
                    message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable38"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable39"]))
                      ]
                    }).then(msg => msg.delete({
                      timeout: 7500
                    }))
                    throw "❌​ ERROR";
                  }
                })
                .catch(e => {
                  errored = e
                })
              if (errored)
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setColor("RED").setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable40"]))
                    .setDescription(`\`\`\`${errored.message}\`\`\``)
                  ]
                }).then(msg => msg.delete({
                  timeout: 7500
                }))




              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                  .setAuthor('Configurando...', 'https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif')
                  .setFooter(client.getFooter(es))
                ]
              })




              var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                .setColor(es.color)
                .setFooter(client.getFooter(es))


              var msg = await message.reply({
                embeds: [embed
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable42"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable42_1"]))
                ]
              })

              await msg.channel.awaitMessages({
                filter: m => m.author.id === userid,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var content = collected.first().content;
                if (!content.startsWith("#") && content.length !== 7) {
                  message.reply({
                    content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable43"])
                  })
                } else {
                  if (isValidColor(content)) {
                    color = content;
                  } else {
                    message.reply({
                      content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable44"])
                    })
                  }
                }

                function isValidColor(str) {
                  return str.match(/^#[a-f0-9]{6}$/i) !== null;
                }
              }).catch(e => {
                errored = e
              })
              if (errored)
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setColor("RED")
                    .setFooter(client.getFooter(es))
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable45"]))
                    .setDescription(`\`\`\`${errored.message}\`\`\``)
                  ]
                }).then(msg => msg.delete({
                  timeout: 7500
                }))

              await message.reply({
                embeds: [embed
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable46"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable46_1"]))
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === userid,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  desc = collected.first().content;
                  var setupembed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                    .setColor(color)
                    .setDescription(desc)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable47"]))
                    .setFooter(client.getFooter(es))
                  message.guild.channels.cache.get(applychannel).send({
                    embeds: [setupembed],
                    components: allbuttons
                  }).then(msg => {
                    apply_for_here.set(msg.guild.id, msg.id, pre+".message_id")
                    apply_for_here.set(message.guild.id, f_applychannel, pre+".f_channel_id")
                    apply_for_here.set(msg.guild.id, applychannel, pre+".channel_id")
                  });
                  var counter = 0;
                  apply_for_here.set(msg.guild.id, [{
                    "1": "DEFAULT"
                  }], pre+".QUESTIONS")
                  ask_which_qu();

                  function ask_which_qu() {
                    counter++;
                    if (counter === 25) {
                      message.reply({
                        embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED")
                          .setAuthor('Has alcanzado la cantidad máxima de preguntas!', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png')
                        ]
                      })

                      return ask_addrole();
                    }
                    message.reply({
                      embeds: [embed.setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable49"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable50"]))]
                    }).then(msg => {
                      msg.channel.awaitMessages({
                        filter: m => m.author.id === userid,
                        max: 1,
                        time: 180000,
                        errors: ["TIME"]
                      }).then(collected => {
                        if (collected.first().content.toLowerCase() === "finish") {
                          return ask_addrole();
                        }
                        switch (counter) {
                          case 1: {
                            apply_for_here.set(msg.guild.id, [], pre+".QUESTIONS");
                            apply_for_here.push(msg.guild.id, {
                              "1": collected.first().content
                            }, pre+".QUESTIONS");
                          }
                          break;
                        case 2:
                          apply_for_here.push(msg.guild.id, {
                            "2": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 3:
                          apply_for_here.push(msg.guild.id, {
                            "3": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 4:
                          apply_for_here.push(msg.guild.id, {
                            "4": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 5:
                          apply_for_here.push(msg.guild.id, {
                            "5": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 6:
                          apply_for_here.push(msg.guild.id, {
                            "6": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 7:
                          apply_for_here.push(msg.guild.id, {
                            "7": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 8:
                          apply_for_here.push(msg.guild.id, {
                            "8": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 9:
                          apply_for_here.push(msg.guild.id, {
                            "9": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 10:
                          apply_for_here.push(msg.guild.id, {
                            "10": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 11:
                          apply_for_here.push(msg.guild.id, {
                            "11": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 12:
                          apply_for_here.push(msg.guild.id, {
                            "12": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 13:
                          apply_for_here.push(msg.guild.id, {
                            "13": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 14:
                          apply_for_here.push(msg.guild.id, {
                            "14": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 15:
                          apply_for_here.push(msg.guild.id, {
                            "15": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 16:
                          apply_for_here.push(msg.guild.id, {
                            "16": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 17:
                          apply_for_here.push(msg.guild.id, {
                            "17": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 18:
                          apply_for_here.push(msg.guild.id, {
                            "18": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 19:
                          apply_for_here.push(msg.guild.id, {
                            "19": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 20:
                          apply_for_here.push(msg.guild.id, {
                            "20": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 21:
                          apply_for_here.push(msg.guild.id, {
                            "21": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 22:
                          apply_for_here.push(msg.guild.id, {
                            "22": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 23:
                          apply_for_here.push(msg.guild.id, {
                            "23": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        case 24:
                          apply_for_here.push(msg.guild.id, {
                            "24": collected.first().content
                          }, pre+".QUESTIONS");
                          break;
                        }
                        ask_which_qu();
                      }).catch(e => {
                        errored = e
                      })
                      if (errored)
                        return message.reply({
                          embeds: [new Discord.MessageEmbed().setColor("RED")
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable51"]))
                            .setDescription(`\`\`\`${errored.message}\`\`\``)
                          ]
                        }).then(msg => msg.delete({
                          timeout: 7500
                        }))

                    })
                  }

                  function ask_addrole() {
                    message.reply({
                      embeds: [embed.setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable52"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable53"]))]
                    }).then(msg => {
                      msg.channel.awaitMessages({
                        filter: m => m.author.id === userid,
                        max: 1,
                        time: 180000,
                        errors: ["TIME"]
                      }).then(async collected => {
                        if (collected.first().content.toLowerCase() === "no") {
                          return message.reply({
                            embeds: [new Discord.MessageEmbed()
                              .setFooter(client.getFooter(es))
                              .setColor(es.color)
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable54"]))
                              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable55"]))
                            ]
                          });
                        } else {
                          var role = collected.first().mentions.roles.first();
                          if (!role) return message.reply({
                            embeds: [new Discord.MessageEmbed()
                              .setFooter(client.getFooter(es))
                              .setColor(es.color)
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable56"]))
                              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable57"]))

                            ]
                          });
                          var guildrole = message.guild.roles.cache.get(role.id)

                          if (!message.guild.me.roles) return message.reply({
                            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable58"])).setAuthor("❌​ ERROR | No se pudo acceder al rol", message.author.displayAvatarURL({
                              dynamic: true
                            }))]
                          })

                          var botrole = message.guild.me.roles.highest
                          if (guildrole.rawPosition >= botrole.rawPosition) {
                            message.reply({
                              content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable59"])
                            })
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setFooter(client.getFooter(es))
                                .setColor(es.color)
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable60"]))
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable61"]))

                              ]
                            });
                          }
                          apply_for_here.set(message.guild.id, role.id, pre+".TEMP_ROLE")
                          return message.reply({
                            embeds: [new Discord.MessageEmbed()
                              .setFooter(client.getFooter(es))
                              .setColor(es.color)
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable62"]))
                              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable63"]))

                            ]
                          });
                        }
                      }).catch(e => {
                        console.log(e.stack ? String(e.stack).grey : String(e).grey)
                        errored = e
                      })
                      if (errored)
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setColor("RED")
                            .setFooter(client.getFooter(es))
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable64"]))
                            .setDescription(`\`\`\`${errored.message}\`\`\``)
                          ]
                        }).then(msg => msg.delete({
                          timeout: 7500
                        }))
                    })
                  }
                }).catch(e => {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  errored = e
                })
                if (errored)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setColor("RED")
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable65"]))
                      .setDescription(`\`\`\`${errored.message}\`\`\``)
                    ]
                  }).then(msg => msg.delete({
                    timeout: 7500
                  }))
              })
            }
          }
          break;
        case "acceptmsg": {
          message.reply({
            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser el nuevo mensaje de aceptación?", message.author.displayAvatarURL({
              dynamic: true
            }))]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              apply_for_here.set(message.guild.id, collected.first().content, pre+".accept")
              return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el MENSAJE DE ACEPTACIÓN!", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable68"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "acceptrole": {
          message.reply({
            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debe ser el nuevo rol de aceptación que se otorgará cuando el usuario sea aceptado?", message.author.displayAvatarURL({
              dynamic: true
            }))]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var role = collected.first().mentions.roles.first();
              if (!role) return message.reply({
                content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable69"])
              })
              var guildrole = message.guild.roles.cache.get(role.id)

              if (!message.guild.me.roles) return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable70"])).setAuthor("❌​ ERROR | No se pudo acceder al rol", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })

              var botrole = message.guild.me.roles.highest

              if (guildrole.rawPosition <= botrole.rawPosition) {
                apply_for_here.set(message.guild.id, role.id, pre+".accept_role")
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
              } else {
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable71"])).setAuthor("❌​ ERROR | No se pudo acceder al rol", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
              }
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable72"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "denymsg": {
          message.reply({
            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser el nuevo mensaje de denegación?", message.author.displayAvatarURL({
              dynamic: true
            }))]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              apply_for_here.set(message.guild.id, collected.first().content, pre+".deny")
              return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el MENSAJE DE DENEGACIÓN!", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable73"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "ticketmsg": {
          message.reply({
            embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser el nuevo mensaje del ticket? | {user} hace ping al usuario", message.author.displayAvatarURL({
              dynamic: true
            }))]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              apply_for_here.set(message.guild.id, collected.first().content, pre+".ticket")
              return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el MENSAJE DE LA ENTRADA!", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable74"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "emojione": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable75"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable76"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable77"]))
                .setColor("RED")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable111"]).substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
              filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "Reaccionaste con un emoji equivocado"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable78"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser el nuevo mensaje de aceptación para el emoji uno?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, pre+".one.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el MENSAJE DE ACEPTACIÓN para el emoji uno!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable79"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser el nuevo rol de aceptación, que se otorgará cuando el usuario sea aceptado por el emoji uno?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable80"])
                })
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable81"])).setAuthor("❌​ ERROR | No se pudo acceder al rol", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, pre+".one.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el ROL ACEPTADO para el emoji uno!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable82"])).setAuthor("❌​ ERROR | No se pudo acceder al rol", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable83"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", pre+".one.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Eliminado con éxito el ROL ACEPTADO para el emoji uno!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, pre+".one.image.enabled")
            apply_for_here.set(message.guild.id, "", pre+".one.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor("GREEN")
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable84"]))
              ]
            })
          }
          case "setimage": {
            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable85"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable86"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, pre+".one.image.enabled")
                      apply_for_here.set(message.guild.id, url, pre+".one.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable87"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable88"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, pre+".one.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, pre+".one.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable89"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable90"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable91"]))
                  .setColor("RED")
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable130"]))
                  .setFooter(client.getFooter(es))
                ]
              });
            }


          }

          }
        }
        break;
        case "emojitwo": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable93"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable94"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable95"]))
                .setColor("RED")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable151"]).substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
              filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "Reaccionaste con un emoji equivocado"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable96"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser el nuevo mensaje de aceptación para el emoji dos?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, pre+".two.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el MENSAJE DE ACEPTACIÓN para el emoji 2!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable97"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser el nuevo rol de aceptación que se otorgará cuando el usuario sea aceptado por el emoji 2?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable98"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable99"]))
                  ]
                });
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable100"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, pre+".two.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el ROL ACEPTADO para emoji 2!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable101"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable102"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", pre+".two.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Se ha eliminado con éxito el ROL ACEPTADO para el emoji 2!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, pre+".two.image.enabled")
            apply_for_here.set(message.guild.id, "", pre+".two.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor("GREEN")
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable103"]))
              ]
            })
          }
          break;
          case "setimage": {

            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable104"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable105"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, pre+".two.image.enabled")
                      apply_for_here.set(message.guild.id, url, pre+".two.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable106"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable107"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, pre+".two.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, pre+".two.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable108"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable109"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable110"]))
                  .setColor("RED")
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable171"]))
                  .setFooter(client.getFooter(es))
                ]
              });
            }

          }
          break;
          }
        }
        break;
        case "emojithree": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable112"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable113"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable114"]))
                .setColor("RED")
                .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
              filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "Reaccionaste con un emoji equivocado"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable115"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser el nuevo mensaje de aceptación para los emoji 3?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, pre+".three.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el MENSAJE DE ACEPTACIÓN para el emoji 3!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable116"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAutho("Cuál debería ser el nuevo rol de aceptación que se otorgará cuando el usuario sea aceptado por emoji 3?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable117"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable118"]))

                  ]
                });
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable119"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, pre+".three.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Se ha cambiado con éxito la función de aceptaciDOn del emoji 3!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable120"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable121"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", pre+".three.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Se ha eliminado con éxito la función de acEPTADOción del emoji 3!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, pre+".three.image.enabled")
            apply_for_here.set(message.guild.id, "", pre+".three.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor("GREEN")
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable122"]))
              ]
            })
          }
          case "setimage": {
            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable123"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable124"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, pre+".three.image.enabled")
                      apply_for_here.set(message.guild.id, url, pre+".three.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable125"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable126"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, pre+".three.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, pre+".three.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable127"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable128"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable129"]))
                  .setColor("RED")
                  .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
                  .setFooter(client.getFooter(es))
                ]
              });
            }

          }

          default:
            return message.reply({
              embeds: [new Discord.MessageEmbed().setColor("RED").setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable131"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable132"]))]
            })
            break;
          }
        }
        break;
        case "emojifour": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable133"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable134"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable135"]))
                .setColor("RED")
                .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
            filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "Reaccionaste con un emoji equivocado"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable136"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthr("Cuál debería ser el nuevo mensaje de aceptación de los emoj 4?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, pre+".four.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Ha cambiado con éxito el MENSAJE DE ACEPTACIÓN para el emoji 4!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable137"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAutho("¿Cuál debería ser el nuevo rol de aceptación que se otorgará cuando el usuario sea aceptado por emoji 4?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable138"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable139"]))
                  ]
                });
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable140"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, pre+".four.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Se ha cambiado con éxito el ROL ACEPTAR pDOra el emoji 4!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable141"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable142"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", pre+".four.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Se ha eliminado con éxito el ROL DE ACEPTAEPTADO para el emoji 4!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, pre+".four.image.enabled")
            apply_for_here.set(message.guild.id, "", pre+".four.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor("GREEN")
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable143"]))
              ]
            })
          }
          case "setimage": {
            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable144"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable145"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, pre+".four.image.enabled")
                      apply_for_here.set(message.guild.id, url, pre+".four.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable146"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable147"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, pre+".four.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, pre+".four.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable148"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable149"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable150"]))
                  .setColor("RED")
                  .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
                  .setFooter(client.getFooter(es))
                ]
              });
            }
          }

          default:
            return message.reply({
              embeds: [new Discord.MessageEmbed().setColor("RED").setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable152"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable153"]))]
            })
            break;
          }
        }

        break;
        case "emojifive": {
          var type = ""
          var tempmsg2;
          tempmsg2 = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable154"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable155"])).setFooter(client.getFooter(es))
            ]
          })
          try {
            tempmsg2.react("1️⃣")
            tempmsg2.react("2️⃣")
            tempmsg2.react("3️⃣")
            tempmsg2.react("4️⃣")
            tempmsg2.react("5️⃣")
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable156"]))
                .setColor("RED")
                .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          }
          await tempmsg2.awaitReactions({
            filter: (reaction, user) => user.id == cmduser.id,
              max: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(collected => {
              var reaction = collected.first()
              reaction.users.remove(cmduser.id)
              if (reaction.emoji?.name === "1️⃣") type = "message";
              else if (reaction.emoji?.name === "2️⃣") type = "setrole";
              else if (reaction.emoji?.name === "3️⃣") type = "delrole";
              else if (reaction.emoji?.name === "4️⃣") type = "delimage";
              else if (reaction.emoji?.name === "5️⃣") type = "setimage";
              else throw "Reaccionaste con un emoji equivocado"

            })
            .catch(e => {
              timeouterror = e;
              console.log(timeouterror = e)
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable157"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
          switch (type) {
            case "message": {
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthr("Cuál debería ser el nuevo mensaje de aceptación de los emoj 5?", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ["TIME"]
                }).then(collected => {
                  apply_for_here.set(message.guild.id, collected.first().content, pre+".five.message")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Ha cambiado con éxito el MENSAJE DE ACEPTACIÓN para el emoji 5!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }).catch(error => {

                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable158"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                })
              })
            }
            break;
          case "setrole": {
            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAutho("¿Cuál debería ser el nuevo rol de aceptación que se otorgará cuando el usuario sea aceptado por emoji 5?", message.author.displayAvatarURL({
                dynamic: true
              }))]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                errors: ["TIME"]
              }).then(collected => {
                var role = collected.first().mentions.roles.first();
                if (!role) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable159"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable160"]))

                  ]
                });
                var guildrole = message.guild.roles.cache.get(role.id)

                if (!message.guild.me.roles) return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable161"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })

                var botrole = message.guild.me.roles.highest

                if (guildrole.rawPosition <= botrole.rawPosition) {
                  apply_for_here.set(message.guild.id, role.id, pre+".five.role")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Se ha cambiado con éxito el ROL ACEPTAR pDOra el emoji 5!", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable162"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                      dynamic: true
                    }))]
                  })
                }
              }).catch(error => {

                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable163"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          }
          break;
          case "delrole": {
            apply_for_here.set(message.guild.id, "", pre+".five.role")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Se ha eliminado con éxito el ROL ACEEPTADO para el emoji 5!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          break;
          case "delimage": {
            apply_for_here.set(message.guild.id, false, pre+".five.image.enabled")
            apply_for_here.set(message.guild.id, "", pre+".five.image.url")
            return message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Se ha eliminado con éxito la IMAGEN DE ACEPTACIÓN para el emoji 5!", message.author.displayAvatarURL({
                dynamic: true
              }))]
            })
          }
          case "setimage": {
            try {
              var url;
              tempmsg2 = await tempmsg2.edit({
                embeds: [new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable164"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable165"]))
                  .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                  .setThumbnail(client.user.displayAvatarURL())
                ]
              }).then(msg => {
                msg.channel.awaitMessages({
                  filter: m => m.author.id === cmduser.id,
                  max: 1,
                  time: 180000,
                  errors: ['time']
                }).then(collected => {
                  if (collected.first().attachments.size > 0) {
                    if (collected.first().attachments.every(attachIsImage)) {
                      apply_for_here.set(message.guild.id, true, pre+".five.image.enabled")
                      apply_for_here.set(message.guild.id, url, pre+".five.image.url")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setFooter(client.getFooter(es))

                          .setColor("GREEN")
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable166"]))
                        ]
                      })
                    } else {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable167"]))
                          .setColor("RED")
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                    apply_for_here.set(message.guild.id, true, pre+".five.image.enabled")
                    apply_for_here.set(message.guild.id, collected.first().content, pre+".five.image.url")
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setFooter(client.getFooter(es))

                        .setColor("GREEN")
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable168"]))
                      ]
                    })
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable169"]))
                        .setColor("RED")
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }

                  function attachIsImage(msgAttach) {
                    url = msgAttach.url;

                    //True if this url is a png image.
                    return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                      url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                      url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                      url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                  }
                });
              })
            } catch (e) {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable170"]))
                  .setColor("RED")
                  .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
                  .setFooter(client.getFooter(es))
                ]
              });
            }

          }

          default:
            return message.reply({
              embeds: [new Discord.MessageEmbed().setColor("RED").setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable172"])).setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable173"]))]
            })
            break;
          }
        }
        break;
        case "editquestion": {
          var Questions = apply_for_here.get(message.guild.id, pre+".QUESTIONS");
          var embed = new Discord.MessageEmbed()
            .setFooter(client.getFooter(es))

            .setColor(es.color)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable174"])) 
            .setFooter("AÑADIR EL ÍNDICE PARA EDITAR EL MSG", message.guild.iconURL({
              dynamic: true
            }))
            .setTimestamp()

          for (var i = 0; i < Questions.length; i++) {
            try {
              embed.addField(`**${Object.keys(Questions[i])}.**`, `>>> ${Object.values(Questions[i])}`)
            } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
            }
          }

          message.reply({
            embeds: [embed, new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable175"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable176"]))
            ]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var arr = apply_for_here.get(message.guild.id, pre+".QUESTIONS");
              var quindex = collected.first().content
              if (arr.length >= Number(quindex)) {
                message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color).setAuthor("Cuál debería ser la nueva pregunta?", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                }).then(msg => {
                  msg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 180000,
                    errors: ["TIME"]
                  }).then(collected => {
                    var index = Number(quindex);
                    var obj;
                    switch (Number(index)) {
                      case 1:
                        obj = {
                          "1": collected.first().content
                        };
                        break;
                      case 2:
                        obj = {
                          "2": collected.first().content
                        };
                        break;
                      case 3:
                        obj = {
                          "3": collected.first().content
                        };
                        break;
                      case 4:
                        obj = {
                          "4": collected.first().content
                        };
                        break;
                      case 5:
                        obj = {
                          "5": collected.first().content
                        };
                        break;
                      case 6:
                        obj = {
                          "6": collected.first().content
                        };
                        break;
                      case 7:
                        obj = {
                          "7": collected.first().content
                        };
                        break;
                      case 8:
                        obj = {
                          "8": collected.first().content
                        };
                        break;
                      case 9:
                        obj = {
                          "9": collected.first().content
                        };
                        break;
                      case 10:
                        obj = {
                          "10": collected.first().content
                        };
                        break;
                      case 11:
                        obj = {
                          "11": collected.first().content
                        };
                        break;
                      case 12:
                        obj = {
                          "12": collected.first().content
                        };
                        break;
                      case 13:
                        obj = {
                          "13": collected.first().content
                        };
                        break;
                      case 14:
                        obj = {
                          "14": collected.first().content
                        };
                        break;
                      case 15:
                        obj = {
                          "15": collected.first().content
                        };
                        break;
                      case 16:
                        obj = {
                          "16": collected.first().content
                        };
                        break;
                      case 17:
                        obj = {
                          "17": collected.first().content
                        };
                        break;
                      case 18:
                        obj = {
                          "18": collected.first().content
                        };
                        break;
                      case 19:
                        obj = {
                          "19": collected.first().content
                        };
                        break;
                      case 20:
                        obj = {
                          "20": collected.first().content
                        };
                        break;
                      case 21:
                        obj = {
                          "21": collected.first().content
                        };
                        break;
                      case 22:
                        obj = {
                          "22": collected.first().content
                        };
                        break;
                      case 23:
                        obj = {
                          "23": collected.first().content
                        };
                        break;
                      case 24:
                        obj = {
                          "24": collected.first().content
                        };
                        break;
                    }
                    arr[index] = obj;
                    apply_for_here.set(message.guild.id, arr, pre+".QUESTIONS")
                    Questions = apply_for_here.get(message.guild.id, pre+".QUESTIONS");
                    var new_embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                      .setColor(es.color)
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable177"])) 
                      .setFooter(message.guild.name, message.guild.iconURL({
                        dynamic: true
                      }))
                      .setTimestamp()
                    for (var i = 0; i < Questions.length; i++) {
                      try {
                        new_embed.addField(`**${Object.keys(Questions[i])}.**`, `>>> ${Object.values(Questions[i])}`)
                      } catch {}
                    }
                    message.reply({
                      embeds: [new_embed]
                    });
                  }).catch(error => {

                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable178"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  })
                })
              } else {
                message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setAuthor("Parece que esta pregunta no existe. Por favor, vuelva a intentarlo. Aquí están todas las preguntas:", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
                return message.reply({
                  embeds: [embed]
                });
              }
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable179"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })



        }
        break;
        case "temprole":
          message.reply({
            embeds: [new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable180"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable181"]))
            ]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var role = collected.first().mentions.roles.first();
              if (!role) return message.reply({
                content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable182"])
              })
              var guildrole = message.guild.roles.cache.get(role.id)

              if (!message.guild.me.roles) return message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable183"])).setAuthor("❌​ ERROR | No se pudo acceder a la función", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })

              var botrole = message.guild.me.roles.highest

              if (guildrole.rawPosition <= botrole.rawPosition) {
                apply_for_here.set(message.guild.id, role.id, pre+".TEMP_ROLE")
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Cambiado con éxito el ROL TEMP!", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
              } else {
                return message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable184"])).setAuthor("❌​ ERROR | No se pudo acceder al rol", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
              }
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable185"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
          break;
        case "addquestion": {
          message.reply({
            embeds: [new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable186"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable187"]))
            ]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var Questions = apply_for_here.get(message.guild.id, pre+".QUESTIONS")
              var obj;
              switch (Questions.length + 1) {
                case 1:
                  obj = {
                    "1": collected.first().content
                  };
                  break;
                case 2:
                  obj = {
                    "2": collected.first().content
                  };
                  break;
                case 3:
                  obj = {
                    "3": collected.first().content
                  };
                  break;
                case 4:
                  obj = {
                    "4": collected.first().content
                  };
                  break;
                case 5:
                  obj = {
                    "5": collected.first().content
                  };
                  break;
                case 6:
                  obj = {
                    "6": collected.first().content
                  };
                  break;
                case 7:
                  obj = {
                    "7": collected.first().content
                  };
                  break;
                case 8:
                  obj = {
                    "8": collected.first().content
                  };
                  break;
                case 9:
                  obj = {
                    "9": collected.first().content
                  };
                  break;
                case 10:
                  obj = {
                    "10": collected.first().content
                  };
                  break;
                case 11:
                  obj = {
                    "11": collected.first().content
                  };
                  break;
                case 12:
                  obj = {
                    "12": collected.first().content
                  };
                  break;
                case 13:
                  obj = {
                    "13": collected.first().content
                  };
                  break;
                case 14:
                  obj = {
                    "14": collected.first().content
                  };
                  break;
                case 15:
                  obj = {
                    "15": collected.first().content
                  };
                  break;
                case 16:
                  obj = {
                    "16": collected.first().content
                  };
                  break;
                case 17:
                  obj = {
                    "17": collected.first().content
                  };
                  break;
                case 18:
                  obj = {
                    "18": collected.first().content
                  };
                  break;
                case 19:
                  obj = {
                    "19": collected.first().content
                  };
                  break;
                case 20:
                  obj = {
                    "20": collected.first().content
                  };
                  break;
                case 21:
                  obj = {
                    "21": collected.first().content
                  };
                  break;
                case 22:
                  obj = {
                    "22": collected.first().content
                  };
                  break;
                case 23:
                  obj = {
                    "23": collected.first().content
                  };
                  break;
                case 24:
                  obj = {
                    "24": collected.first().content
                  };
                  break;
              }
              apply_for_here.push(message.guild.id, obj, pre+".QUESTIONS")
              message.reply({
                embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("GREEN").setAuthor("Ha añadido su pregunta con éxito!", message.author.displayAvatarURL({
                  dynamic: true
                }))]
              })
              Questions = apply_for_here.get(message.guild.id, pre+".QUESTIONS");
              var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                .setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable188"])) 
                .setFooter(message.guild.name, message.guild.iconURL({
                  dynamic: true
                }))
                .setTimestamp()

              for (var i = 0; i < Questions.length; i++) {
                try {
                  embed.addField(`**${Object.keys(Questions[i])}.**`, `>>> ${Object.values(Questions[i])}`)
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                }
              }
              message.reply({
                embeds: [embed]
              });
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable189"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })
        }
        break;
        case "removequestion": {
          var Questions = apply_for_here.get(message.guild.id, pre+".QUESTIONS");
          var embed = new Discord.MessageEmbed()
            .setFooter(client.getFooter(es))

            .setColor(es.color)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable190"])) 
            .setFooter("AÑADIR EL ÍNDICE PARA EDITAR EL MSG", message.guild.iconURL({
              dynamic: true
            }))
            .setTimestamp()

          for (var i = 0; i < Questions.length; i++) {
            try {
              embed.addField(`**${Object.keys(Questions[i])}.**`, `>>> ${Object.values(Questions[i])}`)
            } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
            }
          }

          message.reply({
            embeds: [embed, new Discord.MessageEmbed()
              .setFooter(client.getFooter(es))

              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable191"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable192"]))
            ]
          }).then(msg => {
            msg.channel.awaitMessages({
              filter: m => m.author.id === cmduser.id,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var arr = apply_for_here.get(message.guild.id, pre+".QUESTIONS");
              var quindex = collected.first().content
              if (arr.length >= Number(quindex)) {

                var index = Number(quindex);
                var counter = 0;
                for (var item of arr) {
                  // console.log(Object.keys(item))
                  if (Object.keys(item) == index) {
                    arr.splice(counter, 1);
                  }
                  counter++;
                }
                counter = 0;
                for (var item of arr) {
                  if (Object.keys(item) != counter + 1) {
                    var key = String(Object.keys(item));
                    item[key] = item[key] //replace the item
                    delete item[key] //delete the old one
                    arr[counter] === item; //update it
                  }
                  counter++;
                }
                apply_for_here.set(message.guild.id, arr, pre+".QUESTIONS")
                Questions = apply_for_here.get(message.guild.id, pre+".QUESTIONS");
                var new_embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable193"])) 
                  .setFooter(message.guild.name, message.guild.iconURL({
                    dynamic: true
                  }))
                  .setTimestamp()
                for (var i = 0; i < Questions.length; i++) {
                  try {
                    new_embed.addField(`**${Object.keys(Questions[i])}.**`, `>>> ${Object.values(Questions[i])}`)
                  } catch {}
                }
                message.reply({
                  embeds: [new_embed]
                });

              } else {
                message.reply({
                  embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor("RED").setAuthor("Parece que esta pregunta no existe. Por favor, vuelva a intentarlo. Aquí están todas las preguntas:", message.author.displayAvatarURL({
                    dynamic: true
                  }))]
                })
                return message.reply({
                  embeds: [embed]
                });
              }
            }).catch(error => {

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable194"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
          })


        }
        break;
        case "applychannel":
          try {
            var applychannel;
            var f_applychannel;
            
            var userid = cmduser.id;
            pickmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setFooter(client.getFooter(es))

                .setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable195"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable196"]))
              ]
            })

            await pickmsg.channel.awaitMessages({filter: (m) => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                erros: ["time"]
              }).then(collected => {
                var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                if (channel) {
                  applychannel = channel.id;
                } else {
                  message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setColor("RED")
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable197"]))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable198"]))
                    ]
                  }).then(msg => msg.delete({
                    timeout: 7500
                  }))
                  throw "❌​ ERROR";
                }
              })
              .catch(e => {
                errored = e
              })
            if (errored)
              return message.reply({
                embeds: [new Discord.MessageEmbed().setColor("RED")
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable199"]))
                  .setDescription(`\`\`\`${errored.message}\`\`\``)
                ]
              }).then(msg => msg.delete({
                timeout: 7500
              }))

            message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                .setAuthor('Configurando...', 'https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif')
                .setFooter(client.getFooter(es))
              ]
            })
            var embed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            var msg = await message.reply({
              embeds: [embed
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable201"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable201_1"]))
              ]
            })
            await msg.channel.awaitMessages({
              filter: m => m.author.id === userid,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              var content = collected.first().content;
              if (!content.startsWith("#") && content.length !== 7) {
                message.reply({
                  content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable202"])
                })
              } else {
                if (isValidColor(content)) {
                  color = content;
                  if (color.toLowerCase() === "#ffffff")
                    color = "#fffff9"
                } else {
                  message.reply({
                    content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable203"])
                  })
                }
              }

              function isValidColor(str) {
                return str.match(/^#[a-f0-9]{6}$/i) !== null;
              }
            }).catch(e => {
              errored = e
            })
            if (errored)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor("RED")
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable204"]))
                  .setDescription(`\`\`\`${errored.message}\`\`\``)
                ]
              }).then(msg => msg.delete({
                timeout: 7500
              }))

            await message.reply({
              embeds: [embed
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable205"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable205_1"]))
              ]
            })
            await msg.channel.awaitMessages({
              filter: m => m.author.id === userid,
              max: 1,
              time: 180000,
              errors: ["TIME"]
            }).then(collected => {
              desc = collected.first().content;
              var setupembed = new Discord.MessageEmbed().setFooter(client.getFooter(es))
                .setColor(color)
                .setDescription(desc)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable206"]))
                .setFooter(client.getFooter(es))

              message.guild.channels.cache.get(applychannel).send({
                embeds: [setupembed],
                components: allbuttons
              }).then(msg => {
                apply_for_here.set(msg.guild.id, msg.id, pre+".message_id")
                apply_for_here.set(msg.guild.id, msg.channel.id, pre+".channel_id")
              }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))

              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setFooter(client.getFooter(es))
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable207"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable208"]))

                ]
              });

            }).catch(e => {
              errored = e
            })
            if (errored)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor("RED").setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable209"]))
                  .setDescription(`\`\`\`${errored.message}\`\`\``)
                ]
              }).then(msg => msg.delete({
                timeout: 7500
              }))
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor("RED")
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable210"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable211"]))
              ]
            }).then(msg => msg.delete({
              timeout: 7500
            }))
          }
          break;
        case "finishedapplychannel":
          try {
            var applychannel;
            var f_applychannel;

            var userid = cmduser.id;
            pickmsg = await message.reply({
              embeds: [new Discord.MessageEmbed().setFooter(client.getFooter(es)).setColor(es.color)
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable212"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable212_1"]))
                .setFooter(client.getFooter(es))
              ]
            })

            await pickmsg.channel.awaitMessages({filter: (m) => m.author.id === cmduser.id,
                max: 1,
                time: 180000,
                erros: ["time"]
              }).then(collected => {
                var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                if (channel) {
                  f_applychannel = channel.id;
                } else {
                  message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setColor("RED")
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable213"]))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable214"]))
                    ]
                  }).then(msg => msg.delete({
                    timeout: 7500
                  }))
                  throw "❌​ ERROR";
                }
              })
              .catch(e => {
                errored = e
              })
            if (errored)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor("RED")
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable215"]))
                  .setDescription(`\`\`\`${errored.message}\`\`\``)
                ]
              }).then(msg => msg.delete({
                timeout: 7500
              }))
            apply_for_here.set(message.guild.id, f_applychannel, pre+".f_channel_id")
            return message.reply({
              content: eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable216"])
            });

          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor("RED")
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable217"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable218"]))
              ]
            }).then(msg => msg.delete({
              timeout: 7500
            }))
          }
          break;
        case `${pre}.last_verify`: {
          apply_for_here.set(message.guild.id, !apply_for_here.get(message.guild.id, `${pre}.last_verify`), `${pre}.last_verify`)
          var embed = new Discord.MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.color)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable219"])) 
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable220"])) 
            .setTimestamp()
          message.reply({
            embeds: [embed]
          });
        }
        break;
        }
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor).setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["variable223"]))
          ]
        });
      }
    }
  }
}


function getNumberEmojis() {
  return [
    "<:Number_0:843943149915078696>",
    "<:Number_1:843943149902626846>",
    "<:Number_2:843943149868023808>",
    "<:Number_3:843943149914554388>",
    "<:Number_4:843943149919535154>",
    "<:Number_5:843943149759889439>",
    "<:Number_6:843943150468857876>",
    "<:Number_7:843943150179713024>",
    "<:Number_8:843943150360068137>",
    "<:Number_9:843943150443036672>",
    "<:Number_10:843943150594031626>",
    "<:Number_11:893173642022748230>",
    "<:Number_12:893173642165383218>",
    "<:Number_13:893173642274410496>",
    "<:Number_14:893173642198921296>",
    "<:Number_15:893173642182139914>",
    "<:Number_16:893173642530271342>",
    "<:Number_17:893173642538647612>",
    "<:Number_18:893173642307977258>",
    "<:Number_19:893173642588991488>",
    "<:Number_20:893173642307977266>",
    "<:Number_21:893173642274430977>",
    "<:Number_22:893173642702250045>",
    "<:Number_23:893173642454773782>",
    "<:Number_24:893173642744201226>",
    "<:Number_25:893173642727424020>"
  ]
}