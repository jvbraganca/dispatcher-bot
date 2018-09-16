const Discord = require("discord.js");
const prefix = "!";
const snekfetch = require('snekfetch');
// Setting up my API Keys, you can do it here as a string, I am setting these variables on the server side
const awApiKey = process.env.AW_API_KEY; // AW stands for Aisweb
const awApiPass = process.env.AW_API_PASS; // AW stands for Aisweb
const icaoApiKey = process.env.ICAO_API_KEY; // This is the key for the ICAO API key
// End of API Keys
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
    default:
  }
});
bot.login(process.env.BOT_TOKEN);
