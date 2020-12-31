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
    console.log(data.wind_gust);
    // const wind = (typeof data.wind_gust === null) ? `${data.wind_direction.repr}/${data.wind_speed.repr}` : `${data.wind_direction.repr}/${data.wind_speed.repr} rajadas de ${data.wind_gust.repr}`;
    let wind = ''
    if (data.wind_gust !== null) {
      wind = `${data.wind_direction.repr}/${data.wind_speed.repr} rajadas de ${data.wind_gust.repr}`;
    } else {
      wind =`${data.wind_direction.repr}/${data.wind_speed.repr}`;
    }
    wind += ` ${data.units.wind_speed}`

    let clouds = '';
    data.clouds.forEach(cloud => {
      clouds += `${cloud.repr} `;
    })
    let wx_codes = '';
    data.wx_codes.forEach(wx => {
      wx_codes += `${wx.repr} `;
    })
    const embed = {
      color: 1752220,
      title: `Metar de ${icao} de ${data.time.dt}`,
      fields: [
        {
          name: "Reporte completo",
          value: data.sanitized
        },
        {
          name: "Reporte por partes",
          value: `
            **Local: ** ${data.station}
            **Horário da observação: ** ${data.time.dt}
            **Vento :** ${wind}
            **Visibilidade :** ${data.visibility.repr} ${data.units.visibility}
            **Temperatura :** ${data.temperature.repr} º${data.units.temperature}
            **Ponto de orvalho :** ${data.dewpoint.repr} º${data.units.temperature}
            **Altímetro :** ${data.altimeter.repr}
            **Nuvens :** ${clouds}
            **Precipitações: ** ${wx_codes}
            **Condições de voo :** ${data.flight_rules}
            **Remarks :** ${data.remarks}
          `
        },
      ],
      thumbnail: {
        url: "https://cdn.discordapp.com/app-icons/490642659426304011/053e005a8c51442329fceef6361543e9.png" 
      },
      footer: {
        text: "Dispatcher Bot - [Braganssão](https://github.com/jvbraganca/dispatcher-bot/)"
      }
    }
    message.channel.send({ embed })
    return;
  })
  .catch((err) => console.warn('> ERROR: ', err))
}

module.exports.help = {
  name: "metar",
  usage: "Digite .metar ICAO para obter o METAR da localidade"
}
