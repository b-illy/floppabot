import dateFormat from "dateformat";

const daysAgo = (date) => {
    let now = new Date();
    let diff = now - date;
    return Math.floor(diff / (24 * 60 * 60 * 1000));
}

export default {
    name: "userinfo",
    description: "gets some detailed information about a user",
    options: [
        {
            name: "userid",
            description: "ID of the user whose info to get",
            type: 3,
            required: false
        },
        {
            name: "user",
            description: "user whose info to get",
            type: 6,
            required: false
        }
    ],
    run: async (client, interaction, message, member, channel) => {
        let target = member.user;  // if unable to get user from arguments, send the user their own avatar
        if (interaction) {
            // no option -> use member.user
            if (interaction.data.options) {
                // user option
                if (interaction.data.options.find(n => n.name == "user")) {
                    target = await client.users.get(interaction.data.options.find(n => n.name == "user").value) ?? 
                             await client.getRESTUser(interaction.data.options.find(n => n.name == "user").value) ?? 
                             member.user;
                } 
                // userid option
                else if (interaction.data.options.find(n => n.name == "userid")) {
                    target = await client.users.get(interaction.data.options.find(n => n.name == "userid").value) ?? 
                             await client.getRESTUser(interaction.data.options.find(n => n.name == "userid").value) ?? 
                             member.user;
                }
            }
        } else {
            target = message.mentions[0] ??  // try to get user from mentions
                     client.users.get(message.args[0]) ??  // try to get user from id in first arg
                     member.user;
        }

        // check if this user is in the guild for guild-specific fields
        let targetInGuild = false;
        let targetMember;
        let roles = [];
        const res = await channel.guild.fetchMembers({userIDs: [target.id]});
        if (res.length != 0) {
            targetInGuild = true;
            // also save the member object of this user
            targetMember = res[0];
            // fetch member's roles, sort by position, and map to mentions
            roles = targetMember.roles.sort((a, b) => {
                return (channel.guild.roles.get(b).position) - (channel.guild.roles.get(a).position);
            }).map(id => `<@&${id}>`);
        }

        return { 
            content: {
                embed: {
                    color: target.accentColor ?? client.color,
                    
                    title: `${target.username}#${target.discriminator}`,

                    footer: {
                        text: `ID: ${target.id}`
                    },

                    thumbnail: {
                        url: target.avatarURL
                    },

                    description: `[[click for avatar url]](${target.avatarURL})`,

                    fields: [
                        {
                            name: "Joined this server on:",
                            value: targetInGuild ? `${dateFormat(targetMember.joinedAt, "dS mmmm yyyy")} (${daysAgo(targetMember.joinedAt)} days ago)` : "N/A"
                        },
                        {
                            name: "Created their account on:",
                            value: `${dateFormat(target.createdAt, "dS mmmm yyyy")} (${daysAgo(target.createdAt)} days ago)`
                        },
                        {
                            name: "Roles:",
                            value: targetInGuild ? roles.join(", ") : "N/A"
                        }
                    ]
                }
            }
        }
    }
}