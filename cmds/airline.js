const Discord = module.require("discord.js");
const axios = require('axios');

module.exports.run = async (bot, message, args) => {
  var icao = args;
  axios.all([
    //Gets name and Callsign
    axios.get(`https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airlines/designators/code-list?api_key=${icaoApiKey}&format=json&states=&operators=${icao}`),
    //Gets Operator Risk Profile
    axios.get(`https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airlines/risk/profile-stats?api_key=${icaoApiKey}&states=&format=json&operators=${icao}`)
  ]).then(axios.spread((response1, response2) => {
    //Round the number to 2 decimals
    var fleet_age = response2.data['0'].av_fleet_age;
    var fleet_age = fleet_age.toFixed(2);
    let embed = new Discord.RichEmbed()
      .setAuthor(response1.data['0'].operatorName)
      .setColor('258FE8')
      .addField("Modelos de aeronaves", `${response2.data['0'].models}`, true)
      .addField("Quantidade de aeronaves", `${response2.data['0'].aircraft}`, true)
      .addField("# acidentes em 5 anos", `${response2.data['0'].accidents_5y}`, true)
      .addField("# acidentes fatais em 5 anos", `${response2.data['0'].fatalaccidents_5y}`)
      .addField("Pais de origem", `${response2.data['0'].countryName}`, true)
      .addField("Media de idade da frota", `${fleet_age}`, true)
      .addField("Aeronaves 25+ anos", `${response2.data['0'].aircraft_over_25y}`, true)
      .addField("# de rotas", `${response2.data['0'].routes}`)
      .addField("# de conexoes", `${response2.data['0'].connections}`, true)
      .addField("# de destinos", `${response2.data['0'].destinations}`, true)
      .addField("# de voos por ano", `${response2.data['0'].annual_flights}`, true)
      .addField("# de voos intl por ano", `${response2.data['0'].annual_international_flights}`);
    message.channel.send({ embed: embed});
    return;
  }))
  .catch(error => {
    console.log(error);
  });
}

module.exports.help = {
  name: "airline",
  usage: "Digite !airline ICAO para obter as informacoe dessa companhia"
}
