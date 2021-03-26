const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db");
const conf = require("../config.js") 

module.exports.run = async (client, message, args, settings, embed) => {

if (db.get("settings.maintenanceMode")) {
message.channel.send(embed.setDescription("Sunucu bakım modundadır. Kayıtlar kapalıdır."));
return;
}

if (!settings.womanRoles || !settings.vipRole || !settings.boosterRole || !settings.registerAuthorizedRoles) return message.channel.send(embed.setDescription("Sunucu ayarları kurulmamış." + "`" + conf.prefix + "ayar`")).then(qwe => qwe.delete({timeout: 3 * 1000}));

let name;
args = args.filter(a => a !== "" && a !== " ").splice(1);

let qwe = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

if (message.member.roles.cache.has(settings.boosterRole) && !qwe) {
let isim = args.filter(qwe => isNaN(qwe)).map(qwe => qwe.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(0)).join(" ");
message.member.setNickname(isim)
message.channel.send(embed.setDescription("Sunucu içindeki booster ismin `" + isim + "` olarak ayarlandı!"))
}

if (!settings.registerAuthorizedRoles.some(qwe => message.member.roles.cache.has(qwe)) && !message.member.roles.cache.has(settings.ownerRole) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Yeterli yetkilere sahip değilsiniz.")).then(qwe => qwe.delete({timeout: 3 * 1000}));

if (!qwe) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisiniz."));
if (qwe.roles.cache.has(settings.ownerRole) && qwe.hasPermission("ADMINISTRATOR") && message.member.roles.highest.position <= qwe.roles.highest.position) return message.channel.send(embed.setDescription("Yöneticilerin üstünde işlem yapamazsınız.")).then(qwe => qwe.delete({timeout: 3 * 1000}));


if (db.get("settings.nameAge")) {
let isim = args.filter(qwe => isNaN(qwe)).map(qwe => qwe.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
let yaş = args.filter(qwe => !isNaN(qwe))[0] || undefined;

if (!isim || !yaş) return message.channel.send(embed.setDescription("Geçerli bir isim ve yaş belirtmelisiniz.")).then(qwe => qwe.delete({timeout: 3 * 1000}));
name = `${qwe.user.username.includes(settings.tag) ? settings.tag : settings.unTag} ${isim} | ${yaş}`
} else {
let isim = args.join(" ");
if (!isim) message.channel.send(embed.setDescription("Geçerli bir isim belirtmelisiniz.")).then(qwe => qwe.delete({timeout: 3 * 1000}));
name = `${qwe.user.username.includes(settings.tag) ? settings.tag : settings.unTag} ${isim}`
}


qwe.setNickname(name);

db.push(`isimler.${qwe.id}`, {
Yetkili: message.author.id,
Isim: name,
Tarih: Date.now()
})

message.channel.send(embed.setDescription(`:tada: ${qwe} kullanıcısının ismi başarıyla "${name}" olarak ayarlandı.`)).then(qwe => qwe.delete({timeout: 15 * 1000}));

let members = message$.guild.members.cache.filter(member => member.user.username.includes(settings.tag));
members.array().forEach((member, index) => {
setTimeout(() => {
member.roles.add(settings.crewRole);
}, index * 1500)
})

};

exports.config = {
  name: "isim",
  guildOnly: true,
  aliases: ["name", "nick", "i"],
};