const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
    name: "toggleplaymessage",
    aliases: ["toggleplaymsg", "playmessage", "playmsg"],
    category: "⚙️ Ajustes",
    description: "Cambia el mensaje de juego (igual que la poda...). Si es true se enviará un mensaje de reproducción de una nueva pista, incluso si su afk. Si es false, no enviará ningún mensaje si se reproduce una nueva pista! | Default: true aka enviar nueva información de la pista",
    usage: "toggleplaymessage",
    memberpermissions: ["ADMINISTRATOR"],
    type: "music",
    run: async (client, message, args, cmduser, text, prefix) => {
    
      let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
      
      //run the code of togglepruning
      let { run } = require("./togglepruning");
      run(client, message, args);
  }
};


