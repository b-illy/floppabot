export default {
    name: "test",
    description: "test command",
    options: [],
    run: (client, interaction, message) => {
        if (interaction) {
            interaction.createMessage(`what the floppa <@${interaction.member.user.id}>!`);
        } else {
            message.channel.createMessage(`what the floppa <@${message.member.user.id}>!`);
        }
    }
}