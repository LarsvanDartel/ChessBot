const Database = require("@replit/database")
const db = new Database()


module.exports = {
    commands: 'setTheme',
    expectedArgs: '<wikipedia | lichess-brown | lichess-blue>',
    description: 'Change the color theme for the chessboard.',
    permissionError: 'You need admin permissions to run this command.',
    minArgs: 1,
    maxArgs: 1,
    callback: async (msg, args, text) => {
        const {channel, guild} = msg;
        const settings = await db.get(guild.id);
        if(text.toLowerCase() !== 'wikipedia' && text.toLowerCase() !== 'lichess-brown' && text.toLowerCase() !== 'lichess-blue'){
            return channel.send(`${text} is not a theme, choose one of the following: wikipedia, lichess-brown, lichess-blue.`);
        }
        settings.settings.theme = text.toLowerCase();

        await db.set(guild.id, settings);
        channel.send(`Theme is now ${text}`);
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannel: true
}