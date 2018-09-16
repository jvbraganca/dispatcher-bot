const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
  var icao = args;
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
