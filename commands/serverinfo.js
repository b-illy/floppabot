import dateFormat from "dateformat";

const daysAgo = (date) => {
    let now = new Date();
    let diff = now - date;
    return Math.floor(diff / (24 * 60 * 60 * 1000));
}

export default {
    name: "serverinfo",
    description: "gets some detailed information about the server",
    options: [],
    run: async (client, interaction, message, member, channel) => {
        // fetch roles
        let roles = [];
        channel.guild.roles.forEach(r => {
            roles.push(r);
        });
        // sort by position, map to mentions
        roles = roles.sort((a, b) => {
            return (b.position) - (a.position);
        }).map(r => `<@&${r.id}>`);

        return { 
            content: {
                embed: {
                    color: client.color,
                    
                    title: channel.guild.name,

                    footer: {
                        text: `ID: ${channel.guild.id}`
                    },

                    thumbnail: {
                        url: channel.guild.iconURL
                    },

                    description: `[[click for server icon url]](${channel.guild.iconURL})`,

                    fields: [
                        {
                            name: "Members",
                            value: channel.guild.memberCount,
                            inline: true
                        },
                        {
                            name: "Emojis",
                            value: channel.guild.emojis.length ?? 0,
                            inline: true
                        },
                        {
                            name: "Stickers",
                            value: channel.guild.stickers.length ?? 0,
                            inline: true
                        },
                        {
                            name: "Vanity URL",
                            value: channel.guild.vanityURL ?? "[none]",
                            inline: true
                        },
                        {
                            name: "Boost tier",
                            value: channel.guild.premiumTier,
                            inline: true
                        },
                        {
                            name: "Channels",
                            value: channel.guild.channels.size,
                            inline: true
                        },
                        {
                            name: "Server owner:",
                            value: `<@${(await client.users.get(channel.guild.ownerID)).id ?? (await client.getRESTUser(channel.guild.ownerID)).id}>`
                        },
                        {
                            name: "Created on:",
                            value: `${dateFormat(channel.guild.createdAt, "dS mmmm yyyy")} (${daysAgo(channel.guild.createdAt)} days ago)`
                        },
                        {
                            name: "Roles:",
                            value: roles.length != 0 ? roles.join(", ") : "No roles"
                        }
                    ]
                }
            }
        }
    }
}