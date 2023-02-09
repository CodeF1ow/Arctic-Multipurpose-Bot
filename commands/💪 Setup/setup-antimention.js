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
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-antimention",
  category: "💪 Configurar",
  aliases: ["setupantimention", "setup-mention", "setupmention", "antimention-setup", "antimentionsetup"],
  cooldown: 5,
  usage: "setup-antimention  -->  Siga los pasos",
  description: "Activar + Cambiar la cantidad permitida de menciones / mensajes",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      
      
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Habilitado`" : "`❌ Deshabilitado`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `Habilitar y establecer la anti mención`,
            description: "Habilitar y limitar las menciones/mensajes permitidos",
            emoji: "833101995723194437"
          },
          {
            value: `Deshabilitar la anti mención`,
            description: "No impedir las menciones masivas",
            emoji: "833101993668771842"
          },
          {
            value: "Settings",
            description: `Mostrar la configuración actual del sistema antimenciones`,
            emoji: "📑"
          },
          {
            value: "Agregar Whitelist-CHANNEL",
            description: `Permitir canales donde está permitido`,
            emoji: "💯"
          },
          {
            value: "Eliminar Whitelist-CHANNEL",
            description: `Eliminar los canales permitidos`,
            emoji: "💢"
          },
          {
            value: "Cambiar la cantidad de Mute máximo",
            description: `Cambiar el tiempo máximo permitido para hacerlo antes de silenciar!`,
            emoji: "🕛"
          },
          {
            value: "Cancel",
            description: `Anular y detener la instalación de anti-menciones!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Haga clic en mí para configurar el sistema anti mención!').setCustomId('MenuSelection') 
          .setMaxValues(1).setMinValues(1) 
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
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor("Configuración del sistema antimenciones", 
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/a-button-blood-type_1f170-fe0f.png",
          "https://arcticbot.xyz/discord")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable1"]))
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
            let menuoptiondataIndex = menuoptions.findIndex(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(" ")[0]
            handle_the_picks(menuoptiondataIndex, SetupNumber, menuoptiondata)
          }
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }

      //THE FUNCTION TO HANDLE THE SELECTION PICS
      async function handle_the_picks(menuoptionindex, menuoptiondata) {
        switch(menuoptionindex){
          case 0: {
              let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("**Cuántas MENCIONES** se puede enviar un mensaje**? (Pings a roles + Pings a miembros)")
                .setColor(es.color)
                .setDescription(`El límite actual es: \`${client.settings.get(message.guild.id, "antimention.limit")} Menciones / Mensaje\`\n\nNuestra sugerencia es mantenerlo entre 3 y 10\n\nPor favor, sólo envíe el NÚMERO`)
                .setFooter(client.getFooter(es))]
              });
              await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                }) .then(collected => {
                  var message = collected.first();
                  if (message.content) {
                    var limit = Number(message.content);
                    if(limit > 100 || limit <= 0) 
                      return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle("El límite debe estar entre 1 y 100")
                          .setColor(es.wrongcolor)
                          .setFooter(client.getFooter(es))]
                        }); 
                    try {
                      client.settings.set(message.guild.id, limit, "antimention.limit");
                      client.settings.set(message.guild.id, true, "antimention.enabled");
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle("Habilitado con éxito el sistema antimenciones")
                        .setColor(es.color)
                        .setDescription(`Si un usuario que no es administrador envía más pings en un solo mensaje, entonces ${limit}, su(s) mensaje(s) será(n) borrado(s) + será(n) "advertido(s)" (no hay sistema de advertencia pero sí)\n\nSi sigue haciendo eso, será silenciado`.substring(0, 2048))
                        .setFooter(client.getFooter(es))]
                      });
                    } catch (e) {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable8"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable9"]))
                        .setFooter(client.getFooter(es))]
                      });
                    }
                  } else {
                    message.reply( "no has hecho ping a un canal válido")
                  }
                }) .catch(e => {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable10"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  });
                })

          }break;
          case 1: {
            client.settings.set(message.guild.id, false, "antimention.enabled");
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Deshabilitado con éxito el sistema anti mención")
              .setColor(es.color)
              .setDescription(`Para habilitarlo escriba \`${prefix}setup-antimention\``.substring(0, 2048))
              .setFooter(client.getFooter(es))]
            });
          }break;
          case 2: {
            let thesettings = client.settings.get(message.guild.id, `antimention`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("La configuración del sistema anti mención")
              .setColor(es.color)
              .setDescription(`**Habilitado:** ${thesettings.enabled ? "​✔️" : "❌​"}\n\n**Menciones permitidas / Mensaje:** \`${thesettings.limit} Pings\``.substring(0, 2048))
              .setFooter(client.getFooter(es))]}
            );
          } break;
          case 3: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable6"]))
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
                let antisettings = client.settings.get(message.guild.id, "antimention.whitelistedchannels")
                if (antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable7"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.settings.push(message.guild.id, channel.id, "antimention.whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`The Channel \`${channel.name}\` se ha añadido a los canales de la lista blanca de este sistema`)
                    .setColor(es.color)
                    .setDescription(`Todos los canales:\n<#${client.settings.get(message.guild.id, "antimention.whitelistedchannels").join(">\n<#")}>\nno es comprobado por el Sistema`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable10"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply("no has hecho ping a un canal válido")
              }
            })
            .catch(e => {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }break;
          case 4: {

            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable12"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable13"]))
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
                let antisettings = client.settings.get(message.guild.id, "antimention.whitelistedchannels")
                if (!antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable14"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.settings.remove(message.guild.id, channel.id, "antimention.whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`The Channel \`${channel.name}\` se ha eliminado de los canales de la lista blanca de este sistema`)
                    .setColor(es.color)
                    .setDescription(`Todos los canales:\n> <#${client.settings.get(message.guild.id, "antimention.whitelistedchannels").join(">\n> <#")}>\nno es comprobado por el Sistema`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable16"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable17"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply("no has hecho ping a un canal válido")
              }
            })
            .catch(e => {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable18"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }break;
          case 5: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Cuántas veces se debe permitir que alguien lo haga en 15 segundos?")
              .setColor(es.color)
              .setDescription(`Currently it is at: \`${client.settings.get(message.guild.id, "antimention.mute_amount")}\`\n\nPor favor, envíe el número! (0 significa que después de la primera vez se silenciará)`)
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              if (message.content) {
                let number = message.content;
                if(isNaN(number)) return message.reply(":x: **No es un número válido**");
                if(Number(number) < 0 || Number(number) > 15) return message.reply(":x: **El número debe estar entre `0` y `15`.**");
                
                try {
                  client.settings.set(message.guild.id, Number(number), "antimention.mute_amount");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Se han establecido con éxito los nuevos importes máximos permitidos " + number + " Times")
                    .setColor(es.color)
                    .setDescription(`**Si alguien lo hace sobre __${number} times__ he/she/they se silenciará durante 10 minutos!**`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable16"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable17"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply("No has añadido un contenido de mensaje válido")
              }
            })
            .catch(e => {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable18"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }break;
        
        }

      }

      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable13"]))]
      });
    }
  },
};

