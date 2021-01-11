const Database = require("@replit/database");
const db = new Database();
const {defaultGame} = require('./../functions/defaultGame');
const Discord = require('discord.js')
module.exports = {
    commands: 'abort',
    expectedArgs: '',
    permissionError: 'You need admin permissions to run this command.',
    description: 'Aborts the game currently played.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const {game, settings} = await db.get(guild.id);
        if(game.fen == null) return msg.reply('There is currently no game being played.');

        const draw = guild.members.cache.get(game.drawID);
            const white = guild.members.cache.get(game.whiteID);
            const black = guild.members.cache.get(game.blackID);

            const embed = new Discord.MessageEmbed()
                .setTitle(`The game between ${white.user.username} and ${black.user.username} has ended.`)
                .setColor(10197915)
                .setDescription("Aborted game.")
                .addField("White :white_large_square:", `${white.user.username}`, true)
                .addField("Black :black_large_square:", `${black.user.username}`, true);
            channel.send(embed);

        await db.set(guild.id, {game: defaultGame(), settings:settings});
        console.log(await db.get(guild.id));
        return;
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannel: false
}