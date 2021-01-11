const Database = require("@replit/database")
const db = new Database()


module.exports = {
    commands: 'challenge',
    expectedArgs: '<member> (as <black | white>)',
    description: 'Challenge someone to a game of chess.',
    minArgs: 1,
    maxArgs: 3,
    callback: async (msg, args, text) => {
        const {guild, channel} = msg;
        const {game, settings} = await db.get(guild.id);
        if(args.length == 2) return;
        if(game.fen !== null) return channel.send('There is currently a game being played, please wait for this game to end before starting a new game.')
        if(game.challenge !== null) return channel.send('There is already someone being challenged, please wait.')

        const challenger = msg.member;
        const memberString = (args[0].includes('!')) ? args[0].split('!').join('') : args[0];
        const member = guild.members.cache.find(m => m.toString() == memberString);
        
        if(!member) return channel.send(`Member ${args[0]} cannot be found.`);
        if(member.user.bot) return channel.send(`You cannot challenge a bot.`);
        if(challenger.id == member.id) return channel.send('You cannot challenge yourself.');

        var flipped = (args[2] && args[2].toLowerCase() == 'black');
        game.challenge =  {challenger: challenger.id, member: member.id, flipped: flipped};
        
        await db.set(guild.id, {game: game, settings: settings});
        
        channel.send(`${args[0]}. You have been challenged by ${challenger.toString()}. \nDo you accept this challenge? (${settings.prefix}accept / ${settings.prefix}decline)`);
        setTimeout(async function(){
            const newGame = await db.get(guild.id);
            if(newGame.game.challenge !== null){
                channel.send(`${challenger.toString()}, it looks like ${member.toString()} is not responding.`)
                newGame.game.challenge = null;
                await db.set(guild.id, {game: newGame.game, settings:newGame.settings});
            }
        }, 20*1000);

    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
}