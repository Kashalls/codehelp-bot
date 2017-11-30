const { Extendable } = require("klasa");
const memberRegex = new RegExp(/^(?:<@!?)?([0-9]+)>?$/);

module.exports = class membernameExtendable extends Extendable {

    constructor(...args) {
        super(...args, ["ArgResolver"], { klasa: true });
    }

    async extend(arg, currentUsage, possible, repeat, msg) {
        const matches = memberRegex.exec(arg);
        if (matches) return await this.member(matches[1], currentUsage, possible, repeat, msg);
        const search = arg.toLowerCase();
        const members = msg.guild.members.filterArray(memberFilterInexact(search));
        if (members.length === 1) return members[0];
        const exactMembers = members.filter(memberFilterExact(search));
        if (exactMembers.length === 1) return exactMembers[0];
        if (currentUsage.type === "optional" && !repeat) return null;
        if (exactMembers.length > 15) throw "Multiple members found. Please be more specific.";
        throw `${currentUsage.possibles[possible].name} Must be a vaild mention, id, username or display name`;
    }


};


function memberFilterExact(search) {
    return mem => mem.user.username.toLowerCase() === search ||
  (mem.nickname && mem.nickname.toLowerCase() === search) ||
  `${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === search;
}

function memberFilterInexact(search) {
    return mem => mem.user.username.toLowerCase().includes(search) ||
  (mem.nickname && mem.nickname.toLowerCase().includes(search)) ||
  `${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search);
}
