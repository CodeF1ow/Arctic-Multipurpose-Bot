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
  name: "setup-commands",
  category: "💪 Configurar",
  aliases: ["setupcommands", "setup-command", "setupcommand"],
  cooldown: 5,
  usage: "setup-commands  --> Sigue los pasos",
  description: "Habilitar/Deshabilitar comandos específicos",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      function getMenuOptions() {
        return [
          {
            label: "ECONOMY",
            value: "ECONOMY",
            emoji: "💸",
            description: `${client.settings.get(message.guild.id, "ECONOMY") ? "❌ Deshabilitar los comandos de ECONOMÍA" : "✅ Habilitar los comandos de ECONOMÍA"}`
          },
          {
            label: "SCHOOL",
            value: "SCHOOL",
            emoji: "🏫",
            description: `${client.settings.get(message.guild.id, "SCHOOL") ? "❌ Deshabilitar los comandos de la escuela" : "✅ Habilitar los comandos de la escuela"}`
          },
          {
            label: "MUSIC",
            value: "MUSIC",
            emoji: "🎶",
            description: `${client.settings.get(message.guild.id, "MUSIC") ? "❌ Comandos de música deshabilitados" : "✅ Habilitar los comandos de música"}`
          },
          {
            label: "FILTER",
            value: "FILTER",
            emoji: "👀",
            description: `${client.settings.get(message.guild.id, "FILTER") ? "❌ Deshabilitar los comandos del FILTRO" : "✅ Habilitar los comandos del FILTRO"}`
          },
          {
            label: "CUSTOMQUEUE",
            value: "CUSTOMQUEUE",
            emoji: "⚜️",
            description: `${client.settings.get(message.guild.id, "CUSTOMQUEUE") ? "❌ Deshabilitar los comandos CUSTOM-QUEUE" : "✅ Habilitar los comandos CUSTOM-QUEUE"}`
          },
          {
            label: "PROGRAMMING",
            value: "PROGRAMMING",
            emoji: "⌨️",
            description: `${client.settings.get(message.guild.id, "PROGRAMMING") ? "❌ Deshabilitar los comandos de programación" : "✅ Habilitar comandos de programación"}`
          },
          {
            label: "RANKING",
            value: "RANKING",
            emoji: "📈",
            description: `${client.settings.get(message.guild.id, "RANKING") ? "❌ Deshabilitar los comandos de RANKING" : "✅ Habilitar los comandos de RANKING"}`
          },
          {
            label: "SOUNDBOARD",
            value: "SOUNDBOARD",
            emoji: "🔊",
            description: `${client.settings.get(message.guild.id, "SOUNDBOARD") ? "❌ Deshabilitar los comandos de SOUNDBOARD" : "✅ Habilitar los comandos de SOUNDBOARD"}`
          },
          {
            label: "VOICE",
            value: "VOICE",
            emoji: "🎤",
            description: `${client.settings.get(message.guild.id, "VOICE") ? "❌ Deshabilitar los comandos de VOZ" : "✅ Habilitar los comandos de VOZ"}`
          },
          {
            label: "FUN",
            value: "FUN",
            emoji: "🕹️",
            description: `${client.settings.get(message.guild.id, "FUN") ? "❌ Desactivar los comandos FUN" : "✅ Activar los comandos de FUN"}`
          },
          {
            label: "MINIGAMES",
            value: "MINIGAMES",
            emoji: "🎮",
            description: `${client.settings.get(message.guild.id, "MINIGAMES") ? "❌ Deshabilitar los comandos de MINIGAMES" : "✅ Habilitar los comandos de MINIGAMES"}`
          },
          {
            label: "ANIME",
            value: "ANIME",
            emoji: "😳",
            description: `${client.settings.get(message.guild.id, "ANIME") ? "❌ Deshabilitar los comandos de ANIME" : "✅ Habilitar los comandos ANIME"}`
          },
        ];
      }
      function getMenuRowComponent() { 
        let menuOptions = getMenuOptions();
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Haga clic en: activar/desactivar las categorías de comandos")
          .setMinValues(1)
          .setMaxValues(menuOptions.length)
          .addOptions(menuOptions.filter(Boolean))
        return [new MessageActionRow().addComponents(menuSelection)]
      }


      let embed = new Discord.MessageEmbed()
        .setTitle(`Configurar las categorías de comandos permitidas/no permitidas de este servidor`)
        .setColor(es.color)
        .setDescription(`**En la selección de abajo aparecen todas las categorías**\n\n**Selecciónelo para desactivarlo/activarlo!**\n\n**Puede seleccionar todos (*al menos 1*) Comando-Categorías si quiere desactivar/activar todas a la vez!**`)

       //Send message with buttons
      let msg = await message.reply({   
        embeds: [embed], 
        components: getMenuRowComponent()
      });
      const collector = msg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author.id == client.user.id, time: 180e3, max: 1 });
      collector.on("collect", async b => {
        if(b?.user.id !== message.author.id)
        return b?.reply({content: ":x: Sólo el que ha escrito el comando puede seleccionar Cosas!", ephemeral: true});
     
        let enabled = 0, disabled = 0;
        for(const value of b?.values) {
          let oldstate = client.settings.get(message.guild.id, `${value.toUpperCase()}`);
          if(!oldstate) enabled++;
          else disabled++;
          client.settings.set(message.guild.id, !oldstate, `${value.toUpperCase()}`)
        }
        b?.reply(`​✔️ **\`Habilitado ${enabled} Comando-Categorías\` y \`Deshabilitado ${disabled} Comando-Categorías\` out of \`${b?.values.length} categorías de comandos seleccionadas\`**`)
      })
      collector.on('end', collected => {
        msg.edit({content: ":x: Time ran out/Input finished! Cancelled", embeds: [
          msg.embeds[0]
            .setDescription(`${getMenuOptions().map(option => `> ${option.emoji} **${option.value}-Commands**: ${option.description.split(" ")[0] != "❌" ? `\`Ahora están deshabilitados [❌]\`` : `\`Are now enabled [✅]\``}`).join("\n\n")}`)
        ], components: []}).catch((e)=>{})
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-commands"]["variable5"]))
      ]});
    }
  },
};

function getNumberEmojis() {
  return [
    "<:Number_0:843943149915078696>",
    "<:Number_1:843943149902626846>",
    "<:Number_2:843943149868023808>",
    "<:Number_3:843943149914554388>",
    "<:Number_4:843943149919535154>",
    "<:Number_5:843943149759889439>",
    "<:Number_6:843943150468857876>",
    "<:Number_7:843943150179713024>",
    "<:Number_8:843943150360068137>",
    "<:Number_9:843943150443036672>",
    "<:Number_10:843943150594031626>",
    "<:Number_11:893173642022748230>",
    "<:Number_12:893173642165383218>",
    "<:Number_13:893173642274410496>",
    "<:Number_14:893173642198921296>",
    "<:Number_15:893173642182139914>",
    "<:Number_16:893173642530271342>",
    "<:Number_17:893173642538647612>",
    "<:Number_18:893173642307977258>",
    "<:Number_19:893173642588991488>",
    "<:Number_20:893173642307977266>",
    "<:Number_21:893173642274430977>",
    "<:Number_22:893173642702250045>",
    "<:Number_23:893173642454773782>",
    "<:Number_24:893173642744201226>",
    "<:Number_25:893173642727424020>"
  ]
}
