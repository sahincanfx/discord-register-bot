const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db");
const conf = require("../config.js") 

module.exports.run = async (client, message, args, settings, embed) => {

if (!message.member.roles.cache.has(settings.ownerRole) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Yeterli yetkilere sahip değilsiniz.")).then(qwe => qwe.delete({timeout: 3 * 1000}));

let qwe = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!qwe) return message.channel.send(embed.setDescription(`:no_entry_sign: Geçerli bir üye belirtmelisiniz.`)).then(qwe => qwe.delete({timeout: 3 * 1000}));

let isimler = db.get(`isimler.${qwe.id}`) || [];
let isim = isimler.length > 0 ? isimler.map((value, index) => `\`${index + 1}.\` ${value.Isim} [${message.guild.members.cache.get(value.Yetkili) ? message.guild.members.cache.get(value.Yetkili) : message.guild.members.cache.get(value.Yetkili).user.username}]`).join("\n") : "İsim geçmişi yok!";

message.channel.send(embed.addField(`${qwe} kullanıcısının toplam **${isimler.length || "0"}** adet isim geçmişi bulundu.`, isimler.length < 1 ? "Kullanıcının isim geçmişi temiz." : isim))
};

exports.config = {
  name: "isimler",
  guildOnly: true,
  aliases: ["names", "nicks"],
};