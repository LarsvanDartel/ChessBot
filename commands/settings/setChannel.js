const Database = require("@replit/database")
const db = new Database()


module.exports = {
    commands: 'setChannel',
    expectedArgs: '<channel>',
    permissionError: 'You need admin permissions to run this command.',
    description: 'Change the bot\'s channel.',
    minArgs: 1,
    maxArgs: 1,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const settings = await db.get(guild.id);
        const newChannel = guild.channels.cache.find(c => c.type == 'text' && c.permissionsFor(guild.client.user).has('SEND_MESSAGES') && c.id == text.substring(2, text.length-1));
        if(!newChannel) return channel.send(`Channel ${text} was not found or the bot doesn't have permissions to send messages in the channel.`);
        channel.send(`Chess channel has been updated to ${text}.`);
        settings.settings.channelID = newChannel.id;
        await db.set(guild.id, settings);
        newChannel.send('This is the new chess channel.');
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannel: true
}