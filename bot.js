// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const bot = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

bot.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});


bot.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // in this case, we're only going to accept input when the user mentions @botname (Konradd)
  const prefixMention = new RegExp(`^<@!?${bot.user.id}> `);
    const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : '!';

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command) {
    // If we're telling someone to shut up, do that
    if(command === "tell") {
      // Only do if they have the role
      if(message.member.roles.find(r => r.name === "Friend of Konradd")) {
          // shut em up
          const user = getUserFromMention(args[1]);
          if (user) {
            message.channel.send("<@" + user.id + "> shut up")
          }
      } else if(message.member.roles.find(r => r.name === "Enemy of Konradd")) {
          // Mark them for elimination by sending a message to the id below
          client.users.get("248964060945711104").send(`A user by the name ${message.member.user.tag} has been marked for elimination.`);
      } else {
          // add them to the special role
          var role = message.guild.roles.find(role => role.name === "Enemy of Konradd");
          message.member.addRole(role);
      }

    }
  } else {
      // Ok, we're not, so just reply with shut up
      // Only do if they have the role
      if(message.member.roles.find(r => r.name === "Friend of Konradd")) {
        // shut em up
        message.reply("shut up");
    } else if(message.member.roles.find(r => r.name === "Enemy of Konradd")) {
        // Mark them for elimination by sending a message to the id below
        client.users.get("248964060945711104").send(`A user by the name ${message.member.user.tag} has been marked for elimination.`);
    } else {
        // add them to the special role
        var role = message.guild.roles.find(role => role.name === "Enemy of Konradd");
        message.member.addRole(role);
    }
  }
});

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.get(mention);
	}
}

bot.login(config.token);