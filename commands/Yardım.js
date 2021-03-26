const Discord = require("discord.js"),
client = new Discord.Client();
const db = require("quick.db");
const conf = require("../config.js") 

module.exports.run = async (client, message, args, settings, embed) => {

};

exports.config = {
  name: "yardım",
  guildOnly: true,
  aliases: ["help"],
};