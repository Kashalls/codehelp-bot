const { Command, Stopwatch } = require("klasa");
const { inspect } = require("util");
const discord = require("discord.js"); //eslint-disable-line

module.exports = class EvalCommand extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ["ev"],
            permLevel: 10,
            description: "Evaluates arbitrary Javascript.",
            usage: "<expression:str>",
            usageDelim: "",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [...code]) {
        const client = msg.client; // eslint-disable-line
        const guild = msg.guild; // eslint-disable-line 
        const settings = this.client.settings; // eslint-disable-line
        const start = new Stopwatch();
        try {
            const evaled = eval(code.join(" "));
            let ogeval = evaled;
            if (evaled instanceof Promise) ogeval = await ogeval;
            if (typeof evaled !== "string") ogeval = inspect(ogeval, { depth: this.depth, showHidden: true });
            const cleanEval = this.client.methods.util.clean(ogeval);
            if (ogeval.length > 1950) {
                const haste = await this.client.haste(cleanEval, "js").catch(console.error);
                msg.send(`**Took:** \`${start.stop()}\`, **Typeof:** \`${this.getComplexType(evaled).type}\`
\`Input:\`
${this.client.methods.util.codeBlock("js", code.join(" "))}
\`Output:\` **Evaled code was over 2000 letters Here yo go **${haste}`).catch(console.error);
            } else {
                msg.send(`**Took:** \`${start.stop()}\`, **Typeof:** \`${this.getComplexType(evaled).type}\`
\`Input:\`
${this.client.methods.util.codeBlock("js", code.join(" "))}
\`Output:\`
${this.client.methods.util.codeBlock("js", cleanEval)}
`).catch(console.error);
            }
        } catch (err) {
            console.log(`Eval error:`, err.stack);
            msg.send(`
**Took:** \`${start.stop()}\`
\`Input:\`
${this.client.methods.util.codeBlock("js", code.join(" "))}
\`Error:\`
${this.client.methods.util.codeBlock("js", err)}`).catch(console.error);
            if (err.stack) this.client.emit("error", err.stack);
        }
    }

    async init() {
        this.depth = 0;
    }

    getType(value) {
        if (value === null) return String(value);
        return typeof value;
    }

    getComplexType(value) {
        const basicType = this.getType(value);
        if (basicType === "object" || basicType === "function") return { basicType, type: this.getClass(value) };
        return { basicType, type: basicType };
    }

    getClass(value) {
        return value && value.constructor && value.constructor.name ?
            value.constructor.name :
            {}.toString.call(value).match(/\[object (\w+)\]/)[1];
    }


};
