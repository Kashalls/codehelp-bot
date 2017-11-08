const { Monitor } = require("klasa");
const codeRegex = new RegExp(/```(?:js|json|javascript)?\n?((?:\n|.)+?)\n?```/ig);
const Linter = require("eslint").Linter;
const linter = new Linter();

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true
        });
    }

    async run(msg) {
        let code = ``;
        const groups = codeRegex.exec(msg.content);
        if (groups && groups[1] && groups[1].length) code = groups[1];
        if (!code) return;

        const errors = linter.verify(code, { rules: { semi: 2, indent: 2 } });
        console.log("errors", errors);
        if (errors.length) msg.react("❎");
        else if (!errors.length || !errors) msg.react("✅");
    }


};
