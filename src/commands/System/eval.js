const { Command, Stopwatch } = require("klasa");
const { inspect } = require("util");
const discord = require("discord.js"); //eslint-disable-line
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ["ev"],
            permLevel: 10,
            description: "Evaluates arbitrary Javascript.",
            usage: "[Depth:integer{0,5}] <expression:str>",
            usageDelim: " ",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [depth = 0, code]) {
        const client = msg.client; //eslint-disable-line
        const start = new Stopwatch();
        try {
            const evaled = eval(code);
            let ogeval = evaled;
            if (evaled instanceof Promise) ogeval = await ogeval;
            if (typeof evaled !== "string") ogeval = inspect(ogeval, { depth: depth });
            const cleanEval = this.client.methods.util.clean(ogeval);
            if (ogeval.length > 1950) {
                const haste = await this.client.haste(cleanEval, "js").catch(console.error);
                msg.send(`**Took:** \`${start.stop()}\`, **Typeof:** \`${evaled.constructor.name}\`
\`Input:\`
${this.client.methods.util.codeBlock("js", code)}
\`Output:\` **Evaled code was over 2000 letters Here yo go **${haste}`).catch(console.error);
            } else {
                msg.send(`**Took:** \`${start.stop()}\`, **Typeof:** \`${evaled.constructor.name}\`
\`Input:\`\n${this.client.methods.util.codeBlock("js", code)}
\`Output:\` \`\`\`js
${cleanEval}\`\`\`
`).catch(console.error);
            }
        } catch (err) {
            msg.send(`**Took:** \`${start.stop()}
\`Input:\`
${this.client.methods.util.codeBlock("js", code)}
\`ERROR\`
${this.client.methods.util.codeBlock("js", err)}`).catch(console.error);
            if (err.stack) this.client.emit("error", err.stack);
        }
    }

};
