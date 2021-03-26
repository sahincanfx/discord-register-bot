const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db");
const conf = require("../config.js") 

module.exports.run = async (client, message, args, settings, embed) => {

if (!message.member.roles.cache.has(settings.ownerRole) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Yeterli yetkilere sahip değilsiniz.")).then(qwe => qwe.delete({timeout: 3 * 1000}));

let qwe = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!qwe) return message.channel.send(embed.setDescription(`:no_entry_sign: Geçerli bir üye belirtmelisiniz.`)).then(qwe => qwe.delete({timeout: 3 * 1000}));

qwe.roles.cache.has(settings.vipRole) ? qwe.roles.remove(settings.vipRole) : qwe.roles.add(settings.vipRole)
return message.channel.send(embed.setDescription(`${qwe} kullanıcısı başarıyla **VIP** üye yapıldı!`))

};

exports.config = {
  name: "vip",
  guildOnly: true,
  aliases: ["fcm", "firstclassmember", "special"],
};