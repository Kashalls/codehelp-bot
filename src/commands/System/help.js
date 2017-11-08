const { Command } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ["commands"],
            description: "Display help for a command.",
            usage: "[Command:cmd]"
        });
    }

    async run(msg, [cmd]) {
        if (cmd) {
            const info = [`📘 | **Help Message** | \`${cmd.name}\``,
                `${cmd.description}`,
                ``,
                `🗒 | ***Command Usage***`,
                `\`${cmd.usage.fullUsage(msg)}\``,
                ``,
                `🗒 | ***Extended Help***`,
                cmd.extendedHelp].join("\n");
            return msg.sendMessage(info, { split: true });
        }
        const help = await this.buildHelp(msg);
        const catergorys = Object.keys(help);
        const helpMsg = [];

        helpMsg.push(`**${this.client.user.username}'s Command List \n\nUse** \`${msg.guildSettings.prefix}help <commandname>\` **for more details about a command**\n`);

        for (let cat = 0; cat < catergorys.length; cat++) {
            helpMsg.push(`\u200b\n**${catergorys[cat]} Commands**\n\n`);
            helpMsg.push(`${help[catergorys[cat]].join("")}`);
            helpMsg.push("\n\u200b");
        }
        msg.author.send(helpMsg.join(""), { split: { char: "\u200b" } })
            .then(() => { if (msg.channel.type !== "dm" && this.client.user.bot) msg.sendMessage(msg.language.get("COMMAND_HELP_DM")); })
            .catch(() => { if (msg.channel.type !== "dm" && this.client.user.bot) msg.sendMessage(msg.language.get("COMMAND_HELP_NODM")); });
    }

    async buildHelp(msg) {
        const help = {};
        const commandNames = Array.from(this.client.commands.keys());
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

        await Promise.all(this.client.commands.map(command =>
            this.client.inhibitors.run(msg, command, true)
                .then(() => {
                    if (!help.hasOwnProperty(command.category)) help[command.category] = [];
                    help[command.category].push(`${msg.guildSettings.prefix}${command.name.padEnd(longest)} → \`${command.description}\`\n`);
                    return;
                })
                .catch((e) => {
                    console.log(e);
                    // noop
                })
        ));
        return help;
    }

};
