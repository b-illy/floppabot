export default {
    name: "help",
    description: "lists all available commands",
    options: [],
    run: async (client, interaction, message, member, channel) => {
        // add all commands into an array
        let commandArr = [];
        client.commands.forEach(c => {
            commandArr.push(c);
        });

        // sort alphabetically by name
        commandArr.sort((a, b) => {
            let aL = a.name.toLowerCase();
            let bL = b.name.toLowerCase();

            if (aL < bL) return -1;
            if (aL > bL) return 1;
            return 0;
        });

        // construct output message
        let output = "All commands:```\n";
        for (let i in commandArr) {
            output += `${commandArr[i].name} - ${commandArr[i].description}\n`;
        }
        output = output.slice(0, -1) + "```";  // remove trailing newline and close code block

        // classic command help
        if (process.env.ENABLE_CLASSIC_COMMANDS != 0) output = `Classic commands are enabled -- my prefix is ${process.env.PREFIX}\n` + output;

        return { content: output };
    }
}