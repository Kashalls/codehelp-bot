const { Event } = require("klasa");

module.exports = class KlasaReadyEvent extends Event {

    run() {
        this.client.config.prefixMention = new RegExp(`^<@!?${this.client.user.id}> |^((?:Hey |Ok )?code(?:,|!) +)`, "i");
        this.client.user.setActivity(`Code Helper IS FUKING READY TO HELP YOU! (because you suck at coding)`);
    }

};
