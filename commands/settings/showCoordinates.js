const Database = require("@replit/database")
const db = new Database()


module.exports = {
    commands: ['showCoördinates', 'showCoordinates'],
    expectedArgs: '<true | false>',
    description: 'Show coördinates in the side margin of the board.',
    permissionError: 'You need admin permissions to run this command.',
    minArgs: 1,
    maxArgs: 1,
    callback: async (msg, args, text) => {
        const settings = await db.get(msg.guild.id);
        settings.settings.showCoordinates = text.toLowerCase() == 'true';
        await db.set(guild.id, settings);
        msg.channel.send(`Coördinates will ${(text.toLowerCase() == 'true') ? 'now' : 'no longer'} be shown.`);
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannel: true
}