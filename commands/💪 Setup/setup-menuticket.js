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
  name: "setup-menuticket",
  category: "💪 Configurar",
  aliases: ["setupmenuticket", "menuticket-setup", "menuticketsetup", "menuticketsystem"],
  cooldown: 5,
  usage: "setup-menuticket --> seguir los pasos",
  description: "Gestione hasta 25 sistemas de Tickets diferentes en forma de DISCORD-MENU",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      var theDB = client.menuticket;
      var pre;

      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      let NumberEmojis = getNumberEmojis();
      first_layer()
      async function first_layer() {

        let menuoptions = []
        for (let i = 1; i <= 100; i++) {
          menuoptions.push({
            value: `${i}. Ticket menú`,
            description: `Gestionar/Editar ${i}. Menú de configuración de Tickets`,
            emoji: NumberEmojiIds[i]
          })
        }

        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de tickets de menú.')
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
          .setPlaceholder('Haga clic en mí para configurar el sistema de tickets de menú.')
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
          .setPlaceholder('Haga clic en mí para configurar el sistema de tickets de menú.')
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
          .setPlaceholder('Haga clic en mí para configurar el sistema de tickets de menú.')
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
          .setAuthor(client.getAuthor('Menu Ticket Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://arcticbot.xyz/discord'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [row1, row2, row3, row4, new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://www.youtube.com/channel/UCN6ydnskxN9b47zPDL6rVVQ").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(".")[0];
            pre = `menuticket${SetupNumber}`;
            theDB = client.menuticket; //change to the right database
            second_layer(SetupNumber)
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
            content: `​✔️ **Seleccionado: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nada"}\`**`
          }).catch(() => { });
        });
      }
      async function second_layer(SetupNumber) {
        //setup-menuticket
        theDB.ensure(message.guild.id, {
          messageId: "",
          channelId: "",
          claim: {
            enabled: false,
            messageOpen: "Hola {user}!\n> *Por favor, espere hasta que un miembro del personal reclame su Ticket!*",
            messageClaim: "{claimer} **ha reclamado el Ticket!**\n> Ahora dará {user} soporte!"
          },
          access: [],
          data: [
            /*
              {
                value: "",
                description: "",
                category: null,
                replyMsg: "{user} Welcome to the Support!",
              }
            */
          ]
        }, pre);
        let menuoptions = [{
          value: "Enviar el mensaje de configuración",
          description: `(Re) Enviar el mensaje de Abrir un Ticket (con MENÚ)`,
          emoji: "👍"
        },
        {
          value: "Añadir la opción de la entrada",
          description: `Añada hasta 25 opciones diferentes de Ticket abierto`,
          emoji: "📤"
        },
        {
          value: "Opción de editar el Ticket",
          description: `Editar uno de los datos de las opciones de los Tickets`,
          emoji: "✒️"
        },
        {
          value: "Gestionar el acceso general",
          description: `Añadir/eliminar usuarios/roles`,
          emoji: "👍"
        },
        {
          value: "Eliminar la opción Ticket",
          description: `Eliminar una opción de Ticket abierto`,
          emoji: "🗑"
        },
        {
          value: "Categoría de Tickets cerrados",
          description: `Al cerrar un Ticket, se moverá a allí`,
          emoji: "✂️"
        },
        {
          value: "Sistema de Reclamación de Tickets",
          description: `Gestionar el sistema de reclamaciones de este sistema de tickets.`,
          emoji: "✅"
        },
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder('Haga clic en mí para configurar el sistema Menu-Ticket!')
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
          //.setAuthor('Menu Ticket Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://arcticbot.xyz/discord')
          .setAuthor({ name: "Menú de configuración de tickets", iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png", url: "https://arcticbot.xyz/discord" })
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection), new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://www.youtube.com/channel/UCN6ydnskxN9b47zPDL6rVVQ").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            handle_the_picks(menu?.values[0], menuoptiondata, SetupNumber)
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
            content: `​✔️ **Seleccionado: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nada"}\`**`
          })
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata, SetupNumber) {
        switch (optionhandletype) {
          case "Sistema de Reclamación de Tickets": {
            /*
              claim: {
                enabled: false,
                messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
              }
            */
            let claimData = theDB.get(message.guild.id, `${pre}.claim`);
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
                description: `Cancelar y detener el Ticket-Setup!`,
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
                .setAuthor(SetupNumber + " Ticket Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "https://arcticbot.xyz/discord")
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
                handle_the_picks2(menu?.values[0], SetupNumber)
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
            async function handle_the_picks2(optionhandletype) {

              switch (optionhandletype) {
                case `${claimData.enabled ? "Sistema de reclamación deshabilitado" : "Habilitar el sistema de reclamaciones"}`: {
                  theDB.set(message.guild.id, !claimData.enabled, `${pre}.claim.enabled`);
                  claimData = theDB.get(message.guild.id, `${pre}.claim`);
                  return message.reply({
                    embeds: [
                      new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setFooter(client.getFooter(es))
                        .setTitle(`${claimData.enabled ? "Habilitado el sistema de reclamaciones" : "Deshabilitado el sistema de reclamaciones"}`)
                        .setDescription(`${claimData.enabled ? "Cuando un usuario abre un Ticket, un miembro del personal tiene que reclamarlo, antes de que pueda enviar algo allí!\n> Esto es útil para la profesionalidad y la información!\n> **NOTA:** Los administradores siempre pueden chatear..." : "Ya no es necesario reclamar un Ticket"}`)
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
                      theDB.set(message.guild.id, collected.first().content, `${pre}.claim.messageOpen`);
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
                    .setTitle("Cuál debería ser el nuevo mensaje cuando un miembro del personal reclama un Ticket??")
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
                      theDB.set(message.guild.id, collected.first().content, `${pre}.claim.messageClaim`);
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
          case "Enviar el mensaje de configuración": {
            await message.guild.emojis.fetch().catch(() => { });
            let data = theDB.get(message.guild.id, pre + ".data");
            let settings = theDB.get(message.guild.id, pre);
            if (!data || data.length < 1) {
              return message.reply("❌​ **Debe añadir al menos 1 Open-Ticket-Option**")
            }
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("Cuál debe ser el texto a mostrar en el Embed?")
                  .setDescription(`Por ejemplo:\n> \`\`\`Para abrir un Ticket, seleccione el tema que necesita en la selección de abajo!\`\`\``)
              ]
            });

            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("Dónde debo enviar el mensaje de abrir un nuevo Ticket??")
                    .setDescription(`Por favor, haga ping al canal ahora!\n> Sólo tienes que escribir: \`#canal\`${settings.channelId && message.guild.channels.cache.get(settings.channelId) ? `| Antes de que fuera: <#${settings.channelId}>` : settings.channelId ? `| Antes de que fuera: ${settings.channelId} (El canal se ha borrado)` : ""}\n\nPuede editar el título, etc., después utilizando el botón \`${prefix}editembed\` Command`)
                ]
              });

              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && (collected2.first().mentions.channels.size > 0 || message.guild.channels.cache.get(collected2.first().content?.trim()))) {
                let data = theDB.get(message.guild.id, pre + ".data");
                let channel = collected2.first().mentions.channels.first() || message.guild.channels.cache.get(collected2.first().content?.trim());
                let msgContent = collected.first().content;
                let embed = new MessageEmbed()
                  .setColor(es.color)
                  .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setDescription(msgContent)
                  .setTitle("📨 Abrir un Ticket")
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder('Haga clic en mí para acceder al sistema de Menu-Ticket!')
                  .addOptions(
                    data.map((option, index) => {
                      let Obj = {
                        label: option.value.substring(0, 50),
                        value: option.value.substring(0, 50),
                        description: option.description.substring(0, 50),
                        emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                      }
                      return Obj;
                    }))
                channel.send({
                  embeds: [embed],
                  components: [new MessageActionRow().addComponents([Selection])]
                }).catch((err) => {
                  console.log(err)
                  let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder('Haga clic en mí para acceder al sistema de Menu-Ticket!')
                    .addOptions(
                      data.map((option, index) => {
                        let Obj = {
                          label: option.value.substring(0, 50),
                          value: option.value.substring(0, 50),
                          description: option.description.substring(0, 50),
                          emoji: NumberEmojiIds[index + 1]
                        }
                        return Obj;
                      }))
                  channel.send({
                    embeds: [embed],
                    components: [new MessageActionRow().addComponents([Selection])]
                  }).catch((e) => {
                    console.warn(e)
                  }).then(msg => {
                    theDB.set(message.guild.id, msg.id, pre + ".messageId");
                    theDB.set(message.guild.id, channel.id, pre + ".channelId");
                    message.reply(`Se ha configurado con éxito el Menu-Ticket en <#${channel.id}>`)
                  });
                }).then(msg => {
                  theDB.set(message.guild.id, msg.id, pre + ".messageId");
                  theDB.set(message.guild.id, channel.id, pre + ".channelId");
                  message.reply(`Se ha configurado con éxito el Ticket-Menú en <#${channel.id}>`)
                });
              } else {
                return message.reply("❌​ **No has hecho ping a un canal válido!**")
              }
            } else {
              return message.reply("❌​ **No has introducido un mensaje válido en el tiempo! CANCELADO!**")
            }
          }
            break;
          case "Añadir la opción de la entrada": {
            let data = theDB.get(message.guild.id, pre + ".data");
            if (data.length >= 25) {
              return message.reply("❌​ **Has alcanzado el límite de 25 opciones diferentes!** Eliminar primero otra opción!")
            }
            //ask for value and description
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("Cuál debe ser el VALOR y la DESCRIPCIÓN de la opción de menú?")
                  .setDescription(`**Uso:** \`VALOR++DESCRIPCIÓN\`\n> **Nota:** La longitud máxima del VALOR es: \`25 Letras\`\n> **Nota:** La longitud máxima de la DESCRIPCIÓN es: \`50 Letras\`\n\nPor ejemplo:\n> \`\`\`Soporte general++Obtenga ayuda para lo que quiera!\`\`\``)
              ]
            });
            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              if (!collected.first().content.includes("++")) return message.reply("❌​ **Uso inválido! Por favor, tenga en cuenta el uso y compruebe el ejemplo**")
              let value = collected.first().content.split("++")[0].trim().substring(0, 25);
              let index = data.findIndex(v => v.value == value);
              if (index >= 0) {
                return message.reply("❌​ **Las opciones no pueden tener el MISMO VALOR!** Ya existe una opción con ese valor!");
              }
              let description = collected.first().content.split("++")[1].trim().substring(0, 50);
              //ask for category
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("En qué categoría deben abrirse los nuevos Tickets de esta Opción??")
                    .setDescription(`**Se sugiere rellenarla, ya que hay ajustes para la sincronización con esa categoría!**\nSólo tiene que enviar el ID de la misma, enviar \`no\` para ninguna categoría!\nPor ejemplo:\n> \`840332704494518292\``)
                ]
              });
              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && collected2.first().content) {
                let categoryId = collected2.first().content;
                let category = message.guild.channels.cache.get(categoryId) || null;
                if (category && category.id) category = category.id;
                else category = null;
                //ask for reply message
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("Cuál debería ser el mensaje de respuesta cuando alguien abre un Ticket??")
                      .setDescription(`For Example:\n> \`\`\`{user} Bienvenido a Soporte! Díganos en qué podemos ayuda!\`\`\``)
                  ]
                });
                let collected3 = await tempmsg.channel.awaitMessages({
                  filter: (m) => m.author.id == cmduser.id,
                  max: 1,
                  time: 90000, errors: ["time"]
                });
                if (collected3 && collected3.first().content) {
                  let replyMsg = collected3.first().content;
                  let defaultname = "🎫・{count}・{member}";
                  let tempmsg = await message.reply({
                    embeds: [
                      new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("Cuál debería ser el nuevo nombre de Ticket por defecto?")
                        .setDescription(`Actualmente/Sugerido es: \`${defaultname}\` alias se convertirá en: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\` ... se sustituirá por el nombre de usuario de apertura del ticket\n> \`{count}\` ... Se sustituirá por el ID del TICKET (COUNT)\n**Envíe el mensaje ahora!**`)
                    ]
                  });
                  let collected4 = await tempmsg.channel.awaitMessages({
                    filter: (m) => m.author.id == cmduser.id,
                    max: 1,
                    time: 90000, errors: ["time"]
                  });
                  if (collected4 && collected4.first().content) {
                    if (!collected4.first().content || !collected4.first().content.includes("{member}")) {
                      message.reply("You need to have {member} somewhere, utilizando la SUGERENCIA DEFAULTNAME (se modifica mediante edición)");
                    } else if (!collected4.first().content || collected4.first().content.length > 32) {
                      message.reply("Un nombre de canal no puede tener más de 32 caracteres, utilizando la sugerencia DEFAULTNAME (se cambia a través de la edición)");
                    } else {
                      defaultname = collected4.first().content
                    }


                    var rermbed = new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("Cuál debe ser el EMOJI a mostrar?")
                      .setDescription(`Reacciona a __ESTE MENSAJE__ con el Emoji que quieras!\n> Haga clic en el Emoji por defecto o añada uno personalizado/estándar`)

                    var emoji, emojiMsg;
                    message.reply({ embeds: [rermbed] }).then(async msg => {
                      await msg.react(NumberEmojiIds[data.length + 1]).catch(console.warn);
                      msg.awaitReactions({
                        filter: (reaction, user) => user.id == cmduser.id,
                        max: 1,
                        time: 180e3
                      }).then(async collected => {
                        await msg.reactions.removeAll().catch(console.warn);
                        if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                          emoji = collected.first().emoji?.id;
                          if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                          else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                        } else if (collected.first().emoji?.name) {
                          emoji = collected.first().emoji?.name;
                          emojiMsg = collected.first().emoji?.name;
                        } else {
                          message.reply(":x: **No se ha añadido ningún emoji válido, se utiliza el EMOJI por defecto**");
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                        }

                        try {
                          await msg.react(emoji);
                          if (NumberEmojiIds.includes(collected.first().emoji?.id)) {
                            emoji = null;
                            emojiMsg = NumberEmojis[data.length];
                          }
                        } catch (e) {
                          console.log(e)
                          message.reply(":x: **No he podido utilizar el EMOJI PERSONALIZADO que has añadido, ya que no puedo acceder a él / utilizarlo como reacción/emoji para el menú**\nUtilizar el emoji por defecto!");
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                        }
                        finished();

                      }).catch(() => {
                        message.reply(":x: **No se ha añadido ningún emoji válido, se utiliza el EMOJI por defecto**");
                        emoji = null;
                        emojiMsg = NumberEmojis[data.length];
                        finished();
                      });
                    })
                    function finished() {
                      theDB.push(message.guild.id, {
                        value,
                        description,
                        category,
                        defaultname,
                        replyMsg,
                        emoji
                      }, pre + ".data");
                      message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Se han añadido con éxito los nuevos datos a la lista!")
                            .setDescription(`Asegúrese de volver a enviar el mensaje, para que también lo actualice!\n> \`${prefix}setup-menuticket\` --> Enviar mensaje de configuración`)
                            .addField("Valor:", `> ${value}`.substring(0, 1024), true)
                            .addField("Descripción:", `> ${description}`.substring(0, 1024), true)
                            .addField("Categoría:", `> <#${category}> (${category})`.substring(0, 1024), true)
                            .addField("Nombre por defecto:", `> \`${defaultname}\` --> \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``.substring(0, 1024), true)
                            .addField("Mensaje de respuesta:", `> ${replyMsg}`.substring(0, 1024), true)
                            .addField("Emoji:", `> ${emojiMsg}`.substring(0, 1024), true)
                        ]
                      });
                    }



                  } else {
                    return message.reply("❌​ **No has introducido un mensaje válido en el tiempo! CANCELADO!**")
                  }
                } else {
                  return message.reply("❌​ **No ha introducido un mensaje válido a tiempo. CANCELADO!**")
                }
              } else {
                return message.reply("❌​ **No has introducido un mensaje válido en el tiempo. CANCELADO!**")
              }
            } else {
              return message.reply("❌​ **No has introducido un mensaje válido en el tiempo. CANCELADO!**")
            }
          }
            break;
          case "Opción de editar el Ticket": {


            let data = theDB.get(message.guild.id, pre + ".data");
            if (!data || data.length < 1) {
              return message.reply("❌​ **No hay opciones de Open-Ticket para eliminar**")
            }
            let embed = new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setDescription("Sólo tienes que elegir las opciones que quieres editar!")
              .setTitle("Qué opción desea editar??")
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Haga clic en mí para configurar el sistema de Menu-Ticket!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                    emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                  }
                  return Obj;
                }))
            let menumsg;

            //send the menu msg
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async (err) => {
              console.log(err)
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Haga clic en mí para acceder al sistema de Menu-Ticket!')
                .addOptions(
                  data.map((option, index) => {
                    let Obj = {
                      label: option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                      emoji: NumberEmojiIds[index + 1]
                    }
                    return Obj;
                  }))
              menumsg = await message.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([Selection])]
              }).catch((e) => {
                console.warn(e)
              })
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              max: 1,
              time: 90000, errors: ["time"]
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                let index = data.findIndex(v => v.value == menu?.values[0]);




                let menuoptions = [{
                  value: "Cambiar el valor y la descripción".substring(0, 25),
                  description: `Cambiar el valor, etc. de la opción de visualización`,
                  emoji: "✒️"
                },
                {
                  value: "Cambiar la categoría abierta",
                  description: `Al abrir un Ticket, se trasladará a él`,
                  emoji: "✂️"
                },
                {
                  value: "Cambiar el nombre por defecto",
                  description: `Cambiar el nombre del Ticket por defecto`,
                  emoji: "🎫"
                },
                {
                  value: "Cambiar Emoji",
                  description: `Cambiar el emoji por defecto`,
                  emoji: "👍"
                },
                {
                  value: "Cambiar el mensaje de respuesta",
                  description: `Cambiar el mensaje al abrir el Ticket`,
                  emoji: "✅"
                },
                ]
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder(`Haga clic en mí para editar el ${index}. Opción!`)
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
                  .setAuthor(client.getAuthor('Menú de configuración de tickets', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://arcticbot.xyz/discord'))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

                //send the menu msg
                let menumsg = await message.reply({
                  embeds: [MenuEmbed],
                  components: [new MessageActionRow().addComponents(Selection), new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://www.youtube.com/channel/UCN6ydnskxN9b47zPDL6rVVQ").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
                })
                //Create the collector
                const collector = menumsg.createMessageComponentCollector({
                  filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                  time: 90000, errors: ["time"]
                })
                //Menu Collections
                collector.on('collect', menu => {
                  if (menu?.user.id === cmduser.id) {
                    collector.stop();
                    let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                    if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                    menu?.deferUpdate();
                    handle_the_picks3(menu?.values[0], menuoptiondata, SetupNumber)
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
                    content: `​✔️ **Seleccionado: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nada"}\`**`
                  })
                });

                async function handle_the_picks3(optionhandletype) {

                  switch (optionhandletype) {
                    case `Cambiar el valor y la descripción`.substring(0, 25): {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Cuál debe ser el VALOR y la DESCRIPCIÓN de la opción de menú?")
                            .setDescription(`**Uso:** \`VALOR++DESCRIPCIÓN\`\n> **Nota:** La longitud máxima del VALOR es: \`25 Letras\`\n> **Nota:** La longitud máxima de la DESCRIPCIÓN es: \`50 Letras\`\n\nPor ejemplo:\n> \`\`\`Soporte general++Obtenga ayuda para lo que quiera!\`\`\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      if (collected && collected.first().content) {
                        if (!collected.first().content.includes("++")) return message.reply("❌​ **Uso inválido! Por favor, tenga en cuenta el uso y compruebe el ejemplo**")
                        let value = collected.first().content.split("++")[0].trim().substring(0, 25);
                        let index2 = data.findIndex(v => v.value == value);
                        if (index2 >= 0 && index != index2) {
                          return message.reply("❌​ **Las opciones no pueden tener el MISMO VALOR ** Ya hay una opción con ese valor!");
                        }
                        let description = collected.first().content.split("++")[1].trim().substring(0, 50);
                        data[index].value = value;
                        data[index].description = description;
                        return finished();
                      } else {
                        return message.reply("❌​ **No has introducido un mensaje válido en el tiempo. CANCELADO!**")
                      }
                    } break;
                    case `Cambiar la categoría abierta`: {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("En qué categoría deben abrirse los nuevos Tickets de esta Opción??")
                            .setDescription(`**Se sugiere rellenarla, ya que hay ajustes para la sincronización con esa categoría!**\n\nSólo tiene que enviar el ID de la misma, \`no\` para ninguna categoría!\nPor ejemplo:\n> \`840332704494518292\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      let categoryId = collected ? collected2.first().content : "";
                      let category = message.guild.channels.cache.get(categoryId) || null;
                      if (category && category.id) {
                        data[index].category = category.id;
                        return finished();
                      }
                      return message.reply("❌​ **Se ha añadido un Category-ID inválido**")
                    } break;
                    case `Cambiar el nombre por defecto`: {
                      let defaultname = "🎫・{count}・{member}";
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Cuál debería ser el nuevo nombre de Ticket por defecto?")
                            .setDescription(`Actualmente/Sugerido es: \`${defaultname}\` alias se convertirá en: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\` ... se sustituirá por el nombre de usuario de apertura del ticket\n> \`{count}\` ... Se sustituirá por el ID del TICKET (COUNT)\n**Envíe el mensaje ahora!**`)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      if (!collected4.first().content || !collected4.first().content.includes("{member}")) {
                        return message.reply("Es necesario tener {member} somewhere, utilizando la SUGERENCIA DEFAULTNAME (se modifica a través de la edición)");
                      } else if (!collected4.first().content || collected4.first().content.length > 32) {
                        return message.reply("Un nombre de canal no puede tener más de 32 caracteres, utilizando la SUGERENCIA DEFAULTNAME (se cambia a través de la edición)");
                      } else {
                        data[index].defaultname = collected4.first().content
                        return finished();
                      }
                    } break;
                    case `Cambiar Emoji`: {
                      var rermbed = new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("Cuál debe ser el EMOJI a mostrar?")
                        .setDescription(`Reacciona a __ESE MENSAJE__ con el Emoji que quieras!\n> Haga clic en el Emoji por defecto o añada uno personalizado/estándar`)

                      var emoji, emojiMsg;
                      message.reply({ embeds: [rermbed] }).then(async msg => {
                        await msg.react(NumberEmojiIds[data.length]).catch(console.warn);
                        msg.awaitReactions({
                          filter: (reaction, user) => user.id == cmduser.id,
                          max: 1,
                          time: 180e3
                        }).then(async collected => {
                          await msg.reactions.removeAll().catch(console.warn);
                          if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                            emoji = collected.first().emoji?.id;
                            if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                            else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                          } else if (collected.first().emoji?.name) {
                            emoji = collected.first().emoji?.name;
                            emojiMsg = collected.first().emoji?.name;
                          } else {
                            message.reply(":x: **No se ha añadido ningún emoji válido, se utiliza el EMOJI por defecto**");
                            data[index].emoji = null;
                            data[index].emojiMsg = NumberEmojis[data.length];
                          }

                          try {
                            await msg.react(emoji);
                            if (NumberEmojiIds.includes(collected.first().emoji?.id)) {
                              data[index].emoji = null;
                              data[index].emojiMsg = NumberEmojis[data.length];
                            } else {
                              data[index].emoji = emoji;
                              data[index].emojiMsg = emojiMsg;
                            }
                          } catch (e) {
                            console.log(e)
                            message.reply(":x: **No he podido utilizar el EMOJI PERSONALIZADO que has añadido, ya que no puedo acceder a él / utilizarlo como reacción/emoji para el menú**\nUtilizar el emoji por defecto!");
                            data[index].emoji = null;
                            data[index].emojiMsg = NumberEmojis[data.length];
                          }
                          finished();
                        }).catch((e) => {
                          console.log(e)
                          message.reply(":x: **No se ha añadido ningún emoji válido, se utiliza el EMOJI por defecto**");
                          data[index].emoji = null;
                          data[index].emojiMsg = NumberEmojis[data.length];
                          finished();
                        });
                      })
                    } break;
                    case `Cambiar el mensaje de respuesta`: {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Cuál debería ser el mensaje de respuesta cuando alguien abre un Ticket??")
                            .setDescription(`Por ejemplo:\n> \`\`\`{user} Bienvenido a la Asistencia! Díganos en qué necesita ayuda!\`\`\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      if (collected && collected.first().content) {
                        data[index].replyMsg = collected3.first().content;
                        return finished();
                      } else {
                        return message.reply("❌​ **No has introducido un mensaje válido en el tiempo. CANCELADO!**")
                      }
                    } break;
                  }
                }
                function finished() {
                  theDB.set(message.guild.id, data, pre + ".data");
                  let {
                    value,
                    description,
                    defaultname,
                    category,
                    replyMsg,
                    emojiMsg, emoji
                  } = data[index];
                  emojiMsg = emojiMsg ? emojiMsg : client.emojis.cache.has(emoji) ? client.emojis.cache.get(emoji).toString() : emoji;
                  message.reply({
                    embeds: [
                      new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("**Editado con éxito:**")
                        .setDescription(`>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nNo olvide reenviar el mensaje de configuración del Ticket!`)
                        .addField("Valor:", `> ${value}`.substring(0, 1024), true)
                        .addField("Descripción:", `> ${description}`.substring(0, 1024), true)
                        .addField("Categoría:", `> <#${category}> (${category})`.substring(0, 1024), true)
                        .addField("Nombre por defecto:", `> \`${defaultname}\` --> \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``.substring(0, 1024), true)
                        .addField("Mensaje de respuesta:", `> ${replyMsg}`.substring(0, 1024), true)
                        .addField("Emoji:", `> ${emojiMsg}`.substring(0, 1024), true)

                    ]
                  });
                }



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
                content: `​✔️ **Seleccionado: \`${collected.size > 0 ? collected.first().values[0] : "NADA"}\`**`
              })
            });
          }
            break;
          case "Eliminar la opción Ticket": {
            let data = theDB.get(message.guild.id, pre + ".data");
            if (!data || data.length < 1) {
              return message.reply("❌​ **No hay opciones de Open-Ticket para eliminar**")
            }
            let embed = new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setDescription("Sólo tienes que elegir las opciones que quieres eliminar!")
              .setTitle("Qué opción desea eliminar??")
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(data.length)
              .setMinValues(1)
              .setPlaceholder('Haga clic en mí para configurar el sistema de Menu-Ticket!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                    emoji: NumberEmojiIds[index + 1]
                  }
                  return Obj;
                }))
            //send the menu msg
            let menumsg;
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async (err) => {
              console.log(err)
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Haga clic en mí para acceder al sistema de Menu-Ticket!')
                .addOptions(
                  data.map((option, index) => {
                    let Obj = {
                      label: option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                      emoji: NumberEmojiIds[index + 1]
                    }
                    return Obj;
                  }))
              menumsg = await message.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([Selection])]
              }).catch((e) => {
                console.warn(e)
              })
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              time: 90000, errors: ["time"]
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                for (const value of menu?.values) {
                  let index = data.findIndex(v => v.value == value);
                  data.splice(index, 1)
                }
                theDB.set(message.guild.id, data, pre + ".data");
                message.reply(`**Eliminado con éxito:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nNo olvide reenviar el mensaje de configuración del Ticket!`)
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
                content: `​✔️ **Seleccionado: \`${collected.first().values[0]}\`**`
              })
            });
          }
            break;
          case "Categoría de Tickets cerrados": {
            let parentId = theDB.get(message.guild.id, `${pre}.closedParent`);
            let parent = parentId ? message.guild.channels.cache.get(parentId) : null;
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("Cuál debería ser la nueva Categoría de Tickets cerrados?")
              .setDescription(`Actualmente es: \`${parentId ? "Aún no está configurado" : parent ? parent.name : `Canal no encontrado: ${parentId}`}\`!\nAl cerrar un Ticket, se moverá a allí hasta que se borre!\n> **Envíe el nuevo __PARENT ID__ ahora!**`)
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
                if (!parent) {
                  return message.reply(`No hay ningún parent al que pueda acceder en este servidor que tenga la ID ${content}`);
                }
                if (parent.type !== "GUILD_CATEGORY") {
                  return message.reply(`<#${parent.id}> no es una CATEGORÍA/PARENT`);
                }
                theDB.set(message.guild.id, parent.id, `${pre}.closedParent`);
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

          case "Gestionar el acceso general": {
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("Qué usuario(s) o rol(es) quiere añadir/eliminar?")
                  .setDescription(`Sólo tienes que enviarles un ping. Si ya están añadidos, se eliminarán!`)
              ]
            });

            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && (collected.first().mentions.roles.size > 0 || collected.first().mentions.users.size > 0)) {
              let { users, roles } = collected.first().mentions;
              let settings = theDB.get(message.guild.id, pre);
              let toadd = [];
              let toremove = [];
              for (const role of roles.map(r => r.id)) {
                if ([...settings.access].includes(role)) {
                  toremove.push(role)
                } else {
                  toadd.push(role)
                }
              }
              for (const user of users.map(r => r.id)) {
                if ([...settings.access].includes(user)) {
                  toremove.push(user)
                } else {
                  toadd.push(user)
                }
              }
              for (const add of toadd) {
                theDB.push(message.guild.id, add, pre + ".access");
              }
              for (const remove of toremove) {
                theDB.remove(message.guild.id, remove, pre + ".access");
              }
              message.reply(`👍 Añadido con éxito \`${toadd.length} Usuarios/Roles\` y eliminado \`${toremove.length} Usuarios/Roles\`\n> Ahora siempre pueden ver, escribir y gestionar las cosas en el menu de TICKETS para ellos!`)
            } else {
              message.reply(":x: **No has hecho un ping a un usuario válido**")
            }
          } break;
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
    function isEmoji(emoji) {
      if (!emoji) return false;
      const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
      let unicode = regexExp.test(String(emoji));
      if (unicode) {
        return true
      } else {
        let dcemoji = client.emojis.cache.has(emoji) || message.guild.emojis.cache.has(emoji);
        if (dcemoji) return true;
        else return false;
      }
    }
  },
};

