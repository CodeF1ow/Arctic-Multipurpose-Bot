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
  name: "setup-reactionrole",
  category: "💪 Configurar",
  aliases: ["setupreactionrole", "setup-react", "setupreact", "reactionrolesetup", "reactionrole-setup", "react-setup", "reactsetup"],
  cooldown: 5,
  usage: "setup-reactionrole --> seguir los pasos",
  description: "Crear roles de reacción o eliminar todos los roles de reacción activos.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      var rembed = new MessageEmbed()
      .setColor(es.color)
      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable2"]))
      .setDescription(`
**Cómo configurar la función de reacción de los bots de clan!**
> 1. Reaccionar al mensaje __ABAJO__ **este** mensaje

> 2. A continuación, aparece un nuevo mensaje. Después de eso, usted puede hacer PING al ROL para el EMOJI de la reaccion

> 3. Proceso 1... continúa, escriba \`finish\` para terminar el proceso (o simplemente no reaccionar)

> 4. Una vez que haya terminado:

> 4.1 Le preguntaré qué tipo de rol para la reacción desea asignar.!
 | - **Múltiples** = *puedes tener todas las opciones de reacción posibles!*
 | - **Solo** = *Sólo una función al mismo tiempo!*
> 4.2 Se le pedirá el TÍTULO de la función de reacción, que es necesario!
> 4.3 A continuación, introduce en qué canal quieres que aparezca tu Rol de Reacción. Sólo tienes que hacer un ping! \`#chat\`
> 4.4 Después de eso, el Rol de Reacción se enviara, con la información para cada Parámetro: \`EMOJI = ROL\`, se enviará en su canal deseado y funcionará!

*Tienes 30 segundos para cada entrada!*
`)
      
      .setFooter(client.getFooter(es))
    message.reply({embeds: [rembed]})
    var objet = {
      MESSAGE_ID: "",
      remove_others: false,
      Parameters: []
    };
    var counters = 0;
    ask_emoji()

    function ask_emoji() {
      counters++;
      if (counters.length === 21) return finished();
      var object2 = {
        Emoji: "",
        Emojimsg: "",
        Role: ""
      };
      var rermbed = new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable3"]))
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable4"]))
      var cancel = false;
      message.reply({embeds: [rermbed]}).then(msg => {
        msg.awaitReactions({ filter: (reaction, user) => user.id == message.author.id, 
          max: 1,
          time: 180e3
        }).then(collected => {
          if (collected.first().emoji?.id  && collected.first().emoji?.id.length > 2) {
            msg.delete();
            object2.Emoji = collected.first().emoji?.id ;
            if (collected.first().emoji?.animated)
              object2.Emojimsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
            else
              object2.Emojimsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
            return ask_role();
          } else if (collected.first().emoji?.name) {
            msg.delete();
            object2.Emoji = collected.first().emoji?.name;
            object2.Emojimsg = collected.first().emoji?.name;
            return ask_role();
          } else {
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable5"])});
            return finished();
          }
        }).catch(() => {
          if (!cancel) {
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable6"])});
            return finished();
          }
        });
        msg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
          max: 1,
          time: 180e3
        }).then(collected => {
          if (collected.first().content.toLowerCase() === "finish") {
            cancel = true;
            return finished();
          }
        }).catch(() => {
          if (!cancel) {
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable7"])});
            return finished();
          }
        });
      })

      function ask_role() {
        counters++;
        var rermbed = new MessageEmbed()
          .setColor(es.color)
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable8"]))
        message.reply({embeds: [rermbed]}).then(msg => {
          msg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
            max: 1,
            time: 180e3
          }).then(collected => {
            var role = collected.first().mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
            if (!role) message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable9"])})
            if (role) {

              object2.Role = role.id;
              objet.Parameters.push(object2)


              try {
                msg.delete();
              } catch {}
              try {
                msg.channel.bulkDelete(1);
              } catch {}

              return ask_emoji();
            } else {
              message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable10"])});
              return finished();
            }
          }).catch((e) => {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable11"])});
            return finished();
          });
        })
      }
    }


    function finished() {
      message.reply({embeds: [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable12"]))
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable13"]))]}).then(msg => {
        var emojis2 = ["1️⃣", "2️⃣"]
        for (var emoji of emojis2) msg.react(emoji)
        msg.awaitReactions({ filter: (reaction, user) => user.id === message.author.id && emojis2.includes(reaction.emoji?.name),
          max: 1,
          time: 120000,
          erros: ["time"]
        }).then(collected => {
          switch (collected.first().emoji?.name) {
            case "1️⃣":
              break;
            case "2️⃣":
              objet.remove_others = true;
              break;
            default:
              message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable14"])})
              break;
          }


          var thisembed = new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable15"]))
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable16"]))
          message.reply({
            content: `Utilizaré **${objet.remove_others ? "Solo": "Múltiples"}** Opción de reacción!\n`,
            embeds: [thisembed]
          }).then(msg => {
            msg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
              max: 1,
              time: 120000,
              errors: ["TIME"]
            }).then(collected => {
              var title = String(collected.first().content).substring(0, 256);

              message.reply({embeds: [new MessageEmbed()
                .setColor(es.color)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable17"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable18"]))
              ]}).then(msg => {
                msg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                  max: 1,
                  time: 120000,
                  errors: ["TIME"]
                }).then(collected => {

                  if (collected.first().mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first()) {

                    var channel = collected.first().mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first();
                    var embed = new MessageEmbed().setColor(es.color).setTitle(title.substring(0, 256)).setFooter(message.guild.name, message.guild.iconURL({
                      dynamic: true
                    }))
                    var buffer = "";
                    for (var i = 0; i < objet.Parameters.length; i++) {
                      try {
                        buffer += objet.Parameters[i].Emojimsg + "  **==**  <@&" + objet.Parameters[i].Role + ">\n";
                      } catch (e) {
                        console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      }
                    }
                    channel.send({embeds: [embed.setDescription(buffer)]}).then(msg => {
                      for (var i = 0; i < objet.Parameters.length; i++) {
                        try {
                          msg.react(objet.Parameters[i].Emoji).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
                        } catch (e) {
                          console.log(e.stack ? String(e.stack).grey : String(e).grey)
                        }
                      }
                      objet.MESSAGE_ID = msg.id;
                      client.reactionrole.push(message.guild.id, objet, "reactionroles");
                      message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable19"])})
                    })

                  } else {
                    message.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable20"])});
                    return;
                  }
                }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
              })
            }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
          })
        }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
      })
    }
  
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-reactionrole"]["variable22"]))
      ]});
    }
  },
};

