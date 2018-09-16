const Discord = module.require("discord.js");
const snekfetch = require('snekfetch');

module.exports.run = async (bot, message, args) => {
  var icao = args;
  var icao = icao.toUpperCase();
    snekfetch.get(`http://avwx.rest/api/metar/${icao}?options=&format=json&onfail=cache`)
    .send({ usingGoodRequestLibrary: true })
    .then(r => {
      let embed = new Discord.RichEmbed()
        .setAuthor(`Metar de ${icao} de ${r.body.Meta.Timestamp}`)
        .setColor('258FE8')
        .setDescription(r.body.Sanitized)
        .addField("Regra de voo", r.body['Flight-Rules']);
      message.channel.send({ embed: embed});
    return;
  })
}

module.exports.help = {
  name: "metar",
  usage: "Digite !metar ICAO para obter o METAR da localidade"
}
