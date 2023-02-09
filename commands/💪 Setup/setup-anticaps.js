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
  name: "setup-anticaps",
  category: "💪 Configurar",
  aliases: ["setupanticaps", "setup-caps", "setupcaps", "anticaps-setup", "anticapssetup"],
  cooldown: 5,
  usage: "setup-anticaps  --> Sigue los pasos",
  description: "Activar + Cambiar el porcentaje máximo de mayúsculas dentro de un mensaje",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      
      
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Activado`" : "`❌ Desactivado`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `Enable & Set Anti Caps %`,
            description: "Permitir establecer un % permitido para las mayúsculas en un mensaje",
            emoji: "833101995723194437"
          },
          {
            value: `Disable Anti Spam`,
            description: "No eliminar los mensajes con mayúsculas",
            emoji: "833101993668771842"
          },
          {
            value: "Settings",
            description: `Mostrar la configuración actual del sistema anti-capas`,
            emoji: "📑"
          },
          {
            value: "Agregar Whitelist-CHANNEL",
            description: `Permitir Canales donde está permitido`,
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
            description: `Cancela y detiene la configuración de Anti-Caps!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Haga clic en mí para configurar el sistema anti-capas!').setCustomId('MenuSelection') 
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
          .setAuthor("Anti-Caps Configuración del sistema", 
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
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable3"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable4"]))
                .setFooter(client.getFooter(es))]
              });
              await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                }) .then(collected => {
                  var message = collected.first();
                  if (message.content) {
                    var userpercent = Number(message.content.trim().replace("%", "").split(" ")[0]);
                    if(userpercent > 100 || userpercent < 0) 
                      return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable5"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable6"]))
                          .setFooter(client.getFooter(es))]
                        }); 
                    try {
                      client.settings.set(message.guild.id, userpercent, "anticaps.percent");
                      client.settings.set(message.guild.id, true, "anticaps.enabled");
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable7"]))
                        .setColor(es.color)
                        .setDescription(`Si un usuario no administrador escribe un mensaje con más de ${userpercent}% cantidad de MAYÚSCULAS su mensaje será borrado + será "advertido" (no hay sistema de advertencia pero sí)\n\nSi sigue haciendo eso, será silenciado`.substring(0, 2048))
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
            client.settings.set(message.guild.id, false, "anticaps.enabled");
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable11"]))
              .setColor(es.color)
              .setDescription(`Para habilitarlo escriba \`${prefix}setup-anticaps\``.substring(0, 2048))
              .setFooter(client.getFooter(es))]
            });
          }break;
          case 2: {
            let thesettings = client.settings.get(message.guild.id, `anticaps`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable12"]))
              .setColor(es.color)
              .setDescription(`**Habilitado:** ${thesettings.enabled ? "​✔️" : "❌​"}\n\n**Porcentaje, del mensaje permitido en mayúsculas:** \`${thesettings.percent} %\``.substring(0, 2048))
              .setFooter(client.getFooter(es))]}
            );
          }
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
                let antisettings = client.settings.get(message.guild.id, "anticaps.whitelistedchannels")
                if (antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable7"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.settings.push(message.guild.id, channel.id, "anticaps.whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`El Canal \`${channel.name}\` se ha añadido a los canales de la lista blanca de este sistema`)
                    .setColor(es.color)
                    .setDescription(`Todos los canales:\n<#${client.settings.get(message.guild.id, "anticaps.whitelistedchannels").join(">\n<#")}>\nis not checked by the System`.substring(0, 2048))
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
                let antisettings = client.settings.get(message.guild.id, "anticaps.whitelistedchannels")
                if (!antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable14"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.settings.remove(message.guild.id, channel.id, "anticaps.whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`The Channel \`${channel.name}\` se ha eliminado de los canales de la lista blanca de este sistema`)
                    .setColor(es.color)
                    .setDescription(`Todos los canales:\n> <#${client.settings.get(message.guild.id, "anticaps.whitelistedchannels").join(">\n> <#")}>\nis not checked by the System`.substring(0, 2048))
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
                message.reply("you didn't ping a valid Channel")
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
              .setDescription(`Actualmente se encuentra en: \`${client.settings.get(message.guild.id, "anticaps.mute_amount")}\`\n\nPor favor, envíe el número! (0 significa que después de la primera vez se silenciará)`)
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
                if(isNaN(number)) return message.reply(":x: **Not a valid Number**");
                if(Number(number) < 0 || Number(number) > 15) return message.reply(":x: **El número debe estar entre `0` y `15`.**");
                
                try {
                  client.settings.set(message.guild.id, Number(number), "anticaps.mute_amount");
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

