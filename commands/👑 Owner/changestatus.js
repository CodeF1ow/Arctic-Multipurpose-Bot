var {
  MessageEmbed,
  MessageButton, 
  MessageActionRow, 
  MessageMenuOption, 
  MessageSelectMenu,
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fs = require('fs');
var {
  databasing,
  isValidURL,
  nFormatter
} = require(`${process.cwd()}/handlers/functions`);
const moment = require("moment")
module.exports = {
  name: "changestatus",
  category: "👑 Dueño",
  type: "bot",
  aliases: ["botstatus", "status"],
  cooldown: 5,
  usage: "changestatus  -->  Siga los pasos",
  description: "Cambia el estatus del BOT",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable2"]))
      ]});
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Status 1. Text",
            description: `Cambiar el primer texto de visualización del estado`,
            emoji: "📝"
          },
          {
            value: "Status 2. Text",
            description: `Cambiar el segundo texto de visualización del estado`,
            emoji: "📝"
          },
          {
            value: "Status Type",
            description: `Cambie el tipo de estado a: Playing/Listening/...`,
            emoji: "🔰"
          },
          {
            value: "Status URL",
            description: `Si Status-State = Streaming, cambiar la URL de Twitch`,
            emoji: "🔗"
          },
          {
            value: "Status State",
            description: `Cambia el Status-State a: Online/Idle/Dnd/Streaming`,
            emoji: "🔖"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener el Ai-Chat-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para cambiar el estado') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
              value: option.value.substring(0, 50),
              description: option.description.substring(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new MessageEmbed()
          .setColor(es.color)
          .setAuthor('Cambiar el estado', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/au-kddi/190/purple-heart_1f49c.png', 'https://arcticbot.xyz/discord')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
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
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            handle_the_picks(menu?.values[0])
          }
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }

      async function handle_the_picks(optionhandletype) {
        switch (optionhandletype) {
          case "Status 1. Text":
            {
              var tempmsg = await message.reply({embeds: [new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable7"]))
                .setColor(es.color)
                .setDescription(`Ejemplo: \`${prefix}help | ${client.user.username.split(" ")[0]} | by: Kiri86\`
      
              *Introduzca el texto ahora!*`).setFooter(client.getFooter(es))
              .addField("PALABRAS CLAVE que se sustituyen:", `\`{guildcount}\` .. Muestra todos los gremios
              \`{prefix}\` .. Muestra el prefix por defecto
              \`{membercount}\` .. Muestra todos los miembros
              \`{created}\` .. Muestra cuándo se creó el bot
              
              \`{createdtime}\` .. Muestra la hora de cuando se creo el bot
              \`{name}\` .. Muestra el nombre del bot
              \`{tag}\` ... Muestra el nombre del bot#1234
              \`{commands}\` .. Muestra todos los comandos
              \`{usedcommands}\` .. Muestra la cantidad de comandos utilizados
              \`{songsplayed}\` .. Muestra la cantidad de canciones reproducidas`)
              ]})
              await tempmsg.channel.awaitMessages({ filter: m => m.author.id == cmduser.id, 
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var msg = collected.first().content;
                  let status = config
                  let newStatusText = msg
                  .replace("{prefix}", config.prefix)
                  .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
                  .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
                  .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
                  .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
                  .replace("{name}", client.user.username)
                  .replace("{tag}", client.user.tag)
                  .replace("{commands}", client.commands.size)
                  .replace("{usedcommands}", nFormatter(Math.ceil(client.stats.get("global", "commands") * [...client.guilds.cache.values()].length / 10), 2))
                  .replace("{songsplayed}", nFormatter(Math.ceil(client.stats.get("global", "songs") * [...client.guilds.cache.values()].length / 10), 2))
                  newStatusText = String(newStatusText).substring(0, 128);
                  status.status.text = String(msg).substring(0, 128);
                  client.user.setActivity(newStatusText, {
                    type: config.status.type,
                    url: config.status.url
                  })
                  fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                    if (e) {
                      console.log(e.stack ? String(e.stack).dim : String(e).dim);
                      return message.channel.send({embeds: [new MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor(es.wrongcolor)
                        .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable8"]))
                        .setDescription(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable9"]))
                      ]})
                    }
                    return message.channel.send({embeds: [new MessageEmbed()
                      .setFooter(client.getFooter(es))
                      .setColor(es.color)
                      .setTitle(`Se ha establecido con éxito el Nuevo Texto de Estado:\n> \`${newStatusText}\``)
                    ]})
                  });
                }).catch(e => {
                  console.log(e)
                  return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable11"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
          }
          break;
          case "Status 2. Text":
            {
              var tempmsg = await message.reply({embeds: [new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable7"]))
                .setColor(es.color)
                .setDescription(`Example: \`${prefix}help | ${client.user.username.split(" ")[0]} | by: Kiri86\`
      
              *Introduzca el texto ahora!*`).setFooter(client.getFooter(es))
              .addField("PALABRAS CLAVE que se sustituyen:", `\`{guildcount}\` .. Muestra todos los servidores
              \`{prefix}\` .. Muestra el prefix por defecto
              \`{membercount}\` .. Muestra todos los ,miembros
              \`{created}\` .. Muestra cuándo se creó el bot             
              \`{createdtime}\` .. Muestra la hora de cuándo se creó el bot
              \`{name}\` .. Muestra el nombre del bot
              \`{tag}\` ... Muestra el nombre del bot#1234
              \`{commands}\` .. Muestra todos los comandos
              \`{usedcommands}\` .. Muestra la cantidad de comandos utilizados
              \`{songsplayed}\` .. Muestra la cantidad de canciones reproducidas`)
              ]})
              await tempmsg.channel.awaitMessages({ filter: m => m.author.id == cmduser.id, 
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var msg = collected.first().content;
                  let status = config
                  let newStatusText = msg
                  .replace("{prefix}", config.prefix)
                  .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
                  .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
                  .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
                  .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
                  .replace("{name}", client.user.username)
                  .replace("{tag}", client.user.tag)
                  .replace("{commands}", client.commands.size)
                  .replace("{usedcommands}", nFormatter(Math.ceil(client.stats.get("global", "commands") * [...client.guilds.cache.values()].length / 10), 2))
                  .replace("{songsplayed}", nFormatter(Math.ceil(client.stats.get("global", "songs") * [...client.guilds.cache.values()].length / 10), 2))
                  newStatusText = String(newStatusText).substring(0, 128);
                  status.status.text2 = String(msg).substring(0, 128);
                  client.user.setActivity(newStatusText, {
                    type: config.status.type,
                    url: config.status.url
                  })
                  fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                    if (e) {
                      console.log(e.stack ? String(e.stack).dim : String(e).dim);
                      return message.channel.send({embeds: [new MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor(es.wrongcolor)
                        .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable8"]))
                        .setDescription(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable9"]))
                      ]})
                    }
                    return message.channel.send({embeds: [new MessageEmbed()
                      .setFooter(client.getFooter(es))
                      .setColor(es.color)
                      .setTitle(`Se ha establecido con éxito el Nuevo Texto de Estado:\n> \`${newStatusText}\``)
                    ]})
                  });
                }).catch(e => {
                  console.log(e)
                  return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable11"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
          }
          break;
          case "Status Type":
            {
                second_layer()
                async function second_layer(){
                  let menuoptions = [
                    {
                      value: "PLAYING",
                      description: `e.j: Playing ${config.status.text}`
                    },
                    {
                      value: "WATCHING",
                      description: `e.j: Watching ${config.status.text}`
                    },
                    {
                      value: "STREAMING",
                      description: `e.j: Streaming ${config.status.text}`
                    },
                    {
                      value: "LISTENING",
                      description: `e.j: Listening to ${config.status.text}`
                    },
                    {
                      value: "COMPETING",
                      description: `e.j: Competing ${config.status.text}`
                    },
                    {
                      value: "Cancel",
                      description: `Cancelar y detener el Ai-Chat-Setup!`,
                      emoji: "862306766338523166"
                    }
                  ]
                  //define the selection
                  let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection') 
                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                    .setPlaceholder('Haga clic en mí para cambiar el estado') 
                    .addOptions(
                    menuoptions.map(option => {
                      let Obj = {
                        label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                        value: option.value.substring(0, 50),
                        description: option.description.substring(0, 50),
                      }
                    if(option.emoji) Obj.emoji = option.emoji;
                    return Obj;
                   }))
                  
                  //define the embed
                  let MenuEmbed = new MessageEmbed()
                    .setColor(es.color)
                    .setAuthor('Cambiar el estado', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/au-kddi/190/purple-heart_1f49c.png', 'https://arcticbot.xyz/discord')
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
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
                      if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                      menu?.deferUpdate();
                      let temptype = menu?.values[0]
                      let status = config
                      status.status.type = temptype;
                      client.user.setActivity(config.status.text, {
                        type: temptype,
                        url: config.status.url
                      })
                      fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                        if (e) {
                          console.log(e.stack ? String(e.stack).dim : String(e).dim);
                          return message.channel.send({embeds: [new MessageEmbed()
                            .setFooter(client.getFooter(es))
                            .setColor(es.wrongcolor)
                            .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable14"]))
                            .setDescription(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable15"]))
                          ]})
                        }
                        return message.channel.send({embeds: [new MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor(es.color)
                          .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable16"]))
                        ]})
                      });
                    }
                    else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
                  });
                  //Once the Collections ended edit the menu message
                  collector.on('end', collected => {
                    menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
                  });
                }
            }
          break;
          case "Status URL":{
            tempmsg = await message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable22"]))
              .setColor(es.color)
              .setDescription(`
              Ejemplo: \`https://twitch.tv/#\` --> debe ser un enlace de twitch
    
            *Introduzca el texto ahora!*`).setFooter(client.getFooter(es))
            ]})
            await tempmsg.channel.awaitMessages({ filter: m => m.author.id == cmduser.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var msg = collected.first().content;
                if (!isValidURL(msg))
                  return message.channel.send({embeds: [new MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.wrongcolor)
                    .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable23"]))
                  ]})
                if (!msg.includes("twitch"))
                  return message.channel.send({embeds: [new MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.wrongcolor)
                    .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable24"]))
                  ]})
                let status = config
                status.status.url = msg;
                client.user.setActivity(config.status.text, {
                  type: config.status.type,
                  url: msg
                })
                fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                  if (e) {
                    console.log(e.stack ? String(e.stack).dim : String(e).dim);
                    return message.channel.send({embeds: [new MessageEmbed()
                      .setFooter(client.getFooter(es))
                      .setColor(es.wrongcolor)
                      .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable25"]))
                      .setDescription(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable26"]))
                    ]})
                  }
                  return message.channel.send({embeds: [new MessageEmbed()
                    .setFooter(client.getFooter(es))
                    .setColor(es.color)
                    .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable27"]))
                  ]})
                });
              }).catch(e => {
                console.log(e)
                return message.reply({embeds: [new MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable28"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Status State":
            {
                second_layer()
                async function second_layer(){
                  let menuoptions = [
                    {
                      value: "online",
                      description: `Mostrándome como en línea`,
                      emoji: "🟢"
                    },
                    {
                      value: "idle",
                      description: `Mostrándome como inactivo`,
                      emoji: "🟡"
                    },
                    {
                      value: "dnd",
                      description: `Mostrándome como dnd`,
                      emoji: "🔴"
                    },
                    {
                      value: "Cancel",
                      description: `Cancelar y detener el Ai-Chat-Setup!`,
                      emoji: "862306766338523166"
                    }
                  ]
                  //define the selection
                  let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection') 
                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                    .setPlaceholder('Haga clic en mí para cambiar el estado') 
                    .addOptions(
                    menuoptions.map(option => {
                      let Obj = {
                        label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                        value: option.value.substring(0, 50),
                        description: option.description.substring(0, 50),
                      }
                    if(option.emoji) Obj.emoji = option.emoji;
                    return Obj;
                   }))
                  
                  //define the embed
                  let MenuEmbed = new MessageEmbed()
                    .setColor(es.color)
                    .setAuthor('Cambiar el estado', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/au-kddi/190/purple-heart_1f49c.png', 'https://arcticbot.xyz/discord')
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
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
                      if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                      menu?.deferUpdate();
                      let temptype = menu?.values[0]
                      client.user.setStatus(temptype) 
                      return message.channel.send({embeds: [new MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable20"]))
                      ]})
                    }
                    else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
                  });
                  //Once the Collections ended edit the menu message
                  collector.on('end', collected => {
                    menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
                  });
                }
            }
          break;
          
        }
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable30"]))
      ]});
    }
  },
};
