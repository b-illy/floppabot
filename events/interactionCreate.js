export default async (client, i) => {
    switch (i.type) {
        case 1:  // ping
            client.logger.verbose("ping interaction received");
            i.acknowledge();
            break;
        case 2:  // application command
            if(!client.commands.get(i.data.name)) {  // command not found and does not exist
                i.createMessage("Command no longer exists");
                return;
            }

            client.logger.verbose(`Slash command ${i.data.name} used by ${i.member.username}#${i.member.discriminator} (${i.member.id})`);

            // acknowledge command, giving the "waiting..." text response to show that it is working
            await i.acknowledge();
            try {
                // run the command and store the outputted message
                const res = await client.commands.get(i.data.name).run(client, i, null, i.member, i.channel);
                // send the follow up message
                i.createFollowup(
                    res.content,
                    res.file ?? null
                );
            } catch (err) {
                i.createFollowup("An error occured while running this command.");
                client.logger.error(err.stack);
            }
            break;
        case 3:  // message component
            client.logger.warn("message component update received, but this is not yet implemented");
            break;
        default:
            client.logger.error(new Error("unknown interaction type").stack);
    }
}