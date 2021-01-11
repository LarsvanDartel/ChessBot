const Database = require("@replit/database")
const db = new Database()


module.exports = {
    commands: 'draw',
    expectedArgs: '',
    description: 'Offer a draw.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const {game, settings} = await db.get(guild.id);
        
        if(game.fen === null) return;
        if(msg.member.id != game.whiteID && msg.member.id != game.blackID) {
            message = await channel.send(`${msg.member.toString()} please don't interrupt the game by sending messages.`);
            setTimeout(() => {
                msg.delete();
                message.delete();
            }, 5000);
            return;
        }
        var message = null;
        const white = guild.members.cache.get(game.whiteID);
        const black = guild.members.cache.get(game.blackID);
        if(msg.member.id == game.whiteID) message = await channel.send(`${black.toString()}, ${white.toString()} offers you a draw, do you accept it? (${settings.prefix}accept / ${settings.prefix}decline)`);
        if(msg.member.id == game.blackID) message = await channel.send(`${white.toString()}, ${black.toString()} offers you a draw, do you accept it? (${settings.prefix}accept / ${settings.prefix}decline)`);

        game.drawID = msg.member.id;
        await db.set(guild.id, {game: game, settings: settings});

        setTimeout(async () => {
            const newGame = await db.get(guild.id);
            if(newGame.game.drawID !== null){
                msg.delete();
                message.delete();
                message = await channel.send(`${msg.member.toString()}, your draw offer has been declined.`);
                setTimeout(() => message.delete(), 2000);
                game.drawID = null;
            } else {
                msg.delete();
                message.delete();
            }
        }, 10000);
    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
}