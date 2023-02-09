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
  name: "setup-counter",
  category: "💪 Configurar",
  aliases: ["setupcounter",  "counter-setup", "countersetup", "setup-numbercounter", "setupnumbercounter", "numbercounter-setup", "numbercountersetup"],
  cooldown: 5,
  usage: "setup-counter  --> Sigue los pasos",
  description: "Esta configuración le permite enviar registros a un canal específico, cuando alguien entra en el comando: report",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {


      first_layer()
      async function first_layer(){
        let menuoptions = [{
            value: "Habilitar contador",
            description: `Fijar un canal en el canal del contador`,
            emoji: "✅"
          },
          {
            value: "Deshabilitar el contador",
            description: `Deshabilita el sistema de contadores`,
            emoji: "❌"
          },
          {
            value: "Restablecer el número actual",
            description: `Restablece el número actual contado a 0`,
            emoji: "🗑️"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar la configuración actual!`,
            emoji: "📑"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema de contador de números!') 
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
        .setAuthor('Configuración del contador de números', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/emojidex/112/input-symbol-for-numbers_1f522.png', 'https://arcticbot.xyz/discord')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
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
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype){ // return message.reply
          case "Habilitar contador": {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-counter"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-counter"]["variable6"])).setFooter(client.getFooter(es))]
            })
            var thecmd;
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO SE ENVÍA NINGÚN MENSAJE");
                let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if(channel){
                  client.settings.set(message.guild.id, channel.id, `counter`)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-counter"]["variable7"]))
                    .setColor(es.color)
                    .setDescription(`Ahora puede contar Números en <#${channel.id}>`.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }
                else{
                  return message.reply("NO HAY NINGÚN CANAL QUE HAYA SIDO PINGADO");
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-counter"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Deshabilitar el contador": {
            client.settings.set(message.guild.id, "no", `counter`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-counter"]["variable9"]))
              .setColor(es.color)
              .setDescription(`Ya no se pueden contar los números`.substring(0, 2048))
              .setFooter(client.getFooter(es))
            ]});
          }break;
          case "Restablecer el número actual": {
            client.settings.set(message.guild.id, 0, `counternum`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-counter"]["variable10"]))
              .setColor(es.color)
              .setDescription(`La gente tiene que volver a contar desde el 1!`.substring(0, 2048))
              .setFooter(client.getFooter(es))
            ]});
          }break;
          case "Mostrar configuración": {
            let thesettings = client.settings.get(message.guild.id, `counter`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-counter"]["variable11"]))
              .setColor(es.color)
              .setDescription(`**Canal:** ${thesettings == "no" ? "No se ha configurado" : `<#${thesettings}> | \`${thesettings}\``}\n\n**Número actual:** \`${client.settings.get(message.guild.id, "counternum")}\`\n**Número siguiente:** \`${Number(client.settings.get(message.guild.id, "counternum")) + 1}\``.substring(0, 2048))
              .setFooter(client.getFooter(es))
            ]});
          }break;
        }
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-counter"]["variable13"]))
      ]});
    }
  },
};
