const {
  MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu
} = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration, handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "help",
  category: "🔰 Info",
  aliases: ["h", "commandinfo", "halp", "hilfe"],
  usage: "help [Command/Category]",
  description: "Devuelve todos los comandos, o un comando específico",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {

    let settings = client.settings.get(message.guild.id);
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    try {
      if (args[0]) {
        const embed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null);
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        var cat = false;
        if (args[0].toLowerCase().includes("cust")) {
          let cuc = client.customcommands.get(message.guild.id, "commands");
          if (cuc.length < 1) cuc = [handlemsg(client.la[ls].cmds.info.help.error1)]
          else cuc = cuc.map(cmd => `\`${cmd.name}\``)
          const items = cuc


          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable1"]))
            .setDescription(items.join("︲"))
            .setFooter(handlemsg(client.la[ls].cmds.info.help.nocustom), client.user.displayAvatarURL());

          message.reply({ embeds: [embed] })
          return;
        } var cat = false;
        if (!cmd) {
          cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
        }
        if (!cmd && (!cat || cat == null)) {
          return message.reply({ embeds: [embed.setColor(es.wrongcolor).setDescription(handlemsg(client.la[ls].cmds.info.help.noinfo, { command: args[0].toLowerCase() }))] });
        } else if (cat) {
          var category = cat;
          const items = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable2"]))
            .setFooter(handlemsg(client.la[ls].cmds.info.help.nocustom, { prefix: prefix }), client.user.displayAvatarURL());
          let embeds = allotherembeds_eachcategory();
          if (cat == "🔰 Info")
            return message.reply({ embeds: [embeds[0]] })
          if (cat == "💸 Economia")
            return message.reply({ embeds: [embeds[1]] })
          if (cat == "🏫 Comandos Escolares")
            return message.reply({ embeds: [embeds[2]] })
          if (cat == "🎶 Musica")
            return message.reply({ embeds: [embeds[3]] })
          if (cat == "👀 Filtro")
            return message.reply({ embeds: [embeds[4]] })
          if (cat == "⚜️ Cola(s) personalizada(s)")
            return message.reply({ embeds: [embeds[5]] })
          if (cat == "🚫 Administracion")
            return message.reply({ embeds: [embeds[6]] })
          if (cat == "💪 Configurar")
            return message.reply({ embeds: [embeds[7]] })
          if (cat == "⚙️ Ajustes")
            return message.reply({ embeds: [embeds[8]] })
          if (cat == "👑 Dueño")
            return message.reply({ embeds: [embeds[9]] })
          if (cat == "⌨️ Programacion")
            return message.reply({ embeds: [embeds[10]] })
          if (cat == "⌨️ Clasificacion")
            return message.reply({ embeds: [embeds[11]] })
          if (cat == "🔊 Soundboard")
            return message.reply({ embeds: [embeds[12]] })
          if (cat == "🎤 Voz")
            return message.reply({ embeds: [embeds[13]] })
          if (cat == "🕹️ Diversion")
            return message.reply({ embeds: [embeds[14]] })
          if (cat == "🎮 Minijuegos")
            return message.reply({ embeds: [embeds[15]] })
          if (cat == "😳 Anime-Emotions")
            return message.reply({ embeds: [embeds[16]] })
          if (category.toLowerCase().includes("custom")) {
            const cmd = client.commands.get(items[0].split("`").join("").toLowerCase()) || client.commands.get(client.aliases.get(items[0].split("`").join("").toLowerCase()));
            try {
              embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable3"]));
            } catch { }
          } else {
            embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable4"]))
          }
          return message.reply({ embeds: [embed] })
        }
        if (cmd.name) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.name), `\`\`\`${cmd.name}\`\`\``);
        if (cmd.name) embed.setTitle(handlemsg(client.la[ls].cmds.info.help.detail.about, { cmdname: cmd.name }));
        if (cmd.description) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.desc), `\`\`\`${cmd.description}\`\`\``);
        if (cmd.aliases && cmd.aliases.length > 0 && cmd.aliases[0].length > 1) try {
          embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.aliases), `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        } catch { }
        if (cmd.cooldown) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.cooldown), `\`\`\`${cmd.cooldown} Seconds\`\`\``);
        else embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.cooldown), `\`\`\`3 Seconds\`\`\``);
        if (cmd.usage) {
          embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.usage), `\`\`\`${prefix}${cmd.usage}\`\`\``);
          embed.setFooter(handlemsg(client.la[ls].cmds.info.help.detail.syntax), es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL());
        }
        return message.reply({ embeds: [embed] });
      } else {
        let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.back))
        let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.home))
        let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.forward))
        let button_tutorial = new MessageButton().setStyle('LINK').setEmoji("840260133686870036").setLabel("Aprende").setURL("https://youtu.be/")
        let menuOptions = [
          {
            label: "Resumen",
            value: "Overview",
            emoji: "833101995723194437",
            description: "Mi visión general de mí!"
          },
          {
            label: "Información",
            value: "Information",
            emoji: "🔰",
            description: "Comandos para compartir información"
          },
          {
            label: "Economía",
            value: "Economy",
            emoji: "💸",
            description: "Comandos para utilizar el sistema de economía"
          },
          {
            label: "Escuela",
            value: "School",
            emoji: "🏫",
            description: "Comandos útiles para la escuela y el trabajo!"
          },
          {
            label: "Música",
            value: "Music",
            emoji: "🎶",
            description: "Comandos para reproducir Música / añadir Filtro"
          },
          {
            label: "Filtro",
            value: "Filter",
            emoji: "👀",
            description: "Comandos para añadir filtros a la música"
          },
          {
            label: "Cola personalizada",
            value: "Customqueue",
            emoji: "⚜️",
            description: "Comandos para guardar las colas y gestionarlas"
          },
          {
            label: "Admin",
            value: "Admin",
            emoji: "🚫",
            description: "Comandos para administrar el servidor"
          },
          {
            label: "Configurar",
            value: "Setup",
            emoji: "💪",
            description: "Comandos para configurar los sistemas"
          },
          {
            label: "Ajustes",
            value: "Settings",
            emoji: "⚙️",
            description: "Comandos para cambiar la configuración del servidor"
          },
          {
            label: "Propietario",
            value: "Owner",
            emoji: "👑",
            description: "Comandos para gestionar el Bot"
          },
          {
            label: "Programación",
            value: "Programming",
            emoji: "⌨️",
            description: "Comandos útiles para la programación"
          },
          {
            label: "Clasificación",
            value: "Ranking",
            emoji: "📈",
            description: "Comandos para gestionar y mostrar los rangos"
          },
          {
            label: "Soundboard",
            value: "Soundboard",
            emoji: "🔊",
            description: "Comandos de voz Soundboard"
          },
          {
            label: "Voz",
            value: "Voice",
            emoji: "🎤",
            description: "Comandos para la gestión de los canales de voz"
          },
          {
            label: "Diversión",
            value: "Fun",
            emoji: "🕹️",
            description: "Comandos para la diversión (imagen) utiliza"
          },
          {
            label: "Minijuegos",
            value: "Minigames",
            emoji: "🎮",
            description: "Comandos para los Minijuegos con el Bot"
          },
          {
            label: "Anime-Emotions",
            value: "Anime-Emotions",
            emoji: "😳",
            description: "Comandos para mostrar tus emociones con estilo anime"
          },
          {
            label: "Customcommand",
            value: "Customcommand",
            emoji: "🦾",
            description: "Comandos personalizados de este servidor"
          },
        ];
        menuOptions = menuOptions.map(i => {
          if (settings[`${i?.value.toUpperCase()}`] === undefined) {
            return i; //if its not in the db, then add it
          }
          else if (settings[`${i?.value.toUpperCase()}`]) {
            return i; //If its enabled then add it
          }
          else if (settings.showdisabled && settings[`${i?.value.toUpperCase()}`] === false) {
            return i;
          } else {
            //return i // do not return, cause its disabled! to be shown
          }
        })
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Clic para desplegar el Menu de ayuda de las paginas")
          .setMinValues(1)
          .setMaxValues(5)
          .addOptions(menuOptions.filter(Boolean))
        let buttonRow = new MessageActionRow().addComponents([button_back, button_home, button_forward, button_tutorial])
        let SelectionRow = new MessageActionRow().addComponents([menuSelection])
        const allbuttons = [buttonRow, SelectionRow]
        //define default embed
        let OverviewEmbed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          //.setFooter("Page Overview\n"+ client.user.username, client.user.displayAvatarURL())
          .setFooter({ text: "Resumen de la página\n" + client.user.username, iconURL: client.user.displayAvatarURL() })
          .setTitle(`Información sobre __${client.user.username}__`)
          .addField("💪🏻​**__Mis características__**",
                `**💻┊58+ Sistemas** ⋐⋑ **🗂️┊Twitter Poosts** ⋐⋑ **🎞️┊YouTube**\n
                 **📲┊Aplicaciónes** ⋐⋑ **​📩┊Sistma ​Tickets** ⋐⋑ **📷┊Bienvenida**\n
                 **🚸┊Reaction Rol** ⋐⋑ **🎉​┊Sistma Sorteos** ⋐⋑ **🔒┊Anti-Nuke**\n
                 **🎶┊Sistm Música** ⋐⋑ **🎙️​┊Filtro d audio** ⋐⋑ **🥳┊Diversion**\n
                 **🎮┊Minii-juegos** ⋐⋑ **🥷┊​Administración** ⋐⋑ **📢┊Moderacion**\n`)                
              .addField("❓​**__COMO USARME__**",
                  `>>> \`${prefix}setup\` **y reaccionar con el Emoji para la acción correcta, 
                  pero también puede hacer:** \n \`${prefix}setup-welcome\`\n`)
                  .addField("\n📈┊**__ESTADISTICAS DEL BOT__**",
                 `**⚙️┊Comandos** \`${client.commands.map(a => a).length}\`
                  **🗂️┊​Servidores** \`${client.guilds.cache.size}\`
                  **⌚️┊Uptime** ${duration(client.uptime).map(i => `\`${i}\``).join("︲")}
                  **📶┊Ping** \`${Math.floor(client.ws.ping)}ms\`
                  **⌨️┊​Desarrollador** [**Kiri86#8565**](https://arcticbot.xyz/discord)`) 

         .addField("🆘┊OBTENER AYUDA", `>>>  **1- Ir a** \`Los botones para intercambiar entre diferentes paginas\` \n **2- Ir al** \`Menú para seleccionar todas las páginas de ayuda que desee ver\` \n **3- Ir a** \`"Aprende" para ver el tutorial de Youtube\``)

        let err = false;
        //Send message with buttons
        let helpmsg = await message.reply({
          content: `***Haga clic en los __Botones__ para intercambiar las paginas de ayuda***`,
          embeds: [OverviewEmbed],
          components: allbuttons
        }).catch(e => {
          err = true;
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          return message.reply(`:x: No pude enviar ayuda? Tal vez me falta el Permiso de **EMBED LINKS**`).catch(() => { })
        });
        if (err) return;
        var edited = false;
        var embeds = [OverviewEmbed]
        for (const e of allotherembeds_eachcategory(true))
          embeds.push(e)
        let currentPage = 0;

        //create a collector for the thinggy
        const collector = helpmsg.createMessageComponentCollector({ filter: (i) => (i?.isButton() || i?.isSelectMenu()) && i?.user && i?.message.author.id == client.user.id, time: 180e3 });
        //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
        collector.on('collect', async b => {
          try {
            if (b?.isButton()) {
              if (b?.user.id !== message.author.id)
                return b?.reply({ content: handlemsg(client.la[ls].cmds.info.help.buttonerror, { prefix: prefix }), ephemeral: true });

              //page forward
              if (b?.customId == "1") {
                //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
                if (currentPage !== 0) {
                  currentPage -= 1
                } else {
                  currentPage = embeds.length - 1
                }
              }
              //go home
              else if (b?.customId == "2") {
                //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
                currentPage = 0;
              }
              //go forward
              else if (b?.customId == "3") {
                //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
                if (currentPage < embeds.length - 1) {
                  currentPage++;
                } else {
                  currentPage = 0
                }
              }
              await helpmsg.edit({ embeds: [embeds[currentPage]], components: allbuttons }).catch(e => { })
              b?.deferUpdate().catch(e => { })


            }
            if (b?.isSelectMenu()) {
              //b?.reply(`***Going to the ${b?.customId.replace("button_cat_", "")} Page***, *please wait 2 Seconds for the next Input*`, true)
              //information, music, admin, settings, voice, minigames
              let index = 0;
              let vembeds = []
              let theembeds = [OverviewEmbed, ...allotherembeds_eachcategory()];
              for (const value of b?.values) {
                switch (value.toLowerCase()) {
                  case "overview": index = 0; break;
                  case "information": index = 1; break;
                  case "economy": index = 2; break;
                  case "school": index = 3; break;
                  case "music": index = 4; break;
                  case "filter": index = 5; break;
                  case "customqueue": index = 6; break;
                  case "admin": index = 7; break;
                  case "setup": index = 8; break;
                  case "settings": index = 9; break;
                  case "owner": index = 10; break;
                  case "programming": index = 11; break;
                  case "ranking": index = 12; break;
                  case "soundboard": index = 13; break;
                  case "voice": index = 14; break;
                  case "fun": index = 15; break;
                  case "minigames": index = 16; break;
                  case "anime-emotions": index = 17; break;
                  case "customcommand": index = 19; break;
                }
                vembeds.push(theembeds[index])
              }
              b?.reply({
                embeds: vembeds,
                ephemeral: true
              });
            }
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            console.log(String(e).italic.italic.grey.dim)
          }
        });

        collector.on('end', collected => {
          //array of all disabled buttons
          let d_buttonRow = new MessageActionRow().addComponents([button_back.setDisabled(true), button_home.setDisabled(true), button_forward.setDisabled(true), button_tutorial])
          const alldisabledbuttons = [d_buttonRow]
          if (!edited) {
            edited = true;
            helpmsg.edit({ content: handlemsg(client.la[ls].cmds.info.help.timeended, { prefix: prefix }), embeds: [helpmsg.embeds[0]], components: alldisabledbuttons }).catch((e) => { })
          }
        });
      }
      function allotherembeds_eachcategory(filterdisabled = false) {
        //ARRAY OF EMBEDS
        var embeds = [];

        //INFORMATION COMMANDS
        var embed0 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔰 Info").size}\`] 🔰 Comandos de información 🔰`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔰 Info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField(`🙂 **Comandos de usuario**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "user").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`🕹️ **Comandos relacionados con los juegos**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "games").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`​📔 **Comandos relacionados con el servidor**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "server").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`🤖​ **Comandos relacionados con el bot**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "bot").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`🚧​ **Comandos relacionados con la utilidad**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "util").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed0)

        //ECONOMY COMMANDS
        var embed1 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💸 Economia").size}\`] 💸 Economia Commands 💸 | ${settings.ECONOMY ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💸 Economia").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField(`🕹️ **Minijuego para ganar 💸**`, ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economia" && cmd.type === "game").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`:clock1: **Ganar repetidamente 💸 a través de Evento(s)**`, ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economia" && cmd.type === "earn").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`🚧​ **Información y gestión 💸**`, ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economia" && cmd.type === "info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        if (!filterdisabled || settings.ECONOMY || settings.showdisabled) embeds.push(embed1)

        //SCHOOL COMMANDS
        var embed2 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🏫 Comandos Escolares").size}\`] 🏫 Comandos Escolares 🏫 | ${settings.SCHOOL ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🏫 Comandos Escolares").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField(`:school: **Matemáticas**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🏫 Comandos Escolares" && cmd.type === "math").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`:clock1: **Gestión del tiempo**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🏫 Comandos Escolares" && cmd.type === "time").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        if (!filterdisabled || settings.SCHOOL || settings.showdisabled) embeds.push(embed2)

        //MUSIC COMMANDS type: song, queue, queuesong, bot
        var embed3 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎶 Musica").size}\`] 🎶 Comandos de Música 🎶 | ${settings.MUSIC ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎶 Musica").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("📑 **Comandos de cola**", "> " + client.commands.filter((cmd) => cmd.category === "🎶 Musica" && cmd.type.includes("queue")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("📀 **Comandos de la canción**", "> " + client.commands.filter((cmd) => cmd.category === "🎶 Musica" && cmd.type.includes("song")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🤖​ **Comandos del bot**", "> " + client.commands.filter((cmd) => cmd.category === "🎶 Musica" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        if (!filterdisabled || settings.MUSIC || settings.showdisabled) embeds.push(embed3)

        //FILTER COMMANDS
        var embed4 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👀 Filtro").size}\`] 👀 Filtro de Comandos 👀 | ${settings.FILTER ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👀 Filtro").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.FILTER || settings.showdisabled) embeds.push(embed4)

        //CUSTOM QUEUE COMMANDS
        var embed5 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚜️ Cola(s) personalizada(s)").first().extracustomdesc.length}\`] Comandos de ⚜️ Cola(s) personalizada(s) | ${settings.CUSTOMQUEUE ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚜️ Cola(s) personalizada(s)").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}*`)
          .addField("\u200b", "\u200b")
          .addField("​✔️  **Uso**", "> " + client.commands.filter((cmd) => cmd.category === "⚜️ Cola(s) personalizada(s)").first().usage)
        if (!filterdisabled || settings.CUSTOMQUEUE || settings.showdisabled) embeds.push(embed5)

        //ADMINISTRATION
        var embed6 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🚫 Administracion").size}\`] 🚫 Comandos de administración 🚫`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🚫 Administracion").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("​📔 **Comandos relacionados con el servidor**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administracion" && cmd.type.includes("server")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("📌 **Comandos relacionados con el canal**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administracion" && cmd.type.includes("channel")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("📌​ **Comandos relacionados con el hilo**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administracion" && cmd.type.includes("thread")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("✏️ **Comandos relacionados con la función**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administracion" && cmd.type.includes("role")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🙂 **Comandos relacionados con los miembros**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administracion" && cmd.type.includes("member")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed6)

        //SETUP
        var embed7 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💪 Configurar").size}\`] 💪 Comandos de configuración 💪`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💪 Configurar").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("😛 **Montajes para el entretenimiento**", "> " + client.commands.filter((cmd) => cmd.category === "💪 Configurar" && cmd.type.includes("fun")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("💡 **Información y gestión (bot/servidor)**", "> " + client.commands.filter((cmd) => cmd.category === "💪 Configurar" && cmd.type.includes("info")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("<:arctic:1021557680730558464> **Sistemas más utilizados**", "> " + client.commands.filter((cmd) => cmd.category === "💪 Configurar" && cmd.type.includes("system")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🚧​ **Sistemas de seguridad**", "> " + client.commands.filter((cmd) => cmd.category === "💪 Configurar" && cmd.type.includes("security")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed7)

        //Settings
        var embed8 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚙️ Ajustes").size}\`] ⚙️ Comandos de configuración ⚙️`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚙️ Ajustes").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("🙂 **Comandos relacionados con el usuario**", "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Ajustes" && cmd.type.includes("user")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🤖​ **Bot Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Ajustes" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🎶 **Comandos relacionados con la música**", "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Ajustes" && cmd.type.includes("music")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed8)

        //Owner
        var embed9 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👑 Dueño").size}\`] 👑 Comandos del propietario 👑`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👑 Dueño").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("​📔 **Información y gestión**", "> " + client.commands.filter((cmd) => cmd.category === "👑 Dueño" && cmd.type.includes("info")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🤖​ **Ajustar el Bot**", "> " + client.commands.filter((cmd) => cmd.category === "👑 Dueño" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed9)

        //Programming Commands
        var embed10 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⌨️ Programacion").size}\`] ⌨️ Comandos de programación ⌨️ | ${settings.PROGRAMMING ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⌨️ Programacion").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.PROGRAMMING || settings.showdisabled) embeds.push(embed10)

        //Ranking
        var embed11 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⌨️ Clasificacion").size}\`] 📈 Comandos de clasificación 📈 | ${settings.RANKING ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⌨️ Clasificacion").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("🚧​ **Gestionar el rango**", `> ${client.commands.filter((cmd) => cmd.category === "⌨️ Clasificacion" && cmd.type === "manage").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
          .addField("📈 **Información de rango**", `> ${client.commands.filter((cmd) => cmd.category === "⌨️ Clasificacion" && cmd.type === "info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
        if (!filterdisabled || settings.RANKING || settings.showdisabled) embeds.push(embed11)

        //SOUNDBOARD COMMANDS
        var embed12 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔊 Soundboard").size}\`] 🔊 Soundboard Commands 🔊 | ${settings.SOUNDBOARD ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔊 Soundboard").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.SOUNDBOARD || settings.showdisabled) embeds.push(embed12)

        //Voice COMMANDS
        var embed13 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎤 Voz").first().extracustomdesc.length}\`] 🎤 Comandos de voz 🎤 | ${settings.VOICE ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎤 Voz").first().extracustomdesc.split(",").map(i => i?.trim()).join("︲")}*`)
          .addField("\u200b", "\u200b")
          .addField("​✔️  **Usar**", "> " + client.commands.filter((cmd) => cmd.category === "🎤 Voz").first().usage)
        if (!filterdisabled || settings.VOICE || settings.showdisabled) embeds.push(embed13)

        //FUN COMMANDS
        var embed14 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🕹️ Diversion").size}\`] 🕹️ Comandos divertidos 🕹️ | ${settings.FUN ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🕹️ Diversion").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("🙂 **Comandos de imagen de usuario divertidos**", "> " + client.commands.filter((cmd) => cmd.category === "🕹️ Diversion" && cmd.type === "user").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🙂💬 **Usuario divertido Image-Text Commands**", "> " + client.commands.filter((cmd) => cmd.category === "🕹️ Diversion" && cmd.type === "usertext").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("💬 **Comandos de texto divertidos**", "> " + client.commands.filter((cmd) => cmd.category === "🕹️ Diversion" && cmd.type === "text").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        if (!filterdisabled || settings.FUN || settings.showdisabled) embeds.push(embed14)

        //MINIGAMES
        var embed15 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎮 Minijuegos").size}\`] 🎮 Comandos de minijuegos 🎮 | ${settings.MINIGAMES ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("💬 **Minijuegos de texto**", "> " + client.commands.filter((cmd) => cmd.category === "🎮 Minijuegos" && cmd.type === "text").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🔘 **Botón(es) Minijuegos**", "> " + client.commands.filter((cmd) => cmd.category === "🎮 Minijuegos" && cmd.type === "buttons").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🎙️ **Minijuegos de voz**", "> " + client.commands.filter((cmd) => cmd.category === "🎮 Minijuegos" && cmd.type === "voice").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎮 Minijuegos").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.MINIGAMES || settings.showdisabled) embeds.push(embed15)

        //ANIME EMOTIONS
        var embed16 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").size}\`] 😳 Comandos de anime 😳 | ${settings.ANIME ? "​✔️ HABILITADO" : "❌​ DESHABILITADO"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Comandos subcategorizados:**__")
          .addField("😳 **Anime-Mention-Emotions (or Self.)**", `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "mention").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
          .addField("😳 **Anime-Self-Emotions**", `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "self").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
        if (!filterdisabled || settings.ANIME || settings.showdisabled) embeds.push(embed16)

        //CUSTOM COMMANDS EMBED
        var embed18 = new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable23"]))
        let cuc = client.customcommands.get(message.guild.id, "commands");
        if (cuc.length < 1) cuc = ["Aún no se han definido comandos personalizados, hazlo con: `!setup-customcommands`"]
        else cuc = cuc.map(cmd => `\`${cmd.name}\``)
        const items = cuc
        embed18.setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable24"]))
        embed18.setDescription(">>> " + items.join("︲"))
        embeds.push(embed18)

        return embeds.map((embed, index) => {
          return embed
            .setColor(es.color)
            .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(`Page ${index + 1} / ${embeds.length}\nPara ver las descripciones e información de los comandos, escriba: ${config.prefix}help [CMD NAME]`, client.user.displayAvatarURL()));
        })
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
        ]
      });
    }
  }
}

