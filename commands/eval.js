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
    run: (client, interaction, message, member, channel) => {
        if (member.id != process.env.OWNER) {
            return { content: "This command is only for the bot owner" };
        } else {
            let code;
            if (message) {
                code = message.args.join(" ");
            } else {
                code = interaction.data.options.find(n => n.name == "code").value;
            }

            try {
                const evaled = eval(code);
                const output = `\`\`\`js\n${evaled}\n\`\`\``;
                if (output.length >= 2000) {
                    return {
                        content: "Output was too large, see attached file instead",
                        file: {
                            file: evaled,
                            name: "output.txt"
                        }
                    };
                } else {
                    return { content: output };
                }
            } catch (err) {
                return { content: `\`\`\`\n${err}\n\`\`\`` };
            }
        }
    }
}