var {
  MessageEmbed, MessageSelectMenu, MessageActionRow
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var fs = require("fs");
var {
  databasing,
} = require(`${process.cwd()}/handlers/functions`);
const twitconfig = require("../../social_log/twitter.json");
const Twit = require('twit');
module.exports = {
  name: "setup-twitter",
  category: "💪 Configurar",
  aliases: ["setuptwitter", "twitter-setup"],
  cooldown: 5,
  usage: "setup-twitter  --> ​Siga los pasos",
  description: "Gestionar los 2x sistemas de Twitter (establecer el canal, establecer el twitter)",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {



      var timeouterror;
      first_layer()
      async function first_layer() {
        let menuoptions = [{
            value: "Establecer cuenta de Twitter",
            description: `Definir qué cuenta de Twitter postear`,
            emoji: "840255600851812393"
          },
          {
            value: "Establecer el canal de los posts",
            description: `Definir un canal para publicar los mensajes!`,
            emoji: "895066899619119105"
          },
          {
            value: "Fijar el mensaje de publicación",
            description: `Mostrar la configuración del registro de comandos de administración`,
            emoji: "💬"
          },
          {
            value: `${client.social_log.get(message.guild.id, `twitter.REETWET`) ? "Deshabilitar Retweets" : "Habilitar Retweets"}`,
            description: `Mostrar la configuración del registro de comandos de administración`,
            emoji: `${client.social_log.get(message.guild.id, `twitter.REETWET`) ? "❌" : "✅"}`
          },
          {
            value: "Configuración manual",
            description: `Forzar la configuración del nombre e identificación de la ONU si lo normal no es válido`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancela y Detiene el Admin-Command-Log-Setup!`,
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
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))

        //define the embed
        let MenuEmbed = new MessageEmbed()
          .setColor(es.color)
          .setAuthor('Configuración de Twitter', 'https://cdn.discordapp.com/emojis/840255600851812393.png?size=96', 'https://arcticbot.xyz/discord')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(" ")[0]
            handle_the_picks(menu?.values[0], SetupNumber, menuoptiondata)
          } else menu?.reply({
            content: `❌ No está permitido hacer eso! Sólo: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`
          })
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, menuoptiondata) {
        switch (optionhandletype) {
          case "Establecer cuenta de Twitter": {
            var username;
            var userid;
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable10"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable11"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var twitlink = collected.first().content;
                if (!String(twitlink).toLowerCase().includes("https")) {
                  timeouterror = "ENLACE INVÁLIDO";
                  return message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable12"]));
                }
                if (!String(twitlink).toLowerCase().includes("twitter")) {
                  timeouterror = "ENLACE INVÁLIDO";
                  return message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable13"]));
                }
                username = twitlink.replace("https://twitter", "").split("/")[1];
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable14"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });

            var T = new Twit({
              consumer_key: twitconfig.consumer_key,
              consumer_secret: twitconfig.consumer_secret,
              access_token: twitconfig.access_token,
              access_token_secret: twitconfig.access_token_secret,
              timeout_ms: twitconfig.timeout_ms,
              strictSSL: twitconfig.strictSSL,
            })
            await T.get('users/search', {
              q: `${username}`,
              count: 1
            }, function (err, data, response) {
              if (err) return message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable15"]))
              var user = data[0];
              if (!user) return message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable16"]))
              userid = user.id_str;
              var TwitterName = user.screen_name;
              try {
                client.social_log.set(message.guild.id, userid, `twitter.TWITTER_USER_ID`)
                client.social_log.set(message.guild.id, username, `twitter.TWITTER_USER_NAME_ONLY_THOSE`)
                //require("../../social_log/twitterfeed").creat_twit(client);
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable17"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable18"]))
                    .addField(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variablex_19"]), eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable19"]))
                    .setURL(`https://twitter.com/${TwitterName}`)
                    .setFooter(client.getFooter(es))
                  ]
                });
              } catch (e) {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable20"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable28"]))
                    .setFooter(client.getFooter(es))
                  ]
                });
              }
            })
          }
          break;
        case "Establecer el canal de los posts": {
          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable22"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable23"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
              if (channel) {
                try {
                  client.social_log.set(message.guild.id, channel.id, `twitter.DISCORD_CHANNEL_ID`)
                  //require("../../social_log/twitterfeed").creat_twit(client);
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable24"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable25"]))
                      .addField(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variablex_26"]), eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable26"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } catch (e) {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable27"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable36"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else {
                throw "No has hecho ping a un canal válido"
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable29"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });

            })
        }
        break;
        case "Fijar el mensaje de publicación": {

          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable30"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable31"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              try {
                client.social_log.set(message.guild.id, collected.first().content, `twitter.infomsg`)
                //require("../../social_log/twitterfeed").creat_twit(client);
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable32"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable33"]))
                    .setColor(es.color)
                    .addField(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variablex_34"]), eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable34"]))
                    .setFooter(client.getFooter(es))
                  ]
                });

              } catch (e) {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable35"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable49"]))
                    .setFooter(client.getFooter(es))
                  ]
                });
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable37"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            })
        }
        break;
        case `${client.social_log.get(message.guild.id, `twitter.REETWET`) ? "Disable Retweets" : "Enable Retweets"}`: {
          client.social_log.set(message.guild.id, !client.social_log.get(message.guild.id, `twitter.REETWET`), `twitter.REETWET`)
          //require("../../social_log/twitterfeed").creat_twit(client);
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable38"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable39"]))
              .setColor(es.color)
              .addField(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variablex_40"]), eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable40"]))
              .setFooter(client.getFooter(es))
            ]
          });
        }
        break;
        case "Manual Setup": {
          var tempmsg = await message.reply({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable41"]))
              .setColor(es.color)
              .setURL("https://tweeterid.com")
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable42"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(async collected => {
              try {
                client.social_log.set(message.guild.id, collected.first().content, `twitter.TWITTER_USER_ID`)
                //require("../../social_log/twitterfeed").creat_twit(client);
                message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(`​✔️ Set the TWITTER USER ID TO: \`${collected.first().content}\``.substring(0, 256))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable43"]))
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  ]
                });

                var tempmsg = await message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable44"]))
                    .setColor(es.color)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable45"]))
                    .setFooter(client.getFooter(es))
                  ]
                })
                await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    try {
                      client.social_log.set(message.guild.id, collected.first().content, `twitter.TWITTER_USER_NAME_ONLY_THOSE`)
                      //require("../../social_log/twitterfeed").creat_twit(client);
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(`​✔️ Set the TWITTER USER Name TO: \`${collected.first().content}\``.substring(0, 256))
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable46"]))
                          .setColor(es.color)
                          .addField(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variablex_47"]), eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable47"]))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    } catch (e) {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable48"]))
                          .setColor(es.wrongcolor)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable52"]))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  })
                  .catch(e => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable50"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  })
              } catch (e) {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable51"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable55"]))
                    .setFooter(client.getFooter(es))
                  ]
                });
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-twitter"]["variable53"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });

            })
        }
        break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
        ]
      });
    }
  },
};
