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
  name: "setup-autosupport",
  category: "💪 Configurar",
  aliases: ["setupautosupport", "autosupport-setup", "autosupportsetup", "autosupportsystem"],
  cooldown: 5,
  usage: "setup-autosupport --> seguir los pasos",
  description: "Gestiona hasta 25 mensajes de asistencia automática diferentes en un DISCORD-MENU",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      let theDB = client.autosupport;
      let pre;
      
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      let NumberEmojis = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer() {
        
        let menuoptions = []
        for(let i = 1; i<=100;i++) {
          menuoptions.push({
            value: `${i}. Soporte automático`,
            description: `Gestionar/editar el ${i}. Configuración del soporte automático`,
            emoji: NumberEmojiIds[i]
          })
        }
        
        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el Sistema de Soporte Automático!')
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
          .setPlaceholder('Haga clic en mí para configurar el Sistema de Soporte Automático!')
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
          .setPlaceholder('Haga clic en mí para configurar el Sistema de Soporte Automático!')
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
          .setPlaceholder('Haga clic en mí para configurar el Sistema de Soporte Automático!')
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
          .setAuthor(client.getAuthor('Configuración del soporte automático', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://arcticbot.xyz/discord'))
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
            pre = `autosupport${SetupNumber}`;
            theDB = client.autosupport; //change to the right database
            second_layer()
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
      async function second_layer() {
        //setup-autosupport
        theDB.ensure(message.guild.id, {
          messageId: "",
          channelId: "",
          data: [
            /*
              {
                value: "",
                emoji: "",
                description: "",
                sendEmbed: true,
                replyMsg: "{user} Welcome to the Support!"
              }
            */
          ]
        }, pre);
        let menuoptions = [{
            value: "Enviar el mensaje de configuración",
            description: `(Re) Enviar el mensaje de apoyo de respuesta automática (con MENÚ)`,
            emoji: "👍"
          },
          {
            value: "Añadir la opción AutoSup",
            description: `Añade hasta 25 opciones diferentes de soporte de respuesta automática`,
            emoji: "📤"
          },
          {
            value: "Editar la opción AutoSup",
            description: `Editar una de las opciones de soporte de respuesta automática`,
            emoji: "✒️"
          },
          {
            value: "Eliminar la opción AutoSup",
            description: `Eliminar las opciones de soporte de respuesta automática`,
            emoji: "🗑"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder('Haga clic en mí para configurar el sistema de soporte automático!')
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
          .setAuthor('Configuración de soporte automático', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/question-mark_2753.png', 'https://arcticbot.xyz/discord')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
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
            handle_the_picks(menu?.values[0], menuoptiondata)
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
            content: `​✔️ **Seleccionado: \`${collected && collected.first() && collected.first().values.length > 0 ? collected.first().values[0] : "Nada"}\`**`
          })
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype) {
          case "Enviar el mensaje de configuración": {
            let data = theDB.get(message.guild.id, pre+".data");
            let settings = theDB.get(message.guild.id, pre);
            if (!data || data.length < 1) {
              return message.reply("❌​ **Debe añadir al menos 1 opción de soporte automático**")
            }
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                .setColor(es.color)
                .setTitle("Cuál debe ser el texto a mostrar en el Embed?")
                .setDescription(`Por ejemplo:\n> \`\`\`Para obtener ayuda general para nuestro servidor y nuestros temas, asegúrese de seleccionar la opción correcta!\`\`\``)
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
                  .setTitle("En dónde debo enviar el mensaje de soporte automático?")
                  .setDescription(`Por favor, haga ping al canal ahora!\n> Sólo tienes que escribir: \`#channel\`${settings.channelId && message.guild.channels.cache.get(settings.channelId) ? `| Antes de que fuera: <#${settings.channelId}>` : settings.channelId ? `| Antes de que fuera: ${settings.channelId} (El canal se ha borrado)` : ""}\n\nPuede editar el título, etc., después utilizando el botón \`${prefix}editembed\` Comando`)
                ]
              });

              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && collected2.first().mentions.channels.size > 0) {
                let data = theDB.get(message.guild.id, pre+".data");
                let channel = collected2.first().mentions.channels.first();
                let msgContent = collected.first().content;
                let embed = new MessageEmbed()
                  .setColor(es.color)
                  .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setDescription(msgContent)
                  .setTitle(":question: Soporte automático")
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder('Haga clic en mí para acceder al sistema de asistencia automática!')
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
                }).catch(() => {
                  let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder('Haga clic en mí para acceder al sistema de asistencia automática!')
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
                    }).catch(() => {}).then(msg => {
                      theDB.set(message.guild.id, msg.id, pre+".messageId");
                      theDB.set(message.guild.id, channel.id, pre+".channelId");
                      message.reply(`Configurado con éxito el sistema de soporte automático en <#${channel.id}>`)
                    });
                }).then(msg => {
                  theDB.set(message.guild.id, msg.id, pre+".messageId");
                  theDB.set(message.guild.id, channel.id, pre+".channelId");
                  message.reply(`Configurado con éxito el sistema de soporte automático en <#${channel.id}>`)
                });
              } else {
                return message.reply("❌​ **No has hecho ping a un canal válido!**")
              }
            } else {
              return message.reply("❌​ **No ha introducido un mensaje válido en el tiempo! CANCELADO!**")
            }
          }
          break;
          case "Añadir la opción AutoSup": {
            let data = theDB.get(message.guild.id, pre+".data");
            if (data.length >= 25) {
              return message.reply("❌​ **Ha alcanzado el límite de 25 opciones diferentes ** Elimine primero otra opción!")
            }
            //ask for value and description
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                .setColor(es.color)
                .setTitle("Cuál debe ser el VALOR y la DESCRIPCIÓN de la opción de menú?")
                .setDescription(`**Uso:** \`VALOR++DESCRIPCIÓN\`\n> **Nota:** La longitud máxima del VALOR es: \`25 Letras\`\n> **Nota:** La longitud máxima de la DESCRIPCIÓN es: \`50 Letras\`\n\nPor ejemplo:\n> \`\`\`Dónde obtener ayuda++Para obtener ayuda visite #ticket-support!\`\`\``)
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
              if(index2 >= 0 && index != index2) {
                  return message.reply("❌​ **Las opciones no pueden tener el MISMO VALOR** Ya hay una opción con ese valor!");
              }
              let description = collected.first().content.split("++")[1].trim().substring(0, 50);
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("Si la Respuesta está dentro de un Embed?")
                ],
                components: [
                  new MessageActionRow().addComponents([
                    new MessageButton().setStyle("ÉXITO").setLabel("En un Embed").setEmoji("✅").setCustomId("yes"),
                    new MessageButton().setStyle("DANGER").setLabel("No en un Embed").setEmoji("❌").setCustomId("no"),
                  ])
                ]
              });
              //Create the collector
            const collector = tempmsg.createMessageComponentCollector({
              filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
              time: 90000, errors: ["time"]
            })
            //button Collections
            collector.on('collect', async button => {
              if (button?.user.id === cmduser.id) {
                collector.stop();
                var sendEmbed = true;
                if(button?.customId != "yes"){
                  sendEmbed = false;
                }
                
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("Cuál debería ser el contenido del mensaje de respuesta cuando alguien selecciona una opción de soporte automático??")
                    .setDescription(`For Example:\n> \`\`\`{user} Make sure to check out #ticket-support Channel to open a Ticket!\`\`\``)
                  ]
                });
                let collected3 = await tempmsg.channel.awaitMessages({
                  filter: (m) => m.author.id == cmduser.id,
                  max: 1,
                  time: 90000, errors: ["time"]
                });
                if (collected3 && collected3.first().content) {
                  let replyMsg = collected3.first().content;
                  
                  var rermbed = new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("Cuál debe ser el EMOJI a mostrar?")
                    .setDescription(`Reacciona a __ESE MENSAJE__ con el Emoji que quieras!\n> Haga clic en el Emoji por defecto o añada uno personalizado/estándar`)

                  var emoji;
                  message.reply({embeds: [rermbed]}).then(async msg => {
                    await msg.react(NumberEmojiIds[data.length]).catch(console.warn);
                    msg.awaitReactions({ filter: (reaction, user) => user.id == cmduser.id, 
                      max: 1,
                      time: 180e3
                    }).then(async collected => {
                      await msg.reactions.removeAll().catch(console.warn);
                      if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                        emoji = collected.first().emoji?.id;
                        if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
                        else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
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
                        if(NumberEmojiIds.includes(collected.first().emoji?.id)){
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                        }
                      } catch (e){
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
                      sendEmbed,
                      replyMsg,
                      emoji
                    }, pre+".data");
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("Se han añadido con éxito los nuevos datos a la lista!")
                        .setDescription(`Asegúrese de volver a enviar el mensaje, para que también lo actualice!\n> \`${prefix}setup-autosupport\` --> Enviar mensaje de configuración`)
                      ]
                    });
                  }
                  
                } else {
                  return message.reply("❌​ **No ha introducido un mensaje válido en el tiempo! CANCELADO!**")
                }
              }
            })
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              tempmsg.edit({
                embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)],
                components: [],
                content: `​✔️ **Seleccionado: \`${collected ? collected.customId : "Nada | CANCELADO"}\`**`
              })
            });
            } else {
              return message.reply("❌​ **No ha introducido un mensaje válido en el tiempo! CANCELADO!**")
            }
          }
          break;
          case "Editar la opción AutoSup": {
            let data = theDB.get(message.guild.id, pre+".data");
            if (!data || data.length < 1) {
              return message.reply("❌​ **No hay opciones de Open-Ticket para editar**")
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
              .setPlaceholder('Haga clic en mí para configurar el sistema de soporte automático!')
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
            //send the menu msg
            let menumsg;
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async() => {
              let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Haga clic en mí para configurar el sistema de soporte automático!')
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
                let index = data.findIndex(v => v.value == menu?.values[0]);

                //ask for value and description
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("Cuál debe ser el VALOR y la DESCRIPCIÓN de la opción de menú?")
                    .setDescription(`**Uso:** \`VALOR++DESCRIPCIÓN\`\n> **Nota:** La longitud máxima del VALOR es: \`25 Letras\`\n> **Nota:** La longitud máxima de la DESCRIPCIÓN es: \`50 Letras\`\n\nPor ejemplo:\n> \`\`\`Dónde obtener ayuda++Para obtener ayuda visite #ticket-support!\`\`\``)
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
                  if(index2 >= 0 && index != index2) {
                      return message.reply("❌​ **Las opciones no pueden tener el MISMO VALOR ** Ya hay una opción con ese valor!");
                  }
                  let description = collected.first().content.split("++")[1].trim().substring(0, 50);
                  let tempmsg = await message.reply({
                    embeds: [
                      new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("Si la Respuesta está dentro de un Embed?")
                    ],
                    components: [
                      new MessageActionRow().addComponents([
                        new MessageButton().setStyle("SUCCESS").setLabel("En un Embed").setEmoji("✅").setCustomId("yes"),
                        new MessageButton().setStyle("DANGER").setLabel("No en un Embed").setEmoji("❌").setCustomId("no"),
                      ])
                    ]
                  });
                  //Create the collector
                const collector = tempmsg.createMessageComponentCollector({
                  filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                  time: 90000, errors: ["time"]
                })
                //button Collections
                collector.on('collect', async button => {
                  if (button?.user.id === cmduser.id) {
                    collector.stop();
                    var sendEmbed = true;
                    if(button?.customId != "yes"){
                      sendEmbed = false;
                    }
                    
                    let tempmsg = await message.reply({
                      embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("Cuál debería ser el contenido del mensaje de respuesta cuando alguien selecciona una opción de soporte automático??")
                        .setDescription(`Por ejemplo:\n> \`\`\`{user} Asegúrese de consultar el canal #ticket-support para abrir un Ticket!\`\`\``)
                      ]
                    });
                    let collected3 = await tempmsg.channel.awaitMessages({
                      filter: (m) => m.author.id == cmduser.id,
                      max: 1,
                      time: 90000, errors: ["time"]
                    });
                    if (collected3 && collected3.first().content) {
                      let replyMsg = collected3.first().content;
                      
                      var rermbed = new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("Cuál debe ser el EMOJI a mostrar?")
                        .setDescription(`Reacciona a __ESE MENSAJE__ con el Emoji que quieras!\n> Haga clic en el Emoji por defecto o añada uno personalizado/estándar`)

                      var emoji;
                      message.reply({embeds: [rermbed]}).then(async msg => {
                        await msg.react(NumberEmojiIds[data.length]).catch(console.warn);
                        msg.awaitReactions({ filter: (reaction, user) => user.id == cmduser.id, 
                          max: 1,
                          time: 180e3
                        }).then(async collected => {
                          await msg.reactions.removeAll().catch(console.warn);
                          if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                            emoji = collected.first().emoji?.id;
                            if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
                            else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
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
                            if(NumberEmojiIds.includes(collected.first().emoji?.id)){
                              emoji = null;
                              emojiMsg = NumberEmojis[data.length];
                            }
                          } catch (e){
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
                        data[index] = {
                          value,
                          description,
                          sendEmbed,
                          replyMsg,
                          emoji
                        };
                        theDB.set(message.guild.id, data, pre+".data");
                        message.reply(`**Editado con éxito:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nNo olvide reenviar el mensaje de configuración del soporte automático!`)
                      }
                      
                    } else {
                      return message.reply("❌​ **No has introducido un mensaje válido en el tiempo! CANCELADO!**")
                    }
                  }
                })
                //Once the Collections ended edit the menu message
                collector.on('end', collected => {
                  tempmsg.edit({
                    embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)],
                    components: [],
                    content: `​✔️ **Seleccionado: \`${collected ? collected.customId : "Nothing | CANCELLED"}\`**`
                  })
                });
                } else {
                  return message.reply("❌​ **No has introducido un mensaje válido en el tiempo! CANCELADO!**")
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
                content: `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**`
              })
            });
          }
          break;
          case "Eliminar la opción AutoSup": {
          let data = theDB.get(message.guild.id, pre+".data");
          if (!data || data.length < 1) {
            return message.reply("❌​ **No hay opciones de soporte de respuesta automática para eliminar**")
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
            .setPlaceholder('Haga clic en mí para configurar el sistema de soporte automático!')
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
          //send the menu msg
          let menumsg;
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async() => {
              let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Haga clic en mí para configurar el sistema de soporte automático!')
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
              theDB.set(message.guild.id, data, pre+".data");
              message.reply(`**Eliminado con éxito:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nNo olvide reenviar el mensaje de configuración del soporte automático!`)
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
              content: `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**`
            })
          });
        }
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
      if(!emoji) return false;
      const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
      let unicode = regexExp.test(String(emoji));
      if(unicode) {
        return true 
      } else {
        let dcemoji = client.emojis.cache.has(emoji) || message.guild.emojis.cache.has(emoji);
        if(dcemoji) return true;
        else return false;
      }
    }
  },
};

