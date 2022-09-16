import fs from "fs";

export default (client) => {
    console.log(`Now ready on ${client.user.username}#${client.user.discriminator}`);

    // register/load commands
    const commandFiles = fs.readdirSync("./commands");
    for (let i in commandFiles) {
        import(`../commands/${commandFiles[i]}`).then(command => {
            command = command.default;
            // types: 1=slash command, 2=user, 3=message
            client.createCommand({
            name: command.name,
            description: command.description,
            options: command.options || []
            });
            
            client.commands.set(command.name, command);

            console.log(`Registered command: ${command.name}`); 
        });  
    }
}