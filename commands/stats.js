import os from "os";
import fs from "fs";

const makeTimeString = (num) => {
    return `${Math.floor(num/3600)}:${Math.floor(num/60).toString().padStart(2, "0")}:${Math.floor(num%60).toString().padStart(2, "0")}`;
}

export default {
    name: "stats",
    description: "give some stats about the bot",
    options: [],
    run: async (client, interaction, message, member, channel) => {
        const botOwnerUser = client.users.get(process.env.OWNER) ?? client.getRESTUser(process.env.OWNER);
        return { 
            content: {
                embed: {
                    type: "rich",

                    color: client.color,

                    title: "Bot stats",

                    footer: {
                        text: `Bot owned by ${botOwnerUser.username}#${botOwnerUser.discriminator}`
                    },

                    fields: [
                        {
                            name: "Host platform",
                            value: `${os.type()} ${os.machine}`,
                            inline: true
                        },
                        {
                            name: "Uptime",
                            value: `${makeTimeString(client.uptime/1000)}`,
                            inline: true
                        },
                        {
                            name: "Guilds",
                            value: client.guilds.size,
                            inline: true
                        },
                        {
                            name: "Memory usage",
                            value: `${Math.floor(process.memoryUsage().rss/(1024*1024))}MiB/${Math.floor(os.totalmem()/(1024*1024))}MiB`,
                            inline: true
                        },
                        {
                            name: "Node version",
                            value: process.version,
                            inline: true
                        },
                        {
                            name: "Bot version",
                            value: JSON.parse(fs.readFileSync("./package.json")).version,
                            inline: true
                        }
                    ]
                }
            }
        }
    }
}