var {
  MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing,
  isValidURL
} = require(`${process.cwd()}/handlers/functions`);
//Import npm modules
const Canvas = require("canvas");
const canvacord = require("canvacord");
const Fonts = "Genta, UbuntuMono, `DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
const wideFonts = "`DM Sans`, STIXGeneral, AppleSymbol, Arial, ArialUnicode";
module.exports = {
  name: "setup-welcome",
  category: "💪 Setup",
  aliases: ["setupwelcome"],
  cooldown: 5,
  usage: "setup-welcome --> Siga los pasos",
  description: "Gestionar el Sistema de Bienvenida (Mensaje, Rastreador de Invitaciones, Diseño de Imágenes, Sistema de Captcha, Roles, etc.)",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed"); let ls = client.settings.get(message.guild.id, "language")
    try {
      var tempmsg;
      var url = "";
      first_layer()
      async function first_layer() {
        let menuoptions = [
          {
            value: "Mensajes de bienvenida con imagen",
            description: `Gestionar los mensajes de bienvenida con imagen`,
            emoji: "895066899619119105" //
          },
          {
            value: "Mensaje de bienvenida de texto",
            description: `Establecer un msg normal para un 2º Canal (sin Embed)`,
            emoji: "895066899619119105" //
          },
          {
            value: "Mensajes directos de bienvenida",
            description: `Gestionar los mensajes de bienvenida en el DMS`,
            emoji: "😬"
          },
          {
            value: "Roles de bienvenida",
            description: `Gestionar los Roles de Bienvenida. Añadir/eliminar/enumerarlas!`,
            emoji: "895066900105674822"
          },
          {
            value: "Sistema Captcha (Seguridad)",
            description: `${client.settings.get(message.guild.id, "welcome.captcha") ? "❌ Deshabilitar el sistema de seguridad Captcha" : "✅ Habilitar el sistema de seguridad Captcha"}`,
            emoji: "866089515993792522"
          },
          {
            value: `Prueba de bienvenida`,
            description: `Probar el mensaje de bienvenida actual`,
            emoji: `💪`
          },
          {
            value: "Cancel",
            description: `Cancelar y detener el Welcome-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el Sistema de Bienvenida')
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
        let MenuEmbed = new MessageEmbed()
          .setColor(es.color)
          .setAuthor({ name: "Welcome Setup", url: "https://arcticbot.xyz/discord", iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png" })
          //.setAuthor('Welcome Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
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
            handle_the_picks(menu?.values[0], SetupNumber, menuoptiondata)
          }
          else menu?.reply({ content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, menuoptiondata) {
        switch (optionhandletype) {
          case "Mensajes de bienvenida con imagen": {

            second_layer()
            async function second_layer() {
              let menuoptions = [
                {
                  value: `${client.settings.get(message.guild.id, "welcome.channel") == "nochannel" ? "Establecer canal" : "Sobreescritura del canal"}`,
                  description: `${client.settings.get(message.guild.id, "welcome.channel") == "nochannel" ? "Establezca un canal en el que deben aparecer los mensajes de bienvenida" : "Sobrescribir el canal actual con uno nuevo"}`,
                  emoji: "895066899619119105" //
                },
                {
                  value: "Bienvenida deshabilitada",
                  description: `Deshabilitar los mensajes de bienvenida`,
                  emoji: "❌"
                },
                {
                  value: "Gestionar la imagen",
                  description: `Gestionar la imagen de bienvenida del mensaje`,
                  emoji: "🖼️"
                },
                {
                  value: "Editar el mensaje",
                  description: `Editar el mensaje de bienvenida ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: `${client.settings.get(message.guild.id, "welcome.invite") ? "Desactivar InviteInformación" : "Activar la información de las invitaciones"}`,
                  description: `${client.settings.get(message.guild.id, "welcome.invite") ? "Ya no se muestra la información que invitó him/her" : "Mostrar información sobre los invitados him/her"}`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancelar y detener el Welcome-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haga clic en mí para configurar el Sistema de Bienvenida')
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor('Configuración de bienvenida', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
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
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({ content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true });
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata) {
              switch (optionhandletype) {
                case `${client.settings.get(message.guild.id, "welcome.channel") == "nochannel" ? "Establecer canal" : "Sobreescritura del canal"}`: {
                  tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable7"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable8"]))
                      .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                    .then(collected => {
                      var message = collected.first();
                      var channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      if (channel) {
                        client.settings.set(message.guild.id, channel.id, "welcome.channel")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable9"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "Aún no se ha definido"}!\nEditar el mensaje con: \`${prefix}setup-welcome\``.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } else {
                        return message.reply("no has hecho ping a un canal válido")
                      }
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable12"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                } break;
                case `Disable Welcome`: {
                  client.settings.set(message.guild.id, "nochannel", "welcome.channel")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable13"]))
                      .setColor(es.color)
                      .setDescription(`Si alguien se une a este servidor, no se enviará ningún mensaje a un canal!\nEstablecer un canal con: \`${prefix}setup-welcome\` --> Escoge 1️⃣ --> Escoge 1️⃣`.substring(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } break;
                case `Gestionar la imagen`: {
                  third_layer()
                  async function third_layer() {
                    let menuoptions = [
                      {
                        value: "Deshabilitar la imagen",
                        description: `No voy a adjuntar más imágenes`,
                        emoji: "❌"
                      },
                      {
                        value: "Habilitar Aunto imagen",
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
                        value: `${client.settings.get(message.guild.id, "welcome.frame") ? "Deshabilitar" : "Habilitar"} Frame`,
                        description: `${client.settings.get(message.guild.id, "welcome.frame") ? "No mostraré más el Marco" : "Permítame mostrar un marco de color para resaltar"}`,
                        emoji: "✏️"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.discriminator") ? "Deshabilitar" : "Habilitar"} User-Tag`,
                        description: `${client.settings.get(message.guild.id, "welcome.discriminator") ? "No mostraré más la etiqueta de usuario" : "Permítame mostrar una etiqueta de usuario de color (#1234)"}`,
                        emoji: "🔢"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.membercount") ? "Deshabilitar" : "Habilitar"} Member Count`,
                        description: `${client.settings.get(message.guild.id, "welcome.membercount") ? "No mostraré más el recuento de miembros" : "Permítanme mostrar un MemberCount coloreado del Servidor"}`,
                        emoji: "📈"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.servername") ? "Deshabilitar" : "Habilitar"} Server Name`,
                        description: `${client.settings.get(message.guild.id, "welcome.servername") ? "Ya no mostraré el nombre del servidor" : "Permítame mostrar un nombre de servidor coloreado"}`,
                        emoji: "🗒"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.pb") ? "Deshabilitar" : "Habilitar"} User-Avatar`,
                        description: `${client.settings.get(message.guild.id, "welcome.pb") ? "No mostraré más el avatar de usuario" : "Permítame mostrar el avatar de usuario"}`,
                        emoji: "💯"
                      },
                      {
                        value: "Color del marco",
                        description: `Cambiar el color del marco`,
                        emoji: "⬜"
                      },
                      {
                        value: "Cancel",
                        description: `Cancelar y detener el Welcome-Setup!`,
                        emoji: "862306766338523166"
                      }
                    ]
                    //define the selection
                    let Selection = new MessageSelectMenu()
                      .setCustomId('MenuSelection')
                      .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                      .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                      .setPlaceholder('Haga clic en mí para configurar el Sistema de Bienvenida')
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
                    let MenuEmbed = new MessageEmbed()
                      .setColor(es.color)
                      .setAuthor('Configuración de bienvenida', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
                    //send the menu msg
                    let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
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
                        handle_the_picks_3(menu?.values[0], SetupNumber, menuoptiondata)
                      }
                      else menu?.reply({ content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true });
                    });
                    //Once the Collections ended edit the menu message
                    collector.on('end', collected => {
                      menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
                    });
                  }
                  async function handle_the_picks_3(optionhandletype, SetupNumber, menuoptiondata) {
                    switch (optionhandletype) {
                      case `Deshabilitar la imagen`: {
                        client.settings.set(message.guild.id, false, "welcome.image")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable18"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, un mensaje **with__out__ una imagen** se enviará a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "AÚN NO SE HA DEFINIDO NINGÚN CANAL"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `Habilitar Aunto imagen`: {
                        client.settings.set(message.guild.id, true, "welcome.image")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable21"]))
                            .setColor(es.color)
                            .setDescription(`Utilizaré ${client.settings.get(message.guild.id, "welcome.custom") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definición, Imagen personalizada"}\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "AÚN NO SE HA DEFINIDO NINGÚN CANAL"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `Establecer el fondo de la imagen`: {
                        tempmsg = await message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable24"]))
                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable25"]))
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({
                          filter: m => m.author.id === cmduser.id,
                          max: 1,
                          time: 60000,
                          errors: ["time"]
                        })
                          .then(collected => {
                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, "no", "welcome.custom")
                                client.settings.set(message.guild.id, url, "welcome.background")
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable26"]))
                                    .setColor(es.color)
                                    .setDescription(`Voy a utilizar ${client.settings.get(message.guild.id, "welcome.custom") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definición, Imagen personalizada"}\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "AÚN NO SE HA DEFINIDO NINGÚN CANAL"}`.substring(0, 2048))
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              } else {
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable27"]))
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, "no", "welcome.custom")
                                client.settings.set(message.guild.id, url, "welcome.background")
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable28"]))
                                    .setColor(es.color)
                                    .setDescription(`Voy a utilizar ${client.settings.get(message.guild.id, "welcome.custom") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definición, Imagen personalizada"}\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              } else {
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable29"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable30"]))
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
                            }
                          })
                          .catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable31"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          })
                      } break;
                      case `Del fondo de la imagen`: {
                        client.settings.set(message.guild.id, true, "welcome.image")
                        client.settings.set(message.guild.id, "transparent", "welcome.background")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable32"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `Imagen personalizada`: {
                        tempmsg = await message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable35"]))
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({
                          filter: m => m.author.id === cmduser.id,
                          max: 1,
                          time: 60000,
                          errors: ["time"]
                        })
                          .then(collected => {

                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, url, "welcome.custom")
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable36"]))
                                    .setColor(es.color)
                                    .setDescription(`Voy a utilizar ${client.settings.get(message.guild.id, "welcome.custom") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definido, Imagen personalizada"}\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              } else {
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable37"]))
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, url, "welcome.custom")
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable38"]))
                                    .setColor(es.color)
                                    .setDescription(`Utilizaré ${client.settings.get(message.guild.id, "welcome.custom") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definido, Imagen personalizada"}\n\nSi alguien se une a este servidor, se enviará un mensaje **con una imagen** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              } else {
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable39"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable40"]))
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
                            }
                          })
                          .catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable41"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          })
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.frame") ? "Deshabilitado" : "Habilitado"} Frame`: {
                        client.settings.set(message.guild.id, "no", "welcome.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.frame"), "welcome.frame")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable42"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.discriminator") ? "Deshabilitado" : "Habilitado"} User-Tag`: {
                        client.settings.set(message.guild.id, "no", "welcome.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.discriminator"), "welcome.discriminator")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable45"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.membercount") ? "Deshabilitado" : "Habilitado"} Recuento de miembros`: {
                        client.settings.set(message.guild.id, "no", "welcome.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.membercount"), "welcome.membercount")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable48"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.servername") ? "Deshabilitado" : "Habilitado"} Nombre del servidor`: {
                        client.settings.set(message.guild.id, "no", "welcome.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.servername"), "welcome.servername")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable51"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.pb") ? "Deshabilitado" : "Habilitado"} User-Avatar`: {
                        client.settings.set(message.guild.id, "no", "welcome.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.pb"), "welcome.pb")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable54"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `Color del marco`: {

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
                          ]
                        })
                        //Create the collector
                        const collector = tempmsg.createMessageComponentCollector({
                          filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                          time: 90000
                        })
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                          tempmsg.edit({ embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `​✔️ **Selected the \`${collected.first().customId}\` Color**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
                        });
                        //Menu Collections
                        collector.on('collect', async button => {
                          if (button?.user.id === cmduser.id) {
                            var color = button?.customId;
                            client.settings.set(message.guild.id, color, "welcome.framecolor")
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable59"]))
                                .setColor(color)
                                .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          } else {
                            button?.reply(":x: **Sólo el ejecutor de la orden puede reaccionar!**")
                          }
                        })
                      } break;
                    }
                  }

                } break;
                case `Editar el mensaje`: {
                  tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable64"]))
                      .setColor(es.color)
                      .setDescription(`\`{user}\` ... será sustituido por el Userping (e.j: ${cmduser})\n\`{username}\` ... será sustituido por el nombre de usuario (e.g: ${cmduser.user.username})\n\`{usertag}\` ... será sustituido por el Usertag (e.j: ${cmduser.user.tag})\n\n**Introduzca su mensaje ahora!**`)
                      .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                    .then(collected => {
                      var message = collected.first();
                      client.settings.set(message.guild.id, message.content, "welcome.msg")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable66"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, este mensaje se enviará a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "TODAVÍA NO HAY CANAL"}!\n\n${message.content.replace("{user}", `${cmduser.user}`).replace("{username}", `${cmduser.user.username}`).replace("{usertag}", `${cmduser.user.tag}`)}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable69"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                } break;
                case `${client.settings.get(message.guild.id, "welcome.invite") ? "Desactivar InviteInformación" : "Activar la información de las invitaciones"}`: {
                  client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.invite"), "welcome.invite")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable70"]))
                      .setColor(es.color)
                      .setDescription(`Si alguien se une a este servidor, se enviará un mensaje con información de invitación a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "Aún no se ha definido"}!\nEditar el mensaje con: \`${prefix}setup-welcome\``.substring(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } break;
              }
            }
          } break;
          case "Mensaje de bienvenida de texto": {
            second_layer()
            async function second_layer() {
              let menuoptions = [
                {
                  value: `${client.settings.get(message.guild.id, "welcome.secondchannel") == "nochannel" ? "Establecer canal" : "Sobreescritura del canal"}`,
                  description: `${client.settings.get(message.guild.id, "welcome.secondchannel") == "nochannel" ? "Establezca un canal en el que deben aparecer los mensajes de bienvenida" : "Sobrescribir el canal actual con uno nuevo"}`,
                  emoji: "895066899619119105" //
                },
                {
                  value: "Deshabilitar Welcome de texto",
                  description: `Deshabilitar el segundo mensaje de bienvenida`,
                  emoji: "❌"
                },
                {
                  value: "Editar el mensaje",
                  description: `Editar el segundo Mensaje de Bienvenida ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancelar y detener el Welcome-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haga clic en mí para configurar el Sistema de Bienvenida')
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor('Configuración de bienvenida', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
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
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({ content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true });
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata) {
              switch (optionhandletype) {
                case `${client.settings.get(message.guild.id, "welcome.secondchannel") == "nochannel" ? "Establecer canal" : "Sobreescritura del canal"}`: {
                  tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable7"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable8"]))
                      .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                    .then(collected => {
                      var message = collected.first();
                      var channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      if (channel) {
                        client.settings.set(message.guild.id, channel.id, "welcome.secondchannel")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable9"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.secondchannel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.secondchannel")) : "Aún no se ha definido"}!\nEditar el mensaje con: \`${prefix}setup-welcome\``.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } else {
                        return message.reply("no has hecho ping a un canal válido")
                      }
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable12"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                } break;
                case `Deshabilitar Welcome de texto`: {
                  client.settings.set(message.guild.id, "nochannel", "welcome.secondchannel")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable13"]))
                      .setColor(es.color)
                      .setDescription(`Si alguien se une a este servidor, no se enviará ningún mensaje a un canal!\nEstablecer un canal con: \`${prefix}setup-welcome\` --> Escoge 1️⃣ --> Escoge 1️⃣`.substring(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } break;
                case `Editar el mensaje`: {
                  tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable64"]))
                      .setColor(es.color)
                      .setDescription(`\`{user}\` ... será sustituido por el Userping (e.j: ${cmduser})\n\`{username}\` ... será sustituido por el nombre de usuario (e.j: ${cmduser.user.username})\n\`{usertag}\` ... será sustituido por el Usertag (e.j: ${cmduser.user.tag})\n\n**Introduzca su mensaje ahora!**`)
                      .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                    .then(collected => {
                      var message = collected.first();
                      client.settings.set(message.guild.id, message.content, "welcome.secondmsg")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable66"]))
                          .setColor(es.color)
                          .setDescription(`Si alguien se une a este servidor, este mensaje se enviará a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.secondchannel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.secondchannel")) : "TODAVÍA NO HAY CANAL"}!\n\n${message.content.replace("{user}", `${cmduser.user}`).replace("{username}", `${cmduser.user.username}`).replace("{usertag}", `${cmduser.user.tag}`)}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable69"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                } break;
              }
            }
          } break;
          case "Mensajes directos de bienvenida": {

            second_layer()
            async function second_layer() {
              let menuoptions = [
                {
                  value: `${!client.settings.get(message.guild.id, "welcome.dm") ? "Habilitar dm welcome" : "Deshabilitado dm bienvenido"}`,
                  description: `${!client.settings.get(message.guild.id, "welcome.dm") ? "Enviar mensajes de bienvenida directamente a los usuarios" : "No envíe mensajes de bienvenida directamente a los usuarios"}`,
                  emoji: !client.settings.get(message.guild.id, "welcome.dm") ? "✅" : "❌" // ✅❌
                },
                {
                  value: "Gestionar la imagen",
                  description: `Gestionar la imagen de bienvenida del mensaje`,
                  emoji: "🖼️"
                },
                {
                  value: "Editar el mensaje",
                  description: `Editar el mensaje de bienvenida ...`,
                  emoji: "877653386747605032"
                },
                {
                  value: `${client.settings.get(message.guild.id, "welcome.invite") ? "Desactivar InviteInformación" : "Activar la información de las invitaciones"}`,
                  description: `${client.settings.get(message.guild.id, "welcome.invite") ? "Ya no muestra la información que le invitó" : "Mostrar información sobre los invitados him/her"}`,
                  emoji: "877653386747605032"
                },
                {
                  value: "Cancel",
                  description: `Cancelar y detener el Welcome-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haga clic en mí para configurar el Sistema de Bienvenida')
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor('DM - Configuración de bienvenida', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
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
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({ content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true });
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata) {
              switch (optionhandletype) {
                case `${!client.settings.get(message.guild.id, "welcome.dm") ? "HABILITAR BIENVENIDA POR DM" : "DESHABILITAR BIENVENIDA POR DM"}`: {
                  client.settings.set(message.guild.id, !client.settings.set(message.guild.id, "nochannel", "welcome.dm"), "welcome.dm")
                  if (!client.settings.set(message.guild.id, "nochannel", "welcome.dm")) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable79"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } else {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable76"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } break;
                case `Gestionar la imagen`: {
                  third_layer()
                  async function third_layer() {
                    let menuoptions = [
                      {
                        value: "Deshabilitar la imagen",
                        description: `No voy a adjuntar más imágenes`,
                        emoji: "❌"
                      },
                      {
                        value: "Habilitar Aunto imagen",
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
                        description: `Utilizar una Imagen personalizada en lugar de la Imagen de Fondo`,
                        emoji: "🖼"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.framedm") ? "Deshabilitado" : "Habilitado"} Frame`,
                        description: `${client.settings.get(message.guild.id, "welcome.framedm") ? "I won't show the Frame anymore" : "Let me display a colored Frame for highlighting"}`,
                        emoji: "✏️"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.discriminatordm") ? "Deshabilitado" : "Habilitado"} User-Tag`,
                        description: `${client.settings.get(message.guild.id, "welcome.discriminatordm") ? "I won't show the User-Tag anymore" : "Let me display a colored User-Tag (#1234)"}`,
                        emoji: "🔢"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.membercountdm") ? "Deshabilitado" : "Habilitado"} Member Count`,
                        description: `${client.settings.get(message.guild.id, "welcome.membercountdm") ? "I won't show the Member Count anymore" : "Let me display a colored MemberCount of the Server"}`,
                        emoji: "📈"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.servernamedm") ? "Deshabilitado" : "Habilitado"} Server Name`,
                        description: `${client.settings.get(message.guild.id, "welcome.servernamedm") ? "Ya no mostraré el nombre del servidor" : "Permítame mostrar un nombre de servidor coloreado"}`,
                        emoji: "🗒"
                      },
                      {
                        value: `${client.settings.get(message.guild.id, "welcome.pbdm") ? "Deshabilitado" : "Habilitado"} User-Avatar`,
                        description: `${client.settings.get(message.guild.id, "welcome.pbdm") ? "No mostraré más el avatar de usuario" : "Permítame mostrar el avatar de usuario"}`,
                        emoji: "💯"
                      },
                      {
                        value: "Color del marco",
                        description: `Cambiar el color del marco`,
                        emoji: "⬜"
                      },
                      {
                        value: "Cancel",
                        description: `Cancelar y detener el Welcome-Setup!`,
                        emoji: "862306766338523166"
                      }
                    ]
                    //define the selection
                    let Selection = new MessageSelectMenu()
                      .setCustomId('MenuSelection')
                      .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                      .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                      .setPlaceholder('Haga clic en mí para configurar el Sistema de Bienvenida')
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
                    let MenuEmbed = new MessageEmbed()
                      .setColor(es.color)
                      .setAuthor('Configuración de bienvenida', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
                    //send the menu msg
                    let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
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
                        handle_the_picks_3(menu?.values[0], SetupNumber, menuoptiondata)
                      }
                      else menu?.reply({ content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true });
                    });
                    //Once the Collections ended edit the menu message
                    collector.on('end', collected => {
                      menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
                    });
                  }
                  async function handle_the_picks_3(optionhandletype, SetupNumber, menuoptiondata) {
                    switch (optionhandletype) {
                      case `Deshabilitar la imagen`: {
                        client.settings.set(message.guild.id, false, "welcome.imagedm")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable84"]))
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `Habilitar Aunto imagen`: {
                        client.settings.set(message.guild.id, true, "welcome.imagedm")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable87"]))
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `Establecer el fondo de la imagen`: {
                        tempmsg = await message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable90"]))
                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable91"]))
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({
                          filter: m => m.author.id === cmduser.id,
                          max: 1,
                          time: 60000,
                          errors: ["time"]
                        })
                          .then(collected => {

                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, "no", "welcome.customdm")
                                client.settings.set(message.guild.id, url, "welcome.backgrounddm")
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable92"]))
                                    .setColor(es.color)
                                    .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "welcome.customdm") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definido, Imagen personalizada"}`.substring(0, 2048))
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              } else {
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable93"]))
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, "no", "welcome.customdm")
                                client.settings.set(message.guild.id, url, "welcome.backgrounddm")
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable94"]))
                                    .setColor(es.color)
                                    .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "welcome.customdm") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definido, Imagen personalizada"}`.substring(0, 2048))
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              } else {
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable95"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable96"]))
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
                            }
                          })
                          .catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable31"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          })
                      } break;
                      case `Del fondo de la imagen`: {
                        client.settings.set(message.guild.id, true, "welcome.imagedm")
                        client.settings.get(message.guild.id, "transparent", "welcome.backgrounddm")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable98"]))
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `Imagen personalizada`: {
                        tempmsg = await message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable101"]))
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))]
                        });
                        await tempmsg.channel.awaitMessages({
                          filter: m => m.author.id === cmduser.id,
                          max: 1,
                          time: 60000,
                          errors: ["time"]
                        })
                          .then(collected => {

                            //push the answer of the user into the answers lmfao
                            if (collected.first().attachments.size > 0) {
                              if (collected.first().attachments.every(attachIsImage)) {
                                client.settings.set(message.guild.id, url, "welcome.customdm")
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable102"]))
                                    .setColor(es.color)
                                    .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "welcome.customdm") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definido, Imagen personalizada"}`.substring(0, 2048))
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              } else {
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable103"]))
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              }
                            } else {
                              if (isValidURL(collected.first().content)) {
                                url = collected.first().content;
                                client.settings.set(message.guild.id, url, "welcome.customdm")
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable104"]))
                                    .setColor(es.color)
                                    .setDescription(`Voy a usar ${client.settings.get(message.guild.id, "welcome.customdm") === "no" ? "una imagen generada automáticamente con datos del usuario" : "Su definido, Imagen personalizada"}`.substring(0, 2048))
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              } else {
                                return message.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable105"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable106"]))
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                  ]
                                });
                              }
                            }
                            //this function is for turning each attachment into a url
                            function attachIsImage(msgAttach) {
                              url = msgAttach.url;
                              //True if this url is a png image.
                              return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 ||
                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 ||
                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
                            }
                          })
                          .catch(e => {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable41"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          })
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.framedm") ? "Deshabilitado" : "Habilitado"} Frame`: {
                        client.settings.set(message.guild.id, "no", "welcome.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.framedm"), "welcome.framedm")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable108"]))
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.discriminatordm") ? "Deshabilitado" : "Habilitado"} User-Tag`: {
                        client.settings.set(message.guild.id, "no", "welcome.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.discriminatordm"), "welcome.discriminatordm")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable111"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.membercountdm") ? "Deshabilitado" : "Habilitado"} Recuento de miembros`: {
                        client.settings.set(message.guild.id, "no", "welcome.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.membercountdm"), "welcome.membercountdm")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable114"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.servernamedm") ? "Deshabilitado" : "Habilitado"} Nombre del servidor`: {
                        client.settings.set(message.guild.id, "no", "welcome.customdm")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.servernamedm"), "welcome.servernamedm")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable117"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `${client.settings.get(message.guild.id, "welcome.pbdm") ? "Deshabilitado" : "Habilitado"} User-Avatar`: {
                        client.settings.set(message.guild.id, "no", "welcome.custom")
                        client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.pbdm"), "welcome.pbdm")
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable120"]))
                            .setColor(es.color)
                            .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } break;
                      case `Color del marco`: {

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
                          ]
                        })
                        //Create the collector
                        const collector = tempmsg.createMessageComponentCollector({
                          filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                          time: 90000
                        })
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                          tempmsg.edit({ embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `​✔️ **Selected the \`${collected.first().customId}\` Color**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
                        });
                        //Menu Collections
                        collector.on('collect', async button => {
                          if (button?.user.id === cmduser.id) {
                            var color = button?.customId;
                            client.settings.set(message.guild.id, color, "welcome.framecolordm")
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable125"]))
                                .setColor(color)
                                .setDescription(`Si alguien se une a este servidor, se enviará un mensaje **con una imagen automatizada** a ${message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) ? message.guild.channels.cache.get(client.settings.get(message.guild.id, "welcome.channel")) : "NO HAY NINGÚN CANAL DEFINIDO AÚN"}`.substring(0, 2048))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          } else {
                            button?.reply(":x: **Sólo el ejecutor de la orden puede reaccionar!**")
                          }
                        })
                      } break;
                    }
                  }

                } break;
                case `Editar el mensaje`: {
                  tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable130"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable131"]))
                      .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                    .then(collected => {
                      var message = collected.first();
                      client.settings.set(message.guild.id, message.content, "welcome.dm_msg")
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable132"]))
                          .setColor(es.color)
                          .setDescription(`${message.content.replace("{user}", `${cmduser.user}`).replace("{username}", `${cmduser.user.username}`).replace("{usertag}", `${cmduser.user.tag}`)}`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable69"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                } break;
                case `${client.settings.get(message.guild.id, "welcome.invite") ? "Desactivar InviteInformación" : "Activar la información de las invitaciones"}`: {
                  client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.invitedm"), "welcome.invite")
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable136"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } break;
              }
            }
          } break;
          case "Roles de bienvenida": {

            second_layer()
            async function second_layer() {
              let menuoptions = [
                {
                  value: "Añadir rol",
                  description: `Añadir una función de bienvenida`,
                  emoji: "✅"
                },
                {
                  value: "Eliminar Rol",
                  description: `Eliminar una función de bienvenida`,
                  emoji: "🗑️"
                },
                {
                  value: "Mostrar Roles",
                  description: `Mostrar todas las funciones de bienvenida`,
                  emoji: "📑"
                },
                {
                  value: "Cancel",
                  description: `Cancelar y detener el Welcome-Setup!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haga clic en mí para configurar el Sistema de Bienvenida')
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
              let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor('Configuración de bienvenida', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/306/waving-hand_1f44b?.png', 'https://arcticbot.xyz/discord')
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
              //send the menu msg
              let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
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
                  handle_the_picks_2(menu?.values[0], SetupNumber, menuoptiondata)
                }
                else menu?.reply({ content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true });
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
              });
            }
            async function handle_the_picks_2(optionhandletype, SetupNumber, menuoptiondata) {
              switch (optionhandletype) {
                case `Añadir rol`: {
                  var tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable142"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable143"]))
                      .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                    .then(collected => {
                      var message = collected.first();
                      var role = message.mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                      if (role) {
                        var welcomeroles = client.settings.get(message.guild.id, "welcome.roles")
                        if (welcomeroles.includes(role.id)) return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable144"]))
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                          ]
                        });
                        client.settings.push(message.guild.id, role.id, "welcome.roles");
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable145"]))
                            .setColor(es.color)
                            .setDescription(`Todos los que se unan obtendrán esos roles ahora:\n<@&${client.settings.get(message.guild.id, "welcome.roles").join(">\n<@&")}>`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } else {
                        return message.reply("no has hecho ping a un rol válido")
                      }
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable146"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                } break;
                case `Eliminar Rol`: {
                  var tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable147"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable148"]))
                      .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === cmduser.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                    .then(collected => {
                      var message = collected.first();
                      var role = message.mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                      if (role) {
                        var welcomeroles = client.settings.get(message.guild.id, "welcome.roles")
                        if (!welcomeroles.includes(role.id)) return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable149"]))
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                          ]
                        });
                        client.settings.remove(message.guild.id, role.id, "welcome.roles");
                        return message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable150"]))
                            .setColor(es.color)
                            .setDescription(`Todos los que se unan obtendrán esos roles ahora:\n<@&${client.settings.get(message.guild.id, "welcome.roles").join(">\n<@&")}>`.substring(0, 2048))
                            .setFooter(client.getFooter(es))
                          ]
                        });
                      } else {
                        return message.reply("no has hecho ping a un rol válido")
                      }
                    })
                    .catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable151"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                } break;
                case `Mostrar Roles`: {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable152"]))
                      .setColor(es.color)
                      .setDescription(`<@&${client.settings.get(message.guild.id, "welcome.roles").join(">\n<@&")}>`.substring(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } break;
              }
            }
          } break;
          case "Sistema Captcha (Seguridad)": {
            client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "welcome.captcha"), "welcome.captcha")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-welcome"]["variable154"]))
                .setColor(es.color)
                .setDescription(`${client.settings.get(message.guild.id, "welcome.captcha") ? "Pediré a los nuevos miembros que se verifiquen, luego les enviaré mensajes de bienvenida / les añadiré los roles si lo consiguen, + los expulsaré si no lo consiguen!..." : "No pediré a los nuevos diputados que se verifiquen a sí mismos!"}`.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]
            });
          } break;
          case `Prueba de bienvenida`: {
            var { member } = message;
            let welcome = client.settings.get(member.guild.id, "welcome");
            let invitemessage = `Invitado por ${member.user.tag ? `**${member.user.tag}**` : `<@${member.user.id}>`}\n<:Like:857334024087011378> **X Invitaciones**\n[<:joines:866356465299488809> X Entradas | <:leaves:866356598356049930> X Salidas | ❌ X Fakes]`
            if (welcome) {
              let themessage = String(welcome.secondmsg);
              if (!themessage || themessage.length == 0) themessage = ":wave: {user} **Bienvenido a nuestro servidor!** :v:";
              themessage = themessage.replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`)
              if (message.channel.permissionsFor(message.channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
                message.channel.send({ content: `**CANAL 2 MENSAJE en ${welcome.secondchannel != "nochannel" ? `<#${welcome.secondchannel}>` : ` \`SIN CANAL - CONFIGURADO\``}:**\n\n${themessage}`.substring(0, 2000) }).catch(() => { });
              }
            }

            if (welcome) {
              if (welcome.image) {
                if (welcome.dm) {
                  if (welcome.customdm === "no") dm_msg_autoimg(member);
                  else dm_msg_withimg(member);
                }
                if (welcome.custom === "no") msg_autoimg(member);
                else msg_withimg(member);
              } else {
                if (welcome.dm) {
                  dm_msg_withoutimg(member);
                }
                msg_withoutimg(member)
              }
            }


            async function msg_withoutimg(member) {
              let { channel } = message;

              //define the welcome embed
              const welcomeembed = new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTimestamp()
                .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                  dynamic: true
                }))
                .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable7"]))
                .setDescription(client.settings.get(member.guild.id, "welcome.msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                .addField(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variablex_8"]), eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable8"]))

              //send the welcome embed to there
              if (channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
                if (channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS)) {
                  channel.send({
                    content: `**CANAL BIENVENIDO en ${welcome.channel != "nochannel" ? `<#${welcome.channel}>` : ` \`SIN CANAL - CONFIGURADO\``}:**\n\n<@${member.user.id}>`,
                    embeds: [welcomeembed]
                  }).catch(() => { });
                } else {
                  channel.send({
                    content: `**CANAL BIENVENIDO en ${welcome.channel != "nochannel" ? `<#${welcome.channel}>` : ` \`SIN CANAL - CONFIGURADO\``}:**\n\n<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                  }).catch(() => { });
                }
              }

            }
            async function dm_msg_withoutimg(member) {
              let { channel } = message;
              //define the welcome embed
              const welcomeembed = new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTimestamp()
                .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                  dynamic: true
                }))
                .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable9"]))
                .setDescription(client.settings.get(member.guild.id, "welcome.dm_msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
              if (client.settings.get(member.guild.id, "welcome.invitedm")) welcomeembed.addField("\u200b", `${invitemessage}`)
              //send the welcome embed to there
              channel.send({
                content: `**SE AGRADECE EL MENSAJE DIRECTO:**\n\n<@${member.user.id}>`,
                embeds: [welcomeembed]
              }).catch(() => { });
            }


            async function dm_msg_withimg(member) {
              let { channel } = message;
              //define the welcome embed
              const welcomeembed = new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTimestamp()
                .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                  dynamic: true
                }))
                .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable10"]))
                .setDescription(client.settings.get(member.guild.id, "welcome.dm_msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                .setImage(client.settings.get(member.guild.id, "welcome.customdm"))
              if (client.settings.get(member.guild.id, "welcome.invitedm")) welcomeembed.addField("\u200b", `${invitemessage}`)
              //send the welcome embed to there
              channel.send({
                content: `**SE AGRADECE EL MENSAJE DIRECTO:**\n\n<@${member.user.id}>`,
                embeds: [welcomeembed]
              }).catch(() => { });
            }
            async function msg_withimg(member) {
              let { channel } = message;

              //define the welcome embed
              const welcomeembed = new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setTimestamp()
                .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                  dynamic: true
                }))
                .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable11"]))
                .setDescription(client.settings.get(member.guild.id, "welcome.msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                .setImage(client.settings.get(member.guild.id, "welcome.custom"))
              if (client.settings.get(member.guild.id, "welcome.invite")) welcomeembed.addField("\u200b", `${invitemessage}`)
              //send the welcome embed to there
              if (channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
                if (channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS)) {
                  channel.send({
                    content: `**CANAL BIENVENIDO en ${welcome.channel != "nochannel" ? `<#${welcome.channel}>` : ` \`SIN CANAL - CONFIGURADO\``}:**\n\n<@${member.user.id}>`,
                    embeds: [welcomeembed]
                  }).catch(() => { });
                } else {
                  channel.send({
                    content: `**CANAL BIENVENIDO en ${welcome.channel != "nochannel" ? `<#${welcome.channel}>` : ` \`SIN CANAL - CONFIGURADO\``}:**\n\n<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                  }).catch(() => { });
                }
              }
            }

            async function dm_msg_autoimg(member) {
              let { channel } = message;
              try {
                //define the welcome embed
                const welcomeembed = new Discord.MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setTimestamp()
                  .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                    dynamic: true
                  }))
                  .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable12"]))
                  .setDescription(client.settings.get(member.guild.id, "welcome.dm_msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                if (client.settings.get(member.guild.id, "welcome.invitedm")) welcomeembed.addField("\u200b", `${invitemessage}`)
                //member roles add on welcome every single role
                const canvas = Canvas.createCanvas(1772, 633);
                //make it "2D"
                const ctx = canvas.getContext(`2d`);

                if (client.settings.get(member.guild.id, "welcome.backgrounddm") !== "transparent") {
                  try {
                    const bgimg = await Canvas.loadImage(client.settings.get(member.guild.id, "welcome.backgrounddm"));
                    ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
                  } catch { }
                } else {
                  try {
                    if (!member.guild.iconURL() || member.guild.iconURL() == null || member.guild.iconURL() == undefined) return;
                    const img = await Canvas.loadImage(member.guild.iconURL({
                      format: "png"
                    }));
                    ctx.globalAlpha = 0.3;
                    //draw the guildicon
                    ctx.drawImage(img, 1772 - 633, 0, 633, 633);
                    ctx.globalAlpha = 1;
                  } catch { }
                }

                if (client.settings.get(member.guild.id, "welcome.framedm")) {
                  let background;
                  var framecolor = client.settings.get(member.guild.id, "welcome.framecolordm").toUpperCase();
                  if (framecolor == "WHITE") framecolor = "#FFFFF9";
                  if (client.settings.get(member.guild.id, "welcome.discriminatordm") && client.settings.get(member.guild.id, "welcome.servernamedm"))
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);

                  else if (client.settings.get(member.guild.id, "welcome.discriminatordm"))
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);

                  else if (client.settings.get(member.guild.id, "welcome.servernamedm"))
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);

                  else
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);

                  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                  if (client.settings.get(member.guild.id, "welcome.pbdm")) {
                    background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb?.png`);
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                  }
                }

                var fillcolors = client.settings.get(member.guild.id, "welcome.framecolordm").toUpperCase();
                if (fillcolors == "WHITE") framecolor = "#FFFFF9";
                ctx.fillStyle = fillcolors.toLowerCase();

                //set the first text string 
                var textString3 = `${member.user.username}`;
                //if the text is too big then smaller the text
                if (textString3.length >= 14) {
                  ctx.font = `100px ${Fonts}`;
                  await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2);
                }
                //else dont do it
                else {
                  ctx.font = `150px ${Fonts}`;
                  await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2 + 20);
                }



                ctx.font = `bold 50px ${wideFonts}`;
                //define the Discriminator Tag
                if (client.settings.get(member.guild.id, "welcome.discriminatordm")) {
                  await canvacord.Util.renderEmoji(ctx, `#${member.user.discriminator}`, 750, canvas.height / 2 + 125);
                }
                //define the Member count
                if (client.settings.get(member.guild.id, "welcome.membercountdm")) {
                  await canvacord.Util.renderEmoji(ctx, `Member #${member.guild.memberCount}`, 750, canvas.height / 2 + 200);
                }
                //get the Guild Name
                if (client.settings.get(member.guild.id, "welcome.servernamedm")) {
                  await canvacord.Util.renderEmoji(ctx, `${member.guild.name}`, 700, canvas.height / 2 - 150);
                }

                if (client.settings.get(member.guild.id, "welcome.pbdm")) {
                  //create a circular "mask"
                  ctx.beginPath();
                  ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
                  ctx.closePath();
                  ctx.clip();
                  //define the user avatar
                  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
                    format: `png`
                  }));
                  //draw the avatar
                  ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
                }

                //get it as a discord attachment
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `welcome-image.png`);
                //send the welcome embed to there
                channel.send({
                  content: `**SE AGRADECE EL MENSAJE DIRECTO:**\n\n<@${member.user.id}>`,
                  embeds: [welcomeembed.setImage(`attachment://welcome-image.png`)],
                  files: [attachment]
                }).catch(() => { });
                //member roles add on welcome every single role
              } catch { }
            }
            async function msg_autoimg(member) {
              let { channel } = message;
              try {
                //define the welcome embed
                const welcomeembed = new Discord.MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setTimestamp()
                  .setFooter("ID: " + member.user.id, member.user.displayAvatarURL({
                    dynamic: true
                  }))

                  .setTitle(eval(client.la[ls]["handlers"]["welcomejs"]["welcome"]["variable13"]))
                  .setDescription(client.settings.get(member.guild.id, "welcome.msg").replace("{user}", `${member.user}`).replace("{username}", `${member.user.username}`).replace("{usertag}", `${member.user.tag}`))
                if (client.settings.get(member.guild.id, "welcome.invite")) welcomeembed.addField("\u200b", `${invitemessage}`)
                try {
                  //member roles add on welcome every single role
                  const canvas = Canvas.createCanvas(1772, 633);
                  //make it "2D"
                  const ctx = canvas.getContext(`2d`);

                  if (client.settings.get(member.guild.id, "welcome.background") !== "transparent") {
                    try {
                      const bgimg = await Canvas.loadImage(client.settings.get(member.guild.id, "welcome.background"));
                      ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
                    } catch { }
                  } else {
                    try {
                      if (!member.guild.iconURL() || member.guild.iconURL() == null || member.guild.iconURL() == undefined) return;
                      const img = await Canvas.loadImage(member.guild.iconURL({
                        format: "png"
                      }));
                      ctx.globalAlpha = 0.3;
                      //draw the guildicon
                      ctx.drawImage(img, 1772 - 633, 0, 633, 633);
                      ctx.globalAlpha = 1;
                    } catch { }
                  }


                  if (client.settings.get(member.guild.id, "welcome.frame")) {
                    let background;
                    var framecolor = client.settings.get(member.guild.id, "welcome.framecolor").toUpperCase();
                    if (framecolor == "WHITE") framecolor = "#FFFFF9";
                    if (client.settings.get(member.guild.id, "welcome.discriminator") && client.settings.get(member.guild.id, "welcome.servername"))
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome3frame.png`);

                    else if (client.settings.get(member.guild.id, "welcome.discriminator"))
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_unten.png`);

                    else if (client.settings.get(member.guild.id, "welcome.servername"))
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome2frame_oben.png`);

                    else
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1frame.png`);

                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                    if (client.settings.get(member.guild.id, "welcome.pb")) {
                      background = await Canvas.loadImage(`./assets/welcome/${framecolor}/welcome1framepb?.png`);
                      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                    }
                  }

                  var fillcolor = client.settings.get(member.guild.id, "welcome.framecolor").toUpperCase();
                  if (fillcolor == "WHITE") framecolor = "#FFFFF9";
                  ctx.fillStyle = fillcolor.toLowerCase();

                  //set the first text string 
                  var textString3 = `${member.user.username}`;
                  //if the text is too big then smaller the text
                  if (textString3.length >= 14) {
                    ctx.font = `100px ${Fonts}`;
                    await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2);
                  }
                  //else dont do it
                  else {
                    ctx.font = `150px ${Fonts}`;
                    await canvacord.Util.renderEmoji(ctx, textString3, 720, canvas.height / 2 + 20);
                  }

                  ctx.font = `bold 50px ${wideFonts}`;
                  //define the Discriminator Tag
                  if (client.settings.get(member.guild.id, "welcome.discriminator")) {
                    await canvacord.Util.renderEmoji(ctx, `#${member.user.discriminator}`, 750, canvas.height / 2 + 125);
                  }
                  //define the Member count
                  if (client.settings.get(member.guild.id, "welcome.membercount")) {
                    await canvacord.Util.renderEmoji(ctx, `Member #${member.guild.memberCount}`, 750, canvas.height / 2 + 200);
                  }
                  //get the Guild Name
                  if (client.settings.get(member.guild.id, "welcome.servername")) {
                    await canvacord.Util.renderEmoji(ctx, `${member.guild.name}`, 700, canvas.height / 2 - 150);
                  }


                  if (client.settings.get(member.guild.id, "welcome.pb")) {
                    //create a circular "mask"
                    ctx.beginPath();
                    ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
                    ctx.closePath();
                    ctx.clip();
                    //define the user avatar
                    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
                      format: `png`
                    }));
                    //draw the avatar
                    ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
                  }
                  //get it as a discord attachment
                  const attachment = new Discord.MessageAttachment(await canvas.toBuffer(), `welcome-image.png`);
                  //send the welcome embed to there
                  if (channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
                    if (channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.EMBED_LINKS) && channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.ATTACH_FILES)) {
                      channel.send({
                        content: `**CANAL BIENVENIDO en ${welcome.channel != "nochannel" ? `<#${welcome.channel}>` : ` \`SIN CANAL - CONFIGURADO\``}:**\n\n<@${member.user.id}>`,
                        embeds: [welcomeembed.setImage(`attachment://welcome-image.png`)],
                        files: [attachment]
                      }).catch(() => { });
                    } else if (channel.permissionsFor(channel.guild.me).has(Discord.Permissions.FLAGS.ATTACH_FILES)) {
                      channel.send({
                        content: `**CANAL BIENVENIDO en ${welcome.channel != "nochannel" ? `<#${welcome.channel}>` : ` \`SIN CANAL - CONFIGURADO\``}:**\n\n<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                        files: [attachment]
                      }).catch(() => { });
                    } else {
                      channel.send({
                        content: `**CANAL DE BIENVENIDA en ${welcome.channel != "nochannel" ? `<#${welcome.channel}>` : ` \`SIN CANAL - CONFIGURADO\``}:**\n\n<@${member.user.id}>\n${welcomeembed.description}`.substring(0, 2000),
                        files: [attachment]
                      }).catch(() => { });
                    }
                  }
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey);
                }
              } catch (e) {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
              }
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
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
        ]
      });
    }
  },
};
