const { Client } = require("klasa");
const config = require("./config.json");
const { get, post } = require("snekfetch");

class CodeHelper extends Client {

    constructor(options) {
        super(options);

        Object.defineProperty(this, "keys", { value: config });
    }

    haste(input, extension) {
        return new Promise((res, rej) => {
            if (!input) rej("Input argument is required.");
            post("https://hastebin.com/documents").send(input).then(body => {
                res(`https://hastebin.com/${body.body.key}${extension ? `.${extension}` : ""}`);
            }).catch(e => rej(e));
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
