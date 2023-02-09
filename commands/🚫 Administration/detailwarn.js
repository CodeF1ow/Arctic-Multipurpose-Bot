const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `detailwarn`,
  category: `🚫 Administracion`,
  aliases: [`warninfo`, `snipe`, `infowarn`, `infowarning`, `detailwarning`, `warninginfo`],
  description: `Muestra detalles sobre una orden de aviso de un diputado`,
  usage: `detailwarn @User [Reason]`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      //find the USER
      let warnmember = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]) || message.member
      if (!warnmember)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable2"]))
        ]});

      if (!args[1])
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable4"]))
        ]});


      try {
        client.userProfiles.ensure(warnmember.user.id, {
          id: message.author.id,
          guild: message.guild.id,
          totalActions: 0,
          warnings: [],
          kicks: []
        });

        const warnIDs = client.userProfiles.get(warnmember.user.id, 'warnings');
        const dwarnData = warnIDs.map(id => client.modActions.get(id));
        const warnData = dwarnData.filter(v=> v.guild == message.guild.id)
        
        if (!warnIDs || !warnIDs.length || warnIDs.length < 1 || !dwarnData || !dwarnData.length || !warnData || !warnData.length)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable5"]))
          ]});
        if (isNaN(args[1]) || Number(args[1]) >= warnIDs.length || Number(args[1]) < 0)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable6"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable7"]))
          ]});

        let warning = warnData[parseInt(args[1])]
        let warned_by = message.guild.members.cache.get(warning.moderator) ? `${message.guild.members.cache.get(warning.moderator).user.tag} (${warning.moderator})` : warning.moderator;
        let warned_in = client.guilds.cache.get(warning.guild) ? `${client.guilds.cache.get(warning.guild).name} (${warning.guild})` : warning.guild;

        message.reply({embeds : [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setAuthor(`Warn from ${warnmember.user.tag}`, warnmember.user.displayAvatarURL({
            dynamic: true
          }))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable8"]))
          .addField(`Advertir:`, `\`${parseInt(args[1]) + 1}\` out of **${warnIDs.length} Warns**`, true)
          .addField(`Advertido por:`, `\`${warned_by}\``, true)
          .addField(`Advertido en:`, `\`${warning.when}\``, true)
          .addField(`Advertido en:`, `\`${warned_in}\``, true)
          .addField(`Antigua URL en miniatura`, `[\`Click here\`](${warning.oldthumburl})`, true)
          .addField(`El rol más antiguo:`, `${message.guild.roles.cache.get(warning.oldhighesrole.id) ? `<@&`+message.guild.roles.cache.get(warning.oldhighesrole.id)+`>` : `\`${warning.oldhighesrole.name} (${warning.oldhighesrole.id})\``}`, true)
        ]});
      } catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey);
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable9"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable10"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable11"]))
      ]});
    }
  }
};

