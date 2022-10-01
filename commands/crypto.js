import CryptoJS from "crypto-js";

export default {
    name: "crypto",
    description: "various crypto functions such as sha2, base64, and aes",
    options: [
        {
            name: "textonly",
            description: "crypto functions that act on a single input string only",
            type: 1,  // subcommand
            options: [
                {
                    name: "function",
                    description: "the crypto function to use",
                    type: 3,  // string
                    required: true,
                    choices: [
                        {
                            name: "base64-encode",
                            value: "base64-encode"
                        },
                        {
                            name: "base64-decode",
                            value: "base64-decode"
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
                            name: "md5",
                            value: "md5"
                        }
                    ]   
                },
                {
                    name: "input",
                    description: "the input text to use this function on",
                    type: 3, // string
                    required: true
                }
            ]
        },
        {
            name: "withsecret",
            description: "more secure crypto functions that take both an input and a secret passphrase",
            type: 1,  // subcommand
            options: [
                {
                    name: "function",
                    description: "the crypto function to use",
                    type: 3,  // string
                    required: true,
                    choices: [
                        {
                            name: "hmac-sha256",
                            value: "hmac-sha256"
                        },
                        {
                            name: "hmac-sha512",
                            value: "hmac-sha512"
                        },
                        {
                            name: "aes256-encrypt",
                            value: "aes256-encrypt"
                        },
                        {
                            name: "aes256-decrypt",
                            value: "aes256-decrypt"
                        }
                    ]   
                },
                {
                    name: "input",
                    description: "the input text to use this function on",
                    type: 3, // string
                    required: true
                },
                {
                    name: "secret",
                    description: "secret passphrase to use with this function",
                    type: 3,  // string
                    required: true
                }
            ]
        }
    ],
    run: async (client, interaction, message, member, channel) => {
        let mode, input, secret, output;
        if (interaction) {
            const subcommand = interaction.data.options.find(n => n.name == "textonly") ?? interaction.data.options.find(n => n.name == "withsecret");

            // get mode and input directly from provided command options
            mode = subcommand.options.find(n => n.name == "function").value;
            input = subcommand.options.find(n => n.name == "input").value;
            if (subcommand.name == "withsecret") secret = subcommand.options.find(n => n.name == "secret").value;
        } else {
            // get this file's command object for future usage
            const command = client.commands.get(message.command);

            // get all accepted modes (and whether they need a secret) from the command options instead of repeating them here
            let modesText = command.options.find(n => n.name == "textonly").options.find(n => n.name == "function").choices.map(m => m.name);
            let modesSecret = command.options.find(n => n.name == "withsecret").options.find(n => n.name == "function").choices.map(m => m.name);

            
            // check if mode selected and argument count are valid and determine if a secret is needed
            const usageMsg = `${message ? "NOTE: slash commands are highly recommended for this command!\n\n" : ""}Usage: \`${process.env.PREFIX}${command.name} <${modesText.concat(modesSecret).join(" | ")}> [one-word secret (if needed)] <input>\``;

            let secretNeeded;
            if (modesText.includes(message.args[0]) && message.args.length >= 2) {
                secretNeeded = false;
            } else if (modesSecret.includes(message.args[0]) && message.args.length >= 3) {
                secretNeeded = true;
            } else {
                return { content: usageMsg };
            }

            // store all necessary arguments in appropriate variables
            mode = message.args[0];
            if (secretNeeded) {
                secret = message.args[1];  // note: secret is limited to one word only using this method
                input = message.args.slice(2).join(" ");
            } else {
                input = message.args.slice(1).join(" ");
            }
        }

        switch (mode) {
            // text only
            case "base64-encode":
                output = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input));
                break;
            case "base64-decode":
                output = CryptoJS.enc.Base64.parse(input).toString(CryptoJS.enc.Utf8);
                break;
            case "sha256":
                output = CryptoJS.SHA256(input);
                break;
            case "sha512":
                output = CryptoJS.SHA512(input);
                break;
            case "md5":
                output = CryptoJS.MD5(input);
                break;
            // need secret
            case "hmac-sha256":
                output = CryptoJS.HmacSHA256(input, secret);
                break;
            case "hmac-sha512":
                output = CryptoJS.HmacSHA256(input, secret);
                break;
            case "aes256-encrypt":
                output = CryptoJS.AES.encrypt(input, secret);
                break;
            case "aes256-decrypt":
                output = CryptoJS.AES.decrypt(input, secret).toString(CryptoJS.enc.Utf8);
                break;
            default:
                throw new Error("Unknown mode for crypto command");
        }

        return { content: `${message ? "NOTE: slash commands are highly recommended for this command!\n\n" : ""}Output of ${mode}:\`\`\`${output}\`\`\`` };
    }
}