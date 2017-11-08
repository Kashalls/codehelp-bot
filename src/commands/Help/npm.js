const { Command } = require("klasa");
const { get } = require("snekfetch");

module.exports = class npmCommand extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 5,
            aliases: ["npmjs"],
            botPerms: ["EMBED_LINKS"],
            description: "Gets information on an NPM package.",
            usage: "<Package:string>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [...query]) {
        query = query.join(" ").toLowerCase();
        try {
            const { body } = await get(`https://registry.npmjs.com/${query}`);
            const version = body.versions[body["dist-tags"].latest];
            let deps = version.dependencies ? Object.keys(version.dependencies) : null;
            let maintainers = body.maintainers.map(user => user.name);
            if (maintainers.length > 10) {
                const len = maintainers.length - 10;
                maintainers = maintainers.slice(0, 10);
                maintainers.push(`...${len} more.`);
            }
            if (deps && deps.length > 10) {
                const len = deps.length - 10;
                deps = deps.slice(0, 10);
                deps.push(`...${len} more.`);
            }
            // Now we just need to present the data to the end user.
            const embed = new this.client.methods.Embed()
                .setColor("RANDOM")
                .setThumbnail("https://i.imgur.com/T0VLGPf.png")
                .setURL(version.homepage)
                .setAuthor(body.name, "https://i.imgur.com/ErKf5Y0.png", version.homepage)
                .setDescription(`${body.description || "No description."}
**Version:** ${body["dist-tags"].latest}
**License:** ${body.license}
**Author:** ${body.author ? body.author.name : "Unknown"}
**Modified:** ${new Date(body.time.modified).toDateString()}
**Main File:** ${version.main}
**Dependencies:** ${deps && deps.length ? deps.join(", ") : "None"}
**Download:** [${body.name}](https://www.npmjs.com/package/${query})`);

            return msg.sendEmbed(embed);
        } catch (err) {
            if (err.status === 404) throw "Could not find any results.";
            console.log(err);
        }
    }

};
