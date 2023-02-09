const {
    MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
    format,
    delay,
    swap_pages,
    handlemsg
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
    name: `lyrics`,
    category: `🎶 Musica`,
    aliases: [`songlyrics`, `ly`, `tracklyrics`],
    description: `Muestra la letra de la pista actual`,
    usage: `lyrics [Songtitle]`,
    cooldown: 15,
    parameters: {
        "type": "music",
        "activeplayer": true,
        "previoussong": false
    },
    type: "song",
    run: async (client, message, args, cmduser, text, prefix, player) => {
        
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if (!client.settings.get(message.guild.id, "MUSIC")) {
            return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.disabled.title)
                .setDescription(handlemsg(client.la[ls].common.disabled.description, {
                    prefix: prefix
                }))
            ]});
        }
        try {
            return message.reply("**Debido a razones legales, las letras están desactivadas y no funcionarán durante un tiempo desconocido!** <:cry:275930607702245376>");
        } catch (e) {
            console.log(String(e.stack).dim.bgRed)
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["music"]["lyrics"]["variable2"]))
            ]});
        }
    }
};
