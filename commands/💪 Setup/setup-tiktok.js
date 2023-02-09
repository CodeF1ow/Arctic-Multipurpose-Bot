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
  name: "setup-tiktok",
  category: "💪 Configurar",
  aliases: ["setuptiktok", "tiktok-setup", "tiktoksetup"],
  cooldown: 5,
  usage: "setup-tiktok  -->  Follow Steps",
  description: "Gestionar el registrador tiktok, addstreamer, editstreamer, removestreamer, etc.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      var adminroles = client.settings.get(message.guild.id, "adminroles")


      var timeouterror = false;
      var filter = (reaction, user) => {
        return user.id === message.author.id;
      };
      var temptype = ""
      var tempmsg;
      tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable1"]))
        .setColor(es.color)
        .setDescription(`1️⃣ **== Elija** Discord **Canal** para postear los videos
        
2️⃣ **== Añadir** el canal tiktok
        
3️⃣ **== Eliminar** el canal tiktok

4️⃣ **== Editar** Canal tiktok



*Reacciona con el Emoji adecuado según la acción correcta*`).setFooter(client.getFooter(es))
      ]})
      try {
        tempmsg.react("1️⃣")
        tempmsg.react("2️⃣")
        tempmsg.react("3️⃣")
        tempmsg.react("4️⃣")
      } catch (e) {
        return message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable2"]))
          .setColor(es.wrongcolor)
          .setDescription(`\`\`\` ${e.message ? e.message : e.stack ? String(e.stack).grey.substring(0, 2000) : String(e).grey.substring(0, 2000)}\`\`\``.substring(0, 2000))
          .setFooter(client.getFooter(es))
        ]});
      }
      await tempmsg.awaitReactions({filter, 
          max: 1,
          time: 90000,
          errors: ["time"]
        })
        .then(collected => {
          var reaction = collected.first()
          reaction.users.remove(message.author.id)
          if (reaction.emoji?.name === "1️⃣") temptype = "set"
          else if (reaction.emoji?.name === "2️⃣") temptype = "add"
          else if (reaction.emoji?.name === "3️⃣") temptype = "remove"
          else if (reaction.emoji?.name === "4️⃣") temptype = "edit"
          else throw "Has reaccionado con un emoji equivocado"
        })
        .catch(e => {
          timeouterror = e;
        })
      if (timeouterror)
        return message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable3"]))
          .setColor(es.wrongcolor)
          .setDescription(`Cancelación de la operación!`.substring(0, 2000))
          .setFooter(client.getFooter(es))
        ]});
      if (temptype == "set") {

        tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable4"]))
          .setColor(es.color)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable5"]))
          .setFooter(client.getFooter(es))]
        })
        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var msg = collected.first();
            if(msg && msg.mentions.channels.filter(ch=>ch.guild.id==msg.guild.id).first()){
              client.social_log.set(message.guild.id, msg.mentions.channels.filter(ch=>ch.guild.id==msg.guild.id).first().id, "tiktok.dc_channel")
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable6"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable7"]))
                .setColor(es.color)
                .setFooter(client.getFooter(es))
              ]});
            }
            else{
              throw {
                message: "NO HAS HECHO PING A UN CANAL VÁLIDO"
              }
            }
          })
          .catch(e => {
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable8"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelación de la operación!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});

      } else if (temptype == "add") {
        if(client.social_log.get(message.guild.id, "tiktok.channels").length >= 3) 
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable9"]))
            .setColor(es.wrongcolor)
            .setDescription(`Eliminar algunos otros primero...`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
        tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable10"]))
          .setColor(es.color)
          .setDescription(`Example: https://www.tiktok.com/@kiri86`)
          .setFooter(client.getFooter(es))]
        })
        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var msg = collected.first();
            if(msg && msg.content ){
              if((msg.content.length > 0 && msg.content.length < 50) &&!msg.content.toLowerCase().includes("tiktok") && !msg.content.toLowerCase().includes("@"))
              throw {
                message: "NO HAS ENVIADO UN ENLACE DE CANAL VÁLIDO"
              }
              var Channel = msg.content.split("@")[1]
              if(Channel.includes("video")) Channel = Channel.split("/")[0]
              if(client.social_log.get(message.guild.id, "tiktok.channels").includes(Channel))
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable11"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                ]});
                client.social_log.push(message.guild.id, Channel, "tiktok.channels")

              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable12"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable13"]))
                .setColor(es.color)
                .setFooter(client.getFooter(es))
              ]});
            }
            else{
              throw {
                message: "NO HA ENVIADO UN CANAL VÁLIDO"
              }
            }
          })
          .catch(e => {
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable14"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelación de la operación!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
      } else if (temptype == "remove") {
        if(client.social_log.get(message.guild.id, "tiktok.channels").length <= 0) 
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable15"]))
            .setColor(es.wrongcolor)
            .setDescription(`Añade algunos otros primero...`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
          var buffer = "";
          var emojis = ["0️⃣", "5️⃣"]
          for(let i = 0; i< client.social_log.get(message.guild.id, "tiktok.channels").length; i++){
            buffer += `${emojis[i]} ${client.social_log.get(message.guild.id, "tiktok.channels")[i]}`
          }
          tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable16"]))
            .setColor(es.color)
            .setDescription(buffer+ "\n\n\n*Reacciona con el emoji relativo al Canal que quieres eliminar*")
            .setFooter(client.getFooter(es))]
          })
          for(const emoji of emojis){
            tempmsg.react(emoji).catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
          }
        await tempmsg.awaitReactions({ filter: (reaction, user) => user.id == message.author.id && emojis.includes(reaction.emoji?.name), 
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var channel = client.social_log.get(message.guild.id, "tiktok.channels")[emojis.findIndex(emoji => emoji == collected.first().emoji?.name)]
            
            client.social_log.remove(message.guild.id, channel, "tiktok.channels")

            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable17"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]});
          })
          .catch(e => {
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable18"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelación de la operación!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
      } else if (temptype == "edit") {
        if(client.social_log.get(message.guild.id, "tiktok.channels").length <= 0) 
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable19"]))
            .setColor(es.wrongcolor)
            .setDescription(`Añadir algunos otros primero...`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
          var buffer = "";
          var emojis = ["0️⃣", "5️⃣"]
          for(let i = 0; i< client.social_log.get(message.guild.id, "tiktok.channels").length; i++){
            buffer += `${emojis[i]} ${client.social_log.get(message.guild.id, "tiktok.channels")[i]}`
          }
          tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable20"]))
            .setColor(es.color)
            .setDescription(buffer+ "\n\n\n*Reacciona con el emoji relativo al Canal que quieres editar*")
            .setFooter(client.getFooter(es))]
          })
          for(const emoji of emojis){
            tempmsg.react(emoji).catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
          }
        await tempmsg.awaitReactions({ filter: (reaction, user) => user.id == message.author.id && emojis.includes(reaction.emoji?.name), 
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var channel = client.social_log.get(message.guild.id, "tiktok.channels")[emojis.findIndex(emoji => emoji == collected.first().emoji?.name)]
                        
            client.tiktok.ensure(channel, {
              oldvid: "",
              message: "**{videoAuthorName}** cargado \`{videoTitle}\`!\n**Mira:** {videoURL}"
            })
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable21"]))
              .setColor(es.color)
              .setDescription(`
**CURRENT MESSAGE:**
> ${client.tiktok.get(channel, "message")}`.substring(0, 2048))
.addField("**VARIABLES**",`
> \`{url}\` ... será sustituido por el vídeo **LINK**
> \`{author}\` ... será sustituido por los vídeos **Autor**
> \`{title}\` ... será sustituido por los vídeos **titulo**`)
              .setFooter(client.getFooter(es))
            ]})
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(async collected => {
              var msg = collected.first();
              if(msg && msg.content ){
                client.tiktok.set(channel, msg.content, "message")  
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable22"]))
                  .setDescription("New Message:\n" + msg.content)
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                ]});
              }
              else{
                throw {
                  message: "NO HAS ENVIADO UN CANAL VÁLIDO"
                }
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              timeouterror = e;
            })
          if (timeouterror)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable23"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelación de la operación!`.substring(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          })
          .catch(e => {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            timeouterror = e;
          })
        if (timeouterror)
          return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable24"]))
            .setColor(es.wrongcolor)
            .setDescription(`Cancelación de la operación!`.substring(0, 2000))
            .setFooter(client.getFooter(es))
          ]});
      }  else {
        return message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable25"]))
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
        ]});
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-tiktok"]["variable26"]))
      ]});
    }
  },
};

