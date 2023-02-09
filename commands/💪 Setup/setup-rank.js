var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing,
  edit_msg,
  send_roster
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-rank",
  category: "💪 Configurar",
  aliases: ["setuprank", "rank-setup", "setup-level", "setup-levels", "setup-leveling", "setuplevel", "setuplevels", "setupleveling"],
  cooldown: 5,
  usage: "setup-rank --> seguir los pasos",
  description: "Gestionar el sistema de Rank con cosas como el canal, el fondo, etc.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {

      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Canal Levelup",
            description: `Definir un canal para todos los mensajes de subida de nivel`,
            emoji: "✅"
          },
          {
            value: "Respuesta sobre Levelup",
            description: `Establece que los mensajes de subida de nivel sean respondidos`,
            emoji: "👻"
          },
          {
            value: "Desactivar Levelup",
            description: `No enviar nunca información de subida de nivel`,
            emoji: "❌"
          },
          {
            value: "Roles de subida de nivel",
            description: `Gestionar los roles de Levelup`,
            emoji: "💾"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar la configuración del sistema de clasificación`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener la configuracion del sistema Ranking!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de clasificación') 
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
          .setAuthor('Configuración del rango', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/page-with-curl_1f4c3.png', 'https://arcticbot.xyz/discord')
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
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, menuoptiondata) {
        switch (optionhandletype) {
          case "Canal Levelup": {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable6"]))
              .setFooter(client.getFooter(es))
            ]})
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
                    client.points.set(message.guild.id, channel.id, "channel")
                    client.points.set(message.guild.id, false, "disabled")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable7"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable8"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable9"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  throw "no has hecho ping a un canal válido"
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey);
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable10"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Respuesta sobre Levelup": {
            try {
              client.points.set(message.guild.id, false, "channel")
              client.points.set(message.guild.id, false, "disabled")
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable11"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable12"]))
                .setColor(es.color)
                .setFooter(client.getFooter(es))
              ]});
            } catch (e) {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable13"]))
                .setColor(es.wrongcolor)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable14"]))
                .setFooter(client.getFooter(es))
              ]});
            }
          }break;
          case "Desactivar Levelup": {
            try {
              if (client.points.get(message.guild.id, "disabled")) return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable15"]))
                .setColor(es.wrongcolor)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable16"]))
                .setFooter(client.getFooter(es))
              ]});
              client.points.set(message.guild.id, true, "disabled")
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable17"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable18"]))
                .setColor(es.color)
                .setFooter(client.getFooter(es))
              ]});
            } catch (e) {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable19"]))
                .setColor(es.wrongcolor)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable20"]))
                .setFooter(client.getFooter(es))
              ]});
            }
          }break;
          case "Roles de subida de nivel": {
            client.points.ensure(message.guild.id, {
              rankroles: {
                  
              }
          })
          var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle("Qué quieres hacer?")
            .setColor(es.color)
            .addField("Para __añadir__ una función de rango envíe lo siguiente:", 
            "> `NIVEL @ROL`\nEjemplo:\n > `3 @Nivel3` / `5 @NIVEL5`\n\n*Una vez que se ha establecido una función, puede escribir esto de nuevo!*")
            .addField("Para __eliminar__ un rol de rango envíe lo siguiente:", 
            "> `NIVEL`\nEjemplo:\n > `3` / `5`")
            .setFooter(client.getFooter(es))
          ]})
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              let arggs = message.content.trim().split(" ");
              if(!arggs[0] || isNaN(arggs[0])) return message.reply("**:x: SE EQUIVOCÓ! Por favor, lee lo que dice la introducción!**\nCancelado!")
              var Role = message.mentions.roles.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.roles.cache.get(arggs[1]);
                try {
                  let oldRankRoles = client.points.get(message.guild.id, "rankroles");
                  if(!arggs[1] && oldRankRoles[parseInt(arggs[0])]){
                    delete oldRankRoles[parseInt(arggs[0])]
                    client.points.set(message.guild.id, oldRankRoles, "rankroles");
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`**ELIMINADA** la función de subir de nivel: ${Role.name} para el nivel superior: ${parseInt(arggs[0])}`)
                      .setColor(es.color)
                      .setDescription(`Para volver a añadirlo escriba: \`${prefix}setup-rank\` --> 4️⃣ -->  \`${parseInt(arggs[0])} @${Role.name}\``)
                      .setFooter(client.getFooter(es))
                    ]});
                  } else if(arggs[1] && oldRankRoles[parseInt(arggs[0])]){
                    oldRankRoles[parseInt(arggs[0])] = Role.id;
                    client.points.set(message.guild.id, oldRankRoles, "rankroles");
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`**Cambiar** el rol de subida de nivel: ${Role.name} para el nivel superior: ${parseInt(arggs[0])}`)
                      .setColor(es.color)
                      .setDescription(`Para volver a añadirlo escriba: \`${prefix}setup-rank\` --> 4️⃣ -->  \`${parseInt(arggs[0])} @${Role.name}\``)
                      .setFooter(client.getFooter(es))
                    ]});
                  } else {
                    oldRankRoles[parseInt(arggs[0])] = Role.id;
                    client.points.set(message.guild.id, oldRankRoles, "rankroles");
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`**Añadido** el rol de subida de nivel: ${Role.name} para el nivel superior: ${parseInt(arggs[0])}`)
                      .setColor(es.color)
                      .setDescription(`Para eliminarlo, escriba: \`${prefix}setup-rank\` --> 4️⃣ -->  \`${parseInt(arggs[0])}\``)
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable8"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable9"]))
                    .setFooter(client.getFooter(es))
                  ]});
                }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable10"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            })
          }break;
          case "Mostrar configuración": {

            client.points.ensure(message.guild.id, {
              rankroles: {
                  
              }
            })
            let rankroles = [];
            let rolesdata = client.points.get(message.guild.id, "rankroles")
            let channel = client.points.get(message.guild.id, "channel")
            let disabled = client.points.get(message.guild.id, "disabled")
            for(const [key, value] of Object.entries(rolesdata)){
              rankroles.push(`\`${key}\`. <@&${value}>`)
            }
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Ajustes del sistema de clasificación")
              .setColor(es.color)
              .addField("**Subida de Nivel-Mensaje**", `> Deshabilitado: ${!disabled ? "NO (ESTA ACTIVADO)" : "Si (ESTA DESHABILITADO)"}\n> **Responder en ${channel ? `<#${channel}>`: "el mismo Canal"}**`)
              .setDescription(`**Roles Subir de nivel:**\n>>> ${rankroles.length > 0 ? rankroles.join("\n") : "\`NINGUNO\`"}`.substring(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          }break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable36"]))
      ]});
    }
  },
};

