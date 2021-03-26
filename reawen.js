const Discord = require("discord.js") 
const client = new Discord.Client();    
const config = require("./config.js") 
const conf = require("./config.js") 
const db = require("quick.db")
const fs = require("fs");                
require('./util/Loader.js')(client);    
const request = require("request");

client.commands = new Discord.Collection();
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
};
client.aliases = new Discord.Collection();  
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);             
  console.log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {                     
    let props = require(`./commands/${f}`);  
    console.log(`${props.config.name} komutu yüklendi.`);     
    client.commands.set(props.config.name, props);
    props.config.aliases.forEach(alias => {          
      client.aliases.set(alias, props.config.name);
    });
  });
})

Date.prototype.turcTarih = function (format) {
  let date = this,
    day = date.getDate(),
    weekDay = date.getDay(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();

  let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
  let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

  if (!format) {
    format = "dd MM yyyy";
  };
  format = format.replace("mm", month.toString().padStart(2, "0"));
  format = format.replace("MM", monthNames[month]);
  
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  };
  
  format = format.replace("dd", day.toString().padStart(2, "0"));
  format = format.replace("DD", dayNames[weekDay]);

  if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("hh") > -1) {
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
  };
  if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
  return format;
};

client.tarih = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

client.login(config.token);

client.on("guildMemberAdd", member => {

const settings = db.get("settings") || [];


if ((new Date().getTime() - member.user.createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 15) {
member.roles.add(settings.suspiciousRole);
if (settings.welcomeChannel) client.channels.cache.get(settings.welcomeChannel).send(`${member} isimli kullanıcının hesabı fake olduğu için cezalıya atıldı!`)
} else {
member.roles.add(unregisterRoles);
if (settings.welcomeChannel) client.channels.cache.get(settings.welcomeChannel).send(`
${member.user.createdTimestamp / (1000 * 60 * 60 * 24) <= 7 ? ":no_entry_sign:" : ":tada:"} ${member} isimli kullanıcı aramıza katıldı! Onunla beraber **${member.guild.memberCount}** kişiyiz.

Selam, ${member}!

"V. Confirmed" isimli kanallara girip isim yaş verdikten sonra kayıt olabilirsin.

Seninle ${settings.registerAuthorizedRoles.map(qwe => `<@&${qwe}>`).join(", ")} rolündeki yetkililerimiz ilgilenecektir.

Hesabın ${client.tarih(member.user.createdAt)} açılmış.

${member.guild.channels.cache.get(settings.rulesChannel) || "Kurallar"} kanalından kurallarımıza bakabilirsin. Unutma ki okuduğun varsayılarak ceza-i işlem uygulanacak.
`)
}
})

client.on("userUpdate", (oldUser, newUser) => {
const settings = db.get("settings") || [];
const guild = client.guilds.cache.get(config.serverID);
let log = guild.channels.cache.get(settings.crewLogChannel);

let member = guild.members.cache.get(oldUser.id);

let yasakTag = settings.bannedTags || [];

if (yasakTag.some(qwe => newUser.username.includes(qwe)) && !member.roles.cache.get(settings.bannedTeamRole)) {
member.roles.set(member.roles.cache.has(settings.boosterRole ? [settings.boosterRole, settings.bannedTeamRole] : [settings.bannedTeamRole]));
log.send(`${member} ${member.user.username} isimli kullanıcı yasaklı tagımızı aldığı için jaillendi! ${yasakTag.map(qwe => `\`${qwe}\``).join(", ")}.`)
}
if (!yasakTag.some(qwe => newUser.username.includes(qwe)) && member.roles.cache.get(settings.bannedTeamRole)) {
member.roles.set(member.roles.cache.has(settings.boosterRole ? [settings.boosterRole, settings.unregisterRoles] : [settings.unregisterRoles]));
log.send(`${member} ${member.user.username} isimli kullanıcı yasaklı tagımızı bıraktığı için jailden çıkarıldı! ${yasakTag.map(qwe => `\`${qwe}\``).join(", ")}.`)
}

if (newUser.username.includes(settings.tag) && !member.roles.cache.get(settings.crewRole)) {
member.roles.add(settings.crewRole);
member.setNickname(member.displayName.replace(settings.unTag, settings.tag))
log.send(`${member} ${member.user.username} isimli kullanıcı tagımızı aldı.`)
}
if (!newUser.username.includes(settings.tag) && member.roles.cache.get(settings.crewRole)) {
if (db.get("settings.needTag")) {
member.roles.set(settings.unregisterRoles);
} else {
member.roles.remove(settings.crewRole);
}
member.setNickname(member.displayName.replace(settings.tag, settings.unTag))
log.send(`${member} ${member.user.username} isimli kullanıcı tagımızı bıraktı.`)
}
})

client.on("ready", async() => {
const settings = db.get("settings") || [];
const guild = client.guilds.cache.get(config.serverID);

setInterval(() => {
qwe();
}, 5000)

function qwe() {

guild.members.cache.filter(qwe => qwe.user.username.includes(settings.tag) && !qwe.hasPermission('ADMINISTRATOR')).array().forEach((ewq, index) => {
guild.members.cache.filter(annen => annen.roles.cache.size === 1).array().forEach((anani, index) => setTimeout(() => { anani.roles.add(settings.unregisterRoles).catch(console.error); }, index*1000));
setTimeout(() => {
ewq.setNickname(ewq.displayName.replace(settings.unTag, settings.tag));
ewq.roles.add(settings.crewRole);
}, index*5000)
})
}
})
