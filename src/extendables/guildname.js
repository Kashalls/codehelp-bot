const { Extendable } = require("klasa");
const guildRegex = new RegExp(/^(\d{17,19})$/);

module.exports = class guildnameExtendable extends Extendable {

    constructor(...args) {
        super(...args, ["ArgResolver"], { klasa: true });
    }

    async extend(arg, currentUsage, possible, repeat, msg) { //eslint-disable-line
        const matches = guildRegex.exec(arg);
        if (matches) return await this.guild(matches[1], currentUsage, possible, repeat, msg);
        const search = arg.toLowerCase();
        const guilds = this.client.guilds.filterArray(guildFilterInexact(search));
        if (guilds.length === 1) return guilds[0];
        const exactGuilds = guilds.filter(guildFilterExact(search));
        if (exactGuilds.length === 1) return exactGuilds[0];
        if (currentUsage.type === "optional" && !repeat) return null;
        if (exactGuilds.length > 15) throw "Multiple guilds found. Please be more specific.";
        throw `${currentUsage.possibles[possible].name} Must be a vaild name or id`;
    }


};

function guildFilterExact(search) {
    return guild => guild.name.toLowerCase() === search;
}

function guildFilterInexact(search) {
    return guild => guild.name.toLowerCase().includes(search);
}