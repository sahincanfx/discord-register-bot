const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db");
const conf = require("../config.js") 

module.exports.run = async (client, message, args, settings, embed) => {

if (message.channel.id != settings.commandChannel) return message.channel.send(embed.setDescription("Bu komut sadece komutlar kanalında kullanılabilir.")).then(qwe => qwe.delete({timeout: 3 * 1000}));

message.channel.send(embed.setDescription(`
:tada: Sunucumuzda toplam **${message.guild.memberCount}** adet üye bulunmakta.
:tada: Sunucumuzun sesli kanallarında toplam **${message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size)}** adet üye bulunmakta.
:tada: Sunucumuzun tagında toplam **${message.guild.members.cache.filter(m => m.user.username.includes(settings.tag)).size}** adet üye bulunmakta.
`))
};

exports.config = {
  name: "say",
  guildOnly: true,
  aliases: ["Say"],
};