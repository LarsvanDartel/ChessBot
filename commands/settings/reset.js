const Database = require("@replit/database");
const db = new Database();
const {defaultSettings} = require('./../../functions/defaultSettings');
const {defaultGame} = require('./../../functions/defaultGame');
module.exports = {
    commands: 'reset',
    expectedArgs: '',
    permissionError: 'You need admin permissions to run this command.',
    description: 'Resets server settings to default settings.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {
        await db.set(msg.guild.id, {game: defaultGame(), settings:defaultSettings(msg.guild)});
        console.log(await db.get(msg.guild.id));
        return;
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannel: false
}