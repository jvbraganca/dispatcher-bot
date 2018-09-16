const Discord = require("discord.js");
const prefix = "!";
const snekfetch = require('snekfetch');
const axios = require('axios');
const fs = require("fs");
// Setting up my API Keys, you can do it here as a string, I am setting these variables on the server side
const awApiKey = process.env.AW_API_KEY; // AW stands for Aisweb
const awApiPass = process.env.AW_API_PASS; // AW stands for Aisweb
const icaoApiKey = process.env.ICAO_API_KEY; // This is the key for the ICAO API key
// End of API Keys
const bot = new Discord.Client({disableEveryone: true,});
bot.commands = new Discord.Collection();

fs.readdir("./cmds/", (err, files) => {
  if(err) console.error(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0) {
    console.log("No commands to load!");
    return;
  }
  console.log(`Loading ${jsfiles.length} commands`);
  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`${i + 1}: ${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

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

  let cmd = bot.commands.get(command.slice(prefix.length));
  if(cmd) cmd.run(bot, message, args);
});
bot.login(process.env.BOT_TOKEN);
