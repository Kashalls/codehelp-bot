const { Command } = require("klasa");

module.exports = class examplesCommand extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 5,
            aliases: ["example"],
            botPerms: ["EMBED_LINKS"],
            description: "Gets examples from Discord.js docs",
            usage: "<ExampleSearch:string> [version:regex/stable|master/]",
            usageDelim: " "
        });
    }

    async run(msg, [examplestr = "list", version = "master"]) {
        const docs = this.client.docs[version];
        const examples = docs.custom.examples;
        const files = examples.files;
        if (examplestr === "list") {
            let listofExamples = `** The examples on the Discord.js docs page**\n\n`;
            for (const i in files) listofExamples += `${i}\n`;
            const embed = new this.client.methods.Embed()
                .setColor("RANDOM")
                .setAuthor(`Examples List`, `https://cdn.discordapp.com/icons/222078108977594368/bc226f09db83b9176c64d923ff37010b.webp`)
                .setDescription(listofExamples);
            return msg.sendEmbed(embed);
        }
        const example = files[examplestr];
        if (!example) throw `\`${examplestr}\` does not exist in the docs or docs havent been initilized yet...`;
        const embed = new this.client.methods.Embed()
            .setColor("RANDOM")
            .setAuthor(example.name, `https://cdn.discordapp.com/icons/222078108977594368/bc226f09db83b9176c64d923ff37010b.webp`, this.makeLink(version, example))
            .setDescription(this.client.methods.util.codeBlock(example.type, example.content));
        return msg.sendEmbed(embed);
    }

    makeLink(version, example) {
        return `https://discord.js.org/#/docs/main/${version}/examples/${example.name.toLowerCase()}`;
    }

};
