export default {
    name: "avatar",
    description: "gets a user's avatar",
    options: [
        {
            name: "userid",
            description: "ID of the user whose avatar is to be fetched",
            type: 3,
            required: false
        },
        {
            name: "user",
            description: "user whose avatar is to be fetched",
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

        return { content: target.avatarURL };
    }
}