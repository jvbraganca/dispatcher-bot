const Discord = module.require("discord.js");
const snekfetch = require('snekfetch');
module.exports.run = async (bot, message, args) => {
  var icao = args;
    snekfetch.get(`https://avwx.rest/api/taf/${icao}?options=summary`)
    .send({ usingGoodRequestLibrary: true })
    .then(r => {
      let embed = new Discord.RichEmbed()
        .setAuthor(`TAF de ${icao} de ${r.body.Meta.Timestamp}`)
        .setColor('258FE8')
        .setDescription(r.body['Raw-Report']);
      message.channel.send({ embed: embed});
    return;
  });
}
module.exports.help = {
  name: "taf",
  usage: "Digite !taf ICAO para obter o TAF da localidade"
}
