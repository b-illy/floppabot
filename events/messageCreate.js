export default (client, message) => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) {
        return;
    } else {
        let args = message.content.split(" ");
        let command = args.shift().substring(process.env.PREFIX.length);

        message.args = args;

        if (client.commands.get(command)) {
            message.channel.createMessage({
                content: client.commands.get(command).run(client, null, message, message.member, message.channel).content,
                file: client.commands.get(command).run(client, null, message, message.member, message.channel).file ?? null,
                messageReference: {
                    messageID: message.id,
                    failIfNotExists: false
                }
            });
        } else {
            return;
        }
    }
}