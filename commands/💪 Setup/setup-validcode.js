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
  name: "setup-validcode",
  category: "💪 Configurar",
  aliases: ["setupvalidcode", "validcode-setup", "validcodesetup"],
  cooldown: 5,
  usage: "setup-validcode  --> Sigue los pasos",
  description: "Esta configuración le permite enviar registros a un canal específico, cuando alguien entra en el comando: Reporte",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      
      
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Habilitado`" : "`❌ Deshabilitado`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `${client.settings.get(message.guild.id, `validcode`) ? "Deshabilitado" : "Habilitado"} Código válido`,
            description: client.settings.get(message.guild.id, `validcode`) ? "No haga nada con los mensajes que contengan código" : "Reaccionar a los mensajes que contienen un fragmento de código válido",
            emoji: client.settings.get(message.guild.id, `validcode`) ? "833101993668771842" : "833101995723194437"
          },
          {
            value: "Settings",
            description: `Mostrar la configuración actual del sistema de códigos válidos`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancelar y detener el Ticket-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Click me to setup the Valid-Code System!').setCustomId('MenuSelection') 
          .setMaxValues(1).setMinValues(1) 
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
          .setAuthor("Configuración del sistema de códigos válidos", 
          "https://cdn.discordapp.com/emojis/858405056238714930.gif?v=1",
          "https://arcticbot.xyz/discord")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable1"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable2"]))
          menu?.deferUpdate(); used1 = true;
          handle_the_picks(menuoptionindex, menuoptiondata)
        }
        //Event
        client.on('interactionCreate',  (menu) => {
          if (menu?.message.id === menumsg.id) {
            if (menu?.user.id === cmduser.id) {
              if(used1) return menu?.reply({content: `❌​ Ya ha seleccionado algo, esta selección está deshabilitada!`, ephemeral: true})
              menuselection(menu);
            }
            else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
          }
        });
      }

      //THE FUNCTION TO HANDLE THE SELECTION PICS
      async function handle_the_picks(menuoptionindex, menuoptiondata) {
        switch(menuoptionindex){
          case 0: {
            client.settings.set(message.guild.id, !client.settings.get(message.guild.id, `validcode`), `validcode`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable3"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]});
          }
          case 1: {
            let thesettings = client.settings.get(message.guild.id, `validcode`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable4"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable5"]))
              .setFooter(client.getFooter(es))
            ]});
          }
        }

      }

      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable6"]))
      ]});
    }
  },
};
