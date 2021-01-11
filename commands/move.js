const Database = require("@replit/database")
const db = new Database()
const {Chess} = require('chess.js')
const Discord = require('discord.js')
const {boardToMessage} = require('./../functions/boardToMessage');
const {defaultGame} = require('./../functions/defaultGame')

module.exports = {
    commands: 'move',
    expectedArgs: '<move>',
    description: 'Make a move using the official chess notation.',
    minArgs: 1,
    maxArgs: 1,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const {game, settings} = await db.get(guild.id);
        if(game.fen == null) return;
        var chess = new Chess(game.fen);
        var move = null;
        if(chess.turn() == 'b' && msg.member.id == game.blackID){
            move = chess.move(text, {sloppy: true});
        } else if(chess.turn() == 'w' && msg.member.id == game.whiteID){
            move = chess.move(text, {sloppy: true});
        } else {
            let message = await channel.send(`${msg.member.toString()} please don't interrupt the game by sending messages.`);
            setTimeout(() => {
                msg.delete();
                message.delete();
            }, 5000);
            return;
        }
        if(move !== null){
            game.history.push(`${move.from}${move.to}`);
            game.lastFen = game.fen;
            game.fen = chess.fen();
            await db.set(guild.id, {game: game, settings: settings});
            const message = channel.messages.cache.get(game.messageID);
            await message.edit(await boardToMessage(guild));
            if(chess.game_over()){
                const white = guild.members.cache.get(game.whiteID);
                const black = guild.members.cache.get(game.blackID);
                console.log(`${game.whiteID}->${white}`)
                console.log(`${game.blackID}->${black}`)
                const embed = new Discord.MessageEmbed()
                    .setTitle(`The game between ${white.user.username} and ${black.user.username} has ended.`);
                embed.setColor(10197915);
                if(chess.in_checkmate()){
                    if(chess.turn() == 'b') embed.setDescription(`${white.toString()} has won by checkmate!`).setColor(16777215)
                    else embed.setDescription(`${black.toString()} has won by checkmate!`).setColor(1);
                } else if(chess.in_stalemate) embed.setDescription(`Draw by stalemate.`);
                else if(chess.in_threefold_repetition()) embed.setDescription(`Draw by threefold repetition.`);
                else if(chess.insufficient_material()) embed.setDescription(`Draw by insufficient material.`);
                else embed.setDescription(`Draw.`);
                embed.addField("White :white_large_square:", `${white.user.username}`, true);
                embed.addField("Black :black_large_square:", `${black.user.username}`, true);
                channel.send(embed);
                await db.set(guild.id, {game: defaultGame(), settings: settings});
            }
        } else {
            let temp = await channel.send(`The move ${text} is illegal.`);
            setTimeout(() => temp.delete(), 5000);      
        }
        setTimeout(() => msg.delete(), 1000);
    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
}