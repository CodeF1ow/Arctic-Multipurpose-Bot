
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "randomcase",
    aliases: ["randomcasetext"],
    category: "🎮 Minijuegos",
    description: "Hacer texto a casos aleatorios?",
    usage: "randomcase TEXT",
    type: "text",
     run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        message.reply(randomCase(args[0] ? args.join(" ") : "No se ha añadido ningún texto. Por favor, inténtelo de nuevo!"))
        
    }
  }
  function randomCase(string) {
		let result = '';
		if (!string) throw new TypeError('Error: No se ha especificado una cadena.');
		if (typeof string !== 'string') {
			throw new TypeError('Error: La cadena proporcionada no es válida.');
		}
		for (const i in string) {
			const Random = Math.floor(Math.random() * 2);
			result += Random == 1 ? string[i].toLowerCase() : string[i].toUpperCase();
		}
		return result;
	}