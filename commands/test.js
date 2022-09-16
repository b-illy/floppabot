export default {
    name: "test",
    description: "test command",
    options: [],
    run: (client, interaction, message, member, channel) => {
        return { content: `what the floppa <@${member.user.id}>!` };
    }
}