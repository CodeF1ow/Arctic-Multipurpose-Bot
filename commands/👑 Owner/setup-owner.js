var {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow, MessageButton
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fs = require('fs');
var {
  databasing,
  isValidURL
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "setup-owner",
  category: "👑 Dueño",
  aliases: ["setup-owners", "setupowner", "setupowners"],
  cooldown: 5,
  type: "info",
  usage: "setup-owner  -->  Siga los pasos",
  description: "Cambiar los propietarios de los bots",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable2"]))
      ]});
    try {

      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: `Añadir propietario`,
            description: `Añadir otro Propietario al Bot!`,
            emoji: emoji.react.SUCCESS
          },
          {
            value: `Retirar al propietario`,
            description: `Eliminar un propietario del Bot! (Sólo el propietario original puede hacerlo)`,
            emoji: emoji.react.ERROR
          },
          {
            value: "Settings",
            description: `Mostrar la configuración actual`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener la configuración de la publicidad!`,
            emoji: "833101993668771842"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar los Propietarios!')
          .addOptions(menuoptions.map(option => {
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
        .setAuthor('Configuración del propietario', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/prohibited_1f6ab?.png',  'https://arcticbot.xyz/discord')
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable4"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.channel.send({embeds : [MenuEmbed], components: [new MessageActionRow().addComponents([Selection])]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["owner"]["setup-advertise"]["variable5"]))
          menu?.deferUpdate();
          used1 = true;
          handle_the_picks(menuoptionindex, menuoptiondata)
        }
        //Event
        client.on('interactionCreate',  (menu) => {
          if (menu?.message.id === menumsg.id) {
            if (menu?.user.id === cmduser.id) {
              if(used1) return menu?.reply({content : `❌​ Ya ha seleccionado algo, esta selección está desactivada!`, ephermal : true});
              menuselection(menu);
            }
            else menu?.reply({content : `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephermal : true});
          }
        });
      }

      const d2p = (bool) => bool ? "`✔️ Activado`" : "`❌ Desactivado`"; 
      const d2p2 = (bool) => bool ? "`✔️ Si`" : "`❌ No`"; 

      async function handle_the_picks(menuoptionindex, menuoptiondata) {
        switch (menuoptionindex) {
          //add
          case 0: {

            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable7"]))
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable8"]))
              .setFooter(client.getFooter(es))
            ]})
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var message = collected.first();
                var user = message.mentions.users.first();
                if (user) {
                  if (config.ownerIDS.includes(user.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                  ]});
                  try {
                    let status = config
                    status.ownerIDS.push(user.id);
                    fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                      if (e) {
                        console.log(e.stack ? String(e.stack).dim : String(e).dim);
                        return message.channel.send({embeds: [new MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor(es.wrongcolor)
                          .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable10"]))
                          .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable11"]))
                        ]})
                      }
                      return message.channel.send({embeds: [new MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable12"]))
                      ]})
                    });
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable13"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable14"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  throw "no has hecho ping a un usuario válido"
                }
              })
              .catch(e => {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable15"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })    
          } break;
          //remove
          case 1: {
            if(config.ownerIDS[0] != message.author.id && config.ownerIDS[1] != message.author.id){
              return message.channel.send({embeds: [new MessageEmbed()
                .setFooter(client.getFooter(es))
                .setColor(es.wrongcolor)
                .setTitle(`No está permitido eliminar Propietarios`)
                .setDescription(`Sólo <@${config.ownerIDS[0]}> y <@${config.ownerIDS[1]}> se les permite hacer eso!`)
              ]})
            }
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Retirar al propietario")
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setDescription("Por favor, pinguee al propietario que quiere eliminar")
              .setFooter(client.getFooter(es))
            ]})
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var message = collected.first();
                var user = message.mentions.users.first();
                if (user) {
                  if (!config.ownerIDS.includes(user.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Este usuario no es propietario de un bot..")
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                  ]});
                  if(user.id == "275930607702245376"){
                    return message.channel.send({embeds: [new MessageEmbed()
                      .setFooter(client.getFooter(es))
                      .setColor(es.wrongcolor)
                      .setTitle(`No se puede eliminar!`)
                      .setDescription(`Esta es una opción de seguridad`)
                    ]})
                  }
                  if(user.id == cmduser.id){
                    return message.channel.send({embeds: [new MessageEmbed()
                      .setFooter(client.getFooter(es))
                      .setColor(es.wrongcolor)
                      .setTitle(`No puedes quitarte a ti mismo!`)
                    ]})
                  }
                  try {
                    let status = config
                    let index = status.ownerIDS.indexOf(user.id);
                    if(index > -1) {
                      status.ownerIDS.splice(index, 1);
                      fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                        if (e) {
                          console.log(e.stack ? String(e.stack).dim : String(e).dim);
                          return message.channel.send({embeds: [new MessageEmbed()
                            .setFooter(client.getFooter(es))
                            .setColor(es.wrongcolor)
                            .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable10"]))
                            .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable11"]))
                          ]})
                        }
                        return message.channel.send({embeds: [new MessageEmbed()
                          .setFooter(client.getFooter(es))
                          .setColor(es.color)
                          .setTitle(`Eliminado con éxito ${user.tag} de la lista de propietarios!`)
                        ]})
                      });
                    } else {
                      return message.channel.send({embeds: [new MessageEmbed()
                        .setFooter(client.getFooter(es))
                        .setColor(es.wrongcolor)
                        .setTitle(`No se ha podido encontrar al usuario`)
                      ]})
                    }
                    
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable13"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable14"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  throw "no has hecho ping a un usuario válido"
                }
              })
              .catch(e => {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable15"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })  
          } break;
          //settings
          case 2: {
            let originalOwner = config.ownerIDS.length > 1 ? config.ownerIDS[1] : config.ownerIDS[0]
            var embed = new MessageEmbed()
              .setTitle(`Hay ${config.ownerIDS.length} Owners`)
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .addField(`__Original Owner__:`, `<@${originalOwner}>`.substring(0, 1024))
              .addField(`__Other Owner${config.ownerIDS.filter(id => id != originalOwner).length > 1 ? "s" : ""}__:`, `${config.ownerIDS.filter(id => id != originalOwner).map(id => `<@${id}>`).join("︲")}`.substring(0, 1024))
              .setFooter(client.getFooter(es))
            return message.reply({embeds: [embed]});
          } break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable18"]))
      ]});
    }
  },
};
