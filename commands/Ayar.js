const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db");
const conf = require("../config.js");

module.exports.run = async (client, message, args, embed) => {

if (message.guild.ownerID != message.author.id && !conf.geliştiriciler.includes(message.author.id)) return message.channel.send(embed.setDescription("Sunucu ayarlarını güncelleyebilmek için yeterli yetkilere ve izinlere sahip değilsin.")).then(qwe => qwe.delete({timeout: 5 * 1000}));

let settings = [
{ setting: "tag", description: "Sunucunun kimliğini oluşturacak sembolü belirlersiniz.", type: "symbol" },
{ setting: "unTag", description: "Tagı almayan kullanıcıları temsil edecek sembolü belirlersiniz.", type: "symbol" },

{ setting: "bannedTags", description: "Sunucuya girmesi yasak olan sembolleri belirlersiniz.", type: "symbols" },

{ setting: "welcomeChannel", description: "Bir kişinin sunucuya girdiğinde mesaj atacağı kanalı belirlersiniz.", type: "channel" },
{ setting: "tagLogChannel", description: "Tagı alanların loglanacağı kanalı belirlersiniz.", type: "channel" },
{ setting: "rulesChannel", description: "Bilgilendirme için kullanılacak kurallar kanalını belirlersiniz.", type: "channel" },
{ setting: "chatChannel", description: "Bir kişi kayıt olacağında güzel bir mesaj atacağı kanalı belirlersiniz.", type: "channel" },
{ setting: "crewLogChannel", description: "Sunucu ekiplerinin loglanacağı kanalı belirlersiniz.", type: "channel" },
{ setting: "registerLogChannel", description: "Kayıtların loglanacağı kanalı belirlersiniz.", type: "channel" },
{ setting: "commandChannel", description: "Ek komutların kullanılacağı kanalı belirlersiniz. (Asıl amaç chatin kirlenmemesidir.)", type: "channel" },

{ setting: "ownerRole", description: "Kurucu rolünü belirlersiniz.", type: "role" },
{ setting: "boosterRole", description: "Booster rolünü belirlersiniz.", type: "role" },
{ setting: "vipRole", description: "Özel üye rolünü belirlersiniz.", type: "role" },
{ setting: "crewRole", description: "Taglı üye rolünü belirlersiniz.", type: "role" },
{ setting: "suspiciousRole", description: "Fake üye rolünü belirlersiniz.", type: "role" },
{ setting: "commandBlock", description: "Komut cezası rolünü belirlersiniz.", type: "role" },
{ setting: "bannedTeamRole", description: "Yasaklı tag rolünü belirlersiniz.", type: "role" },

{ setting: "manRoles", description: "Erkek üyelere özel rolleri belirlersiniz.", type: "roles" },
{ setting: "womanRoles", description: "Kadın üyelere özel rolleri belirlersiniz.", type: "roles" },
{ setting: "unregisterRoles", description: "Kayıtsız üyelere özel rolleri belirlersiniz.", type: "roles" },
{ setting: "registerAuthorizedRoles", description: "Kayıt sorumlusu üyelere özel rolleri belirlersiniz.", type: "roles" },

{ setting: "needTag", description: "Halk arasındaki taglı alım sistemini açıp kapatırsınız.", type: "selection" },
{ setting: "nameAge", description: "İsim yaş sistemini açıp kapatırsınız.", type: "selection" },
{ setting: "maintenanceMode", description: "Bakım modunu açıp kapatırsınız.", type: "selection" },
];

let selection = args[0]; 
let setting = settings.find(setting => setting.setting === selection);

if (selection == "liste") {
message.channel.send(embed.setDescription(`:no_entry_sign: Hey! Yardıma mı ihtiyacın var? Aşağıdaki listeden isteklerini giderebilirsin!`).addField("Ayar Listesi", `${settings.map(qwe => `\`${qwe.setting}\``).join(", ")}.`))
return;
}

if (selection == "bilgi") {
let tag = args[1];
let information = settings.find(settings => settings.setting === tag);
if (!information || !tag) return;
message.channel.send(embed.addField("Ayar İle İlgili Bilgiler", `Açıklama: ${information.tag.description}\nTip: \`${information.tag.type.toUpperCase()}\``).setDescription(`:no_entry_sign: \`${tag}\` isimli ayara ait bilgiler aşağıda verilmiştir.`))
return;
} 

if (!selection || !settings.some(setting => setting.setting == selection && "liste") && !settings.some(setting => setting.setting == selection && "bilgi")) return message.channel.send(embed.setDescription(`:no_entry_sign: Hey! Sanırım bir hata yaptın. Bu liste sana yardımcı olur diye düşündüm :blush:`).addField("Ayar Listesi", `${settings.map(qwe => `\`${qwe.setting}\``).join(", ")}.`)).then(qwe => qwe.delete({timeout: 15 * 1000}));

if (setting.type == "channel") {
let tag = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
if (!tag) return message.channel.send(embed.setDescription(`:no_entry_sign: Bir **kanal** belirtmelisiniz.`)).then(qwe => qwe.delete({timeout: 3 * 1000}));
db.set(`settings.${setting.setting}`, tag.id);
return message.channel.send(embed.setDescription(`:tada: **${setting.setting}** isimli ayar başarıyla "${tag}" olarak ayarlandı!`)).then(qwe => qwe.delete({timeout: 5 * 1000}));
} else if (setting.type == "role") {
let tag = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
if (!tag) return message.channel.send(embed.setDescription(`:no_entry_sign: Bir **rol** belirtmelisiniz.`)).then(qwe => qwe.delete({timeout: 3 * 1000}));
db.set(`settings.${setting.setting}`, tag.id);
return message.channel.send(embed.setDescription(`:tada: **${setting.setting}** isimli ayar başarıyla "${tag}" olarak ayarlandı!`)).then(qwe => qwe.delete({timeout: 5 * 1000}));
} else if (setting.type == "roles") {
let tag;
if(message.mentions.roles.size >= 1) tag = message.mentions.roles.map(role => role.id);
else tag = args.splice(1).filter(qwe => message.guild.roles.cache.some(ewq => qwe == ewq.id));
if (!tag) return message.channel.send(embed.setDescription(`:no_entry_sign: Bir **rol** belirtmelisiniz.`)).then(qwe => qwe.delete({timeout: 3 * 1000}));
db.set(`settings.${setting.setting}`, tag);
return message.channel.send(embed.setDescription(`:tada: **${setting.setting}** isimli ayar başarıyla "${tag}" olarak ayarlandı!`)).then(qwe => qwe.delete({timeout: 5 * 1000}));
} else if (setting.type == "symbol") {
let tag = args.splice(1).join(" ");
if (!tag) return message.channel.send(embed.setDescription(`:no_entry_sign: Bir **ayar** belirtmelisiniz.`)).then(qwe => qwe.delete({timeout: 3 * 1000}));
db.set(`settings.${setting.setting}`, tag);
return message.channel.send(embed.setDescription(`:tada: **${setting.setting}** isimli ayar başarıyla "${tag}" olarak ayarlandı!`)).then(qwe => qwe.delete({timeout: 5 * 1000}));
} else if (setting.type == "symbols") {
let taglar = db.get(`setting.${setting.setting}`);
let tag = args.splice(1).join(" ");
if(taglar.includes(tag)) taglar = taglar.filter(qwe => qwe != tag);
else taglar.push(tag);
if (!tag) return message.channel.send(embed.setDescription(`:no_entry_sign: Bir **ayar** belirtmelisiniz.`)).then(qwe => qwe.delete({timeout: 3 * 1000}));
db.set(`settings.${setting.setting}`, taglar);
return message.channel.send(embed.setDescription(`:tada: **${setting.setting}** isimli ayar başarıyla "${tag}" olarak ayarlandı!`).addField("Ayarın içerisindeki diğer veriler.", taglar ? taglar.join(", ") : "Bulunamadı.")).then(qwe => qwe.delete({timeout: 5 * 1000}));
} else if (setting.type == "selection") {
db.set(`settings.${setting.setting}`, !db.get(`settings.${setting.setting}`));
return message.channel.send(embed.setDescription(`:tada: **${setting.setting}** isimli ayar başarıyla ${db.get(`settings.${setting.setting}`) ? "açıldı!" : "kapatıldı!"}`)).then(qwe => qwe.delete({timeout: 5 * 1000}));
}
};

exports.config = {
  name: "ayar",
  guildOnly: true,
  aliases: ["settings", "ayarlar"],
};
