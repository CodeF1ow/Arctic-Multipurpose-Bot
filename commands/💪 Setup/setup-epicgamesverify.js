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
  name: "setup-epicgamesverify",
  category: "💪 Configurar",
  aliases: ["setupepicgamesverify", "epicgamesverify-setup", "epicgamesverifysetup"],
  cooldown: 5,
  usage: "setup-epicgamesverify  --> Sigue los pasos",
  description: "Configurar un sistema de verificación de Epic Games para su servidor para organizar eventos y jugar mejor juntos!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Habilitar la verificación",
            description: `Definir el canal para el proceso de verificación`,
            emoji: "✅"
          },
          {
            value: "Habilitar registro",
            description: `Definir el canal de registro de comandos`,
            emoji: "✅"
          },
          {
            value: "Desactivar el registro",
            description: `Disable the Action Log`,
            emoji: "❌"
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
          .setPlaceholder('Haga clic en mí para configurar el Epic Games Verify') 
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
          .setAuthor('Epic Games verifica la configuración', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/882px-Epic_Games_logo.svg.png', 'https://arcticbot.xyz/discord')
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
        client.epicgamesDB.ensure(message.guild.id, { 
            logChannel: "",
            verifychannel: "",
        });
        switch (optionhandletype) {
          case "Habilitar la verificación":
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
                var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first();
                
                channel.send({
                  embeds: [
                    new MessageEmbed().setColor(es.color).setFooter(message.guild.name + " | By: https://arcticbot.xyz/discord", message.guild.iconURL({dynamic: true})).setThumbnail(es.thumb ? message.guild.iconURL({dynamic: true}) : null)
                    .setTitle(`Haz clic en el botón para verificar y vincular tu cuenta de Epic Games`)
                    .setDescription(`Si haces clic en el botón puedes verificar tu cuenta de Epic Games en este servidor!\nPuede hacer clic de nuevo para cambiar los datos de su cuenta!`)
                  ],
                  components: [
                    new MessageActionRow().addComponents([
                      new MessageButton().setCustomId("epicgamesverify").setStyle("PRIMARY").setLabel("Verificar").setEmoji("✋")
                    ])
                  ]
                });

                client.epicgamesDB.set(message.guild.id, channel.id, `verifychannel`)
                
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Habilitado el sistema de verificación!")
                  .setColor(es.color)
                  .setDescription(`Ahora los usuarios pueden verificar su cuenta de Epic Games en <#${channel.id}>\n> Si lo desea, puede editar el Embed allí ejecutando el \`${prefix}editembed\` Command!`.substring(0, 2048))
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
          break;case "Habilitar registro":
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
              client.epicgamesDB.set(message.guild.id, message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first().id, `logChannel`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Habilitado el registro")
                .setColor(es.color)
                .setDescription(`Ahora registraré todas las Acciones en <#${message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first().id}>`.substring(0, 2048))
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
          case "Desactivar el registro":
            {
              client.epicgamesDB.set(message.guild.id, "", `logChannel`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("Deshabilitado el canal de registro")
                .setColor(es.color)
                .setFooter(client.getFooter(es))]
              });
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
