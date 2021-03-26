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

if (!settings.registerAuthorizedRoles.some(qwe => message.member.roles.cache.has(qwe)) && !message.member.roles.cache.has(settings.ownerRole) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Yeterli yetkilere sahip değilsiniz.")).then(qwe => qwe.delete({timeout: 3 * 1000}));

let qwe = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!qwe) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisiniz."));
if (qwe.roles.cache.has(settings.ownerRole) && qwe.hasPermission("ADMINISTRATOR") && message.member.roles.highest.position <= qwe.roles.highest.position) return message.channel.send(embed.setDescription("Yöneticilerin üstünde işlem yapamazsınız.")).then(qwe => qwe.delete({timeout: 3 * 1000}));

let name;
args = args.filter(a => a !== "" && a !== " ").splice(1);

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

if (db.get("settings.needTag")) {
if (!qwe.user.username.includes(settings.tag) && !qwe.roles.cache.has(settings.boosterRole) && !qwe.roles.cache.has(vipRole)) return message.channel.send(embed.setDescription(`${qwe} isimli kullanıcı tagımızı (\`${settings.tag}\`) almadığı için kayıt işlemine devam edilemedi. Kullanıcıya ${message.guild.roles.cache.get(settings.vipRole) || "VIP rolü"} vererek ya da takviye yapmasını isteyerek kayıt edebilirsiniz.`)).then(qwe => qwe.delete({timeout: 5 * 1000}));
qwe.setNickname(name);
qwe.roles.set(settings.womanRoles || []).catch();
message.channel.send(embed.setDescription(`:tada: ${qwe} kullanıcısına başarıyla ${settings.womanRoles.map(qwe => `<@&${qwe}>`).join(", ")} rolleri verildi.`)).then(qwe => qwe.delete({timeout: 15 * 1000}));
} else {
qwe.setNickname(name);
qwe.roles.set(settings.womanRoles || []).catch();
message.channel.send(embed.setDescription(`:tada: ${qwe} kullanıcısına başarıyla ${settings.womanRoles.map(qwe => `<@&${qwe}>`).join(", ")} rolleri verildi.`)).then(qwe => qwe.delete({timeout: 15 * 1000}));
}

db.push(`isimler.${qwe.id}`, {
Yetkili: message.author.id,
Isim: name,
Tarih: Date.now()
})

db.add(`teyit.${message.author.id}.kız`, 1);

let members = message.guild.members.cache.filter(member => member.user.username.includes(settings.tag));
members.array().forEach((member, index) => {
setTimeout(() => {
member.roles.remove(member.roles.cache.filter(e => e.editable));
member.roles.add(settings.crewRole);
}, index * 1500)
})

};

exports.config = {
  name: "kadın",
  guildOnly: true,
  aliases: ["k", "woman", "women", "kız"],
};