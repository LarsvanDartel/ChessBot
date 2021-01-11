const Database = require("@replit/database")
const db = new Database()
const Discord = require('discord.js')

module.exports = {
    commands: 'decline',
    expectedArgs: '',
    description: 'Decline an offer. Offers include challenge, draw and takeback offers.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const {game, settings} = await db.get(guild.id);
        const {challenge} = game;
        if(game.drawID !== null){
            const draw = guild.members.cache.get(game.drawID);
            let message = await channel.send(`${draw.toString()}, your draw offer has been declined.`);
            setTimeout(() => {
                message.delete();
                msg.delete();
            }, 2000);
            game.drawID = null;
            return;
        }
        if(game.takebackID !== null){
            const takeback = guild.members.cache.get(game.takebackID);
            let message = await channel.send(`${takeback.toString()}, your takeback offer has been declined.`);
            setTimeout(() => {
                message.delete();
                msg.delete();
            }, 2000);
            game.takebackID = null;
            return;
        }
        if(game.challenge == null) return;
        if(msg.member.id != challenge.member) return;
        const embed = new Discord.MessageEmbed()
            .setColor(13632027)
            .setTitle('Chess challenge has been declined.')
        channel.send(embed);
        game.challenge = null;
        await db.set(guild.id, {game: game, settings: settings});
    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
}