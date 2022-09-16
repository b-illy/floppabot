export default (client, message) => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) {
        return;
    } else {
        let args = message.content.split(" ");
        let command = args.shift().substring(process.env.PREFIX.length);

        message.args = args;

        if (client.commands.get(command)) {
            // add content.messageReference to make this message a reply
            let content = client.commands.get(command).run(client, null, message, message.member, message.channel).content;
            content.messageReference = {
                messageID: message.id,
                failIfNotExists: false
            };

            message.channel.createMessage(
                // content
                content,
                // file
                client.commands.get(command).run(client, null, message, message.member, message.channel).file ?? null
            );
        } else {
            return;
        }
    }
}