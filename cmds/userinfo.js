const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
  let embed = new Discord.RichEmbed()
    .setAuthor("Suas informacoes")
    .setColor("258FE8")
    .addField("Nome", `${message.author.username}#${message.author.discriminator}`)
    .addField("Criado em", message.author.createdAt);
  message.channel.send({ embed: embed});
  return;
}

module.exports.help = {
  name: "userinfo",
  usage: "Pega as informacoes"
}
