var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-ticket",
  category: "💪 Configurar",
  aliases: ["setupticket", "ticket-setup", "ticketsetup", "ticketsystem"],
  cooldown: 5,
  usage: "setup-ticket --> seguir los pasos",
  description: "Gestionar 25 sistemas de Ticket diferentes, Ticket-Roles, mensajes, crear/desactivar",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      let temptype = 0;
      let errored = false;
      let guildid = message.guild.id;
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer() {

        let menuoptions = []
        for (let i = 1; i <= 100; i++) {
          menuoptions.push({
            value: `${i} Sistema de tickets`,
            description: `Gestionar/Editar el ${i} Configuración de Tickets`,
            emoji: NumberEmojiIds[i]
          })
        }
        
        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de Tickets')
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
        let row2 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection2')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de Tickets')
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
        let row3 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection3')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de Tickets')
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
        let row4 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection4')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de Tickets')
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
          .setAuthor(client.getAuthor('Configuración de Tickets', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png', 'https://arcticbot.xyz/discord'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [row1, row2, row3, row4]
        })
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          menu?.deferUpdate();
          let SetupNumber = menu?.values[0].split(" ")[0]
          used1 = true;
          second_layer(SetupNumber, menuoptiondata)
        }
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
            menuselection(menu)
          } else menu?.reply({
            content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}`
          })
        });
      }
      async function second_layer(SetupNumber, menuoptiondata) {
        let menuoptions = [{
          value: "Crear un sistema de tickets",
          description: `Crear/Sobreescribir el ${SetupNumber} sistema de tickets`,
          emoji: "⚙️"
        },
        {
          value: "Editar mensaje",
          description: `Editar el mensaje cuando se abre un Ticket`,
          emoji: "🛠"
        },
        {
          value: "Añadir función de Ticket",
          description: `Añadir una función de Ticket para gestionar los Tickets`,
          emoji: "😎"
        },
        {
          value: "Eliminar el rol de los Tickets",
          description: `Eliminar un Rol de Ticket de la gestión de los Tickets`,
          emoji: "💩"
        },
        {
          value: "Categoría de Tickets",
          description: `Definir la categoría en la que se encuentran los Tickets`,
          emoji: "🔘"
        },
        {
          value: "Sistema de Reclamación de Tickets",
          description: `Gestionar el sistema de reclamaciones de este sistema de tickets.`,
          emoji: "✅"
        },
        {
          value: "Canal de registro",
          description: `Definir un canal para los registros de Tickets!`,
          emoji: "📃"
        },
        {
          value: "Establecer el nombre del Ticket por defecto",
          description: `Definir un nombre de canal de tickets por defecto!`,
          emoji: "💬"
        },
        {
          value: "Borrar y Reiniciar",
          description: `Borrar la configuración actual, lo que le permite restablecer la configuración`,
          emoji: "🗑"
        },
        {
          value: "Cerrar Categoría de Tickets",
          description: `When Closing a Ticket, it will be moved to there`,
          emoji: "✂️"
        },
        {
          value: "Cancel",
          description: `Cancel and stop the Ticket-Setup!`,
          emoji: "862306766338523166"
        }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder(`Click me to manage the ${SetupNumber} Ticket System!\n\n**You've picked:**\n> ${menuoptiondata.value}`)
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
          .setAuthor(SetupNumber + " Configuración de Tickets", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "https://arcticbot.xyz/discord")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
          menu?.deferUpdate();
          var ticket = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}`);
          handle_the_picks(menu?.values[0], SetupNumber, ticket)
        }
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
            menuselection(menu)
          } else menu?.reply({
            content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}`
          })
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, ticket) {

        switch (optionhandletype) {
          case "Cerrar Categoría de Tickets": {
            let parentId = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}.closedParent`);
            let parent = parentId ? message.guild.channels.cache.get(parentId) : null;
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("Cuál debería ser la nueva Categoría Cerrada de Tickets?")
              .setDescription(`Actualmente es: \`${parentId ? "Aún no está configurado" : parent ? parent.name : `Canal no encontrado: ${parentId}`}\`!\nCuando se cierra un Ticket, se traslada allí hasta que se borra.!\n> **Envia la nueva __PARENT ID__ ahora!**`)
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                let content = collected.first().content;
                if (!content || content.length > 19 || content.length < 17) {
                  return message.reply("Un Id tiene entre 17 y 19 caracteres")
                }
                parent = message.guild.channels.cache.get(content);
                if(!parent) {
                  return message.reply(`No hay ningún parent al que pueda acceder en este Gremio que tenga el ID ${content}`);
                }
                if(parent.type !== "GUILD_CATEGORY"){
                  return message.reply(`<#${parent.id}> no es una CATEGORÍA/PARENT`);
                }
                client.setups.set(message.guild.id, parent.id, `ticketsystem${SetupNumber}.closedParent`);
                message.reply(`Ahora moveré los Tickets cerrados a ${parent.name} (${parent.id})`);
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          } break;
          case "Establecer el nombre del Ticket por defecto": {
            let defaultname = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}.defaultname`);
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("Cuál debería ser el nuevo nombre de Ticket por defecto?")
              .setDescription(`Actualmente es: \`${defaultname}\` alias se convertirá en: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\` ... se sustituirá por el nombre de usuario de apertura del ticket\n> \`{count}\` ... Se sustituirá por el ID del TICKET (COUNT)\n**Envíe el mensaje ahora!**`)
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                let content = collected.first().content;
                if (!content || !content.includes("{member}")) {
                  return message.reply("Es necesario tener {member} en algún lugar")
                }
                if (!content || content.length > 32) {
                  return message.reply("Un nombre de canal no puede tener más de 32 caracteres")
                }
                defaultname = content;
                client.setups.set(message.guild.id, defaultname, `ticketsystem${SetupNumber}.defaultname`);
                message.reply(`Establezca el nombre del Ticket por defecto en: \`${defaultname}\` alias se convertirá en: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``)
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          } break;
          case "Crear un sistema de tickets":

            var msg11 = new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable6"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable7"]))
              .setFooter(client.getFooter(es))
              .setColor(es.color)
            message.reply({
              embeds: [msg11]
            }).then(mm => {
              mm.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser,
                max: 1,
                time: 180000,
                errors: ['time'],
              }).then(collected => {
                let channel = collected.first().mentions.channels?.filter(ch => ch.guild.id == mm.guild.id)?.first()
                if (!channel) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable8"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
                var msg6 = new MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable9"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable10"]))
                  .setFooter(client.getFooter(es))
                  .setColor(es.color)
                message.reply({
                  embeds: [msg6]
                }).then(msg => {
                  msg.channel.awaitMessages({
                    filter: m => m.author.id == cmduser,
                    max: 1,
                    time: 180000,
                    errors: ['time'],
                  }).then(collected => {
                    //parent id in db
                    if (channel.parent && channel.parent.id) client.setups.set(message.guild.id, channel.parent.id, `ticketsystem${SetupNumber}.parentid`);

                    ticketmsg = collected.first().content;

                    //channel id in db
                    client.setups.set(message.guild.id, channel.id, `ticketsystem${SetupNumber}.channelid`);

                    let button_open = new MessageActionRow().addComponents([new MessageButton().setStyle('SUCCESS').setCustomId('create_a_ticket').setLabel('Create a Ticket').setEmoji("📨")])

                    channel.send({
                      embeds: [new MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable11"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable12"]))
                        .setFooter(client.getFooter(es))
                        .setColor(es.color)
                      ],
                      components: [button_open]
                    }).then(msg => {
                      //message id in db
                      client.setups.set(message.guild.id, msg.id, `ticketsystem${SetupNumber}.messageid`);
                      client.setups.set(message.guild.id, true, `ticketsystem${SetupNumber}.enabled`);
                      //msg.react(emoji2react)
                      var themebd = new MessageEmbed()
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable13"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable14"]))
                        .setFooter(client.getFooter(es))

                      message.reply({
                        embeds: [themebd]
                      })

                    })
                  }).catch(error => {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable15"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  })
                })
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable16"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
           break;
          case "Borrar y Reiniciar":
            try {
              var channel = message.guild.channels.cache.get(ticket.channelid)
              channel.delete();
            } catch { }
            try {
              var parent = message.guild.channels.cache.get(ticket.parentid)
              parent.delete();
            } catch { }
            message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable17"]))
            client.setups.set(message.guild.id, {
              enabled: true,
              guildid: message.guild.id,
              messageid: "",
              channelid: "",
              parentid: "",
              claim: {
                enabled: false,
                messageOpen: "Estimado {user}!\n> *Por favor, espere hasta que un miembro del personal reclame su Ticket!*",
                messageClaim: "{claimer} **ha reclamado el Ticket!**\n> Ahora dará {user} soporte!"
              },
              message: "Hey {user}, gracias por abrir un Ticket! Alguien le ayudará pronto!",
              adminroles: []
            }, `ticketsystem${SetupNumber}`);
            break;
          case "Editar mensaje":
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable18"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable19"]))
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable20"]))
                client.setups.set(message.guild.id, collected.first().content, `ticketsystem${SetupNumber}.message`);

              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Añadir función de billete":
            var rrembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter("Elija el NÚMERO DE ÍNDICE", es.footericon))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable22"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable23"]))
            message.reply({
              embeds: [rrembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                var role = collected.first().mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (!role) message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable24"]))

                message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable25"]));
                client.setups.push(message.guild.id, role.id, `ticketsystem${SetupNumber}.adminroles`);

              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable26"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Eliminar el rol de los Tickets":
            var rrrembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter("Elija el NÚMERO DE ÍNDICE", es.footericon))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable27"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable28"]))
            message.reply({
              embeds: [rrrembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                var role = collected.first().mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (!role) message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable29"]))
                try {
                  client.setups.remove(message.guild.id, role.id, `ticketsystem${SetupNumber}.adminroles`);
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable30"]));
                } catch {
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable31"]))
                  client.setups.set(message.guild.id, [], `ticketsystem${SetupNumber}.adminroles`);
                }
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable32"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Categoría de Tickets":
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable33"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable34"]))
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                if (collected.first().content.length == 18) {
                  try {
                    var cat = message.guild.channels.cache.get(collected.first().content)
                    message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable35"]))
                    client.setups.set(message.guild.id, cat.id, `ticketsystem${SetupNumber}.parentid`);
                  } catch {
                    message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable36"]))
                  }
                } else {
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable37"]))
                }

              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable38"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Sistema de Reclamación de Tickets": {
            /*
            claim: {
              enabled: false,
              messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
              messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
            },
            */
            let claimData = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}.claim`);
            third_layer(SetupNumber)
            async function third_layer(SetupNumber) {
              let menuoptions = [{
                value: `${claimData.enabled ? "Sistema de reclamación deshabilitado" : "Habilitar el sistema de reclamaciones"}`,
                description: `${claimData.enabled ? "Ya no es necesario reclamar los Tickets" : "Hacer que el personal tenga que reclamar el Ticket"}`,
                emoji: `${claimData.enabled ? "❌" : "✅"}`
              },
              {
                value: "Editar mensaje abierto",
                description: `Editar el mensaje de reclamación cuando se abre un Ticket`,
                emoji: "🛠"
              },
              {
                value: "Editar el mensaje de la reclamación",
                description: `Editar el mensaje de reclamación cuando un miembro del personal lo reclama!`,
                emoji: "😎"
              },
              {
                value: "Cancel",
                description: `Cancelar y Detener el Ticket-Setup!`,
                emoji: "862306766338523166"
              }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder(`Haga clic en mí para gestionar el ${SetupNumber} Sistema de Tickets!\n\n**Has elegido:**\n> Sistema de Reclamación de Tickets`)
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
                .setAuthor(SetupNumber + " Configuración de Tickets", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "https://arcticbot.xyz/discord")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
              //send the menu msg
              let menumsg = await message.reply({
                embeds: [MenuEmbed],
                components: [new MessageActionRow().addComponents(Selection)]
              })
              //function to handle the menuselection
              function menuselection(menu) {
                let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
                menu?.deferUpdate();
                var ticket = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}`);
                handle_the_picks2(menu?.values[0], SetupNumber, ticket)
              }
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
                  menuselection(menu)
                } else menu?.reply({
                  content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`,
                  ephemeral: true
                });
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({
                  embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                  components: [],
                  content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}`
                })
              });
            }
            async function handle_the_picks2(optionhandletype, SetupNumber) {

              switch (optionhandletype) {
                case `${claimData.enabled ? "Sistema de reclamación deshabilitado" : "Habilitar el sistema de reclamaciones"}`: {
                  client.setups.set(message.guild.id, !claimData.enabled, `ticketsystem${SetupNumber}.claim.enabled`);
                  claimData = client.setups.get(message.guild.id, `ticketsystem${SetupNumber}.claim`);
                  return message.reply({
                    embeds: [
                      new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setFooter(client.getFooter(es))
                        .setTitle(`${claimData.enabled ? "Habilitado el sistema de reclamaciones" : "Deshabilitado el sistema de reclamaciones"}`)
                        .setDescription(`${claimData.enabled ? "Cuando un usuario abre un Ticket, un miembro del personal tiene que reclamarlo, antes de que pueda enviar algo allí!\n> Esto es útil para la profesionalidad y la información!\n> **NOTA:** Los administradores siempre pueden escribir..." : "Ya no es necesario reclamar un Ticket"}`)
                    ]
                  });
                } break;
                case "Editar mensaje abierto": {
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("Cuál debería ser el nuevo mensaje cuando un usuario abre un Ticket?")
                    .setDescription(String("{user} será sustituido por un USERPING\n\n**Mensaje actual:**\n>>> " + claimData.messageOpen.substring(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(collected => {
                      client.setups.set(message.guild.id, collected.first().content, `ticketsystem${SetupNumber}.claim.messageOpen`);
                      message.reply(`Establecer con éxito el Nuevo Mensaje!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                } break;
                case "Editar el mensaje de la reclamación": {
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a Staff claims a Ticket?")
                    .setDescription(String("{user} será sustituido por un USERPING\n{claimer} será sustituido por un PING para QUIEN LO RECLAMO\n\n**Mensaje actual:**\n>>> " + claimData.messageClaim.substring(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(collected => {
                      client.setups.set(message.guild.id, collected.first().content, `ticketsystem${SetupNumber}.claim.messageClaim`);
                      message.reply(`Establecer con éxito el Nuevo Mensaje!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                } break;
              }
            }
          } break;
          case "Canal de registro":
            //ticketlogid
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("En qué canal desea enviar los registros de este sistema de Tickets (cuando se borra un Ticket)")
              .setDescription(`Hacer ping al canal / enviar \`no\` para desabollar Registros!\n\n*El registro sólo se enviará si el ticket obtiene __BORRADO__ a través del BOTÓN (no del cierre)*`)
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                let channel = collected.first().mentions.channels.first();
                if (channel) {
                  client.setups.set(message.guild.id, channel.id, `ticketsystem${SetupNumber}.ticketlogid`);
                  message.reply(`Se ha establecido con éxito el <#${channel.id}> como el TICKET-LOG para ${SetupNumber ? SetupNumber : 1}. Ticketsystem`);
                } else {
                  client.setups.set(message.guild.id, "", `ticketsystem${SetupNumber}.ticketlogid`);
                  message.reply(":x: Deshabilitado el registro, porque no envió un canal válido")
                }
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable38"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;

          default:
            message.reply(String("SORRY, ese número no existe :(\n Su opinión:\n> " + collected.first().content).substring(0, 1999))
            break;
        }
      }




    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable39"]))
        ]
      });
    }
  },
};


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