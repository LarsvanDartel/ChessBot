const Database = require("@replit/database")
const db = new Database()


module.exports = {
    commands: 'setPrefix',
    expectedArgs: '<prefix>',
    permissionError: 'You need admin permissions to run this command.',
    description: 'Change the bot\'s prefix.',
    minArgs: 1,
    maxArgs: 1,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const settings = await db.get(guild.id);
        settings.settings.prefix = text.toLowerCase();
        await db.set(guild.id, settings);
        channel.send(`The prefix is now \`${text}\`.`);
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannel: true
}