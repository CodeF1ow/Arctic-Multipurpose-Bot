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
  name: "setup-admincmdlog",
  category: "💪 Configurar",
  aliases: ["setupadmincmdlog", "cmdlog", "admincmdlog-setup", "admincmdlogsetup"],
  cooldown: 5,
  usage: "setup-admincmdlog  --> Sigue los pasos",
  description: "Activar/desactivar el registro de ejecuciones de comandos de administración",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Enable Log",
            description: `Definir el canal de registro de comandos`,
            emoji: "✅"
          },
          {
            value: "Disable Log",
            description: `Desactivar el registro de comandos de administración`,
            emoji: "❌"
          },
          {
            value: "Show Settings",
            description: `Mostrar la configuración del registro de comandos de administración`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancela y detiene el Admin-Command-Log-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el registro de comandos de administración') 
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
          .setAuthor('Admin Setup', 'https://cdn.discordapp.com/emojis/892521772002447400.png?size=96', 'https://arcticbot.xyz/discord')
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
          case "Enable Log":
            {
              var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable4"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable5"])).setFooter(client.getFooter(es))
            ]})
            var thecmd;
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(async collected => {
              var message = collected.first();
              if(!message) return message.reply( "NO SE ENVÍA NINGÚN MENSAJE");
              if(message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first()){
                client.settings.set(message.guild.id, message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first().id, `adminlog`)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable6"]))
                  .setColor(es.color)
                  .setDescription(`Si alguien ejecuta un comando de administración, se enviará una información en ese canal`.substring(0, 2048))
                  .setFooter(client.getFooter(es))]
                });
              }
              else{
                return message.reply( "NO HAY NINGÚN CANAL QUE HAYA SIDO PINGADO");
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
          case "Disable Log":
            {
              client.settings.set(message.guild.id, "no", `adminlog`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable8"]))
                .setColor(es.color)
                .setDescription(`Si alguien ejecuta un comando de administración, no se enviará ninguna información.`.substring(0, 2048))
                .setFooter(client.getFooter(es))]
              });
            }
          break;
          case "Show Settings":
            {
              let thesettings = client.settings.get(message.guild.id, `adminlog`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable9"]))
                .setColor(es.color)
                .setDescription(`**Canal:** ${thesettings == "no" ? "No se ha configurado" : `<#${thesettings}> | \`${thesettings}\``}`.substring(0, 2048))
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
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-admincmdlog"]["variable11"]))
      ]});
    }
  },
};
