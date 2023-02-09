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
  name: "setup-autobackup",
  category: "💪 Configurar",
  aliases: ["setupautobackup", "setup-backup", "setupbackup", "autobackup-setup", "autobackupsetup"],
  cooldown: 5,
  usage: "setup-autobackup  --> Sigue los pasos",
  description: "Habilitar/Deshabilitar las copias de seguridad automatizadas de este servidor (una copia de seguridad / 2 días)",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      
      
      if(!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
        return message.reply("❌​ **Me falta el permiso de ADMINISTRADOR!**")
      }
      let owner = await message.guild.fetchOwner().catch(e=>{
          return message.reply("No se pudo conseguir el dueño del servidor objetivo")
      })
      if(owner.id != cmduser.id) {
          return message.reply(`❌​ **Tiene que ser el propietario de este servidor!**`)
      }
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Habilitado`" : "`❌ Deshabilitado`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: !client.settings.get(message.guild.id, "autobackup") ? "Habilitar las copias de seguridad automáticas" : "Deshabilitar las copias de seguridad automáticas",
            description: !client.settings.get(message.guild.id, "autobackup") ? "Haga una copia de seguridad cada dos días" : "No haga más copias de seguridad automáticas del servidor",
            emoji: !client.settings.get(message.guild.id, "autobackup") ? "833101995723194437" : "833101993668771842"
          },
          {
            value: "Cancel",
            description: `Cancela y detiene la configuración de Anti-Caps!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Haga clic en mí para configurar el sistema anti-capas!').setCustomId('MenuSelection') 
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
          .setAuthor("Configuración del sistema de copia de seguridad automática", 
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/floppy-disk_1f4be.png",
          "https://arcticbot.xyz/discord")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable1"]))
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
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "autobackup"), "autobackup");
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(client.settings.get(message.guild.id, "autobackup") ? "Habilitadas las copias de seguridad automáticas" : "Copias de seguridad automáticas deshabilitadas")
              .setColor(es.color)
              .setDescription(`${client.settings.get(message.guild.id, "autobackup") ? `Ahora haré una copia de seguridad cada dos días!\nLas copias de seguridad antiguas se eliminarán automáticamente!\n\nPara ver las copias de seguridad utilice el botón: \`${prefix}listbackups ${message.guild.id}\` Command\n\nPara cargar la última copia de seguridad utilice el \`${prefix}loadbackup ${message.guild.id} 0\` Comandos` : `Ya no haré copias de seguridad automáticas cada 2 días!\n\nPara crear copias de seguridad manualmente utilice: \`${prefix}createbackup`}`.substring(0, 2048))
              .setFooter(client.getFooter(es))]
            });
          }
          else menu?.reply({content: `❌​ No está permitido hacer eso! Sólo: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `​✔️ **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
        });
      }


      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable13"]))]
      });
    }
  },
};

