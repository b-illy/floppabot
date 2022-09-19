export default async (client, message) => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) {
        return;
    } else {
        let args = message.content.split(" ");
        let command = args.shift().substring(process.env.PREFIX.length);

        message.args = args;

        if (client.commands.get(command)) {
            // if content is string, convert to object
            let res = await client.commands.get(command).run(client, null, message, message.member, message.channel);
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

            message.channel.createMessage(
                res.content,
                res.file ?? null
            );
        } else {
            return;
        }
    }
}