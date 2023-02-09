var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing,
  edit_Roster_msg,
  send_roster_msg,
} = require(`${process.cwd()}/handlers/functions`);
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-roster",
  category: "💪 Configurar",
  aliases: ["setuproster", "roster-setup", "rostersetup"],
  cooldown: 5,
  usage: "setup-roster --> seguir los pasos",
  description: "Gestionar 25 sistemas de listas diferentes",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    let pre;
    const filter = (reaction, user) => {
      return user.id == cmduser.id
    }
    try {
      const obj = {};
      for (let i = 1; i <= 100; i++) {
          obj[`roster${i}`] = {
            rosterchannel: "notvalid",
            rosteremoji: "➤",
            rostermessage: "",
            rostertitle: "Roster",
            rosterstyle: "1",
            rosterroles: [],
            inline: false,
          }
      }
      client.roster.ensure(message.guild.id, obj);

      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      var thedb = client.roster;
      async function first_layer(){
        
        let menuoptions = [ ]
        for(let i = 1; i <= 100; i++){
          menuoptions.push({
            value: `${i} Roster System`,
            description: `Gestionar/Editar el ${i}. Sistema de listas de servidores`,
            emoji: NumberEmojiIds[i]
          })
        }
        
        
        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de listas!')
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
          .setPlaceholder('Haga clic en mí para configurar el sistema de listas!')
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
          .setPlaceholder('Haga clic en mí para configurar el sistema de listas!')
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
          .setPlaceholder('Haga clic en mí para configurar el sistema de listas!')
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
        .setAuthor(client.getAuthor('Server Roster Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/page-with-curl_1f4c3.png', 'https://arcticbot.xyz/discord'))
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [row1, row2, row3, row4]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          menu?.deferUpdate();
          let SetupNumber = menu?.values[0].split(" ")[0]
          pre = `roster${SetupNumber}`;
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
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menuselection(menu)
          }
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }
      async function second_layer(SetupNumber, menuoptiondata){
        let menuoptions = [
          {
            value: "Define Channel",
            description: `Definir el canal para este sistema de listas`,
            emoji: "895066899619119105"
          },
          {
            value: "Añadir rol de la lista",
            description: `Añade una función de la lista en la parte inferior para que se muestre`,
            emoji: "✅"
          },
          {
            value: "Eliminar el rol de la lista",
            description: `Se ha eliminado una función de la lista mostrada de la lista`,
            emoji: "❌"
          },
          {
            value: "Mostrar roles de la lista",
            description: `Mostrar todas las funciones de esta lista`,
            emoji: "📃"
          },
          {
            value: "Editar el estilo de la lista",
            description: `Ajustar el estilo de visualización de esta lista`,
            emoji: "🛠"
          },
          {
            value: "Editar Emoji",
            description: `Editar el Emoji/Texto delante de los Nombres`,
            emoji: "✏️"
          },
          {
            value: "Set Title",
            description: `Establecer el título de el embed de esa lista`,
            emoji: "🗞"
          },
          {
            value: `${thedb?.get(message.guild.id, pre+".inline") ? "Disable Multiple Rows": "Enable Roster Rows"}`,
            description: `${thedb?.get(message.guild.id, pre+".inline") ? "Deshabilitado que inline todos los campos": "Habilitado que inline todos los campos"}`,
            emoji: "📰"
          },
          {
            value: `${thedb?.get(message.guild.id, pre+".showallroles") ? "Cortar a los miembros" : "Mostrar todos los miembros"}`,
            description: `${thedb?.get(message.guild.id, pre+".showallroles") ? "Cortar a los miembros y mostrar la cantidad restante": "No cortes, muéstralos todos"}`,
            emoji: "📰"
          },

          {
            value: "Borrar y reiniciar",
            description: `Borrar la configuración actual, lo que le permite restablecer la configuración`,
            emoji: "☠️"
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
          .setPlaceholder(`Haga clic en mí para gestionar el ${SetupNumber} Sistema de listas!\n\n**Has elegido:**\n> ${menuoptiondata.value}`)
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
          .setAuthor(SetupNumber + " Configuración de la lista de servidores", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/page-with-curl_1f4c3.png", "https://arcticbot.xyz/discord")
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
          handle_the_picks(menu?.values[0], SetupNumber)
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
            content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`
          })
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, ticket) {

        switch (optionhandletype) {
          case "Define Channel":{

            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable7"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable8"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var message = collected.first();
                var channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if (channel) {
                  try {
                    thedb?.set(message.guild.id, channel.id, pre+".rosterchannel")
                    send_roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable9"]))
                        .setColor(es.color)
                        .setDescription(`Para añadir funciones al tipo de lista: \`${prefix}setup-roster\``.substring(0, 2048))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable10"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable20"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "no has hecho ping a un canal válido")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable12"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
              })
          }break;
          case "Añadir rol de la lista":{
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable13"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable14"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var message = collected.first();
                var role = message.mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (role) {
                  var rosteroles = thedb?.get(message.guild.id, pre+".rosterroles")
                  if (rosteroles.includes(role.id)) return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable15"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable16"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                  try {
                    thedb?.push(message.guild.id, role.id, pre+".rosterroles")
                    edit_Roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable17"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable18"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable19"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable29"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "no has hecho ping a un rol válido")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable21"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
    
              })    
          }break;
          case "Eliminar el rol de la lista":{

            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable22"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable23"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var message = collected.first();
                var role = message.mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (role) {
                  var rosteroles = thedb?.get(message.guild.id, pre+".rosterroles")
                  if (!rosteroles.includes(role.id)) return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable24"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable25"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                  try {
                    thedb?.remove(message.guild.id, role.id, pre+".rosterroles")
                    edit_Roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable26"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable27"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable28"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable49"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "no has hecho ping a un rol válido")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable30"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
              })
          }break;
          case "Mostrar roles de la lista":{
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable31"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable32"]))
                .setFooter(client.getFooter(es))
              ]
            })
          }break;
          case "Editar el estilo de la lista":{
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable33"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable34"])).setFooter(client.getFooter(es))
              ]
            })
            try{
              for(const emoji of ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"])
               tempmsg.react(emoji)
            }catch(e){
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
            }
            await tempmsg.awaitReactions({
                filter,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var reaction = collected.first()
                reaction.users.remove(message.author.id)
                if (reaction.emoji?.name === "1️⃣") {
                  thedb?.set(message.guild.id, "1", pre+".rosterstyle")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable35"]))
                      .setColor(es.color)
                      .setDescription(`La lista se editará pronto!\n\nSe actualizará en menos de **5 minutos**, *Si no se ha actualizado todavía*`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "2️⃣") {
                  thedb?.set(message.guild.id, "2", pre+".rosterstyle")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable36"]))
                      .setColor(es.color)
                      .setDescription(`La lista se editará pronto!\n\nSe actualizará en menos de **5 minutos**, *si no se ha actualizado todavía*.`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "3️⃣") {
                  thedb?.set(message.guild.id, "3", pre+".rosterstyle")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable37"]))
                      .setColor(es.color)
                      .setDescription(`La lista se editará pronto!\n\nSe actualizará en menos de **5 minutos**, *si no se ha actualizado todavía*.`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "4️⃣") {
                  thedb?.set(message.guild.id, "4", pre+".rosterstyle")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable38"]))
                      .setColor(es.color)
                      .setDescription(`La lista se editará pronto!\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "5️⃣") {
                  thedb?.set(message.guild.id, "5", pre+".rosterstyle")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable39"]))
                      .setColor(es.color)
                      .setDescription(`La lista se editará pronto!\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "6️⃣") {
                  thedb?.set(message.guild.id, "6", pre+".rosterstyle")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable40"]))
                      .setColor(es.color)
                      .setDescription(`La lista se editará pronto!\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "7️⃣") {
                  thedb?.set(message.guild.id, "7", "rosterstyle")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable41"]))
                      .setColor(es.color)
                      .setDescription(`La lista se editará pronto!\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else return message.reply( "Has reaccionado con un emoji equivocado")
    
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable42"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
          }break;
          case "Editar Emoji":{


            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable43"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable44"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var msg = collected.first().content;
    
                if (msg) {
                  if (msg.toLowerCase() == "noemoji") {
                    thedb?.set(message.guild.id, "", pre+".rosteremoji")
                    edit_Roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable45"]))
                        .setColor(es.color)
                        .setDescription(`Para añadir funciones al tipo de lista: \`${prefix}setup-roster\`\n\nEjemplo: \n<@${message.author.id}> | \`${message.author.tag}\`\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2048))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                    return;
                  }
                  try {
                    if (msg.includes(":")) {
                      thedb?.set(message.guild.id, msg, pre+".rosteremoji")
                      edit_Roster_msg(client, message.guild, thedb, pre)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable46"]))
                          .setColor(es.color)
                          .setDescription(`Para añadir funciones al tipo de lista: \`${prefix}setup-roster\`\n\nEjemplo: \n${msg} <@${message.author.id}> | \`${message.author.tag}\`\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    } else {
                      thedb?.set(message.guild.id, msg.substring(0, 5), pre+".rosteremoji")
                      edit_Roster_msg(client, message.guild, thedb, pre)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable47"]))
                          .setColor(es.color)
                          .setDescription(`Para añadir funciones al tipo de lista: \`${prefix}setup-roster\`\n\nEjemplo: \n${msg.substring(0, 5)} <@${message.author.id}> | \`${message.author.tag}\`\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable48"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable55"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "no has añadido un mensaje válido")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable50"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
          }break;
          case "Set Title":{

            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable51"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable52"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var msg = collected.first().content;
    
                if (msg) {
                  try {
                    thedb?.set(message.guild.id, msg.substring(0, 256), pre+".rostertitle")
                    edit_Roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable53"]))
                        .setColor(es.color)
                        .setDescription(`Para añadir funciones al tipo de lista: \`${prefix}setup-roster\`\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2048))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable54"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable61"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "no has añadido un mensaje válido")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable56"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
          }break;
          case `${thedb?.get(message.guild.id, pre+".inline") ? "Deshabilitar varias filas": "Habilitar filas de la lista"}`:{
            thedb?.set(message.guild.id, !thedb?.get(message.guild.id, pre+".inline"), "inline")
            edit_Roster_msg(client, message.guild, thedb, pre)    
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable57"]))
                .setColor(es.color)
                .setDescription(`Para añadir funciones al tipo de lista: \`${prefix}setup-roster\`\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]
            });
          }break;
          case `${thedb?.get(message.guild.id, pre+".showallroles") ? "Cut Members off" : "Show all members"}`:{
            thedb?.set(message.guild.id, !thedb?.get(message.guild.id, pre+".showallroles"), pre+".showallroles")
            edit_Roster_msg(client, message.guild, thedb, pre)    
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable58"]))
                .setColor(es.color)
                .setDescription(`Para añadir funciones al tipo de lista: \`${prefix}setup-roster\`\n\nSe actualizará en menos de **5 Minutos**, *Si aún no se ha actualizado*.`.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]
            });
          }break;
          case `Borrar y reiniciar`:{
            thedb?.set(message.guild.id, {
              rosterchannel: "notvalid",
              rosteremoji: "➤",
              showallroles: false,
              rostermessage: "",
              rostertitle: "Roster",
              rosterstyle: "1",
              rosterroles: [],
              inline: false,
            }, pre)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable59"]))
                .setColor(es.color)
                .setDescription(`Reajuste con: \`${prefix}setup-roster\``.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]
            });
          }break;
        }
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
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