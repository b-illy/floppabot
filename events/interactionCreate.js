export default async (client, i) => {
    switch (i.type) {
        case 1:  // ping
            console.log("ping interaction received");
            i.acknowledge();
            break;
        case 2:  // application command
            if(!client.commands.get(i.data.name)) {  // command not found and does not exist
                i.createMessage("Command no longer exists");
                return;
            }
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
                console.error(err);
            }
            break;
        case 3:  // message component
            console.log("WARNING: message component update received, but this is not yet implemented");
            break;
        default:
            throw new Error("unknown interaction type");
    }
}