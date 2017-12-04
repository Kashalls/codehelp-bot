const { Extendable } = require("klasa");
const roleRegex = new RegExp(/^(?:<@&)?([0-9]+)>?$/);

module.exports = class rolenameExtendable extends Extendable {

    constructor(...args) {
        super(...args, ["ArgResolver"], { klasa: true });
    }

    async extend(arg, currentUsage, possible, repeat, msg) {
        const matches = roleRegex.exec(arg);
        if (matches) return await this.role(matches[1], currentUsage, possible, repeat, msg);
        const search = arg.toLowerCase();
        const roles = msg.guild.roles.filterArray(roleFilterInexact(search));
        if (roles.length === 1) return roles[0];
        const exactRoles = roles.filter(roleFilterExact(search));
        if (exactRoles.length === 1) return exactRoles[0];
        if (currentUsage.type === "optional" && !repeat) return null;
        if (exactRoles.length > 15) throw "Multiple roles found. Please be more specific.";
        throw `${currentUsage.possibles[possible].name} Must be a vaild name, id or mention`;
    }


};

function roleFilterExact(search) {
    return role => role.name.toLowerCase() === search;
}

function roleFilterInexact(search) {
    return role => role.name.toLowerCase().includes(search);
}
