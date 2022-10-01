import CryptoJS from "crypto-js";

export default {
    name: "crypto",
    description: "various crypto functions such as sha2 hashing and base64 encode/decode",
    options: [
        {
            name: "mode",
            description: "which crypto function to use",
            type: 3,  // string
            required: true,
            choices: [
                {
                    name: "base64encode",
                    value: "base64encode"
                },
                {
                    name: "base64decode",
                    value: "base64decode"
                },
                {
                    name: "sha256",
                    value: "sha256"
                },
                {
                    name: "sha512",
                    value: "sha512"
                },
                {
                    name: "hmac sha256",
                    value: "hmac sha256"
                },
                {
                    name: "hmac sha512",
                    value: "hmac sha512"
                },
                {
                    name: "md5 (insecure!)",
                    value: "md5"
                }
            ],
        },
        {
            name: "input",
            description: "input data to perform the crypto function on",
            type: 3,  // string
            required: true
        }
    ],
    run: async (client, interaction, message, member, channel) => {
        let mode;
        let input;
        let output;
        if (interaction) {
            // get mode and input directly from provided command options
            mode = interaction.data.options.find(n => n.name == "mode").value;
            input = interaction.data.options.find(n => n.name == "input").value;
        } else {
            // get this file's command object for future usage
            const command = client.commands.get(message.command);

            // get all accepted modes from the command options instead of repeating them here
            const modes = command.options.find(n => n.name == "mode").choices.map(m => m.name);

            // check for correct structure and arguments and show usage if not
            const usageMsg = `Usage: \`${process.env.PREFIX}${command.name} <${modes.join(" | ")}> <input>\``;
            if (message.args.length < 2 || !modes.includes(message.args[0])) return { content: usageMsg };

            // read first argument as mode and all remaining args as input
            mode = message.args[0];
            input = message.args.slice(1).join(" ");
        }

        switch (mode) {
            case "base64encode":
                output = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input));
                break;
            case "base64decode":
                output = CryptoJS.enc.Base64.parse(input).toString(CryptoJS.enc.Utf8);
                break;
            case "sha256":
                output = CryptoJS.SHA256(input);
                break;
            case "sha512":
                output = CryptoJS.SHA512(input);
                break;
            case "hmac sha256":
                output = CryptoJS.HmacSHA256(input);
                break;
            case "hmac sha512":
                output = CryptoJS.HmacSHA256(input);
                break;
            case "md5":
                output = CryptoJS.MD5(input);
                break;
            default:
                throw new Error("Unknown mode for crypto command");
        }

        return { content: `Output of ${mode}:\`\`\`${output}\`\`\`` };
    }
}