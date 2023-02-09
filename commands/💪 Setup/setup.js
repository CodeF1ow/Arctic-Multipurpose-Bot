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
  name: "setup",
  category: "💪 Configurar",
  aliases: [""],
  cooldown: 5,
  usage: "setup  --> Sigue los pasos",
  description: "Muestra todos los comandos de configuración",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language");
    try {
      first_layer()
        async function first_layer(){
          let menuoptions = [
            {
              value: "setup-admin",
              description: `Configurar Roles/Usuarios para todos/específicos Cmds de Administración`,
              emoji: "🔨"
            },
            {
              value: "setup-admincmdlog",
              description: `Configurar un registrador de comandos de administración a un canal`,
              emoji: "📑"
            },
            {
              value: "setup-aichat",
              description: `Configurar un divertido sistema de chat AI para chatear conmigo`,
              emoji: "💬"
            },
            {
              value: "setup-anticaps",
              description: `Configurar un sistema Anit-CAPS para evitar los mensajes sólo en mayúsculas`,
              emoji: "🅰️"
            },
            {
              value: "setup-antidiscord",
              description: `Establecer un sistema Anit-DISCORD para evitar los DC-LINKS`,
              emoji: "787321652345438228"
            },
            {
              value: "setup-antilink",
              description: `Configurar un sistema Anit-LINK para evitar los ENLACES`,
              emoji: "🔗"
            },
            {
              value: "setup-antinuke",
              description: `Establecer un sistema Anit-NUKE para evitar las NUKES`,
              emoji: "866089515993792522"
            },
            {
              value: "setup-apply",
              description: `Configurar hasta 25 sistemas de aplicación diferentes`,
              emoji: "📋"
            },
            {
              value: "setup-autodelete",
              description: `Configurar el borrado automático Canales`,
              emoji: "🗑️"
            },
            {
              value: "setup-autoembed",
              description: `Definir canal(es) para sustituir los mensajes por EMBEDS`,
              emoji: "📰"
            },
            {
              value: "setup-automeme",
              description: `Definir un canal para publicar MEMES cada minuto`,
              emoji: "862749865460498524"
            },
            {
              value: "setup-blacklist",
              description: `Gestionar la lista de palabras (Blacklist)`,
              emoji: "🔠"
            },
            {
              value: "setup-commands",
              description: `Habilitar/deshabilitar comandos específicos`,
              emoji: "⚙️"
            },
            {
              value: "setup-counter",
              description: `Configurar un divertido canal contador de números`,
              emoji: "#️⃣"
            },
            {
              value: "setup-customcommand",
              description: `Configurar hasta 25 comandos personalizados diferentes`,
              emoji: "⌨️"
            },
            {
              value: "setup-dailyfact",
              description: `Configurar un Canal para publicar Hechos diarios`,
              emoji: "🗓"
            },
            {
              value: "setup-embed",
              description: `Configurar el aspecto de los mensajes incrustados`,
              emoji: "📕"
            },
            {
              value: "setup-jtc",
              description: `Configurar el(los) canal(es) de unión para crear`,
              emoji: "🔈"
            },
            {
              value: "setup-keyword",
              description: `Configure hasta 25 mensajes de palabras clave diferentes`,
              emoji: "📖"
            },
            {
              value: "setup-language",
              description: `Gestionar el lenguaje del bot`,
              emoji: "🇪🇸"
            },
            {
              value: "setup-leave",
              description: `Gestionar los mensajes de baja`,
              emoji: "📤"
            },
            {
              value: "setup-logger",
              description: `Configurar el registro de auditoría`,
              emoji: "🛠"
            },
            {
              value: "setup-membercount",
              description: `Configurar hasta 25 contadores de socios diferentes`,
              emoji: "📈"
            },
            {
              value: "setup-radio",
              description: `Configuración del sistema de radio/sala de espera`,
              emoji: "📻"
            },
            {
              value: "setup-rank",
              description: `Configurar el sistema de clasificación`,
              emoji: "📊"
            },
            {
              value: "setup-reactionrole",
              description: `Configurar roles de reacción infinitos`,
              emoji: "📌"
            },
            {
              value: "setup-reportlog",
              description: `Configurar el sistema de informes y el canal`,
              emoji: "🗃"
            },
            {
              value: "setup-roster",
              description: `Configurar el sistema de listas`,
              emoji: "📜"
            },
            {
              value: "setup-serverstats",
              description: `Configurar hasta 25 contadores de socios diferentes`,
              emoji: "📈"
            },
            {
              value: "setup-suggestion",
              description: `Configurar el sistema de sugerencias`,
              emoji: "💡"
            },
            {
              value: "setup-ticket",
              description: `Configurar hasta 25 sistemas de Tickets diferentes`,
              emoji: "📨"
            },
            {
              value: "setup-tiktok",
              description: `Configure hasta 3 canales diferentes de TikTok Logger`,
              emoji: "840503976315060225"
            },
            {
              value: "setup-twitch",
              description: `Configura hasta 5 canales diferentes de Twitch Logger`,
              emoji: "840260133753061408"
            },
            {
              value: "setup-twitter",
              description: `Configurar hasta 2 canales diferentes de Twitter Logger`,
              emoji: "840255600851812393"
            },
            {
              value: "setup-validcode",
              description: `Configurar el sistema de códigos válidos`,
              emoji: "858405056238714930"
            },
            {
              value: "setup-warn",
              description: `Configurar los ajustes del sistema de alerta`,
              emoji: "🚫"
            },
            {
              value: "setup-welcome",
              description: `Configurar el sistema de Bienvenida/Mensajes`,
              emoji: "📥"
            },
            {
              value: "setup-youtube",
              description: `Configurar hasta 5 canales diferentes de Youtube Logger`,
              emoji: "🚫"
            },
          ]
          let Selection1 = new MessageSelectMenu()
            .setPlaceholder('Haga clic en mí para configurar el (1/3) Sistemas [A-C]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index < Math.ceil(menuoptions.length/3)){
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if(option.emoji) Obj.emoji = option.emoji;
              return Obj;
              }
           }).filter(Boolean))
          let Selection2 = new MessageSelectMenu()
            .setPlaceholder('Haga clic en mí para configurar el (2/3) Sistemas [C-R]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index >= Math.ceil(menuoptions.length/3) && index < 2*Math.ceil(menuoptions.length/3)){
                let Obj = {
                  label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                  value: option.value.substring(0, 50),
                  description: option.description.substring(0, 50),
                }
                if(option.emoji) Obj.emoji = option.emoji;
                return Obj;
              }
           }).filter(Boolean))
          let Selection3 = new MessageSelectMenu()
            .setPlaceholder('Haga clic en mí para configurar el (3/3) Sistemas [R-Z]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index >= 2*Math.ceil(menuoptions.length/3)){
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
            if(option.emoji) Obj.emoji = option.emoji;
            return Obj;
              }
           }).filter(Boolean))
          //define the embed
          let MenuEmbed1 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Configuración-Sistemas | (1/3) [A-C]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://arcticbot.xyz/discord")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable1"]))
          let MenuEmbed2 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Configuración-Sistemas | (2/3) [C-R]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://arcticbot.xyz/discord")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable2"]))
          let MenuEmbed3 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Configuración-Sistemas | (3/3) [R-Z]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://arcticbot.xyz/discord")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable3"]))
          //send the menu msg
          let menumsg1 = await message.reply({embeds: [MenuEmbed1], components: [new MessageActionRow().addComponents(Selection1)]})
          let menumsg2 = await message.reply({embeds: [MenuEmbed2], components: [new MessageActionRow().addComponents(Selection2)]})
          let menumsg3 = await message.reply({embeds: [MenuEmbed3], components: [new MessageActionRow().addComponents(Selection3)]})
          //function to handle the menuselection
          function menuselection(menu) {
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
            menu?.deferUpdate();
            handle_the_picks(menuoptionindex, menuoptiondata)
          }
          //Event
          client.on('interactionCreate',  (menu) => {
            if (menu?.message.id === menumsg1.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg1.edit({components: [], embeds: menumsg1.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
            }
            if (menu?.message.id === menumsg2.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg2.edit({components: [], embeds: menumsg2.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
            }
            if (menu?.message.id === menumsg3.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg3.edit({components: [], embeds: menumsg3.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
            }
          });
        }

        async function handle_the_picks(menuoptionindex, menuoptiondata) {
          require(`./${menuoptiondata.value.toLowerCase()}`).run(client, message, args, cmduser, text, prefix);
        }
      } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable10"]))
      ]});
    }
  },
};

