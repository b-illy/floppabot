export default {
    name: "eval",
    description: "owner-only command to run js code",
    options: [
        {
            name: "code",
            description: "js code to execute",
            type: 3,
            required: true
        }
    ],
    run: (client, interaction, message) => {
        if (interaction) {
            if (interaction.member.id != process.env.OWNER) {
                interaction.createMessage("This command is only for the bot owner");
                return;
            } else {
                interaction.acknowledge().then(() => {
                    const code = interaction.data.options.find(n => n.name == "code").value;
                    try {
                        const output = `\`\`\`js\n${eval(code)}\n\`\`\``;
                        if (output.length >= 2000) {
                            interaction.createFollowup({
                                text: "The result was too large, so here it is as a file:",
                                file: eval(code),
                                name: "result.txt"
                            });
                        } else {
                            interaction.createFollowup(output);
                        }
                    } catch (err) {
                        interaction.createFollowup(`\`\`\`\n${err}\n\`\`\``);
                    }
                });
            }
        } else {
            if (message.member.id != process.env.OWNER) {
                message.channel.createMessage("This command is only for the bot owner");
                return;
            } else {
                const code = message.args.join(" ");
                try {
                    const output = `\`\`\`js\n${eval(code)}\n\`\`\``;
                    if (output.length >= 2000) {
                        message.channel.createMessage({
                            text: "The result was too large, so here it is as a file:",
                            file: eval(code),
                            name: "result.txt"
                        });
                    } else {
                        message.channel.createMessage(output);
                    }
                } catch (err) {
                    message.channel.createMessage(`\`\`\`\n${err}\n\`\`\``);
                }
            }
        }
    }
}