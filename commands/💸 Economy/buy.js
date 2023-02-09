const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "buy",
  category: "💸 Economia",
  aliases: ["buyitem"],
  description: "Muestra la tienda",
  usage: "buy [Item]",
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "ECONOMY")) {
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //command
      var user = message.author;
      //if the user is a bot, then return
      if (user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable1"]))
      //ensure the economy data
      ensure_economy_user(client, message.guild.id, user.id)
      //get the latest data
      var data = client.economy.get(`${message.guild.id}-${user.id}`)
      //set some variables
      var items = 0, itemsvalue = 0;
      //Loop through all items
      for (const itemarray in data.items) {
        items += data.items[`${itemarray}`];
        var prize = 0;
        switch (itemarray.toLowerCase()) {
          case "yacht": prize = 75000; break;
          case "lamborghini": prize = 50000; break;
          case "car": prize = 6400; break;
          case "motorbike": prize = 1500; break;
          case "bicycle": prize = 500; break;

          case "nike": prize = 300; break;
          case "tshirt": prize = 60; break;

          case "mansion": prize = 45000; break;
          case "house": prize = 8000; break;
          case "dirthut": prize = 150; break;

          case "pensil": prize = 20; break;
          case "pen": prize = 10; break;
          case "condom": prize = 30; break;
          case "bottle": prize = 50; break;

          case "fish": prize = 1000; break;
          case "hamster": prize = 1500; break;
          case "dog": prize = 2000; break;
          case "cat": prize = 2000; break;
        }
        itemsvalue += prize * data.items[`${itemarray}`];
      }
      //function for yes or no, if its buyable!
      const p2b = (costs) => (Number(costs) > Number(data.balance)) ? "❌​" : "​✔️";
      //return some message!
      if (!args[0])
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(user.tag + " | ❌ .. No se puede comprar | ✅ ... Posibilidad de comprar", user.displayAvatarURL({ dynamic: true }))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable3"]))
.addField("✏️ Usable", ">>> " + 
`✏️ **\`Lapiz [10 💸]\`** | ${p2b(10)}
🖊️ **\`Pluma [20 💸]\`** | ${p2b(20)}
🟪 **\`Condon [30 💸]\`** | ${p2b(30)}
🍼 **\`Botella [50 💸]\`** | ${p2b(50)}`
)
.addField("👕 Ropa", ">>> " + 
`👟 **\`Zapatillas Nike [300 💸]\`** | ${p2b(300)}
👕 **\`Camiseta [60 💸]\`** | ${p2b(60)}`
)
.addField("🐕 Animales", ">>> " + 
`🐟\`Pescado [1000 💸]\`** | ${p2b(1000)}
🐹 **\`Hamster [1500 💸]\`** | ${p2b(1500)}
🐕 **\`Perro [2000 💸]\`** | ${p2b(2000)}
😺 **\`Gato [2000 💸]\`** | ${p2b(2000)}`
)
.addField("🚗 Medios de transporte", ">>> " + 
`🛥️\`Yate [75000 💸]\`** | ${p2b(75000)}
🏎️ **\`Lamborghini [50000 💸]\`** | ${p2b(50000)}
🚗 **\`Coche [6400 💸]\`** | ${p2b(6400)}
🏍️ **\`Motocicleta [1500 💸]\`** | ${p2b(1500)}
🚲 **\`Bicicleta [500 💸]\`** | ${p2b(500)}`
)
.addField("🏠 Sala de estar", ">>> " + 
`🏘️ **\`Mansion [45000 💸]\`** | ${p2b(45000)}
🏠 **\`Casa [8000 💸]\`** | ${p2b(8000)}
🟫 **\`Dirthut [150 💸]\`** | ${p2b(150)}`
)]});
      let amountofbuy = Number(args[1]) || 1;
      if (amountofbuy == 0)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({ dynamic: true }))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable5"]))
        ]});
      var prize = 0;
      switch (args[0].toLowerCase()) {
        case "yacht": prize = 75000; break;
        case "lamborghini": prize = 50000; break;
        case "car": prize = 6400; break;
        case "motorbike": prize = 1500; break;
        case "bicycle": prize = 500; break;

        case "nike": prize = 300; break;
        case "tshirt": prize = 60; break;

        case "mansion": prize = 45000; break;
        case "house": prize = 8000; break;
        case "dirthut": prize = 150; break;

        case "pensil": prize = 20; break;
        case "pen": prize = 10; break;
        case "condom": prize = 30; break;
        case "bottle": prize = 50; break;

        case "fish": prize = 1000; break;
        case "hamster": prize = 1500; break;
        case "dog": prize = 2000; break;
        case "cat": prize = 2000; break;
        default: prize = false; break;
      }
      if (!prize)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag + " | ❌ .. No se puede comprar | ✅ ... Posibilidad de comprar", user.displayAvatarURL({ dynamic: true }))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable6"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable7"]))
.addField("✏️ Utilizables", ">>> " + 
`✏️ **\`Lapiz [10 💸]\`** | ${p2b(10)}
🖊️ **\`Pluma [20 💸]\`** | ${p2b(20)}
🟪 **\`Condon [30 💸]\`** | ${p2b(30)}
🍼 **\`Botella [50 💸]\`** | ${p2b(50)}`
)
.addField("👕 Clothes", ">>> " + 
`👟 **\`Zapatillas Nike [300 💸]\`** | ${p2b(300)}
👕 **\`Camiseta [60 💸]\`** | ${p2b(60)}`
)
.addField("🐕 Animals", ">>> " + 
`🐟\`Pescado [1000 💸]\`** | ${p2b(1000)}
🐹 **\`Hamster [1500 💸]\`** | ${p2b(1500)}
🐕 **\`Perro [2000 💸]\`** | ${p2b(2000)}
😺 **\`Gato [2000 💸]\`** | ${p2b(2000)}`
)
.addField("🚗 Medios de transporte", ">>> " + 
`🛥️\`Yate [75000 💸]\`** | ${p2b(75000)}
🏎️ **\`Lamborghini [50000 💸]\`** | ${p2b(50000)}
🚗 **\`Coche [6400 💸]\`** | ${p2b(6400)}
🏍️ **\`Motocicleta [1500 💸]\`** | ${p2b(1500)}
🚲 **\`Bicicleta [500 💸]\`** | ${p2b(500)}`
)
.addField("🏠 Sala de estar", ">>> " + 
`🏘️ **\`Mansión [45000 💸]\`** | ${p2b(45000)}
🏠 **\`Casa [8000 💸]\`** | ${p2b(8000)}
🟫 **\`Dirthut [150 💸]\`** | ${p2b(150)}`
)]});
      var endprize = prize * amountofbuy;
      if (endprize > data.balance)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({ dynamic: true }))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable8"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable9"]))
        ]});
      client.economy.math(`${message.guild.id}-${user.id}`, "+", amountofbuy, `items.${args[0].toLowerCase()}`)
      client.economy.math(`${message.guild.id}-${user.id}`, "-", endprize, `balance`)
      data = client.economy.get(`${message.guild.id}-${user.id}`)

      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(user.tag, user.displayAvatarURL({ dynamic: true }))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable10"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable11"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["buy"]["variable12"]))
      ]});
    }
  }
};
