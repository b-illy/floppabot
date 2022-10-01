/*
  imports
*/

import Eris, { Collection, Constants } from "eris";
import { config } from "dotenv";
import fs from "fs";


/*
  basic init
*/

console.log("Starting...");
// dotenv config -- import variables from .env file
config();
// main eris bot setup
const client = new Eris(process.env.TOKEN, {
  intents: [
    Constants.Intents.allNonPrivileged,
    Constants.Intents.guildMembers,  // to fetch users for avatar for example
    Constants.Intents.guildMessages  // to enable classic commands
  ],
  allowedMentions: {
    everyone: false,
    roles: false,
    repliedUser: false
  },
  defaultImageFormat: "png",
  defaultImageSize: 1024,
  restMode: true  // allows fetching users over REST instead of relying on cache
});
// censor token to prevent accidental token leaking since it is no longer needed
process.env.TOKEN = "[censored]";
// loaded commands stored here to be accessed by name
client.commands = new Collection();
// default colour for embeds and whatnot
client.color =  0xE09050;
if (process.env.USE_COLOR != 0) client.color = parseInt(process.env.COLOR, 16);

/*
  event listeners
*/

const eventFiles = fs.readdirSync("./events");
for (let i in eventFiles) {
  const eventFile = eventFiles[i];
  const eventName = eventFile.split(".").slice(0, -1).join(".");
  const event = await import(`./events/${eventFile}`);
  client.on(eventName, event.default.bind(null, client));
  console.log(`Registered event handler: ${eventName}`);
}


client.connect();