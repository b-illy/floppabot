// requires
import Eris, { Collection } from "eris";
import { config } from "dotenv";
import fs from "fs";

// basic init
console.log("Starting...");
config();  // dotenv init
const client = new Eris(process.env.TOKEN);
process.env.TOKEN = "[censored]";  // prevent accidental token leaking
client.commands = new Collection();  // loaded commands stored here to be accessed by name

// add event listeners
const eventFiles = fs.readdirSync("./events");
for (let i in eventFiles) {
  const eventFile = eventFiles[i];
  const eventName = eventFile.split(".").slice(0, -1).join(".");
  import(`./events/${eventFile}`).then(event => {
    client.on(eventName, event.default.bind(null, client));
    console.log(`Registered event handler: ${eventName}`);
  });
}

client.connect();