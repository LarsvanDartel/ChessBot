const Database = require("@replit/database")
const db = new Database()


module.exports = {
    commands: 'showCheck',
    expectedArgs: '<true | false>',
    description: 'Show if any player is currently in check by highlighting the King\'s square.',
    permissionError: 'You need admin permissions to run this command.',
    minArgs: 1,
    maxArgs: 1,
    callback: async (msg, args, text) => {
        const settings = await db.get(msg.guild.id);
        settings.settings.showCheck = text.toLowerCase() == 'true';
        await db.set(guild.id, settings);
        msg.channel.send(`Checks will ${(text.toLowerCase() == 'true') ? 'now' : 'no longer'} be shown.`);
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannel: true
}