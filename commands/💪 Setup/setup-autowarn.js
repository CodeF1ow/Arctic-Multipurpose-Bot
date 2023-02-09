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
  name: "setup-autowarn",
  category: "💪 Configurar",
  aliases: ["setupautowarn", "autowarn-setup", "autowarnsetup", "autowarnsystem"],
  cooldown: 5,
  usage: "setup-autowarn --> seguir los pasos",
  description: "Habilitado/Deshabilitado Auto-Warn-Rules, en mis sistemas de seguridad, como antispam, anticaps, antilinks, blacklist y más!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      client.settings.ensure(message.guild.id,{
          autowarn: {
              antispam: false,
              antiselfbot: false,
              antimention: false,
              antilinks: false,
              antidiscord: false,
              anticaps: false,
              blacklist: false,
              ghost_ping_detector: false,
          }
      })
      first_layer()
      async function first_layer(){
        function getMenuOptions(){
         
          return [
            {
              label: "Anti Spam",
              value: `antispam`,
              description: `${client.settings.get(message.guild.id, "autowarn.antispam") ? "Deshabilitar el aviso automático si alguien hace spam": "Habilitado el aviso automático si alguien hace spam"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antispam") ? "❌": "✅"}`,
            },
            {
              label: "Anti Mention",
              value: `antimention`,
              description: `${client.settings.get(message.guild.id, "autowarn.antimention") ? "Deshabilitar el aviso automático si alguien menciona": "Habilitado el aviso automático si alguien menciona"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antimention") ? "❌": "✅"}`,
            },
            {
              label: "Anti Links",
              value: `antilinks`,
              description: `${client.settings.get(message.guild.id, "autowarn.antilinks") ? "Deshabilitar el aviso automático si alguien envía enlaces": "Habilitado el aviso automático si alguien envía enlaces"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antilinks") ? "❌": "✅"}`,
            },
            {
              label: "Anti Discord",
              value: `antidiscord`,
              description: `${client.settings.get(message.guild.id, "autowarn.antidiscord") ? "Deshabilitado el aviso automático si alguien envía enlaces de Discord": "Habilitado el aviso automático si alguien Links de Discord"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antidiscord") ? "❌": "✅"}`,
            },
            {
              label: "Anti Caps",
              value: `anticaps`,
              description: `${client.settings.get(message.guild.id, "autowarn.anticaps") ? "Deshabilitar el aviso automático si alguien envía MAYUSCULAS": "Habilitado el aviso automático si alguien envía MAYUSCULAS"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.anticaps") ? "❌": "✅"}`,
            },
            {
              label: "Blacklist",
              value: `blacklist`,
              description: `${client.settings.get(message.guild.id, "autowarn.blacklist") ? "Deshabilitar el aviso automático si alguien envía palabras de la blacklist": "Habilitado para avisar automáticamente si alguien envía una palabra de la blacklist"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.blacklist") ? "❌": "✅"}`,
            },
            {
              label: "Ghost Ping Detector",
              value: `ghost_ping_detector`,
              description: `${client.settings.get(message.guild.id, "autowarn.ghost_ping_detector") ? "Deshabilitar el aviso automático si alguien hace pings fantasma": "Habilitado el aviso automático si alguien hace pings fantasma"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.ghost_ping_detector") ? "❌": "✅"}`,
            },
            {
              label: "Anti Self Bot",
              value: `antiselfbot`,
              description: `${client.settings.get(message.guild.id, "autowarn.antiselfbot") ? "Deshabilitar el Detector de Bots": "Habilitado el autodetector de bots"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antiselfbot") ? "❌": "✅"}`,
            },
          ]
        }
        let menuoptions = getMenuOptions();
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(menuoptions.length) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Seleccione todas las reglas de aviso automático que desee activar/desactivar') 
          .addOptions(menuoptions)
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor('Configuración de la alerta automática', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/prohibited_1f6ab?.png', 'https://arcticbot.xyz/discord')
          .setDescription('***Seleccione todas las reglas de aviso automático que desee activar/desactivar en la `Selección` de abajo!***\n> *Las Advertencias sólo se aplicarán, si el Sistema responsable de ello, está habilitado!*\n> **Debe seleccionar al menos 1 o más!**')
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        const collector = menumsg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author.id == client.user.id, time: 180e3, max: 1 });
        collector.on("collect", async b => {
          if(b?.user.id !== message.author.id)
          return b?.reply({content: ":x: Sólo el que ha escrito el comando puede seleccionar Cosas!", ephemeral: true});
       
          let enabled = 0, disabled = 0;
          for(const value of b?.values) {
            console.log(value)
            let oldstate = client.settings.get(message.guild.id, `autowarn.${value.toLowerCase()}`);
            if(!oldstate) enabled++;
            else disabled++;
            client.settings.set(message.guild.id, !oldstate, `autowarn.${value.toLowerCase()}`)
          }
          b?.reply(`​✔️ **\`Habilitado ${enabled} Reglas de aviso automático\` y \`Deshabilitado ${disabled} Reglas de aviso automático\` de \`${b?.values.length} reglas de aviso automático seleccionadas\`**`)
        })
        collector.on('end', collected => {
          menumsg.edit({content: ":x: Se ha agotado el tiempo/se ha terminado la entrada Cancelado", embeds: [
            menumsg.embeds[0]
              .setDescription(`${getMenuOptions().map(option => `> ${option.emoji == "✅" ? "❌": "✅"} **${option.value}-Reglas de aviso automático**: ${option.description.includes("disabled") ? `\`Ahora esta Deshabilitado [❌]\`` : `\`Ahora está Habilitado [✅]\``}`).join("\n\n")}`)
          ], components: []}).catch((e)=>{})
        });
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable40"]))
      ]});
    }
  },
};

