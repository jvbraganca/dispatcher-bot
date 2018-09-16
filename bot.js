const Discord = require("discord.js");
const prefix = "!";
const snekfetch = require('snekfetch');
const axios = require('axios');
// Setting up my API Keys, you can do it here as a string, I am setting these variables on the server side
const awApiKey = process.env.AW_API_KEY; // AW stands for Aisweb
const awApiPass = process.env.AW_API_PASS; // AW stands for Aisweb
const icaoApiKey = process.env.ICAO_API_KEY; // This is the key for the ICAO API key

// const awApiKey = "1308347209"; // AW stands for Aisweb
// const awApiPass = "d384847b-6e6a-11e8-a51a-00505680c1b4"; // AW stands for Aisweb
// const icaoApiKey = "000b1180-b9d8-11e8-84f7-7d88bffacca3"; // This is the key for the ICAO API key
// // End of API Keys
const bot = new Discord.Client({disableEveryone: true,});
bot.on("ready", async () => {
  console.log(`Yaaaay, let's roll! ${bot.user.username}`);
  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
  } catch (e) {
    console.log(e.stack);
  }
});
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);
  if(!command.startsWith(prefix)) return;
  switch (command) {
    case `${prefix}userinfo`:
      let embed = new Discord.RichEmbed()
        .setAuthor("Suas informacoes")
        .setColor("258FE8")
        .addField("Nome", `${message.author.username}#${message.author.discriminator}`)
        .addField("Criado em", message.author.createdAt);
      message.channel.send(embed);
      return;
    break;
    case `${prefix}mute`:
    let toMute = message.guild.member(message.mentions.users.first());
    let role = message.guild.roles.find(r => r.name === "Mutado");
    if (!role) {
      try {
        role = await message.guild.createRole({
          name: "Mutado",
          color: "#D613C7",
          permissions: []
        });
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(roles, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (e) {
        console.log(e.stack);
      }
      await toMute.addRole(role);
      message.channel.sendMessage("Eu o mutei");
      return;
    }
    break;
    case `${prefix}metar`:
      var icao = args;
      snekfetch.get(`http://avwx.rest/api/metar/${icao}?options=&format=json&onfail=cache`)
      .send({ usingGoodRequestLibrary: true })
      .then(r => {
        let embed = new Discord.RichEmbed()
          .setAuthor(`Metar de ${icao} de ${r.body.Meta.Timestamp}`)
          .setColor('258FE8')
          .setDescription(r.body.Sanitized)
          .addField("Regra de voo", r.body['Flight-Rules']);
        message.channel.send(embed);
        return;
      });
    break;
    case `${prefix}taf`:
      var icao = args;
      snekfetch.get(`https://avwx.rest/api/taf/${icao}?options=summary`)
      .send({ usingGoodRequestLibrary: true })
      .then(r => {
        let embed = new Discord.RichEmbed()
          .setAuthor(`TAF de ${icao} de ${r.body.Meta.Timestamp}`)
          .setColor('258FE8')
          .setDescription(r.body['Raw-Report']);
        message.channel.send(embed);
        return;
      });
    break;
    case `${prefix}airline`:
      var icao = args;
      axios.all([//Gets name and Callsign
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
        message.channel.send(embed);
        return;
      }))
      .catch(error => {
        console.log(error);
      });

    break;
    default:
  }
});
bot.login(process.env.BOT_TOKEN);
