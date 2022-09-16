export default (client, interaction) => {
    switch (interaction.type) {
        case 1:  // ping
            console.log("ping received");
            break;
        case 2:  // application command
            client.commands.get(interaction.data.name).run(client, interaction, null);
            break;
        case 3:  // message component
            console.log("message component update received");
            break;
        default:
            throw new Error("unknown interaction type");
    }
}