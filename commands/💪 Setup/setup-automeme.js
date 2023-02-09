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
  name: "setup-automeme",
  category: "💪 Configurar",
  aliases: ["setupautomeme", "cmdlog", "automeme-setup", "automemesetup"],
  cooldown: 5,
  usage: "setup-automeme  --> Sigue los pasos",
  description: "Esta configuración le permite enviar registros a un canal específico, cuando alguien entra en el comando: informe",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Activar Auto-Meme",
            description: `Definir el canal Auto-Meme`,
            emoji: "✅"
          },
          {
            value: "Desactivar Auto-Meme",
            description: `Deshabilitar el Auto-Meme del Administrador`,
            emoji: "❌"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar la configuración del Auto-Meme`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener la configuración automática de la memoria!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el sistema automatizado de memes!') 
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
        .setAuthor('Configuración automática de MEME', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/whatsapp/302/clown-face_1f921.png', 'https://arcticbot.xyz/discord')
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
        switch (optionhandletype){
          case "Activar Auto-Meme": { 
            let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable6"])).setFooter(client.getFooter(es))
            ]})
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply( "NO SE ENVÍA NINGÚN MENSAJE");
                let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if(channel){
                  client.settings.set(message.guild.id, channel.id, `automeme`)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable7"]))
                    .setColor(es.color)
                    .setDescription(`Publicando ahora, cada minuto`.substring(0, 2048))
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
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Desactivar Auto-Meme": { 
            client.settings.set(message.guild.id, "no", `automeme`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable9"]))
              .setColor(es.color)
              .setDescription(`Ya no enviaré imágenes automáticas de memes a un canal`.substring(0, 2048))
              .setFooter(client.getFooter(es))
            ]});
          }break;
          case "Mostrar configuración": { 
            let thesettings = client.settings.get(message.guild.id, `automeme`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable10"]))
              .setColor(es.color)
              .setDescription(`**Canal:** ${thesettings == "no" ? "no configurado" : `<#${thesettings}> | \`${thesettings}\``}\n\n**Cooldown:** 1 Minuto`.substring(0, 2048))
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
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable12"]))
      ]});
    }
  },
};
