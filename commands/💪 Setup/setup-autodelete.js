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
  send_roster,
  duration
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-autodelete",
  category: "💪 Configurar",
  aliases: ["setupautodelete", "autodelete-setup"],
  cooldown: 5,
  usage: "setup-autodelete  --> Siga los pasos",
  description: "Defina un canal en el que cada mensaje se sustituya por un EMBED o desactive esta función",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        let menuoptions = [{
            value: "Añadir un canal",
            description: `Añadir un canal de mensajes de eliminación automática`,
            emoji: NumberEmojiIds[1]
          },
          {
            value: "Eliminar un canal",
            description: `Eliminar un canal de la configuración`,
            emoji: NumberEmojiIds[2]
          },
          {
            value: "Mostrar todos los canales",
            description: `Mostrar todos los canales de configuración!`,
            emoji: "📑"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de eliminación automática!') 
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
          .setAuthor('Configuración de la eliminación automática', 'https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96', 'https://arcticbot.xyz/discord')
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
        client.setups.ensure(message.guild.id, {
          autodelete: [/*{ id: "840330596567089173", delay: 15000 }*/]
        })
        switch (optionhandletype){
          case "Añadir un canal": {
            let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(`**Qué canal quieres añadir?**`)
              .setColor(es.color)
              .setDescription(`Por favor, haga ping al **canal** ahora! / Envíe el **ID** el **Canal/categoría/conversación**!\nY añade la **Duración** en **Segundos** después!\n\n**Ejemplo:**\n> \`#Canal 30\``)
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
                    var a = client.setups.get(message.guild.id, "autodelete")
                    //remove invalid ids
                    for(const id of a){
                      if(!message.guild.channels.cache.get(id.id)){
                        client.setups.remove(message.guild.id, d => d.id == id.id, "autodelete")
                      }
                    }
                    a = client.setups.get(message.guild.id, "autodelete")
                    if(a.map(d => d.id).includes(channel.id))
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`❌​ Este canal ya está configurado!`)
                        .setDescription(`Quítalo primero con \`${prefix}setup-autodelete\` --> A continuación, elija Eliminar!`)
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]});
                    var args = message.content.split(" ");
                    var time = Number(args[1])
                    if(!time || isNaN(time))
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`❌​ Entrada inválida | Hora incorrecta`)
                        .setDescription(`Probablemente se ha olvidado / no ha añadido una Hora!\nPrueba esto: \`${channel.id} 30\``)
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]});
                    if(time > 60*60 || time < 3)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`❌​ Tiempo fuera de rango!`)
                        .setDescription(`La cantidad más larga es de 1 hora aka 3600 segundos y el tiempo debe ser de al menos 3 segundos!`)
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]});
                    client.setups.push(message.guild.id, { id: channel.id, delay: time * 1000 }, "autodelete")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`​✔️ Ahora borraré los mensajes después de \`${time} Segundos\` en **${channel.name}**`)
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable10"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable11"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  return message.reply( "no has hecho ping a un canal válido")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
              
    
          }break;
          case "Eliminar un canal": {
            let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable13"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable14"]))
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
                    var a = client.setups.get(message.guild.id, "autodelete")
                    //remove invalid ids
                    for(const id of a){
                      if(!message.guild.channels.cache.get(id.id)){
                        client.setups.remove(message.guild.id, d => d.id == id.id, "autodelete")
                      }
                    }
                    a = client.setups.get(message.guild.id, "autodelete")
                    if(!a.map(d => d.id).includes(channel.id))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`❌​ This Channel has not been Setup yet!`)
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                    client.setups.remove(message.guild.id, d => d.id == channel.id, "autodelete")
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`​✔️ Eliminado con éxito **${channel.name}** fuera de la configuración!`)
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable18"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable19"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  return message.reply( "no has hecho ping a un canal válido")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Mostrar todos los canales": {
            var a = client.setups.get(message.guild.id, "autodelete")
            //remove invalid ids
            for(const id of a){
              if(!message.guild.channels.cache.get(id.id)){
                client.setups.remove(message.guild.id, d => d.id == id.id, "autodelete")
              }
            }
            a = client.setups.get(message.guild.id, "autodelete")

            message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(`📑 Configuración del sistema de borrado automático`)
              .setColor(es.color)
              .setDescription(`**Canales en los que se borrarán automáticamente los mensajes:**\n${a.map(d => `<#${d.id}> [Después de: ${duration(d.delay).join(", ")}]`)}`)
              .setFooter(client.getFooter(es))]
            })
          }break;
        }
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable26"]))
      ]});
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

