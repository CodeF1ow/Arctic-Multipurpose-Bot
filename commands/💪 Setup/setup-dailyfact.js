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
  name: "setup-dailyfact",
  category: "💪 Configurar",
  aliases: ["setupdailyfact", "cmdlog", "dailyfact-setup", "dailyfactsetup"],
  cooldown: 5,
  usage: "setup-dailyfact  --> Sigue los pasos",
  description: "Esta configuración le permite enviar registros a un canal específico, cuando alguien entra en el comando: report",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Habilitar el hecho diario",
            description: `Definir el canal Dailyfact`,
            emoji: "✅"
          },
          {
            value: "Deshabilitar hecho diario",
            description: `Deshabilitar el Dailyfact`,
            emoji: "❌"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar la configuración del hecho diario`,
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
          .setAuthor('Configuración de los hechos diarios', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/page-with-curl_1f4c3.png', 'https://arcticbot.xyz/discord')
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
          case "Habilitar el hecho diario":
            {
              let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-dailyfact"]["variable5"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-dailyfact"]["variable6"])).setFooter(client.getFooter(es))]
              })
              await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var message = collected.first();
                  if(!message) throw "NO SE ENVÍA NINGÚN MENSAJE";
                  let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                  if(channel){
                    client.settings.set(message.guild.id, channel.id, `dailyfact`)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-dailyfact"]["variable7"]))
                      .setColor(es.color)
                      .setDescription(`Publicando ahora, todos los días`.substring(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  else{
                    message.reply( "NO HAY NINGÚN CANAL QUE HAYA SIDO PINGUEADO");
                  }
                })
                .catch(e => {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-dailyfact"]["variable8"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
            }
          break;
          case "Deshabilitar hecho diario":
            {
              client.settings.set(message.guild.id, "no", `dailyfact`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-dailyfact"]["variable9"]))
                .setColor(es.color)
                .setDescription(`Ya no enviaré hechos automáticos a un canal`.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
            }
          break;
          case "Mostrar configuración":
            {
              let thesettings = client.settings.get(message.guild.id, `dailyfact`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-dailyfact"]["variable10"]))
                .setColor(es.color)
                .setDescription(`**Canal:** ${thesettings == "no" ? "No se ha configurado" : `<#${thesettings}> | \`${thesettings}\``}\n\n**Cooldown:** 24 Horas`.substring(0, 2048))
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
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-dailyfact"]["variable12"]))
      ]});
    }
  },
};
