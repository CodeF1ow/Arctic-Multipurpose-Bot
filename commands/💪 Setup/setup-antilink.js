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
  name: "setup-antilink",
  category: "💪 Configurar",
  aliases: ["setupantilink", "antilinks-setup", "antilink-setup", "antilinksetup", "setup-antilinks"],
  cooldown: 5,
  usage: "setup-antilink  --> Sigue los pasos",
  description: "Habilitado/deshabilitado el sistema antienlace",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      let tempmsg;
      
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Habilitado`" : "`❌ Deshabilitado`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `${client.settings.get(message.guild.id, `antilink.enabled`) ? "Deshabilitado" : "Habilitado"} Anti Links`,
            description: `${client.settings.get(message.guild.id, `antilink.enabled`) ? "No borre otros enlaces" : "Borrar otros enlaces"}`,
            emoji: `${client.settings.get(message.guild.id, `antilink.enabled`) ? "833101993668771842" : "833101995723194437"}`
          },
          {
            value: "Settings",
            description: `Mostrar la configuración actual del sistema antienlace`,
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
            value: "Add Whitelist-LINK",
            description: `Permitir enlaces de servidores específicos`,
            emoji: "🔗"
          },
          {
            value: "Remove Whitelist-LINK",
            description: `Eliminar los enlaces permitidos`,
            emoji: "💢"
          },
          {
            value: "Cambiar la cantidad de Mute máximo",
            description: `Cambiar el tiempo máximo permitido para hacerlo antes de silenciar!`,
            emoji: "🕛"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener el Ticket-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Haga clic en mí para configurar el sistema antienlaces!').setCustomId('MenuSelection') 
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
          .setAuthor("Anti-Links Configuración del sistema", 
          "https://cdn.discordapp.com/emojis/858405056238714930.gif?v=1",
          "https://arcticbot.xyz/discord")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable1"]))
        let used1 = false;
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
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable2"])})
            menu?.deferUpdate(); used1 = true;
            handle_the_picks(menuoptionindex, menuoptiondata)
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
            client.settings.set(message.guild.id, !client.settings.get(message.guild.id, `antilink.enabled`), `antilink.enabled`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable3"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]});
          }break
          case 1: {
           let thesettings = client.settings.get(message.guild.id, `antilink`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable4"]))
              .setColor(es.color)
              .setDescription(`**Enabled:** ${thesettings.enabled ? "​✔️" : "❌​"}\n\n**Canales de la lista blanca:** ${thesettings.whitelistedchannels && thesettings.whitelistedchannels.length > 0 ? `<#${thesettings.whitelistedchannels.join("> | <#")}>` : "No Channels Whitelisted!"}\n\n**Information:** *Anti Discord are not enabled in Tickets from THIS BOT*`.substring(0, 2048))
              .addField("**Enlaces en la lista blanca**", `${thesettings.whitelistedlinks.lenght > 0 ? thesettings.whitelistedlinks.join("\n").substring(0, 1024): "No se permiten enlaces!"}`)
              .setFooter(client.getFooter(es))
            ]});
          }break
          case 2: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable5"]))
          .setColor(es.color)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable6"]))
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
              let antisettings = client.settings.get(message.guild.id, "antilink.whitelistedchannels")
              if (antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable7"]))
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))]
              });
              try {
                client.settings.push(message.guild.id, channel.id, "antilink.whitelistedchannels");
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable8"]))
                  .setColor(es.color)
                  .setDescription(`Every single Channel:\n> <#${client.settings.get(message.guild.id, "antilink.whitelistedchannels").join(">\n> <#")}>\nno es comprobado por el sistema antienlaces`.substring(0, 2048))
                  .setFooter(client.getFooter(es))]
                });
              } catch (e) {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable10"]))
                  .setFooter(client.getFooter(es))]
                });
              }
            } else {
              return message.reply( "no has hecho ping a un canal válido")
            }
          })
          .catch(e => {
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable11"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelación de la operación!`.substring(0, 2000))
              .setFooter(client.getFooter(es))]
            });
          })
          }break
          case 3: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable12"]))
          .setColor(es.color)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable13"]))
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
              let antisettings = client.settings.get(message.guild.id, "antilink.whitelistedchannels")
              if (!antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable14"]))
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))]
              });
              try {
                client.settings.remove(message.guild.id, channel.id, "antilink.whitelistedchannels");
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable15"]))
                  .setColor(es.color)
                  .setDescription(`Every single Channel:\n<#${client.settings.get(message.guild.id, "antilink.whitelistedchannels").join(">\n<#")}>\nno es una comprobación del sistema antienlaces`.substring(0, 2048))
                  .setFooter(client.getFooter(es))]
                });
              } catch (e) {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable16"]))
                  .setColor(es.wrongcolor)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable17"]))
                  .setFooter(client.getFooter(es))]
                });
              }
            } else {
              return message.reply( "no has hecho ping a un canal válido")
            }
          })
          .catch(e => {
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable18"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelación de la operación!`.substring(0, 2000))
              .setFooter(client.getFooter(es))]
            });
          })
          }
          break;
          case 4: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Qué enlace quiere habilitar??")
              .setColor(es.color)
              .setDescription(`Sólo tiene que enviarla!\n**NOTA:**\n> Se sugiere retirar el \`https\`, porque sólo comprueba, **si el Enlace contiene lo que usted envía**\n\n**Ejemplo:**\n> Si quiere permitir \`https://bero-host.de\` entonces asegúrese de enviar: \`bero-host.de\``)
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var { content } = message;
              if (content) {
                let antisettings = client.settings.get(message.guild.id, "antilink.whitelistedlinks")
                if (antisettings.includes(content)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Este enlace ya está permitido! puede eliminarlo si lo desea!")
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.settings.push(message.guild.id, content, "antilink.whitelistedlinks");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Añadido el enlace ${content} to the allowed links!`)
                    .setColor(es.color)
                    .setDescription(`Todos los enlaces permitidos:\n> ${client.settings.get(message.guild.id, "antilink.whitelistedlinks").join("\n> ")}\nNo es un sistema comprobado por el sistema de enlaces antidiscordia`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable10"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply( "no ha enviado un enlace válido")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }
          break;
          case 5: {
            let antisettings = client.settings.get(message.guild.id, "antilink.whitelistedlinks")
            if(antisettings.length < 1) return message.reply(":x: No hay enlaces en la lista blanca...")
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Qué enlace quiere volver a deshabilitar?\nEnviar el enlace en el chat")
              .setColor(es.color)
              .setDescription(`${antisettings.map(i => `\`${i}\``).join("\n")}`)
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var { content } = message;
              if (content) {
                if (!antisettings.includes(content)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Este enlace ya no está en la lista blanca!")
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.settings.remove(message.guild.id, content, "antilink.whitelistedlinks");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Eliminado el enlace ${content} de los enlaces permitidos!`)
                    .setColor(es.color)
                    .setDescription(`Todos los enlaces permitidos:\n> ${client.settings.get(message.guild.id, "antilink.whitelistedlinks").join("\n> ")}\nNo es un sistema comprobado por el sistema de enlaces antidiscordia`.substring(0, 2048))
                    .setFooter(client.getFooter(es))]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable10"]))
                    .setFooter(client.getFooter(es))]
                  });
                }
              } else {
                message.reply( "no ha enviado un enlace válido")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Canceló la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }
          break;
          case 6: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Cuántas veces se debe permitir que alguien lo haga en 15 segundos?")
              .setColor(es.color)
              .setDescription(`Currently it is at: \`${client.settings.get(message.guild.id, "antilink.mute_amount")}\`\n\nPor favor, sólo envíe el número! (0 significa que después de la primera vez se silenciará)`)
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
                  client.settings.set(message.guild.id, Number(number), "antilink.mute_amount");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Establezca con éxito los nuevos importes máximos permitidos en " + number + " Times")
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
                message.reply("No ha añadido un contenido de mensaje válido")
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
      ///////////////////////////////////////s
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antilink"]["variable19"]))]}
      );
    }
  },
};

