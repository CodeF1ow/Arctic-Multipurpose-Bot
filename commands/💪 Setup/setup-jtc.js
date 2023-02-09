var { MessageEmbed } = require("discord.js");
var Discord = require("discord.js");
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
    name: "setup-jtc",
    category: "💪 Configurar",
    aliases: ["setup-jointocreate", "setupjtc", "setupjointocreate", "jtc-setup", "jtcsetup"],
    cooldown: 5,
    usage: "setup-jtc  -->  Follow Steps",
    description: "Gestiona 25 sistemas diferentes de Join to Create",
    type: "system",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    var timeouterror;
    try{
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        
        let menuoptions = [ ]
        for(let i = 0; i < 100; i++){
          menuoptions.push({
            value: `${i + 1} Sistema Join-To-Create`,
            description: `Gestionar/Editar la ${i + 1} Configuracion Join-to-Create`,
            emoji: NumberEmojiIds[i + 1]
          })
        }
        
        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema Join-to-Create!')
          .addOptions(
            menuoptions.slice(0, 25).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row2 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection2')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema Join-to-Create!')
          .addOptions(
            menuoptions.slice(25, 50).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row3 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection3')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema Join-to-Create!')
          .addOptions(
            menuoptions.slice(50, 75).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row4 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection4')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema Join-to-Create!')
          .addOptions(
            menuoptions.slice(75, 100).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor('Configuracion Join-to-Create', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/291/studio-microphone_1f399-fe0f.png', 'https://arcticbot.xyz/discord')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [row1, row2, row3, row4]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          menu?.deferUpdate();
          let SetupNumber = menu?.values[0].split(" ")[0]
          second_layer(SetupNumber, menuoptiondata)
        }
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
            menuselection(menu)
          }
          else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }
      async function second_layer(SetupNumber, menuoptiondata)
      {
        var pre = `jtcsettings${SetupNumber}`
        let thedb = client.jtcsettings;
        thedb?.ensure(message.guild.id, {
          channel: "",
          channelname: "{user}' Salón",
          guild: message.guild.id,
        }, pre);
        let menuoptions = [
          {
            value: "Crear una configuración de canal",
            description: `Crear un canal de unión para crear`,
            emoji: "⚙️"
          },
          {
            value: "Utilizar el canal actual",
            description: `Utiliza tu VC conectado como una nueva configuración`,
            emoji: "🎙️"
          },
          {
            value: "Cambiar los nombres temporales",
            description: `Cambiar los nombres temporales de los nuevos VCS`,
            emoji: "😎"
          },
          {
            value: "Cancel",
            description: `Cancelar y Detener el Ticket-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder(`Haga clic en mí para gestionar el ${SetupNumber} Sistema Join-To-Create!\n\n**Has elegido:**\n> ${menuoptiondata.value}`)
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
        .setAuthor(client.getAuthor(SetupNumber + " Configuracion de Join-to-Create", 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/291/studio-microphone_1f399-fe0f.png', 'https://arcticbot.xyz/discord'))
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //function to handle the menuselection
        function menuselection(menu) {
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
          menu?.deferUpdate();
          handle_the_picks(menu?.values[0], SetupNumber, thedb, pre)
        }
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menuselection(menu)
          }
          else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, SetupNumber, thedb, pre){
        switch (optionhandletype) {
          case "Crear una configuración de canal": {
            var maxbitrate = 96000;
            var boosts = message.guild.premiumSubscriptionCount;
            if (boosts >= 2) maxbitrate = 128000;
            if (boosts >= 15) maxbitrate = 256000;
            if (boosts >= 30) maxbitrate = 384000;
            message.guild.channels.create("Unirse para crear", {
              type: 'GUILD_VOICE',
              bitrate: maxbitrate,
              userLimit: 4,
              permissionOverwrites: [ //update the permissions
                { //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
                  id: message.guild.id,
                  allow: ['VIEW_CHANNEL', "CONNECT"],
                  deny: ["SPEAK"]
                },
              ],
            }).then(vc => {
              if (message.channel.parent) vc.setParent(message.channel.parent.id)
              message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable6"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable7"]))
              .setFooter(client.getFooter(es))
              ]});
              thedb?.set(message.guild.id, vc.id, `${pre}.channel`);
            })
          } break;
          case "Utilizar el canal actual": {
            var {
              channel
            } = message.member.voice;
            if (!channel) return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable8"]))
                .setColor(es.wrongcolor)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable9"]))
                .setFooter(client.getFooter(es))
              ]});
              message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable10"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable11"]))
                .setFooter(client.getFooter(es))
              ]});
              thedb?.set(message.guild.id, channel.id, `${pre}.channel`);
          } break;
          case "Cambiar los nombres temporales": {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable12"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable13"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                thedb?.set(message.guild.id, `${collected.first().content}`.substring(0, 32), pre+".channelname");
                message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable14"]))
                  .setColor(es.color)
                  .setDescription(`**Nuevo nombre del canal:**\n> \`${thedb?.get(message.guild.id, pre+".channelname")}\`\n\n**Cómo podría ser:**\n> \`${thedb?.get(message.guild.id, pre+".channelname").replace("{user}", `${message.author.username}`)}\``)
                  .setFooter(client.getFooter(es))
                ]});
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable16"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
          } break;
        }
      }
        

    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-jtc"]["variable45"]))
        ]});
    }
  }
}


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