const { Client } = require("klasa");
const config = require("./config.json");

class CodeHelper extends Client {
    constructor(options) {
        super(options);

        Object.defineProperty(this, "keys", { value: config });

    }
}

new CodeHelper({
    clientOptions: config.client_options,
    prefix: config.prefix,
    ownerID: config.owner_id,
    typing: false,
    cmdEditing: true,
    cmdPrompt: true,
    readyMessage: (client) => `${client.user.tag}, Ready to help ${client.users.size} users with Coding!!`
}).login(config.token);