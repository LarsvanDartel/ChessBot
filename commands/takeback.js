const Database = require("@replit/database")
const db = new Database()


module.exports = {
    commands: 'takeback',
    expectedArgs: '',
    description: 'Offer a takeback.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const {game, settings} = await db.get(guild.id);
        
        if(game.fen === null) return;
        if(game.lastFen === null) {
            const message =  await channel.send('There is no move to be taken back.');
            setTimeout(() => {
                msg.delete();
                message.delete();
            }, 5000);
            return;
        }
        var message = null;
        const white = guild.members.cache.get(game.whiteID);
        const black = guild.members.cache.get(game.blackID);
        if(msg.member.id == game.whiteID) message = await channel.send(`${black.toString()}, ${white.toString()} offers to take back the last move, do you accept it? (${settings.prefix}accept / ${settings.prefix}decline)`);
        if(msg.member.id == game.blackID) message = await channel.send(`${white.toString()}, ${black.toString()} offers to take back the last move, do you accept it? (${settings.prefix}accept / ${settings.prefix}decline)`);
        
        game.takebackID = msg.member.id;
        await db.set(guild.id, {game: game, settings:settings});
        if(message !== null){
            setTimeout(async () => {
                const newGame = await db.get(guild.id);
                if(newGame.game.takebackID !== null){
                    msg.delete();
                    message.delete();
                    message = await channel.send(`${msg.member.toString()}, your takeback offer has been declined.`);
                    setTimeout(() => message.delete(), 2000);
                    game.takebackID = null;
                } else {
                    msg.delete();
                    message.delete();
                }
            }, 10000);
        } else {
            message = await channel.send(`${msg.member.toString()} please don't interrupt the game by sending messages.`);
            setTimeout(() => {
                msg.delete();
                message.delete();
            }, 5000);
            return;
        }
    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
}