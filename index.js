const Discord = require('discord.js');
const { Chess } = require('chess.js');

const config = require('./config.json');
const functions = require('./functions');
const keepAlive = require('./server');

const client = new Discord.Client();

const settings = new Map();
const games = new Map();
const channels = new Map();
const prefixs = new Map();
const challenges = new Map();
const messages = new Map();

const defaultGame = function(){
    return {
        white:undefined,
        black:undefined,
        chess: undefined,
        draw: undefined,
        takeback: undefined
    };
}

const defaultSettings = function () {
    return {
        showCheck: true,
        theme: 'lichess-brown',
        showCoordinates: true
    };
}

const updateStatus = function(){
	client.user.setPresence({activity: {name: `chess on ${client.guilds.cache.size} servers.`, type: 'PLAYING'}, status: 'online'});
}

// returns settings message
const getSettings = function(guild){
    if(!settings.has(guild)) settings.set(guild, defaultSettings());
    const guildSettings = settings.get(guild);
    if(!prefixs.has(guild)) prefixs.set(guild, 'c!');
    const prefix = prefixs.get(guild);
    const embed = new Discord.MessageEmbed()
        .setColor(8026746)
        .setFooter('This bot was made by PittyPfert#6643. If you have any questions, feel free to DM.')
        .setAuthor('ChessBot Settings', 'https://icons-for-free.com/iconfiles/png/512/settings+icon-1320184981403058053.png')
        .addField('Show Check. Show if any player is currently in check by highlighting the King\'s square.',`${guildSettings.showCheck},\nuse \`${prefix}settings showCheck [true|false]\` to change.`)
        .addField('Theme. Color theme for the chessboard',`${guildSettings.theme},\nuse \`${prefix}settings setTheme \n[wikipedia|lichess-brown|lichess-blue]\` \nto change. For examples, see here:`, true)
        .addField('Examples', 'Wikipedia: :yellow_square::orange_square:\nLichess Brown: :yellow_square::brown_square:\nLichess Blue: :white_large_square::blue_square:', true)
        .addField('Show Coördinates. If true, coördinates will be shown on the side of the board.', `${guildSettings.showCoordinates},\nuse \`${prefix}settings showCoördinates [true|false]\` to change.`);

    return embed;
}

// returns help message
const getHelp = function(guild){
    if(!prefixs.has(guild)) prefixs.set(guild, 'c!');
    const prefix = prefixs.get(guild);
    const embed = new Discord.MessageEmbed()
        .setColor(12882441)
        .setFooter('This bot was made by PittyPfert#6643. If you have any questions, feel free to DM.')
        .setAuthor('ChessBot Help', 'https://images.vexels.com/media/users/3/152864/isolated/preview/2e095de08301a57890aad6898ad8ba4c-yellow-circle-question-mark-icon-by-vexels.png')
        .addField(':question:Help',`\`${prefix}help\` \n\`${prefix}help [command]\`\n\`${prefix}help game\``, true)
        .addField('\u200B', '\u200B', true)
        .addField(':chess_pawn:Function','Displays this menu.\nDisplays info about the usage of the command.\nHelp with commands used during a game.', true)
        .addField(':gear:Settings', `\`${prefix}settings\`\n\`${prefix}settings showCheck\`\n\`${prefix}settings setTheme\`\n\`${prefix}settings showCoördinates\`\n\`${prefix}settings setPrefix\`\n\`${prefix}settings setChannel\``, true)
        .addField(':chess_pawn:Function', 'Displays the settings menu.\nShow if any player is in check.\nSets the color theme for the chessboard.\nShow coördinates on the side of the board.\nChanges the bot\'s prefix\n Changes the bot\'s text channel.', true);
    return embed;
}

// returns game help message
const getGameHelp = function(guild){
    if(!prefixs.has(guild)) prefixs.set(guild, 'c!');
    const prefix = prefixs.get(guild);
	const embed = new Discord.MessageEmbed()
        .setColor(12882441)
        .setFooter('This bot was made by PittyPfert#6643. If you have any questions, feel free to DM.')
        .setAuthor('ChessBot Help Game', 'https://image.freepik.com/free-vector/horse-chess-logo_45189-56.jpg')
        .setDescription(`The game starts when someone issues a challenge using \`${prefix}challenge [member]\`.\n`+
				  `This challenge can now be accepted or declined by either answering yes to accept or no to decline.\n`+
				  `Once a challenge has been accepted, the game will immediately start.\n`+
				  `From this point, both players will take turns making moves, following the rules of chess and the chess notation.\n`+
				  `To get information about the specific rules or notation, use \`${prefix}help chess\`\n`+
				  `The game ends in a win when your opponent is in checkmate or resigns.\n`+
				  `The game ends in a draw following the 50-move rule, stalemate, threefold repetition or insufficient material.`
		);
        
    return embed;
}

const getChessHelp = function(guild, concept){
    if(!prefixs.has(guild)) prefixs.set(guild, 'c!');
    const prefix = prefixs.get(guild);
	const embed = new Discord.MessageEmbed()
		.setColor(12882441)
        .setFooter('This bot was made by PittyPfert#6643. If you have any questions, feel free to DM.')
        .setAuthor('ChessBot Chess Help', 'https://image.freepik.com/free-vector/horse-chess-logo_45189-56.jpg')
	const embedArray = [];
	
	if(!concept){
		embed.setDescription(`Use \`${prefix}help chess [concept]\` to get help about a specific concept or use \`${prefix}help chess all\` to go through all concepts.`)
	}
}

client.on('ready', () => {
    console.log(`Logged in as: ${client.user.tag}`);
	keepAlive();
    client.user.setPresence({activity: {name: `chess on ${client.guilds.cache.size} servers.`, type: 'PLAYING'}, status: 'online'});
});

// USE DATABASE HERE
client.on('guildCreate', (guild) =>{
    functions.getGeneralChannel(guild).send('Hello');
    if(!settings.has(guild)) settings.set(guild, defaultSettings());
    if(!games.has(guild)) games.set(guild, defaultGame());
    if(!channels.has(guild)) channels.set(guild, functions.getChessChannel(guild));
    if(!prefixs.has(guild)) prefixs.set(guild, 'c!');
    if(!challenges.has(guild)) challenges.set(guild, undefined);
});

client.on('message', async (msg) => {
    if(!games.has(msg.guild)) games.set(msg.guild, defaultGame());
    if(!settings.has(msg.guild)) settings.set(msg.guild, defaultSettings());
    if(!channels.has(msg.guild)) channels.set(msg.guild, functions.getChessChannel(msg.guild));
    if(!prefixs.has(msg.guild)) prefixs.set(msg.guild, 'c!');
    if(!challenges.has(msg.guild)) challenges.set(msg.guild, undefined);

    if(msg.channel !== channels.get(msg.guild)) return;
    if(msg.author.bot) return;
    const prefix = prefixs.get(msg.guild);
    if(msg.content.toLowerCase().startsWith(prefix.toLowerCase())){
        const [command, ...args] = msg.content.toLowerCase().substring(prefix.length).split(' ');
        switch (command) {
            case 'help':
                if(args.length == 0) return msg.channel.send(getHelp(msg.guild));
                if(args[0] == 'game') return msg.channel.send(getGameHelp(msg.guild));
				if(args[0] == 'chess') {
					args.shift();
					return msg.channel.send(getChessHelp(msg.guild, args.join(' ')));
				}
                switch(args.join(' ')){
                    case 'help':
                        msg.channel.send(`\`${prefix}help\` **Displays help menu.**\n`+
                                                `\`${prefix}help [command]\` **Displays info about the usage of the command.**\n`+
                                                `\`${prefix}help game\` **Help with commands used during a game.**\n`+
												`\`${prefix}help chess\` **Help with chess rules and notation.**`
                                                );
                        break;
                    case 'help [command]':
                        msg.channel.send(`\`${prefix}help [command]\` **Displays info about the usage of the command.**`);
                        break;
                    case 'help game':
                        msg.channel.send(`\`${prefix}help game\` **Help with commands used during a game.**`);
                        break;
					case 'help chess':
						msg.channel.send(`\`${prefix}help chess\` **Help with chess rules and notation.**`);
						break;
                    case 'settings':
                        msg.channel.send(`\`${prefix}settings\` **Displays the settings menu.**\n`+
                                                `\`${prefix}settings showCheck [true|false]\` **Show if any player is in check.**\n`+
                                                `\`${prefix}settings setTheme[wikipedia|lichess-brown|lichess-blue]\` **Sets the color theme for the chessboard.**\n`+
                                                `Wikipedia: :yellow_square::orange_square: Lichess Brown: :yellow_square::brown_square:  Lichess Blue: :white_large_square::blue_square:\n`+
                                                `\`${prefix}settings showCoördinates [true|false]\` **Show coördinates on the side of the board.**\n`+
                                                `\`${prefix}settings setPrefix\` **Changes the bot\'s prefix.**\n`+
                                                `\`${prefix}settings setChannel\` **Changes the bot\'s text channel.**`
                                                );
                        break;
                    case 'settings showCheck':
                        msg.channel.send(`\`${prefix}settings showCheck [true|false]\` **Show if any player is in check.**`);
                        break;
                    case 'settings setTheme':
                        msg.channel.send(`\`${prefix}settings setTheme[wikipedia|lichess-brown|lichess-blue]\` **Sets the color theme for the chessboard.**\n`+
                                                `Wikipedia: :yellow_square::orange_square: Lichess Brown: :yellow_square::brown_square:  Lichess Blue: :white_large_square::blue_square:
                                                `);
                        break;
                    case 'settings showCoördinates':
                        msg.channel.send(`\`${prefix}settings showCoördinates [true|false]\` **Show coördinates on the side of the board.**`);
                        break;
                    case 'settings setPrefix':
                        msg.channel.send(`\`${prefix}settings setPrefix [prefix]\` **Changes the bot\'s prefix.**`);
                        break;
                    case 'settings setChannel':
                        msg.channel.send(`\`${prefix}settings setChannel [channel]\` **Changes the bot\'s text channel.**`);
                        break;
                    case 'challenge':
                        msg.channel.send(`\`${prefix}challenge [member] (as [white|black])\` **Challenge someone to a game of chess.**`);
                        break;
                }
                break;
            case 'settings':
                if(args.length == 0) return msg.channel.send(getSettings(msg.guild));
                var currentSettings = settings.get(msg.guild);

                switch(args[0]){
                    case 'showcheck':
                        if(args.length <= 1) return msg.channel.send(`Incorrect usage, use \`${prefix}settings showCheck [true|false]\``);
                        currentSettings.showCheck = args[1] == 'true';
                        settings.set(msg.guild, currentSettings);
                        msg.channel.send(`Checks will ${(args[1] == 'true') ? 'now' : 'no longer'} be shown.`);
                        break;
                    case 'settheme':
                        if(args.length <= 1) return msg.channel.send(`Incorrect usage, use \`${prefix}settings setTheme[wikipedia|lichess-brown|lichess-blue]\``);
                        if(args[1] != 'wikipedia' && args[1] != 'lichess-brown' && args[1] != 'lichess-blue')
                            return msg.channel.send('Choose one of the following themes:\nWikipedia: :yellow_square::orange_square: Lichess Brown: :yellow_square::brown_square:  Lichess Blue: :white_large_square::blue_square:');
                        
                        currentSettings.theme = args[1];
                        settings.set(msg.guild, currentSettings);
                        msg.channel.send(`Theme is now ${args[1]}.`);
                        break;
                    case 'showcoördinates':
                        if(args.length <= 1) return msg.channel.send(`Incorrect usage, use \`${prefix}settings showCoördinates [true|false]\``);
                        currentSettings.showCoordinates = args[1] == 'true';
                        settings.set(msg.guild, currentSettings);
                        msg.channel.send(`Coördinates will ${(args[1] == 'true') ? 'now' : 'no longer'} be shown.`);
                        break;
                    case 'showcoordinates':
                        if(args.length <= 1) return msg.channel.send(`Incorrect usage, use \`${prefix}settings showCoördinates [true|false]\``);
                        currentSettings.showCoordinates = args[1] == 'true';
                        settings.set(msg.guild, currentSettings);
                        msg.channel.send(`Coördinates will ${(args[1] == 'true') ? 'now' : 'no longer'} be shown.`);
                        break;
                    case 'setprefix':
                        if(args.length <= 1) return msg.channel.send(`Incorrect usage, use \`${prefix}settings setPrefix [prefix]\``);
                        prefixs.set(msg.guild, args[1])
                        msg.channel.send(`The bot's prefix is now ${args[1]}.`);
                        break;
                    case 'setchannel':
                        if(args.length <= 1) return msg.channel.send(`Incorrect usage, use \`${prefix}settings setChannel [channel]\``);

                        const channel = msg.guild.channels.cache.find(c => c.type == 'text' && c.permissionsFor(msg.guild.client.user).has('SEND_MESSAGES') && c.id == args[1].substring(2, args[1].length-1));
                        if(!channel) return msg.channel.send(`Channel ${args[1]} was not found or the bot doesn't have permissions to send messages in the channel.`);
                        msg.channel.send(`Chess channel has been updated to ${args[1]}.`);
                        channels.set(msg.guild, channel);
                        channel.send('This is the new chess channel.');
                        break;
            }
            break;
            case 'challenge':
                if(args.length == 0) return msg.channel.send(`Incorrect usage, use \`${prefix}challenge [member] (as [white|black])\``);
                if(games.get(msg.guild).chess) return msg.channel.send('There is currently a game being played, please wait for this game to end before starting a new game.')
                if(challenges.get(msg.guild)) return msg.channel.send('There is already someone being challenged, please wait.')
                
                const challenger = msg.member;
                const memberString = (args[0].includes('!')) ? args[0].split('!').join('') : args[0];
                const member = msg.guild.members.cache.find(m => m.toString() == memberString);
                
                if(!member) return msg.channel.send(`Member ${args[0]} cannot be found.`);
                if(member.user.bot) return msg.channel.send(`You cannot challenge a bot.`);
                if(challenger.id == member.id) return msg.channel.send('You cannot challenge yourself.');
                
                var flipped = false;

                if(args[2]){
                    console.log(args[2]);
                    if(args[2] == 'black'){
                        flipped = true;
                    }
                }

                challenges.set(msg.guild, {challenger: challenger, member: member, flipped: flipped});
                msg.channel.send(`${args[0]}. You have been challenged by ${challenger.toString()}. \nDo you accept this challenge? (yes/no)`);
                setTimeout(function(){
                    if(challenges.get(msg.guild)){
                        msg.channel.send(`${challenger.toString()}, it looks like ${member.toString()} is not responding.`)
                        challenges.set(msg.guild, undefined);
                    }
                }, 15*1000);
                break;
        }
    } else {
        if(msg.content.toLowerCase() == 'yes'){
            const challenge = challenges.get(msg.guild);
            const game = games.get(msg.guild);
            if(game.draw){
                let message = await msg.channel.send(`${game.draw.toString()}, your draw offer has been accepted.`);
                const embed = new Discord.MessageEmbed()
                    .setTitle(`The game between ${game.white.user.username} and ${game.black.user.username} has ended.`)
                    .setColor(10197915)
                    .setDescription("Draw by agreement.")
                    .addField("White :white_large_square:", `${game.white.user.username}`, true)
                    .addField("Black :black_large_square:", `${game.black.user.username}`, true);
                msg.channel.send(embed);
                games.set(msg.guild, defaultGame());
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 2000);
                game.draw = undefined;
                return;
            }
            if(game.takeback){
                let message = await msg.channel.send(`${game.draw.toString()}, your takeback offer has been accepted.`);
                game.chess.undo()
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 2000);
                game.takeback = undefined;
                return;
            }
            if(!challenge) return;
            if(msg.member.id != challenge.member.id) return;
            game.white = (challenge.flipped) ? challenge.member : challenge.challenger;
            game.black = (challenge.flipped) ? challenge.challenger : challenge.member;
            game.chess = new Chess();

            challenges.set(msg.guild, undefined);
            const embed = new Discord.MessageEmbed()
                .setColor(8311585)
                .setTitle('Chess challenge has been accepted.')
                .addField(`${game.white.user.username}`, '**White**', true)
                .addField(`${game.black.user.username}`, '**Black**', true);

            msg.channel.send(embed);
            const message = await msg.channel.send(boardToMessage(msg.guild));
            messages.set(msg.guild, message);
            games.set(msg.guild, game);

        } else if(msg.content.toLowerCase() == 'no'){
            const challenge = challenges.get(msg.guild);
            const game = games.get(msg.guild);
            if(game.draw){
                let message = await msg.channel.send(`${game.draw.toString()}, your draw offer has been declined.`);
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 2000);
                game.draw = undefined;
                return;
            }
            if(game.takeback){
                let message = await msg.channel.send(`${game.draw.toString()}, your takeback offer has been declined.`);
                setTimeout(() => {
                    message.delete();
                    msg.delete();
                }, 2000);
                game.takeback = undefined;
                return;
            }
            if(!challenge) return;
            if(msg.member.id != challenge.member.id) return;

            const embed = new Discord.MessageEmbed()
                .setColor(13632027)
                .setTitle('Chess challenge has been declined.')
            msg.channel.send(embed);
            challenges.set(msg.guild, undefined);
            games.set(msg.guild, defaultGame());
        } else if(msg.content.toLowerCase() == 'offer draw'){
            const game = games.get(msg.guild);
            var message = undefined;
            if(msg.member.id == game.white.id) message = await msg.channel.send(`${game.black.toString()}, ${game.white.toString()} offers you a draw, do you accept it? (yes/no)`);
            if(msg.member.id == game.black.id) message = await msg.channel.send(`${game.white.toString()}, ${game.black.toString()} offers you a draw, do you accept it? (yes/no)`);
            
            game.draw = msg.member;
            
            if(message){
                setTimeout(async () => {
                    if(game.draw){
                        msg.delete();
                        message.delete();
                        message = await msg.channel.send(`${msg.member.toString()}, your draw offer has been declined.`);
                        setTimeout(() => message.delete(), 2000);
                    } else {
                        msg.delete();
                        message.delete();
                    }
                }, 10000);
            } else {
                message = await msg.channel.send(`${msg.member.toString()} please don't interrupt the game by sending messages.`);
                setTimeout(() => {
                    msg.delete();
                    message.delete();
                }, 5000);
                return;
            }
        } else if(msg.content.toLowerCase() == 'offer takeback'){
            const game = games.get(msg.guild);
            var message = undefined;
            if(msg.member.id == game.white.id) message = await msg.channel.send(`${game.black.toString()}, ${game.white.toString()} offers to take back the last move, do you accept it? (yes/no)`);
            if(msg.member.id == game.black.id) message = await msg.channel.send(`${game.white.toString()}, ${game.black.toString()} offers to take back the last move, do you accept it? (yes/no)`);
            
            game.takeback = msg.member;
            
            if(message){
                setTimeout(async () => {
                    if(game.takeback){
                        msg.delete();
                        message.delete();
                        message = await msg.channel.send(`${msg.member.toString()}, your takeback offer has been declined.`);
                        setTimeout(() => message.delete(), 2000);
                    } else {
                        msg.delete();
                        message.delete();
                    }
                }, 10000);
            } else {
                message = await msg.channel.send(`${msg.member.toString()} please don't interrupt the game by sending messages.`);
                setTimeout(() => {
                    msg.delete();
                    message.delete();
                }, 5000);
                return;
            }
        } else if(msg.content == "resign"){
            const game = games.get(msg.guild);
            const embed = new Discord.MessageEmbed()
                .setTitle(`The game between ${game.white.user.username} and ${game.black.user.username} has ended.`)
                .setColor(10197915);

            if(msg.member.id == game.black.id) embed.setDescription(`${game.white.toString()} has won by resignation!`).setColor(16777215)
            else embed.setDescription(`${game.black.toString()} has won by resignation!`).setColor(1);
        
            embed.addField("White :white_large_square:", `${game.white.user.username}`, true)
                 .addField("Black :black_large_square:", `${game.black.user.username}`, true);
            msg.channel.send(embed);
            msg.delete();
            games.set(msg.guild, defaultGame());
        } else {
            const game = games.get(msg.guild);
            if(!game) return;
            var chess = game.chess;
            var moved = false;
            if(game.chess.turn() == 'b' && msg.member.id == game.black.id){
                if(game.chess.move(msg.content, {sloppy: true})) moved = true;
            } else if(game.chess.turn() == 'w' && msg.member.id == game.white.id){
                if(game.chess.move(msg.content, {sloppy: true})) moved = true;
            } else {
                let message = await msg.channel.send(`${msg.member.toString()} please don't interrupt the game by sending messages.`);
                setTimeout(() => {
                    msg.delete();
                    message.delete();
                }, 5000);
                return;
            }
            if(moved){
                games.set(msg.guild, game);
                messages.get(msg.guild).edit(boardToMessage(msg.guild));
                if(chess.game_over()){
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`The game between ${game.white.user.username} and ${game.black.user.username} has ended.`);
                    embed.setColor(10197915);
                    if(chess.in_checkmate()){
                        if(chess.turn() == 'b') embed.setDescription(`${game.white.toString()} has won by checkmate!`).setColor(16777215)
                        else embed.setDescription(`${game.black.toString()} has won by checkmate!`).setColor(1);
                    } else if(chess.in_stalemate) embed.setDescription(`Draw by stalemate.`);
                    else if(chess.in_threefold_repetition()) embed.setDescription(`Draw by threefold repetition.`);
                    else if(chess.insufficient_material()) embed.setDescription(`Draw by insufficient material.`);
                    else embed.setDescription(`Draw.`);
                    embed.addField("White :white_large_square:", `${game.white.user.username}`, true);
                    embed.addField("Black :black_large_square:", `${game.black.user.username}`, true);
                    msg.channel.send(embed);
                    games.set(msg.guild, defaultGame());
                }
            } else {
                let temp = await msg.channel.send(`The move ${msg.content} is illegal.`);
                setTimeout(() => temp.delete(), 5000);      
            }
            setTimeout(() => msg.delete(), 1000);
        }
    }
});

client.login(config.token);

module.exports = updateStatus;