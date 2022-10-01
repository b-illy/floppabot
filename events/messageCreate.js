export default async (client, message) => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot || process.env.ENABLE_CLASSIC_COMMANDS == 0) {
        return;
    } else {
        let args = message.content.split(" ");
        let command = args.shift().substring(process.env.PREFIX.length);

        message.args = args;
        message.command = command;

        if (client.commands.get(command)) {
            try {
                // run the command and store the outputted message
                let res = await client.commands.get(command).run(client, null, message, message.member, message.channel);
                // if content is string, convert to object
                if (typeof res.content == "string") {
                    res.content = {
                        content: res.content
                    }
                }
                // add content.messageReference to make this message a reply
                res.content.messageReference = {
                    messageID: message.id,
                    failIfNotExists: false
                };
    
                // send response message
                message.channel.createMessage(
                    res.content,
                    res.file ?? null
                );
            } catch (err) {
                message.channel.createMessage({
                    content: "An error occured while running this command.",
                    messageReference: {
                        messageID: message.id,
                        failIfNotExists: false
                    }
                });
                console.error(err);
            }
        } else {
            return;
        }
    }
}