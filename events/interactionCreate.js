export default (client, i) => {
    switch (i.type) {
        case 1:  // ping
            console.log("ping received");
            break;
        case 2:  // application command
            if(!client.commands.get(i.data.name)) {  // command not found and does not exist
                i.createMessage("Command no longer exists");
                return;
            }
            i.acknowledge().then(() => {
                i.createFollowup({
                    content: client.commands.get(i.data.name).run(client, i, null, i.member, i.channel).content,
                    file: client.commands.get(i.data.name).run(client, i, null, i.member, i.channel).file ?? null
                });
            });
            break;
        case 3:  // message component
            console.log("message component update received");
            break;
        default:
            throw new Error("unknown interaction type");
    }
}