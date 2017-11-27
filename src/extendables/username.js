const { Extendable } = require("klasa");
const userRegex = new RegExp(/^(?:<@!?)?([0-9]+)>?$/);

module.exports = class usernameExtendable extends Extendable {

    constructor(...args) {
        super(...args, ["ArgResolver"], { klasa: true });
    }

    async extend(arg, currentUsage, possible, repeat, msg) {
        const matches = userRegex.exec(arg);
        if (matches) return await this.user(matches[1], currentUsage, possible, repeat, msg);
        const search = arg.toLowerCase();
        const users = msg.client.users.filterArray(userFilterInexact(search));
        if (users.length === 1) return users[0];
        const exactUsers = users.filter(userFilterExact(search));
        if (exactUsers.length === 1) return exactUsers[0];
        if (currentUsage.type === "optional" && !repeat) return null;
        if (exactUsers.length > 15) throw "Multiple users found. Please be more specific.";
        throw `${currentUsage.possibles[possible].name} Must be a vaild mention, id or username`;
    }


};

function userFilterExact(search) {
    return user => user.username.toLowerCase() === search ||
  `${user.username.toLowerCase()}#${user.discriminator}` === search;
}

function userFilterInexact(search) {
    return user => user.username.toLowerCase().includes(search) ||
  `${user.username.toLowerCase()}#${user.discriminator}`.includes(search);
}