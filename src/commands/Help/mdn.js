const { Command } = require("klasa");
const { get } = require("snekfetch");
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 5,
            aliases: ["jsdocs"],
            botPerms: ["EMBED_LINKS"],
            description: "Resources for developers, by developers.",
            usage: "<Searchstring:string>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [...query]) {
        query = query.join(" ");
        try {
            const { body } = await get("https://developer.mozilla.org/en-US/search.json").query({ q: query });
            console.log(await this.client.haste(body.documents[0]));
            if (!body.documents.length) throw "Could not find any results.";
            const data = body.documents[0];
            const embed = new this.client.methods.Embed()
                .setColor(136, 209, 241)
                .setAuthor("MDN", "https://i.imgur.com/DFGXabG.png")
                .setURL(data.url)
                .setTitle(data.title)
                .setThumbnail("https://i.imgur.com/oTsx8S2.png")
                .addField("Tags", data.tags.join(", "))
                .setDescription(data.excerpt);
            return msg.sendEmbed(embed);
        } catch (err) {
            return msg.send(`${msg.author}, Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }

};
