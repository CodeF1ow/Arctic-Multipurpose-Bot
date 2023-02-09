var {
  MessageEmbed, MessageMentions
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
  name: "setup-joinvc",
  category: "💪 Configurar",
  aliases: ["setupjoinvc", "joinvc-setup"],
  cooldown: 5,
  usage: "setup-joinvc  --> ​Siga los pasos",
  description: "Defina un canal en el que cada mensaje se sustituya por un EMBED o desactive esta función",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {//ensure the database
      client.joinvc.ensure(message.guild.id, {
        vcmessages: [
          /*
           {
            channelId: "",
            textChannelId: "",
            message: "",
           }
          */
        ],
        vcroles: [
          /*
            {
              channelId: "",
              roleId: "",
            }
          */
        ],
      })
      first_layer()
      async function first_layer(){
        let menuoptions = [{
            value: "Enviar mensaje en un canal",
            description: `Enviar un mensaje al unirse, y editarlo al salir`,
            emoji: "895066899619119105"
          },
          {
            value: "Añadir / Eliminar Rol",
            description: `Añadir un rol al entrar, quitarlo al salir.`,
            emoji: "895066900105674822"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener la instalación!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de canales de voz') 
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
          .setAuthor('Únase al sistema de canales de voz', 'https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96', 'https://arcticbot.xyz/discord')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
          .addField("Enviar mensaje en un canal", `Si un usuario se une a un canal específico, enviará un mensaje definible (E.J, Ping para el rol(es)) en un Canal definido.\nEsto es útil si tienes un canal de sala de espera, y es necesario para comprobar si un usuario se une a él o no con pings!\n*Después de salir del Canal, el mensaje enviado se edita y elimina el ping*`)
          .addField("Añadir / Eliminar Rol", `Si un usuario se une a un canal de voz él/ella obtendrá un rol específico, este rol se eliminará de nuevo, si él/ella deja el canal de voz!`)        
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
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype){
          case "Enviar mensaje en un canal":{
            second_layer()
            async function second_layer(){
              let menuoptions = [{
                  value: "Añadir un canal de voz",
                  description: `Añadir un canal de voz y mensaje a enviar.`,
                  emoji: "✅"
                },
                {
                  value: "Elimina un canal de voz",
                  description: `Eliminar un canal de voz ya añadido.`,
                  emoji: "❌"
                },
                {
                  value: "Mostrar todos los canales de voz",
                  description: `Mostrar todos los canales de configuración!`,
                  emoji: "📑"
                },
                {
                  value: "Cancel",
                  description: `Cancelar y Detener la instalación!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haga clic en mí para configurar el sistema canales de voz') 
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
                .setAuthor('Sistema canales de voz', 'https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96', 'https://arcticbot.xyz/discord')
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
                  handle_the_picks2(menu?.values[0], menuoptiondata)
                }
                else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
              });
            }
            async function handle_the_picks2(optionhandletype, menuoptiondata) {
              switch (optionhandletype){
                case "Añadir un canal de voz": {
                  let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`**Qué canal quieres añadir??**`)
                    .setColor(es.color)
                    .setDescription(`Por favor, haga ping al **CANAL DE VOZ** ahora! / Enviar el **ID** el **Talk**!\nY añadir el **LOG_CHANNEL** VIA ID / PING después!\nY luego agrega el Mensaje al final!\n\n**Examples:**\n> \`#VoiceChannel #TextChannel @Voice-Support Alguien se unió al Soporte de Voz, revisa el Embed!\`\n> \`901905221851156552 901904924709908540 @Voice-Support Alguien se unió al Soporte de Voz, revisa el Embed!\``)
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                      let ChannelRegex = message.content.match(MessageMentions.CHANNELS_PATTERN)?.map(r => message.guild.channels.cache.get(r.replace(/[<@&#>]/igu, "")))
                      var Voicechannel = ChannelRegex && ChannelRegex.length >= 1 ? ChannelRegex[0] : message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      var Textchannel = ChannelRegex && ChannelRegex.length >= 2 ? ChannelRegex[1] : message.guild.channels.cache.get(message.content.trim().split(" ")[1]);
                      if(!Voicechannel || !Textchannel || Voicechannel.type != "GUILD_VOICE" || Textchannel.type != "GUILD_TEXT") return message.reply(":x: **Compruebe el ejemplo en el Embed, tipo de entrada incorrecta!**")
                      try {
                        let a = client.joinvc.get(message.guild.id, "vcmessages")
                        //remove invalid ids
                        for(const vc of a){
                          if(!message.guild.channels.cache.get(vc.channelId)){
                            client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcmessages")
                          }
                          if(!message.guild.channels.cache.get(vc.textChannelId)){
                            client.joinvc.remove(message.guild.id, d => d.textChannelId == vc.textChannelId, "vcmessages")
                          }
                        }
                        a = client.joinvc.get(message.guild.id, "vcmessages")
                        if(a.map(d => d.channelId).includes(Voicechannel.id))
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`❌ This Channel is already Setupped!`)
                            .setDescription(`Remove it first with \`${prefix}setup-joinvc\` --> A continuación, elija los mensajes del canal de voz --> A continuación, elija Eliminar!`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        var args = message.content.split(" ").slice(2);
                       
                        client.joinvc.push(message.guild.id, { channelId: Voicechannel.id, textChannelId: Textchannel.id, message: args.join(" ") }, "vcmessages")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`​✔️ Ahora enviaré mensajes después de que alguien se una al canal de voz \`${Voicechannel.name}\` en el TextChannel **${Textchannel.name}**`)
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
                case "Elimina un canal de voz": {
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
                      var Voicechannel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id && ch.type == "GUILD_VOICE").first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      if(!Voicechannel || Voicechannel.type != "GUILD_VOICE") return message.reply(":x: **Compruebe el ejemplo en el Embed, tipo de entrada incorrecta!**")
                      try {
                        let a = client.joinvc.get(message.guild.id, "vcmessages")
                        //remove invalid ids
                        for(const vc of a){
                          if(!message.guild.channels.cache.get(vc.channelId)){
                            client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcmessages")
                          }
                          if(!message.guild.channels.cache.get(vc.textChannelId)){
                            client.joinvc.remove(message.guild.id, d => d.textChannelId == vc.textChannelId, "vcmessages")
                          }
                        }
                        a = client.joinvc.get(message.guild.id, "vcmessages")
                        if(!a.map(d => d.channelId).includes(Voicechannel.id))
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`❌ Este canal aún no ha sido configurado!`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        client.joinvc.remove(message.guild.id, d => d.channelId == Voicechannel.id, "vcmessages")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`​✔️ Eliminado con éxito **${Voicechannel.name}** fuera de la configuración!`)
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
                case "Mostrar todos los canales de voz": {
                  let a = client.joinvc.get(message.guild.id, "vcmessages")
                  //remove invalid ids
                  for(const vc of a){
                    if(!message.guild.channels.cache.get(vc.channelId)){
                      client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcmessages")
                    }
                    if(!message.guild.channels.cache.get(vc.textChannelId)){
                      client.joinvc.remove(message.guild.id, d => d.textChannelId == vc.textChannelId, "vcmessages")
                    }
                  }
                  a = client.joinvc.get(message.guild.id, "vcmessages")

                  message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`📑 Ajustes del sistema de mensajes entradas a canales de voz`)
                    .setColor(es.color)
                    .setDescription(`**Dónde se envía un mensaje de VOZ:**\n${a.map(d => `<#${d.channelId}> [Enviar: <#${d.textChannelId}>]`).join("\n")}`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  })
                }break;
              }
            }
          }break;
          case "Añadir / Eliminar Rol":{
            second_layer()
            async function second_layer(){
              let menuoptions = [{
                  value: "Añadir un canal de voz",
                  description: `Añadir un canal de voz y un rol para añadir/eliminar.`,
                  emoji: "✅"
                },
                {
                  value: "Elimina un canal de voz",
                  description: `Eliminar un canale de voz ya añadido.`,
                  emoji: "❌"
                },
                {
                  value: "Mostrar todos los canales de voz",
                  description: `Mostrar todos los canales de configuración!`,
                  emoji: "📑"
                },
                {
                  value: "Cancel",
                  description: `Cancelar y detener la instalación!`,
                  emoji: "862306766338523166"
                }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection') 
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haga clic en mí para configurar el sistema Join VC') 
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
                .setAuthor('Únase al sistema VC', 'https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96', 'https://arcticbot.xyz/discord')
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
                  handle_the_picks2(menu?.values[0], menuoptiondata)
                }
                else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
              });
            }
            async function handle_the_picks2(optionhandletype, menuoptiondata) {
              switch (optionhandletype){
                case "Añadir un canal de voz": {
                  let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`**Which Channel do you wanna add?**`)
                    .setColor(es.color)
                    .setDescription(`Por favor, haz ping al **canal de voz** ahora! / Envíe el **ID** el **Talk**!\nY añadir el **RIKE** en VIA ID / PING después!\n\n**Ejemplos:**\n> \`#VoiceChannel @Role-For-VoiceChannel\``)
                    .setFooter(client.getFooter(es))]
                  })
                  await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 90000,
                      errors: ["time"]
                    })
                    .then(collected => {
                      var message = collected.first();
                      var Voicechannel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id && ch.type == "GUILD_VOICE").first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      var Role = message.mentions.roles.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.roles.cache.get(message.content.trim().split(" ")[1]);
                      if(!Voicechannel || !Role) return message.reply(":x: **Compruebe el ejemplo en el Embed, tipo de entrada incorrecta!**")
                      
                      if (message.guild.me.roles.highest.rawPosition <= Role.rawPosition)
                        return message.reply({embeds: [new MessageEmbed()
                          .setColor(es.wrongcolor)
                          .setFooter(client.getFooter(es))
                          .setTitle("No puedo dar/quitar este Rol, porque es superior/igual a mi Rol más alto")
                        ]});
                      try {
                        let a = client.joinvc.get(message.guild.id, "vcroles")
                        //remove invalid ids
                        for(const vc of a){
                          if(!message.guild.channels.cache.get(vc.channelId)){
                            client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcroles")
                          }
                          if(!message.guild.roles.cache.get(vc.roleId)){
                            client.joinvc.remove(message.guild.id, d => d.roleId == vc.roleId, "vcroles")
                          }
                        }
                        a = client.joinvc.get(message.guild.id, "vcroles")
                        if(a.map(d => d.channelId).includes(Voicechannel.id))
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`❌ Este canal ya está configurado!`)
                            .setDescription(`Remove it first with \`${prefix}setup-joinvc\` --> A continuación, elija VOZ ROLES --> A continuación, elija Remove!`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        client.joinvc.push(message.guild.id, { channelId: Voicechannel.id, roleId: Role.id }, "vcroles")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`​✔️ Ahora voy a añadir el rol \`${Role.name}\` cuando alguien se une a la canal de voz **${Discord.VoiceChannel.name}**`)
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
                case "Elimina un canal de voz": {
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
                      var Voicechannel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id && ch.type == "GUILD_VOICE").first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                      if(!Voicechannel || Voicechannel.type != "GUILD_VOICE") return message.reply(":x: **Compruebe el ejemplo en el Embed, tipo de entrada incorrecta!**")
                      try {
                        let a = client.joinvc.get(message.guild.id, "vcroles")
                        //remove invalid ids
                        for(const vc of a){
                          if(!message.guild.channels.cache.get(vc.channelId)){
                            client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcroles")
                          }
                          if(!message.guild.roles.cache.get(vc.roleId)){
                            client.joinvc.remove(message.guild.id, d => d.roleId == vc.roleId, "vcroles")
                          }
                        }
                        a = client.joinvc.get(message.guild.id, "vcroles")
                        if(!a.map(d => d.channelId).includes(Voicechannel.id))
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`❌ Este canal aún no ha sido configurado!`)
                            .setColor(es.color)
                            .setFooter(client.getFooter(es))
                          ]});
                        client.joinvc.remove(message.guild.id, d => d.channelId == Voicechannel.id, "vcroles")
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`​✔️ Eliminado con éxito **${Voicechannel.name}** fuera de la configuración!`)
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
                case "Mostrar todos los canales de voz": {
                  let a = client.joinvc.get(message.guild.id, "vcroles")
                  //remove invalid ids
                  for(const vc of a){
                    if(!message.guild.channels.cache.get(vc.channelId)){
                      client.joinvc.remove(message.guild.id, d => d.channelId == vc.channelId, "vcroles")
                    }
                    if(!message.guild.roles.cache.get(vc.roleId)){
                      client.joinvc.remove(message.guild.id, d => d.roleId == vc.roleId, "vcroles")
                    }
                  }
                  a = client.joinvc.get(message.guild.id, "vcroles")

                  message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`📑 Configuración del sistema Join Voz-Rol`)
                    .setColor(es.color)
                    .setDescription(`**Dónde añado un rol voz:**\n${a.map(d => `<#${d.channelId}> [Rol: <@&${d.roleId}>]`).join("\n")}`.substring(0, 2000))
                    .setFooter(client.getFooter(es))]
                  })
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
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable26"]))
      ]});
    }
  },
};

