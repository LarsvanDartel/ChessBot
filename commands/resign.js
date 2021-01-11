const Database = require("@replit/database")
const db = new Database()
const {defaultGame} = require('./../functions/defaultGame')
const Discord = require('discord.js')
module.exports = {
    commands: 'Resign',
    expectedArgs: '',
    description: 'resign your game.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const {game, settings} = await db.get(guild.id);
        if(!game.fen) return;
        const white = guild.members.cache.get(game.whiteID);
        const black = guild.members.cache.get(game.blackID);
        const embed = new Discord.MessageEmbed()
            .setTitle(`The game between ${white.user.username} and ${black.user.username} has ended.`)
            .setColor(10197915);
        
        if(msg.member.id == game.blackID) embed.setDescription(`${white.toString()} has won by resignation!`).setColor(16777215);
        else if(msg.member.id == game.whiteID) embed.setDescription(`${black.toString()} has won by resignation!`).setColor(1);
        else return;
        
        embed.addField("White :white_large_square:", `${white.user.username}`, true)
             .addField("Black :black_large_square:", `${black.user.username}`, true);
        
        channel.send(embed);
        msg.delete();
        
        await db.set(guild.id, {game: defaultGame(), settings: settings});
    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
}