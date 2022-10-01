/*
  imports
*/

import Eris, { Collection, Constants } from "eris";
import { config } from "dotenv";
import fs from "fs";
import winston from "winston";


/*
  basic init
*/

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

// create logger
client.logger = winston.createLogger({
  level: process.env.VERBOSE_LOGS != 0 ? "verbose" : "info",
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level}] [${info.timestamp}] ${info.message}`)
  )
});
client.logger.info("Starting...");


// loaded commands stored here to be accessed by name
client.commands = new Collection();

// default colour for embeds and whatnot
client.color =  0xE09050;
if (process.env.USE_COLOR != 0) client.color = parseInt(process.env.COLOR, 16);

// make it clear if certain features are enabled
if (process.env.ENABLE_CLASSIC_COMMANDS != 0) client.logger.verbose("Classic commands are enabled");
if (process.env.VERBOSE_LOGS != 0) client.logger.verbose("Verbose logging is enabled");

/*
  event listeners
*/

const eventFiles = fs.readdirSync("./events");
for (let i in eventFiles) {
  const eventFile = eventFiles[i];
  const eventName = eventFile.split(".").slice(0, -1).join(".");
  const event = await import(`./events/${eventFile}`);
  client.on(eventName, event.default.bind(null, client));
  client.logger.verbose(`Registered event handler: ${eventName}`);
}


client.connect();