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
            await i.acknowledge();
            const res = await client.commands.get(i.data.name).run(client, i, null, i.member, i.channel)
            i.createFollowup(
                res.content,
                res.file ?? null
            );
            break;
        case 3:  // message component
            console.log("WARNING: message component update received, but this is not yet implemented");
            break;
        default:
            throw new Error("unknown interaction type");
    }
}