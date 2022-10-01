import fs from "fs";

export default async (client) => {
    console.log(`Now ready on ${client.user.username}#${client.user.discriminator}, guilds: ${client.guilds.size}`);
    client.editStatus("online", {
        name: `for /help${process.env.ENABLE_CLASSIC_COMMANDS != 0 ? ` or ${process.env.PREFIX}help` : ""}`,
        type: 3  // watching
    });
    console.log("Loading commands...");
    
    // register/load commands from commands directory
    const commandFiles = fs.readdirSync("./commands");
    for (let i in commandFiles) {
        import(`../commands/${commandFiles[i]}`).then(command => {
            command = command.default;

            // add as a slash command
            client.createCommand({
                name: command.name,
                description: command.description,
                options: command.options ?? []
            });
            
            // add to a collection to easily find and run the command by name
            client.commands.set(command.name, command);
            
            console.log(`Registered command: ${command.name}`); 
        });  
    }   
}