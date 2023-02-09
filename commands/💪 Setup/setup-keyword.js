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
  name: "setup-keyword",
  category: "💪 Configurar",
  aliases: ["setupkeyword", "keyword-setup", "setup-keyword"],
  cooldown: 5,
  usage: "setup-keyword  --> ​Siga los pasos",
  description: "Definir mensajes de palabras clave, de modo que si alguien envía un mensaje que contenga esa palabra clave, el bot responderá con el mensaje definido.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      var originalowner = message.author.id;
      let timeouterror;
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        let menuoptions = [{
            value: "Crear palabra clave",
            description: `Cree una palabra clave de su elección`,
            emoji: "✅"
          },
          {
            value: "Eliminar la palabra clave",
            description: `Borrar una de las palabras clave`,
            emoji: "❌"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar todas las palabras clave!`,
            emoji: "📑"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema automatizado de incrustación!') 
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
        .setAuthor('Configuración de palabras clave', 'https://images-ext-1.discordapp.net/external/HF-XNy3iUP4D95zv2fuTUy1csYWuNa5IZj2HSCSkvhs/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/flexed-biceps_1f4aa.png', 'https://arcticbot.xyz/discord')
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
            used1 = true;
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype){ // return message.reply
          case "Crear palabra clave": {
            if (client.keyword.get(message.guild.id, "commands").length > 24)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable5"]))
            .setColor(es.wrongcolor)
            .setDescription(`No puede tener más de **24** palabras clave`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
        var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable6"]))
          .setColor(es.color)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable7"]))
          .setFooter(client.getFooter(es))]
        })
        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
            max: 1,
            time: 120000,
            errors: ["time"]
          })
          .then(async collected => {
            var msg = collected.first().content.split(" ")[0];
            if (msg) {
              var thekeyword = {
                name: msg,
                output: "ye",
                embeds: false,
                channels: [],
                aliases: []
              }
              tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable8"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable9"]))
                .setFooter(client.getFooter(es))
              ]})
              await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                  max: 1,
                  time: 120000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var msg = collected.first().content;
                  if (msg) {
                    thekeyword.output = msg;
                    tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable10"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable11"]))
                      .setFooter(client.getFooter(es))
                    ]})
                    await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                        max: 1,
                        time: 120000,
                        errors: ["time"]
                      })
                      .then(async collected => {
                        var channel = collected.first().mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first();
                        if (channel) {
                          for (const ch of collected.first().mentions.channels.map(este_código_es_por_Kiri86_8565 => este_código_es_por_Kiri86_8565)) {
                            
                            thekeyword.channels.push(ch.id)
                          }
                          tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable12"]))
                            .setColor(es.color)
                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable13"]))
                            .setFooter(client.getFooter(es))
                          ]})
                          await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                              max: 1,
                              time: 120000,
                              errors: ["time"]
                            })
                            .then(async collected => {
                              if (collected.first().content.toLowerCase() == "noalias") {

                              } else {
                                var args = collected.first().content.split(" ")
                                if (args) {
                                  for (const m of args) {
                                    thekeyword.aliases.push(m.toLowerCase())
                                  }
                                } else {
                                  timeouterror = {
                                    message: "NO HAS ENVIADO NINGÚN ALIAS"
                                  }
                                }
                              }
                              var ttempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable14"]))
                                .setColor(es.color)
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable15"]))
                                .setFooter(client.getFooter(es))
                              ]})
                              try {
                                ttempmsg.react("✅")
                                ttempmsg.react("❌")
                              } catch {

                              }
                              await ttempmsg.awaitReactions({filter: (reaction, user) => user == originalowner, 
                                  max: 1,
                                  time: 90000,
                                  errors: ["time"]
                                })
                                .then(collected => {
                                  var reaction = collected.first();
                                  if (reaction) {
                                    if (reaction.emoji?.name == "✅") {
                                      thekeyword.embed = true;
                                    } else {
                                      thekeyword.embed = false;
                                    }

                                    client.keyword.push(message.guild.id, thekeyword, "commands")

                                    message.reply({embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable16"]))
                                      .setColor(es.color)
                                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable17"]))
                                      .setFooter(client.getFooter(es))
                                    ]})

                                    if (reaction.emoji?.name == "✅") {
                                      message.reply({embeds: [new Discord.MessageEmbed()
                                        .setColor(es.color)
                                        .setDescription(thekeyword.output.replace("{member}", `<@${message.author.id}>`))
                                        .setFooter(client.getFooter(es))
                                      ]})
                                    } else {
                                      message.reply(thekeyword.output.replace("{member}", `<@${message.author.id}>`))
                                    }


                                  } else {
                                    return message.reply( "no has hecho ping a un canal válido")
                                  }
                                })
                                .catch(e => {
                                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                  return message.reply({embeds: [new Discord.MessageEmbed()
                                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable18"]))
                                    .setColor(es.wrongcolor)
                                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                    .setFooter(client.getFooter(es))
                                  ]});
                                })

                            })
                            .catch(e => {
                              console.log(e.stack ? String(e.stack).grey : String(e).grey)
                              return message.reply({embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable19"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]});
                            })
                        } else {
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable20"]))
                            .setColor(es.wrongcolor)
                            .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                            .setFooter(client.getFooter(es))
                          ]});
                        }
                      })
                      .catch(e => {
                        console.log(e.stack ? String(e.stack).grey : String(e).grey)
                        return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable20"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]});
                      })


                  } else {
                    return message.reply("no has hecho ping a un canal válido")
                  }
                })
                .catch(e => {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })


            } else {
              return message.reply( "no has hecho ping a un canal válido")
            }
          })
          .catch(e => {
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable22"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelación de la operación!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});

          }break;
          case "Eliminar la palabra clave": {
            let cuc = client.keyword.get(message.guild.id, "commands");
            if(!cuc || cuc.length < 1) return message.reply(":x: There are no Custom Commands")
            let menuoptions = [
            ]
            cuc.forEach((cc, index)=>{
              menuoptions.push({
                value: `${cc.name}`.substring(0, 25),
                description: `Borrar ${cc.name} ${cc.embed ? "[✅ Embed]" : "[❌ Embed]"}`.substring(0, 50),
                emoji: NumberEmojiIds[index + 1]
              })
            })
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection') 
              .setMaxValues(cuc.length) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Seleccione todos los comandos personalizados que deben ser eliminados') 
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
            .setAuthor('Configuración de comandos personalizados', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/flexed-biceps_1f4aa.png', 'https://arcticbot.xyz/discord')
            .setDescription(`**Seleccionar todo \`Comandos personalizados\` que debería ser __borrado__**`)
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
                for(const value of menu?.values){
                  client.keyword.remove(message.guild.id, d => String(d.name).substring(0, 25).toLowerCase() == String(value).toLowerCase(), "commands")
                }
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(`Borrado ${menu?.values.length} Palabras clave!`)
                  .setDescription(`Ahora hay \`${cuc.length - menu?.values.length} Palabras clave\` a la izquierda!`)
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                ]});
              }
              else menu?.reply({content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected.first().values.length} Commands\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
            });
          }break;
          case "Mostrar configuración": {
            let cuc = client.keyword.get(message.guild.id, "commands");
            var embed = new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable22"]))
            .setColor(es.color)
            .setFooter(ee.footertext, es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL())
            var embed2 = new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable22"]))
            .setColor(es.color)
            .setFooter(ee.footertext, es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL())
            var sendembed2 = false;
            for(let i = 0; i < cuc.length; i++){
              try{
                var string = `${cuc[i].output}`;
                if(string.length > 250) string = string.substring(0, 250) + " ..."
                if(i > 13){
                  sendembed2 = true;
                  embed2.addField(`➡️ \`${cuc[i].name}\` | ${cuc[i].embed ? "✅ Embed" : "❌ Embed"}`, ">>> "+ string)
                } else 
                embed.addField(`➡️ \`${cuc[i].name}\` | ${cuc[i].embed ? "✅ Embed" : "❌ Embed"}`, ">>> "+ string)
              }catch (e){
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
              }
            }
            if(sendembed2)
              await message.reply({embeds: [embed, embed2]})
            else
              await message.reply({embeds: [embed]})
          }break;
        }
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable30"]))
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