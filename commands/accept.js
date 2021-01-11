const Database = require("@replit/database")
const db = new Database()
const {Chess} = require('chess.js')
const Discord = require('discord.js')
const {boardToMessage} = require('./../functions/boardToMessage');
const {defaultGame} = require('./../functions/defaultGame');

module.exports = {
    commands: 'accept',
    expectedArgs: '',
    description: 'Accept an offer. Offers include challenge, draw and takeback offers.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {
        const {game, settings} = await db.get(msg.guild.id);
        const {challenge} = game;
        const {guild, channel} = msg;
        if(game.drawID !== null){
            const draw = guild.members.cache.get(game.drawID);
            const white = guild.members.cache.get(game.whiteID);
            const black = guild.members.cache.get(game.blackID);
            let message = await channel.send(`${draw.toString()}, your draw offer has been accepted.`);

            const embed = new Discord.MessageEmbed()
                .setTitle(`The game between ${white.user.username} and ${black.user.username} has ended.`)
                .setColor(10197915)
                .setDescription("Draw by agreement.")
                .addField("White :white_large_square:", `${white.user.username}`, true)
                .addField("Black :black_large_square:", `${black.user.username}`, true);
            channel.send(embed);
            setTimeout(() => {
                message.delete();
                msg.delete();
            }, 2000);
            await db.set(guild.id, {game: defaultGame(), settings: settings});
            return;
        } else if(game.takebackID !== null){
            const takeback = guild.members.cache.get(game.takebackID);
            let message = await channel.send(`${takeback.toString()}, your takeback offer has been accepted.`);
            game.history.pop();
            game.fen = game.lastFen;                                
            game.lastFen = null;
            game.takebackID = null;
            await db.set(guild.id, {game: game, settings: settings});

            const boardMessage = channel.messages.cache.get(game.messageID);
            await boardMessage.edit(await boardToMessage(guild));

            setTimeout(() => {
                message.delete();
                msg.delete();
            }, 2000);
            return;
        }
        if(challenge == null) return;
        if(msg.member.id != challenge.member) return;
        game.whiteID = (challenge.flipped) ? challenge.member : challenge.challenger;
        game.blackID = (challenge.flipped) ? challenge.challenger : challenge.member;
        game.fen = new Chess().fen();

        game.challenge = null;
        await db.set(guild.id, {game: game, settings: settings});
            
        const white = guild.members.cache.get(game.whiteID);
        const black = guild.members.cache.get(game.blackID);
            
        const embed = new Discord.MessageEmbed()
            .setColor(8311585)
            .setTitle('Chess challenge has been accepted.')
            .addField(`${white.user.username}`, '**White**', true)
            .addField(`${black.user.username}`, '**Black**', true);

        channel.send(embed);
        const message = await channel.send(await boardToMessage(guild));
        game.messageID = message.id;
        await db.set(guild.id, {game: game, settings: settings});

    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
}