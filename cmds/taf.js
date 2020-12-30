const Discord = module.require("discord.js");
const axios = require('axios')

axios.defaults.headers.common['Authorization'] = process.env.AVWX_TOKEN

module.exports.run = async (bot, message, args) => {
  const icao = args[0].toUpperCase();
  await axios.get(`https://avwx.rest/api/taf/${icao}?options=summary&format=json`)
    .then(response => {
      console.log(response);
      const { data } = response
      const embed = {
        hexColor: "#3480eb",
        title: `TAF de ${icao} de ${data.time.dt}`,
        description: data.raw,
        fields: [
          {
            name: "Valido entre",
            value: `${data.start_time.repr} - ${data.end_time.repr}`
          }
        ],
        thumbnail: {
          url: "https://cdn.discordapp.com/app-icons/490642659426304011/053e005a8c51442329fceef6361543e9.png" 
        },
        footer: {
          text: "Dispatcher Bot - Braganssão"
        }
      }
    console.log(embed);
    message.channel.send({ embed: embed })
    return;
  })
    .catch(err => console.warn('> ERROR: ', err))
  }
module.exports.help = {
  name: "taf",
  usage: "Digite .taf ICAO para obter o TAF da localidade"
}
