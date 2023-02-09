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
  name: "setup-ghost-ping-detector",
  category: "💪 Configurar",
  aliases: ["setupghost-ping-detector", "ghost-ping-detector-setup", "ghost-ping-detectorsetup", "setup-ghost-ping", "setup-ghostping"],
  cooldown: 5,
  usage: "setup-ghost-ping-detector  -->  Follow Steps",
  description: "Habilitado/Deshabilitado el detector de pings fantasma / Ghost-Ping-Detector - Logger",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Habilitar Detector-Log",
            description: `Definir el canal Ghost-Ping-Detector-Log`,
            emoji: "✅"
          },
          {
            value: "Deshabilitar Detector-Log",
            description: `Deshabilitar el Ghost-Ping-Detector-Log`,
            emoji: "❌"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar la configuración del Ghost-Ping-Detector-Log`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener el Detector-Log-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el Detector-Comando-Log') 
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
          .setAuthor('Ghost-Ping-Detector Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/bookmark_1f516.png', 'https://arcticbot.xyz/discord')
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
          case "Habilitar Detector-Log":
            {
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable5"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable6"]) + `\n\nSi quiere cambiar el tiempo máximo hasta que un ping es detectado como un ping fantasma, entonces haga algo como esto: \`#canal 30\` ... enviar los registros en #canal, detectar los pings fantasmas de las eliminaciones en menos de 30 segundos`)
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
                    try {
                      client.settings.set(message.guild.id, channel.id, "ghost_ping_detector");
                      let maxtime = message.content.split(">")[1];
                      let isnan = false;
                      if(maxtime && maxtime.length > 0){
                        maxtime = maxtime.trim();
                        if(isNaN(maxtime)){
                          isnan = true;
                          maxtime = 10000;
                        } else {
                          maxtime = Number(maxtime) * 1000;
                        }
                      } else {
                        maxtime = 10000;
                      }
                      client.settings.set(message.guild.id, maxtime, "ghost_ping_detector_max_time");
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`​✔️ Ahora enviaré todos los Ghost Pings detectados en \`${channel.name}\``)
                        .setColor(es.color)
                        .setDescription(`${!isnan ? `Y establece el tiempo máximo de los mensajes de Ghost-Ping-Detected-Deletion en \`${maxtime / 1000} Segundos\``: "Has añadido un tiempo no válido, así que he puesto el tiempo máximo de detección de fantasmas a `10 segundos`."}`)
                        .setFooter(client.getFooter(es))]}
                      );
                    } catch (e) {
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable8"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable9"]))
                        .setFooter(client.getFooter(es))]}
                      );
                    }
                  } else {
                    return message.reply("no has hecho ping a un canal válido")
                  }
                })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable7"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))]
              });
            })
          }
          break;
          case "Deshabilitar Detector-Log":
            {
              client.settings.set(message.guild.id, false, "ghost_ping_detector");
              client.settings.set(message.guild.id, 10000, "ghost_ping_detector_max_time");
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`Deshabilitado con éxito el sistema de detección de fantasmas y el registro`)
                .setColor(es.color)
                .setFooter(client.getFooter(es))]}
              );
            }
          break;
          case "Mostrar configuración":
            {
              let ghost_ping_detector = client.settings.get(message.guild.id, `ghost_ping_detector`)
              let ghost_ping_detector_max_time = client.settings.get(message.guild.id, `ghost_ping_detector_max_time`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Settings of the Ghost-Ping-Detector-Log")
                .setColor(es.color)
                .setDescription(`**Canal:** ${ghost_ping_detector == false ? "No se ha configurado" : `<#${ghost_ping_detector}> | \`${ghost_ping_detector}\``}\n\n**Tiempo máximo de detección:** \`${Math.floor(ghost_ping_detector_max_time / 1000)} Segundos\``.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
            }
          break;
        }
      }
      
  
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-logger"]["variable15"]))]}
      );
    }
  },
};

