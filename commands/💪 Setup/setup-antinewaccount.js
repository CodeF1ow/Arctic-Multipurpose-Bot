var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, duration
} = require(`${process.cwd()}/handlers/functions`);
const ms = require("ms");
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-antinewaccount",
  category: "💪 Configurar",
  aliases: ["setupnewaccount", "newaccount-setup", "newaccountsetup", "setupantinewaccount", "antinewaccount-setup", "antinewaccountsetup", "setup-newaccount"],
  cooldown: 5,
  usage: "setup-antinewaccount  -->  Siga los pasos",
  description: "Configurar un sistema que bloquee las cuentas demasiado nuevas!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      client.settings.ensure(message.guild.id, {
        antinewaccount: {
          enabled: false,
          delay: ms("2 dias"),
          action: "kick", // kick / ban
          extra_message: "Por favor, no vuelva a unirse, a menos que cumpla los requisitos!"
        } 
      });


      const settings = client.settings.get(message.guild.id, "antinewaccount")
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: !settings.enabled ? "Habilitar la expulsion de cuentas nuevas" : "Deshabilitar la expulsion de cuentas nuevas",
            description: !settings.enabled ? "Detectar nuevas cuentas y expulsarlas/prohibirlas" : "No detectar nuevas cuentas",
            emoji: !settings.enabled ? "✅" : "❌",
          },
          {
            value: "Establecer mensaje extra",
            description: `Definir un mensaje extra, enviado a su DM`,
            emoji: "💬"
          },
          {
            value: "Seleccione la acción",
            description: `Seleccione la acción correcta de expulsión/prohibición`,
            emoji: "🔨"
          },
          {
            value: "Establecer la duración",
            description: `Definir la fecha mínima de la cuenta`,
            emoji: "🕒"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar configuración de las nuevas cuentas`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener el sistema de nuevas cuentas!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haz clic en mí para configurar sistema de nuevas cuentas') 
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
          .setAuthor('Anti-New-Account', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/hammer_1f528.png', 'https://arcticbot.xyz/discord')
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
          case !settings.enabled ? "Habilitar la entrada de nuevas cuentas" : "Deshabilitar la entrada de nuevas cuentas":
          {
              client.settings.set(message.guild.id, !settings.enabled, `antinewaccount.enabled`)
              let thesettings = client.settings.get(message.guild.id, `antinewaccount`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`${thesettings ? `Activación de la detección de cuentas nuevas` : `Detección de cuentas nuevas deshabilitada`}`)
                .setColor(es.color)
                .setDescription(`${thesettings ? `Ahora expulsaré las cuentas nuevas si fueron creadas antes ${duration(thesettings.delay).map(i => `\`${i}\``).join(", ")} hace!` : `Ahora ya no expulsaré las cuentas nuevas!`}`.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
          }
          break;
          case "Establecer mensaje extra":
            {
              let extramessage = settings.extra_message;
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`Cuál debería ser el nuevo Mensaje Extra?`)
                .setColor(es.color)
                .addField(`**Mensaje extra actual:**`, `${extramessage && extramessage.length > 1 ? extramessage : "No se proporciona ningún mensaje extra"}`.substring(0, 1024))
                .setDescription(`Send it now!`).setFooter(client.getFooter(es))]
              })
              await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var message = collected.first();
                  if(!message) return message.reply("NO SE ENVÍA NINGÚN MENSAJE");
                  if(message.content){
                    extramessage = message.content.slice(0, 1024);
                    client.settings.set(message.guild.id, extramessage, `antinewaccount.extra_message`)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`Definido el nuevo mensaje extra!`)
                      .setColor(es.color)
                      .addField(`**Nuevo mensaje extra:**`, `${extramessage && extramessage.length > 1 ? extramessage : "No se proporciona ningún mensaje extra"}`.substring(0, 1024))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  else{
                    return message.reply("No se ha añadido contenido al mensaje");
                  }
                })
                .catch(e => {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Algo salió mal`)
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
            }
          break;
          case "Mostrar configuración":
            {
              let thesettings = client.settings.get(message.guild.id, `antinewaccount`)
              const extramessage = thesettings.extra_message;
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`Ajustes de la configuración de la detección de nuevas cuentas`)
                .setColor(es.color)
                .setDescription(`**Habilitado:**\n> ${thesettings.enabled ? "✅" : "❌"}\n\n**Fecha mínima de la cuenta:**\n> ${duration(thesettings.delay).map(i => `\`${i}\``).join(", ")}\n\n**Acción:**\n> ${thesettings.action}`.substring(0, 2048))
                .addField(`**Mensaje extra actual:**`, `${extramessage && extramessage.length > 1 ? extramessage : "No se proporciona ningún mensaje extra"}`.substring(0, 1024))
                .setFooter(client.getFooter(es))
              ]});
            }
          break;
        
          case "Seleccione la Acción": {
            let menuoptions = [
              {
                value: "Kick",
                description: `Expulsar nuevos miembros`,
                emoji: "✅"
              },
              {
                value: "Ban",
                description: `Ban nuevos miembros`,
                emoji: "🔨"
              },
              {
                value: "Cancel",
                description: `Cancelar y detener el Anti-New-Account-Setup!`,
                emoji: "862306766338523166"
              }
            ]
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection') 
              .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Click en mi y seleccione el tipo de acción') 
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
              .setAuthor('Anti-New-Account', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/hammer_1f528.png', 'https://arcticbot.xyz/discord')
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
                client.settings.set(message.guild.id, menu?.values[0], `antinewaccount.action`)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(`Se ha establecido con éxito la nueva acción para: ${menu?.values[0]}`)
                  .setColor(es.color)
                  .setDescription(`Ahora voy a ${menu?.values[0]} nuevos miembros, cuya cuenta es demasiado joven!`.substring(0, 2048))
                  .setFooter(client.getFooter(es))
                ]});
              }
              else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
            });
          }break;
          case "Establecer la duración": {
            let extramessage = settings.extra_message;
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`Cuál debe ser la nueva edad mínima de la cuenta?`)
                .setColor(es.color)
                .addField(`**Edad mínima actual de la cuenta:**`, `${duration(settings.delay).map(i => `\`${i}\``).join(", ")}`.substring(0, 1024))
                .setDescription(`Envíalo ahora!\nEjemplo: \`2 Dias\`, \`6 horas + 2 Dias\``).setFooter(client.getFooter(es))]
              })
              await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var message = collected.first();
                  if(!message) return message.reply("NO SE ENVÍA NINGÚN MENSAJE");
                  if(message.content){
                    let gargs = message.content.split("+");
                    let time = 0;
                    for(const a of gargs){
                      time += ms(a.split(" ").join(""))
                    }
                    if(!time || isNaN(time)) return message.reply("Has añadido una Hora no válida!");
                    
                    client.settings.set(message.guild.id, time, `antinewaccount.delay`)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`Definida la nueva duración mínima de la cuenta!`)
                      .setColor(es.color)
                      .addField(`**Nueva edad mínima de la cuenta:**`, `${duration(time).map(i => `\`${i}\``).join(", ")}`.substring(0, 1024))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  else {
                    return message.reply("Sin contenido de mensajes y por tanto sin tiempo añadido");
                  }
                })
                .catch(e => {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Algo salió mal`)
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
          }
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
      ]});
    }
  },
};
