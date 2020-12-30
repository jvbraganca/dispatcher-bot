const Discord = module.require("discord.js");
const axios = require('axios')
require('dotenv').config()

axios.defaults.headers.common['Authorization'] = process.env.AVWX_TOKEN

module.exports.run = async (bot, message, args) => {
  const icao = args[0].toUpperCase();
  await axios.get(`http://avwx.rest/api/metar/${icao}?options=&format=json&onfail=cache`)
  .then((response) => {
    if (response.status !== 200) return
    const { data } = response
    const embed = {
      hexColor: "#3480eb",
      title: `Metar de ${icao} de ${data.time.dt}`,
      description: data.sanitized,
      fields: [
        {
          name: "Condições de voo",
          value: data.flight_rules
        }
      ],
      thumbnail: {
        url: "https://cdn.discordapp.com/app-icons/490642659426304011/053e005a8c51442329fceef6361543e9.png" 
      },
      footer: {
        text: "Dispatcher Bot - Braganssão"
      }
    }
    message.channel.send({ embed: embed })
    return;
  })
  .catch((err) => console.warn('> ERROR: ', err))
}

module.exports.help = {
  name: "metar",
  usage: "Digite .metar ICAO para obter o METAR da localidade"
}
