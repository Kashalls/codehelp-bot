const { Extendable } = require("klasa");
const channelRegex = new RegExp(/^(?:<#)?([0-9]+)>?$/);

module.exports = class channelnameExtendable extends Extendable {

    constructor(...args) {
        super(...args, ["ArgResolver"], { klasa: true });
    }

    async extend(arg, currentUsage, possible, repeat, msg) {
        const matches = channelRegex.exec(arg);
        if (matches) return await this.channel(matches[1], currentUsage, possible, repeat, msg);
        const search = arg.toLowerCase();
        const channels = msg.guild.channels.filterArray(nameFilterInexact(search));
        if (channels.length === 1) return channels[0];
        const exactChannels = channels.filter(nameFilterExact(search));
        if (exactChannels.length === 1) return exactChannels[0];
        if (currentUsage.type === "optional" && !repeat) return null;
        if (exactChannels.length > 15) throw "Multiple channels found. Please be more specific.";
        throw `${currentUsage.possibles[possible].name} Must be a vaild name, id or mention`;
    }


};

function nameFilterExact(search) {
    return thing => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
    return thing => thing.name.toLowerCase().includes(search);
}
