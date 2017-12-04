const { Client } = require("klasa");
const config = require("./config.json");
const { post } = require("snekfetch");

class CodeHelper extends Client {

    constructor(options) {
        super(options);

        Object.defineProperty(this, "keys", { value: config });
    }

    async haste(input, extension) {
        return new Promise(async (res, rej) => {
            if (!input) return rej("Input argument is required.");
            const { body: { key }} = await post("https://hastebin.com/documents").send(input).catch(e => rej(e));
            res(`https://hastebin.com/${key}${extension ? `.${extension}` : ""}`);
        });
    }

}

new CodeHelper({
    clientOptions: config.client_options,
    prefix: config.prefix,
    ownerID: config.owner_id,
    typing: false,
    cmdEditing: true,
    cmdPrompt: true,
    cmdLogging: true,
    console: { useColor: true },
    readyMessage: (client) => `${client.user.tag}, Ready to help ${client.users.size} users with Coding!!\nInvite: ${client.invite}`
}).login(config.token);
