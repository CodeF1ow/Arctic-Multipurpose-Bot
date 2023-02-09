var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing,
  isValidURL
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-leave",
  category: "💪 Configurar",
  aliases: ["setupleave"],
  cooldown: 5,
  usage: "setup-leave --> and ​Siga los pasos",
  description: "Gestionar el sistema de mensajes de salida",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      var timeouterror;
      var tempmsg;
      var url = "";
      var filter = (reaction, user) => {
        return user.id === cmduser.id;
      };
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Mensajes de baja del canal",
            description: `Gestionar los mensajes de salida en 1 CANAL`,
            emoji: "895066899619119105" //
          },
          {
            value: "Mensajes de salida directa",
            description: `Gestionar los mensajes de salida en el DMS`,
            emoji: "😬"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener la instalación de las salidas!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de permisos') 
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
          .setAuthor('Configuracion de Salidas', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
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
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(" ")[0]
            handle_the_picks(menu?.values[0], SetupNumber, menuoptiondata)
          }
          else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, menuoptiondata) {
        switch (optionhandletype) {          
          case "Mensajes de baja del canal":{
            
            second_layer()
            async function second_layer(){
              let menuoptions = [
                {
                  value: `${client.settings.get(message.guild.id, "leave.channel") == "nochannel" ? "Establecer canal": "Sobreescritura del canal"}`,
                  description: `${client.settings.get(message.guild.id, "leave.channel") == "nochannel" ? "Establezca un canal en el que deben aparecer los mensajes de salida": "Sobrescribir el canal actual con uno nuevo"}`,
                  emoji: "895066899619119105" //
                },
                {
                  value: "Salida Deshabilitada",
                  description: `Deshabilitar los mensajes de salida`,
                  emoji: "❌"
                },
                {
                  value: "Gestionar la imagen",
                  description: `Gestionar la imagen de salida del mensaje`,
                  emoji: "🖼️"
                },
                {
                  value: "Editar el mensaje",
                  description: `Editar el mensaje de salida ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: `${client.settings.get(message.guild.id, "leave.invite") ? "Desactivar la información de las invitaciones": "Activar la información de las invitaciones"}`,
                  description: `${client.settings.get(message.guild.id, "leave.invite") ? "Ya no se muestra la información sobre quién le ha invitado": "Mostrar información sobre quién le ha invitado"}`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancelar y detener la instalación de la salidas!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haga clic en mí para configurar el sistema de salidas') 
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
                .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
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
                  let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                  if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  menu?.deferUpdate();
                  let SetupNumber = menu?.values[0].split(" ")[0]
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata){
              switch (optionhandletype) {
                case `${client.settings.get(message.guild.id, "leave.channel") == "nochannel" ? "Establecer canal": "Sobreescritura del canal"}`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable7"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable8"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                      var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      if (channel) {
                        client.settings.set(message.guild.id, channel.id, "leave.channel")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable9"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "Aún no se ha definido"}!\nEditar el mensaje with: \`${prefix}setup-leave  --> Escoge 1️⃣ --> Escoge 4️⃣\``.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } else {
                        return message.reply( "no has hecho ping a un canal válido")
                      }
                    })
                  .catch(e => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable12"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  })
                }break;
                case `Salidas Deshabilitadas`:{
                  client.settings.set(reaction.message.guild.id, "nochannel", "leave.channel")
                  return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable13"]))
                    .setColor(es.color)
                    .setDescription(`Si alguien se une a este servidor, no se enviará ningún mensaje a un canal!\nEstablecer un canal con: \`${prefix}setup-leave\` --> Escoge 1️⃣ --> Escoge 1️⃣`.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
                case `Gestionar la imagen`:{
                  third_layer()
                  async function third_layer(){
                    let menuoptions = [
                      {
                        value: "Deshabilitar la imagen",
                        description: `No voy a adjuntar más imágenes`,
                        emoji: "❌"
                      },
                      {
                        value: "Habilitar la imagen",
                        description: `Voy a generar una imagen con los datos de usuario`,
                        emoji: "865962151649869834"
                      },
                      {
                        value: "Establecer el fondo de la imagen",
                        description: `Definir el fondo de la AUTO IMAGEN`,
                        emoji: "👍"
                      },
                      {
                        value: "Del fondo de la imagen",
                        description: `Restablecer el fondo de la imagen automática a la predeterminada`,
                        emoji: "🗑"
                      },
                      {
                        value: "Imagen personalizada",
                        description: `Utilizar una imagen personalizada en lugar de la imagen de fondo`,
                        emoji: "🖼"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.frame") ? "Deshabilitado" : "Habilitado"} Frame`,
                        description: `${client.settings.get(message.guild.id, "leave.frame") ? "No mostraré más el Marco" : "Permítanme mostrar un marco de color para resaltar"}`,
                        emoji: "✏️" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.discriminator") ? "Deshabilitado" : "Habilitado"} Etiqueta de usuario`,
                        description: `${client.settings.get(message.guild.id, "leave.discriminator") ? "No mostraré más la etiqueta de usuario" : "Permítame mostrar una etiqueta de usuario de color (#1234)"}`,
                        emoji: "🔢" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.membercount") ? "Deshabilitado" : "Habilitado"} Recuento de miembros`,
                        description: `${client.settings.get(message.guild.id, "leave.membercount") ? "I won't show the Member Count anymore" : "Permítanme mostrar un MemberCount coloreado del Servidor"}`,
                        emoji: "📈" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.servername") ? "Deshabilitado" : "Habilitado"} Nombre del servidor`,
                        description: `${client.settings.get(message.guild.id, "leave.servername") ? "Ya no mostraré el nombre del servidor" : "Permítame mostrar un nombre de servidor coloreado"}`,
                        emoji: "🗒" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.pb") ? "Deshabilitado" : "Habilitado"} Avatar de Usuario`,
                        description: `${client.settings.get(message.guild.id, "leave.pb") ? "No mostraré más el avatar de usuario" : "Permítame mostrar el avatar de usuario"}`,
                        emoji: "💯" 
                      },
                      {
                        value: "Color del marco",
                        description: `Cambiar el color del marco`,
                        emoji: "⬜"
                      },
                      {
                        value: "Cancel",
                        description: `Cancelar y detener la instalación de la salidas!`,
                        emoji: "862306766338523166"
                      }
                    ]
                    //define the selection
                    let Selection = new MessageSelectMenu()
                      .setCustomId('MenuSelection') 
                      .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                      .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                      .setPlaceholder('Haga clic en mí para configurar el sistema dsalidas') 
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
                      .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
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
                        let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                        if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                        menu?.deferUpdate();
                        let SetupNumber = menu?.values[0].split(" ")[0]
                        handle_the_picks_3(menu?.values[0], SetupNumber, menuoptiondata)
                      }
                      else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
                    });
                    //Once the Collections ended edit the menu message
                    collector.on('end', collected => {
                      menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
                    });
                  }
                  async function handle_the_picks_3(optionhandletype, SetupNumber, menuoptiondata){
                    switch (optionhandletype) {
                      case `Deshabilitar la imagen`:{
                        client.settings.set(message.guild.id, false, "leave.image")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable18"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, un mensaje **sin__una__imagen** se enviará a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "AÚN NO SE HA DEFINIDO NINGÚN CANAL"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Habilitar la imagen`:{
                        client.settings.set(message.guild.id, true, "leave.image")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable21"]))
                          .setColor(es.color)
                          .setDescription(`Utilizaré ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "una imagen generada automáticamente con datos del usuario": "Su definición, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "AÚN NO SE HA DEFINIDO NINGÚN CANAL"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Establecer el fondo de la imagen`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable24"]))
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable25"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, "no", "leave.custom")
                                client.settings.set(message.guild.id, url, "leave.background")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable26"]))
                                  .setColor(es.color)
                                  .setDescription(`Utilizaré ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definición, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "AÚN NO SE HA DEFINIDO NINGÚN CANAL"}`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable27"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, "no", "leave.custom")
                                client.settings.set(message.guild.id, url, "leave.background")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable28"]))
                                  .setColor(es.color)
                                  .setDescription(`Utilizaré ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definido, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable29"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable30"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                            }
                          })
                          .catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable31"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `Del fondo de la imagen`:{
                        client.settings.set(message.guild.id, true, "leave.image")
                        client.settings.get(message.guild.id, "transparent", "leave.background")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable32"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Imagen personalizada`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable35"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, url, "leave.custom")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable36"]))
                                  .setColor(es.color)
                                  .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definido, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable37"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, url, "leave.custom")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable38"]))
                                  .setColor(es.color)
                                  .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "leave.custom") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definido, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable39"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable40"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                            }
                          })
                          .catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable41"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.frame") ? "Deshabilitado" : "Habilitado"} Frame`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.frame"), "leave.frame")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable42"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.discriminator") ? "Deshabilitado" : "Habilitado"} User-Tag`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.discriminator"), "leave.discriminator")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable45"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.membercount") ? "Deshabilitado" : "Habilitado"} Member Count`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.membercount"), "leave.membercount")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable48"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.servername") ? "Deshabilitado" : "Habilitado"} Server Name`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.servername"), "leave.servername")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable51"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.pb") ? "Deshabilitado" : "Habilitado"} User-Avatar`:{
                        client.settings.set(message.guild.id, "no", "leave.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.pb"), "leave.pb")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable54"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Color del marco`:{

                        let row1 = new MessageActionRow().addComponents([
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FFFFF9").setEmoji("⬜").setLabel("#FFFFF9"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FAFA25").setEmoji("🟨").setLabel("#FAFA25"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FA9E25").setEmoji("🟧").setLabel("#FA9E25"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FA2525").setEmoji("🟥").setLabel("#FA2525"),
                        ])
                        let row2 = new MessageActionRow().addComponents([
                          new MessageButton().setStyle("SECONDARY").setCustomId("#25FA6C").setEmoji("🟩").setLabel("#25FA6C"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#3A98F0").setEmoji("🟦").setLabel("#3A98F0"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#8525FA").setEmoji("🟪").setLabel("#8525FA"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#030303").setEmoji("⬛").setLabel("#030303"),
                        ])
                        
                        tempmsg = await message.reply({
                          components: [row1, row2],
                          embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable57"]))
                          .setColor(es.color)
                          .setDescription(`*Reacciona con el color que quieres que tenga el marco/texto ;)*`)
                          .setFooter(client.getFooter(es))
                        ]})
                        //Create the collector
                        const collector = tempmsg.createMessageComponentCollector({ 
                          filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                          time: 90000
                        })
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                          message.reply({embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `​✔️ **Seleccionado el \`${collected.first().customId}\` Color**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
                        });
                        //Menu Collections
                        collector.on('collect', async button => {
                          if (button?.user.id === cmduser.id) {
                            var color = button?.customId;
                            client.settings.set(message.guild.id, color, "leave.framecolor")
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable59"]))
                              .setColor(color)
                              .setDescription(`Si alguien abandona este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "NO HAY CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                              .setFooter(client.getFooter(es))
                            ]});
                          } else {
                            button?.reply(":x: **Sólo el ejecutor de comandos puede reaccionar!**")
                          }
                        })
                      } break;
                    }
                  }

                }break;
                case `Editar el mensaje`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable64"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable65"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                        client.settings.set(message.guild.id, message.content, "leave.msg")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable66"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, este mensaje se enviará a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "TODAVÍA NO HAY CANAL"}!\n\n${message.content.replace("{user}", message.author)}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                    })
                  .catch(e => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable69"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  })
                }break;
                case `${client.settings.get(message.guild.id, "leave.invite") ? "Disable InviteInformation": "Enable Invite Information"}`:{
                  client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.invite"), "leave.invite")
                  return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable70"]))
                    .setColor(es.color)
                    .setDescription(`Si alguien se une a este servidor, se enviará un mensaje con información de invitación a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "leave.channel")) : "Aún no se ha definido"}!\nEditar el mensaje con: \`${prefix}setup-leave  --> Escoge 1️⃣ --> Escoge 4️⃣\``.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
              }
            }
          }break;       
          case "Mensajes de baja directa":{
          
            second_layer()
            async function second_layer(){
              let menuoptions = [
                {
                  value: `${!client.settings.get(message.guild.id, "leave.dm") ? "Enable Dm Messages": "Disable Dm Messages"}`,
                  description: `${!client.settings.get(message.guild.id, "leave.dm") ? "Enviar mensajes DM si el usuario se va": "No envíes ningún MD cuando se vaya"}`,
                  emoji: "895066899619119105" //
                },
                {
                  value: "Gestionar la imagen",
                  description: `Gestionar la imagen de salida del mensaje`,
                  emoji: "🖼️"
                },
                {
                  value: "Editar el mensaje",
                  description: `Editar el mensaje de salida ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: `${client.settings.get(message.guild.id, "leave.invitedm") ? "Disable InviteInformation": "Enable Invite Information"}`,
                  description: `${client.settings.get(message.guild.id, "leave.invitedm") ? "Ya no muestra la información que le invitó": "Mostrar información sobre quién le ha invitado"}`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancelar y detener la instalación de las salidas!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haga clic en mí para configurar el sistema de salidas') 
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
                .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
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
                  let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                  if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  menu?.deferUpdate();
                  let SetupNumber = menu?.values[0].split(" ")[0]
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata){
              switch (optionhandletype) {
                case `${!client.settings.get(message.guild.id, "leave.dm") ? "Habilitar mensajes DM": "Desactivar mensajes DM"}`:{
                  if(client.settings.get(message.guild.id, "leave.dm")){
                    client.settings.set(message.guild.id, false, "leave.dm")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable79"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } else {
                    client.settings.set(message.guild.id, true, "leave.dm")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable76"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                }break;
                case `Gestionar la imagen`:{
                  third_layer()
                  async function third_layer(){
                    let menuoptions = [
                      {
                        value: "Deshabilitar la imagen",
                        description: `No voy a adjuntar más imágenes`,
                        emoji: "❌"
                      },
                      {
                        value: "Habilitar la imagen",
                        description: `Voy a generar una imagen con los datos de usuario`,
                        emoji: "865962151649869834"
                      },
                      {
                        value: "Establecer el fondo de la imagen",
                        description: `Definir el fondo de la AUTO IMAGEN`,
                        emoji: "👍"
                      },
                      {
                        value: "Del fondo de la imagen",
                        description: `Restablecer el fondo de la imagen automática a la predeterminada`,
                        emoji: "🗑"
                      },
                      {
                        value: "Imagen personalizada",
                        description: `Utilice una imagen personalizada en lugar de la imagen de fondo`,
                        emoji: "🖼"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.framedm") ? "Deshabilitado" : "Habilitado"} Marco`,
                        description: `${client.settings.get(message.guild.id, "leave.framedm") ? "No mostraré más el Marco" : "Permítanme mostrar un marco de color para resaltar"}`,
                        emoji: "✏️" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.discriminatordm") ? "Deshabilitado" : "Habilitado"} Etiqueta de usuario`,
                        description: `${client.settings.get(message.guild.id, "leave.discriminatordm") ? "No mostraré más la etiqueta de usuario" : "Permítame mostrar una etiqueta de usuario de color (#1234)"}`,
                        emoji: "🔢" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.membercountdm") ? "Deshabilitado" : "Habilitado"} Recuento de miembros`,
                        description: `${client.settings.get(message.guild.id, "leave.membercountdm") ? "No mostraré más el recuento de miembros" : "Permítanme mostrar un MemberCount coloreado del Servidor"}`,
                        emoji: "📈" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.servernamedm") ? "Deshabilitado" : "Habilitado"} Nombre del servidor`,
                        description: `${client.settings.get(message.guild.id, "leave.servernamedm") ? "Ya no mostraré el nombre del servidor" : "Permítame mostrar un nombre de servidor coloreado"}`,
                        emoji: "🗒" 
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "leave.pbdm") ? "Deshabilitado" : "Habilitado"} Avatar del usuario`,
                        description: `${client.settings.get(message.guild.id, "leave.pbdm") ? "No mostraré más el avatar de usuario" : "Permítame mostrar el avatar de usuario"}`,
                        emoji: "💯" 
                      },
                      {
                        value: "Color del marco",
                        description: `Cambiar el color del marco`,
                        emoji: "⬜"
                      },
                      {
                        value: "Cancel",
                        description: `Cancelar y detener la instalación de las salidas!`,
                        emoji: "862306766338523166"
                      }
                    ]
                    //define the selection
                    let Selection = new MessageSelectMenu()
                      .setCustomId('MenuSelection') 
                      .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                      .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                      .setPlaceholder('Haga clic en mí para configurar el sistema dsalidas') 
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
                      .setAuthor('Leave Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
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
                        let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
                        if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                        menu?.deferUpdate();
                        let SetupNumber = menu?.values[0].split(" ")[0]
                        handle_the_picks_3(menu?.values[0], SetupNumber, menuoptiondata)
                      }
                      else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
                    });
                    //Once the Collections ended edit the menu message
                    collector.on('end', collected => {
                      menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
                    });
                  }
                  async function handle_the_picks_3(optionhandletype, SetupNumber, menuoptiondata){
                    switch (optionhandletype) {
                      case `Deshabilitar la imagen`:{
                        client.settings.set(message.guild.id, false, "leave.imagedm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable18"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **sin imagen** a DMs`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Habilitar la imagen`:{
                        client.settings.set(message.guild.id, true, "leave.imagedm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable21"]))
                          .setColor(es.color)
                          .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definido, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a DMS`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Establecer el fondo de la imagen`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable24"]))
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable25"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, "no", "leave.customdm")
                                client.settings.set(message.guild.id, url, "leave.backgrounddm")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable26"]))
                                  .setColor(es.color)
                                  .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definido, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a DMS`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable27"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, "no", "leave.customdm")
                                client.settings.set(message.guild.id, url, "leave.backgrounddm")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable28"]))
                                  .setColor(es.color)
                                  .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definido, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a DMS`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable29"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable30"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                            }
                          })
                          .catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable31"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `Del fondo de la imagen`:{
                        client.settings.set(message.guild.id, true, "leave.imagedm")
                        client.settings.get(message.guild.id, "transparent", "leave.backgrounddm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable32"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen** a DMS`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Imagen personalizada`:{
                        tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable35"]))
                          .setColor(es.color)
                          .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          })
                          .then(collected => {
    
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, url, "leave.customdm")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable36"]))
                                  .setColor(es.color)
                                  .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definido, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a DMS`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable37"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, url, "leave.customdm")
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable38"]))
                                  .setColor(es.color)
                                  .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "leave.customdm") === "no" ? "una Imagen Autogenerada con Datos de Usuario": "Su definido, Imagen personalizada" }\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a DMS`.substring(0, 2048))
                                  .setFooter(client.getFooter(es))
                                ]});
                              } else {
                                return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable39"]))
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable40"]))
                                  .setColor(es.color)
                                  .setFooter(client.getFooter(es))
                                ]});
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                            }
                          })
                          .catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable41"]))
                              .setColor(es.wrongcolor)
                              .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                              .setFooter(client.getFooter(es))
                            ]});
                          })
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.framedm") ? "Deshabilitado" : "Habilitado"} Marco`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.framedm"), "leave.framedm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable42"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a DMS`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.discriminatordm") ? "Deshabilitado" : "Habilitado"} Etiqueta de usuario`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.discriminatordm"), "leave.discriminatordm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable45"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a DMS`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.membercountdm") ? "Deshabilitado" : "Habilitado"} Recuento de miembros`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.membercountdm"), "leave.membercountdm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable48"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a DMS`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.servernamedm") ? "Deshabilitado" : "Habilitado"} Nombre del servidor`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.servernamedm"), "leave.servernamedm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable51"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a DMS`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `${client.settings.get(message.guild.id, "leave.pbdm") ? "Deshabilitado" : "Habilitado"} Usuario-Avatar`:{
                        client.settings.set(message.guild.id, "no", "leave.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.pbdm"), "leave.pbdm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable54"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a DMS`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                      } break;
                      case `Color del marco`:{

                        let row1 = new MessageActionRow().addComponents([
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FFFFF9").setEmoji("⬜").setLabel("#FFFFF9"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FAFA25").setEmoji("🟨").setLabel("#FAFA25"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FA9E25").setEmoji("🟧").setLabel("#FA9E25"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#FA2525").setEmoji("🟥").setLabel("#FA2525"),
                        ])
                        let row2 = new MessageActionRow().addComponents([
                          new MessageButton().setStyle("SECONDARY").setCustomId("#25FA6C").setEmoji("🟩").setLabel("#25FA6C"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#3A98F0").setEmoji("🟦").setLabel("#3A98F0"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#8525FA").setEmoji("🟪").setLabel("#8525FA"),
                          new MessageButton().setStyle("SECONDARY").setCustomId("#030303").setEmoji("⬛").setLabel("#030303"),
                        ])
                        
                        tempmsg = await message.reply({
                          components: [row1, row2],
                          embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable57"]))
                          .setColor(es.color)
                          .setDescription(`*Reacciona con el color que quieres que tenga el marco/texto ;)*`)
                          .setFooter(client.getFooter(es))
                        ]})
                        //Create the collector
                        const collector = tempmsg.createMessageComponentCollector({ 
                          filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                          time: 90000
                        })
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                          message.reply({embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `​✔️ **Seleccionado el \`${collected.first().customId}\` Color**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
                        });
                        //Menu Collections
                        collector.on('collect', async button => {
                          if (button?.user.id === cmduser.id) {
                            var color = button?.customId;
                            client.settings.set(message.guild.id, color, "leave.framecolordm")
                            return message.reply({embeds: [new Discord.MessageEmbed()
                              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable59"]))
                              .setColor(color)
                              .setDescription(`Si alguien abandona este servidor, se enviará un mensaje **con una imagen automatizada** a DMS`.substring(0, 2048))
                              .setFooter(client.getFooter(es))
                            ]});
                          } else {
                            button?.reply(":x: **Sólo el ejecutor de la orden puede reaccionar!**")
                          }
                        })
                      } break;
                    }
                  }

                }break;
                case `Editar el mensaje`:{
                  tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable64"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable65"]))
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                        client.settings.set(message.guild.id, message.content, "leave.msgdm")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable66"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, este mensaje se enviará a DMS!\n\n${message.content.replace("{user}", message.author)}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]});
                    })
                  .catch(e => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable69"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]});
                  })
                }break;
                case `${client.settings.get(message.guild.id, "leave.invitedm") ? "Desactivar la información de las invitaciones": "Activar la información de las invitaciones"}`:{
                  client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "leave.invitedm"), "leave.invitedm")
                  return reaction.message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-leave"]["variable70"]))
                    .setColor(es.color)
                    .setDescription(`Si alguien se une a este servidor, se enviará un mensaje con información de invitación a DMS!\nEditar el mensaje with: \`${prefix}setup-leave  --> Escoge 1️⃣ --> Escoge 4️⃣\``.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }break;
              }
            }
            }break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
      ]});
    }
  },
};

