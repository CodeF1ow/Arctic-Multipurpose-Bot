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
  name: "setup-mute",
  category: "💪 Configurar",
  aliases: ["setupmute", "mute-setup", "mutesetup"],
  cooldown: 5,
  usage: "setup-mute  --> Sigue los pasos",
  description: "Configurar el rol/tiempo de espera del sistema de silenciamiento y el tiempo por defecto si no se agrega tiempo",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    client.settings.ensure(message.guild.id, {
      style: "timeout",
      roleId: "",
      defaultTime: 60000, // in ms  
    }, "mute")
    const menusettings = client.settings.get(message.guild.id, "mute");
    try {


      /*
        mute: {
          style: "timeout",
          roleId: "",
          defaultTime: 60000,  
        },
      */
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Alternar el estilo",
            description: `Alternar el estilo de ${menusettings.style} to ${menusettings.style === "timeout" ? "role" : "timeout"}`,
            emoji: "✅"
          },
          {
            value: "Selecciona el Mute-Role",
            description: `Defina el Mute-Role`,
            emoji: "895066900105674822"
          },
          {
            value: "Establecer la hora predeterminada",
            description: `Cambiar el tiempo de silencio por defecto`,
            emoji: "⏲️"
          },
          {
            value: "Mostrar configuración",
            description: `Mostrar la configuración del sistema de silenciamiento`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener la configuración del sistema de silenciamiento!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haga clic en mí para configurar el Sistema de Silenciamiento') 
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
          .setAuthor('Sistema de Mute', 'https://cdn.discordapp.com/emojis/771804364582420532.gif?size=96', 'https://arcticbot.xyz/discord')
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
          case "Alternar el estilo": {
            const newStyle = menusettings.style == "timeout" ? "role" : "timeout";
            client.settings.set(message.guild.id, newStyle, "mute.style");
            return message.reply(`Ha cambiado con éxito el estilo de ${menusettings.style} to ${newStyle}`);
          }break;
          case "Selecciona el Mute-Role": {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Qué rol debo añadir cuando alguien es silenciado y el estilo de silenciamiento == \"role\"")
              .setColor(es.color)
              .setDescription("Haga ping al rol ahora, o envíe el id del mismo!").setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO SE ENVÍA NINGÚN MENSAJE");
                let role = message.mentions.roles.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.roles.cache.get(message.content.trim().split(" ")[0]);
                if(role){
                  client.settings.set(message.guild.id, role.id, `mute.roleId`)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle("Establecer la función de silencio (MUTE)")
                    .setColor(es.color)
                    .setDescription(`Ahora voy a utilizar la función <@&${role.id}> si el estilo de silenciamiento se establece el "rol"`.substring(0, 2048))
                    .setFooter(client.getFooter(es))
                  ]});
                }
                else{
                  return message.reply( "NO HAY NINGÚN CANAL QUE HAYA SIDO PINGUEADO");
                }
              })
              .catch(e => {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Establecer la hora predeterminada":
            {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Cuál debería ser el nuevo tiempo de silencio por defecto, cuando no se añade ningún tiempo?")
              .setColor(es.color)
              .setDescription("Recomendado is: `10min`, pero puedes enviar lo que quieras, siempre que sea menos de `1Week`!\nPara enviar varios haga lo siguiente: `1hour+5min`").setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id == message.author.id, 
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                if(!message) return message.reply("NO SE ENVÍA NINGÚN MENSAJE");
                const ms = require("ms");

                let time = 0;
                if(message.includes("+")) {
                  for(const m of message.split("+")){
                    try {
                      time+= ms(m)
                    }catch{
                      time = null;
                    }
                  }
                } else {
                  try {
                    time = ms(message)
                  }catch{
                    time = null;
                  }
                }
                if(!time || time < 0 || time > ms("1 Week")) {
                  return message.reply("Se ha añadido un tiempo inválido. Debe ser más de 0 y menos de 1 semana")
                }
                client.settings.set(message.guild.id, time, `mute.defaultTime`)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("Establezca el nuevo TIEMPO DE SILENCIO POR DEFECTO")
                  .setColor(es.color)
                  .setDescription(`Cuando se silencia a alguien y no se agrega tiempo, esto se utilizará!`.substring(0, 2048))
                  .setFooter(client.getFooter(es))
                ]});
              })
              .catch(e => {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable8"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelación de la operación!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }
          break;
          case "Mostrar configuración":
            {
              let thesettings = client.settings.get(message.guild.id, `aichat`)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-aichat"]["variable10"]))
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
        .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
      ]});
    }
  },
};

