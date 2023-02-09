const {MessageEmbed} =require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { swap_pages2	 } = require(`${process.cwd()}/handlers/functions`);
module.exports = {
	name: "sponsor",
	category: "🔰 Info",
	aliases: ["sponsors"],
	description: "Muestra el patrocinio de nuestro bot",
	usage: "sponsor",
	type: "bot",
	run: async (client, message, args, cmduser, text, prefix) => {
		let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
		
	try{
			let embed1 = new MessageEmbed()
		    .setColor(es.color)
		    .setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable1"]))
		    .setURL("https://clientes.coldhosting.com/aff.php?aff=116")
		    .setDescription(`
			El patrocinador de este bot es:
**CoolHosting** EL MEJOR HOSTER
➡️ coldhosting.com los patrocina con algunos métodos de alojamiento gratuitos o más baratos,
➡️ Gracias a ellos, podemos alojar nuestro sitio web, los bots y los servidores de juegos
➡️ Nuestra sugerencia es que, si quieres alojar bots/juegos/sitios web, vayas a [coldhosting.com](https://clientes.coldhosting.com/aff.php?aff=116)

**Lo que ofrecen:**
➡️ **>>** Minecraft Hosting, CounterStrike: Global Offensive, Garry's Mod, ARK, ARMA 3, ...
➡️ **>>** Dominios baratos y rápidos
➡️ **>>** WEBHOSTING
➡️ **>>** Linux & Windows Root Servers

[**Discord Server:**](https://arcticbot.xyz/discord)
[**Website:**](https://clientes.coldhosting.com/aff.php?aff=116)
`)
		    .setImage("https://i.imgur.com/kv0fc9o.png")
		    .setFooter("CoolHosting",  "https://i.imgur.com/kv0fc9o.png")
		
		let embed2 = new MessageEmbed()
			.setColor(es.color)
			.setTimestamp()
			.setFooter("coldhosting.com | Usa nuestro enlace para un descuento == De -5%",  'https://i.imgur.com/kv0fc9o.png')
			.setImage("https://i.imgur.com/kv0fc9o.png")
			.setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable4"]))
			.setURL("https://clientes.coldhosting.com/index.php?rp=/store/discord-bots")
			.setDescription(`
➡️ Coolhosting nos proporciona, VPS gratuitas para el alojamiento de bots de discord

➡️ Si utiliza el codigo **NEW15** para obtener al menos un 5% de descuento en todos los productos!

➡️ Consulte su [Página web](https://clientes.coldhosting.com/index.php?rp=/store/discord-bots) y su [Discord](https://arcticbot.xyz/discord) para conseguir también su propio Bot!`);
			swap_pages2(client, message, [embed1, embed2])
		} catch (e) {
        console.log(String(e.stack).grey.bgRed)
		return message.reply({embeds: [new MessageEmbed()
		  .setColor(es.wrongcolor)
		  .setFooter(client.getFooter(es))
		  .setTitle(client.la[ls].common.erroroccur)
		  .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
		]});
    }
  }
}

