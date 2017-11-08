const { Event } = require("klasa");

module.exports = class KlasaReadyEvent extends Event {

    run() {
        this.client.config.prefixMention = new RegExp(`^<@!?${this.client.user.id}> |^((?:Hey |Ok )?code(?:,|!) +)`, "i");
    }

};
