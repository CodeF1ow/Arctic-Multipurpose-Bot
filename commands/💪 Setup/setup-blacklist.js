var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, swap_pages, swap_pages2
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-blacklist",
  category: "💪 Configurar",
  aliases: ["setupblacklist", "blacklist-setup", "blacklistsetup"],
  cooldown: 5,
  usage: "setup-blacklist  --> Sigue los pasos",
  description: "Blacklist de palabras específicas en su servidor",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Añadir Blacklisted-Word",
            description: `Añadir una palabra a la Blacklist`,
            emoji: "✅"
          },
          {
            value: "Eliminar Blacklisted-Word",
            description: `Eliminar una palabra de la Blacklist`,
            emoji: "🗑️"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar todas las palabras de la Blacklist Configuración`,
            emoji: "📑"
          },
          {
            value: "Restablecer la Blacklist",
            description: `Borrar/Restablecer todas las palabras de la Blacklist`,
            emoji: "💥"
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
            description: `Cancelar y detener la configuración automática de la memoria!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema automatizado de memes!') 
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
        .setAuthor('Setup Blacklist', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/291/stop-sign_1f6d1.png', 'https://arcticbot.xyz/discord')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
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
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            used1 = true;
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype){
          case "Añadir Blacklisted-Word": { 
            var tempmsg = await message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable6"]))
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
                try {
                  var blacklistedwords = message.content.split(",").filter(Boolean).map(item => item.trim().toLowerCase());
                  var notadded = []
                  for(const blacklistword of blacklistedwords){
                    if(client.blacklist.get(message.guild.id, "words").includes(blacklistword)){
                      notadded.push(blacklistword);
                    }else {
                      client.blacklist.push(message.guild.id, blacklistword, "words")
                    }
                  }
                  return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable7"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable8"]))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))]}
                  );
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable10"]))
                    .setFooter(client.getFooter(es))]}
                  );
                }
              } else {
                message.reply( "no has hecho ping a un rol válido")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]}
              );
            })
          }
          break;
          case "Eliminar Blacklisted-Word": { 
            var tempmsg = await message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable12"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable13"]))
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
                  try {
                    var blacklistedwords = message.content.split(",").filter(Boolean).map(item => item.trim().toLowerCase());
                    var notremoved = []
                    for(const blacklistword of blacklistedwords){
                      if(!client.blacklist.get(message.guild.id, "words").includes(blacklistword)){
                        notremoved.push(blacklistword);
                      }else {
                        client.blacklist.remove(message.guild.id, blacklistword, "words")
                      }
                    }
                    return message.reply({embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable14"]))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable15"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))]}
                    );
                  } catch (e) {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable16"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable17"]))
                      .setFooter(client.getFooter(es))]}
                    );
                  }
                } else {
                  message.reply( "no has hecho ping a un rol válido")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({embeds: [new MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable18"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))]}
                );
              })
          }
          break;
          case "Mostrar configuración": { 
            return swap_pages(client, message, `${client.blacklist.get(message.guild.id, "words").map(word => `\`${word}\``).join(", ").split("`").join("\`")}`, `${message.guild.name} | Blacklisted Words`);
          }
          break;
          case "Restablecer la Blacklist": { 
            client.blacklist.set(message.guild.id, [], "words")
            return message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable19"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))]}
            );
          }
          break;
          case "Agregar Whitelist-CHANNEL": {
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
                let antisettings = client.blacklist.get(message.guild.id, "whitelistedchannels")
                if (antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable7"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.blacklist.push(message.guild.id, channel.id, "whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`The Channel \`${channel.name}\` se ha añadido a los canales de la lista blanca de este sistema`)
                    .setColor(es.color)
                    .setDescription(`Todos los canales:\n<#${client.blacklist.get(message.guild.id, "whitelistedchannels").join(">\n<#")}>\nno es comprobado por el Sistema`.substring(0, 2048))
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
          case "Eliminar Whitelist-CHANNEL": {

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
                let antisettings = client.blacklist.get(message.guild.id, "whitelistedchannels")
                if (!antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable14"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))]
                });
                try {
                  client.blacklist.remove(message.guild.id, channel.id, "whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`The Channel \`${channel.name}\` se ha eliminado de los canales de la lista blanca de este sistema`)
                    .setColor(es.color)
                    .setDescription(`Todos los canales:\n> <#${client.blacklist.get(message.guild.id, "whitelistedchannels").join(">\n> <#")}>\nno es comprobado por el Sistema`.substring(0, 2048))
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
          case "Cambiar la cantidad de Mute máximo": {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("How often should someone be allowed to do it within 15 Seconds?")
              .setColor(es.color)
              .setDescription(`Currently it is at: \`${client.blacklist.get(message.guild.id, "mute_amount")}\`\n\nPor favor, envíe el número! (0 significa que después de la primera vez se silenciará)`)
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
                  client.blacklist.set(message.guild.id, Number(number), "mute_amount");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Se han establecido con éxito los nuevos importes máximos permitidos " + number + " Times")
                    .setColor(es.color)
                    .setDescription(`**Si alguien lo hace sobre __${number} veces__ se silenciará durante 10 minutos!**`.substring(0, 2048))
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
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable21"]))]}
      );
    }
  },
};
