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

const boardToMessage = function(guild){
    if(!settings.has(guild)) settings.set(guild, defaultSettings());
    if(!games.has(guild)) games.set(guild, defaultGame());
    const game = games.get(guild);
    const chess = game.chess;
    const serverSettings = settings.get(guild);
    const fen = `?fen=${chess.fen()}`;
    const orientation = (chess.turn() == 'w') ? '&orientation=white' : '&orientation=black';
    const size = '&size=400';
    const history = chess.history({verbose: true});
    const lastMove = (history.length > 0) ? `&lastMove=${history[history.length-1].from}${history[history.length-1].to}` : '';
    var check = '';
    if(chess.in_check()){
        for(let i = 1; i <= 8; i++){
            for(let j = 97; j < 105; j++){
                var pos = `${String.fromCharCode(j)}${i}`;
                var piece = chess.get(pos);
                if(piece){
                    if(piece.type == 'k' && piece.color == chess.turn()) check = `&check=${pos}`;
                }
            }
        }
    }
    const coordinates = (serverSettings.showCoordinates) ? '&coordinates=true' : '&coordinates=false';
    const colors = `&colors=${serverSettings.theme}`;
    const url = `https://ChessWebServer.larsvandartel.repl.co/board.png${fen.split(' ').join('%20')}${orientation}${size}${lastMove}${check}${coordinates}${colors}`;
    return new Discord.MessageEmbed().setImage(url);
}

// returns settings message
const getSettings = function(guild){
    if(!settings.has(guild)) settings.set(guild, defaultSettings());
    const guildSettings = settings.get(guild);
    if(!prefixs.has(guild)) prefixs.set(guild, 'c!');
    const prefix = prefixs.get(guild);
    const embed = new Discord.MessageEmbed()
        .setColor(8026746)
        .setFooter('This bot was made by Lars73#0152. If you have any questions, feel free to DM.')
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
        .setFooter('This bot was made by Lars73#0152. If you have any questions, feel free to DM.')
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
        .setFooter('This bot was made by Lars73#0152. If you have any questions, feel free to DM.')
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
    if(msg.author.bot) return;
    if(msg.channel.type == 'dm') return;


    if(!games.has(msg.guild)) games.set(msg.guild, defaultGame());
    if(!settings.has(msg.guild)) settings.set(msg.guild, defaultSettings());
    if(!channels.has(msg.guild)) channels.set(msg.guild, functions.getChessChannel(msg.guild));
    if(!prefixs.has(msg.guild)) prefixs.set(msg.guild, 'c!');
    if(!challenges.has(msg.guild)) challenges.set(msg.guild, undefined);

    if(msg.channel !== channels.get(msg.guild)) return;
    
    const prefix = prefixs.get(msg.guild);
    console.log(msg.content);
    if(msg.content.toLowerCase().startsWith(prefix.toLowerCase())){
        const [command, ...args] = msg.content.toLowerCase().substring(prefix.length).split(' ');
        switch (command) {
            case 'help':
                if(args.length == 0) return msg.channel.send(getHelp(msg.guild));
                if(args[0] == 'game') return msg.channel.send(getGameHelp(msg.guild));
				if(args[0] == 'chess') {
                    if(!prefixs.has(msg.guild)) prefixs.set(msg.guild, 'c!');
                    const prefix = prefixs.get(msg.guild);
                    const embed = new Discord.MessageEmbed()
                        .setColor(12882441)
                        .setFooter('This bot was made by Lars73#0152. If you have any questions, feel free to DM.')
                        .setAuthor('ChessBot Chess Help', 'https://image.freepik.com/free-vector/horse-chess-logo_45189-56.jpg')

                    if(args.length == 1){
                        embed.setDescription(`Use \`${prefix}help chess [concept]\` to get help about a specific concept or use \`${prefix}help chess all\` to go through all concepts.`)
                        return msg.channel.send(embed);
                    }
                    

                    args.shift();
                    const concept = args.join(' ');

                    const embedMap = new Map();
                    // Setup
                    embedMap.set('setup', new Discord.MessageEmbed()
                        .setTitle('Setup')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR%20w%20KQkq%20-%200%201&size=400&coordinates=true')
                        .setDescription('Chess is played on a chessboard, a square board divided into 64 squares (eight-by-eight) of alternating color.\n'+
                                        'No matter what the actual colors of the board, the lighter-colored squares are called "light" or "white",\n'+
                                        'and the darker-colored squares are called "dark" or "black".\n'+
                                        'Sixteen "white" and sixteen "black" pieces are placed on the board at the beginning of the game.\n'+
                                        'The board is placed so that a white square is in each player\'s near-right corner.\n'+
                                        'Horizontal rows are called ranks and vertical rows are called files.\n'+
                                        '\n'+
                                        'At the beginning of the game, the pieces are arranged as shown in the image below:\n'+
                                        'for each side one king, one queen, two rooks, two bishops, two knights, and eight pawns.\n'+
                                        'The pieces are placed, one on a square, as follows:\n'+
                                        ' - The rooks are placed on the outside corners, right and left edge.\n'+
                                        ' - The knights are placed immediately inside of the rooks.\n'+
                                        ' - The bishops are placed immediately inside of the knights.\n'+
                                        ' - The queen is placed on the central square of the same color of that of the player:\n'+
                                        '   white queen on the white square and black queen on the black square.\n'+
                                        ' - The king takes the vacant spot next to the queen.\n'+
                                        ' - The pawns are placed one square in front of all of the other pieces.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // King
                    embedMap.set('king', new Discord.MessageEmbed()
                        .setTitle('King')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/4K3/8/8/8/8%20w%20-%20-%200%201&size=400&coordinates=true&squares=d4,e4,f4,f5,f6,e6,d6,d5')
                        .setDescription('The king moves exactly one square horizontally, vertically, or diagonally. A special move with the king known as castling is allowed only once per player, per game (see castling).')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Queen
                    embedMap.set('queen', new Discord.MessageEmbed()
                        .setTitle('Queen')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/4Q3/8/8/8/8%20w%20-%20-%200%201&size=400&coordinates=true&squares=e6,e7,e8,e4,e3,e2,e1,f5,g5,h5,d5,c5,b5,a5,f6,g7,h8,d6,c7,b8,d4,c3,b2,a1,f4,g3,h2')
                        .setDescription('The queen moves any number of vacant squares horizontally, vertically, or diagonally.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Rook
                    embedMap.set('rook', new Discord.MessageEmbed()
                        .setTitle('Rook')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/4R3/8/8/8/8%20w%20-%20-%200%201&size=400&coordinates=true&squares=e6,e7,e8,e4,e3,e2,e1,f5,g5,h5,d5,c5,b5,a5')
                        .setDescription('A rook moves any number of vacant squares horizontally or vertically. It also is moved when castling.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Bishop
                    embedMap.set('bishop', new Discord.MessageEmbed()
                        .setTitle('Bishop')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/4B3/8/8/8/8%20w%20-%20-%200%201&size=400&coordinates=true&squares=f6,g7,h8,d6,c7,b8,d4,c3,b2,a1,f4,g3,h2')
                        .setDescription('A bishop moves any number of vacant squares diagonally.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Knight
                    embedMap.set('knight', new Discord.MessageEmbed()
                        .setTitle('Knight')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/4N3/8/8/8/8%20w%20-%20-%200%201&size=400&coordinates=true&squares=f7,g6,g4,f3,d3,c4,c6,d7')
                        .setDescription('A knight moves to the nearest square not on the same rank, file, or diagonal. (This can be thought of as moving two squares horizontally then one square vertically, or moving one square horizontally then two squares vertically—i.e. in an "L" pattern.) The knight is not blocked by other pieces: it jumps to the new location.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Pawn
                    embedMap.set('pawn', new Discord.MessageEmbed()
                        .setTitle('Pawn')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/r1r5/1P6/3bb3/4PP2/3P2P1/8%20w%20-%20-%200%201&size=400&coordinates=true&squares=g3,g4,f4,d3,b6&arrows=Gb5a6,Gb5c6')
                        .setDescription('Pawns have the most complex rules of movement:\n'+
                                        'A pawn moves straight forward one square, if that square is vacant.\n'+
                                        'If it has not yet moved, a pawn also has the option of moving two squares straight forward, provided both squares are vacant.\n'+
                                        'Pawns cannot move backwards. Pawns are the only pieces that capture differently from how they move.\n'+
                                        'A pawn can capture an enemy piece on either of the two squares diagonally in front of the pawn\n'+
                                        '(but cannot move to those squares if they are vacant).\n'+
                                        'The pawn is also involved in the two special moves en passant and promotion .')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Check
                    embedMap.set('check', new Discord.MessageEmbed()
                        .setTitle('Check')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/5n2/8/4K3/8/8%20w%20-%20-%200%201&coordinates=true&squares=d4&arrows=Gf5e3&check=e3')
                        .setDescription('A king is in check when it is under attack by at least one enemy piece.\n'+
                                        'It is illegal to make a move that places or leaves one\'s king in check.\n'+
                                        'The possible ways to get out of check are:\n'+
                                        ' - Move the king to a square where it is not in check.\n'+
                                        ' - Capture the checking piece (possibly with the king).\n'+
                                        ' - Block the check by placing a piece between the king and the opponent\'s threatening piece.\n'+
                                        'If it is not possible to get out of check, the king is checkmated and the game is over (see end of game).')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Castling                    
                    embedMap.set('castling', [
                        new Discord.MessageEmbed()
                            .setTitle('Castling')
                            .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=r3k3/8/8/8/8/8/8/4K2R%20w%20-%20-%200%201&size=400&coordinates=true')
                            .setDescription('Castling consists of moving the king two squares towards a rook, then placing the rook on the other side of the king, adjacent to it.\n'+
                                            'Castling is only permissible if all of the following conditions hold:\n'+
                                            ' - The king and rook involved in castling must not have previously moved;\n'+
                                            ' - There must be no pieces between the king and the rook;\n'+
                                            ' - The king may not currently be in check, nor may the king pass through or end up in a square that is under attack by an enemy piece\n'+
                                            '   (though the rook is permitted to be under attack and to pass over an attacked square);\n'+
                                            'The castling must be kingside or queenside as shown in the images below.')
                            .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                        , new Discord.MessageEmbed()
                            .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=2kr4/8/8/8/8/8/8/5RK1%20w%20-%20-%200%201&size=400&coordinates=true')
                            .setDescription('Positions before(above) and after(below) both players castled.')
                            .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                        , new Discord.MessageEmbed()
                            .setImage( 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=r3k2r/8/8/1b5B/8/8/8/RB2K2R%20w%20-%20-%200%201&size=400&coordinates=true&check=e8&arrows=Gh5e8,Gb1,Gb5f1,Gf1')
                            .setDescription('Both players in the image below are not allowed to castle.')
                            .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    ]);
                    // En passant
                    embedMap.set('en passant', new Discord.MessageEmbed()
                        .setTitle('En passant')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/8/Pp6/8/1P6/8%20w%20-%20-%200%201&size=400&coordinates=true&arrows=Ga2,Ga4,Rb4a3&squares=a3')
                        .setDescription('When a pawn advances two squares from its original square and ends the turn adjacent to a pawn of the opponent\'s on the same rank,\n'+
                                        'it may be captured by that pawn of the opponent\'s, as if it had moved only one square forward.\n'+
                                        'This capture is only legal on the opponent\'s next move immediately following the first pawn\'s advance.\n'+
                                        'The image below demonstrates an instance of this: if the white pawn moves from a2 to a4,\n'+
                                        'the black pawn on b4 can capture it en passant, moving from b4 to a3 while the white pawn on a4 is removed from the board.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Pawn promotion
                    embedMap.set('promotion', new Discord.MessageEmbed()
                        .setTitle('Promotion')
                        .setDescription('If a player advances a pawn to its eighth rank, the pawn is then promoted (converted). \n'+
                                       'The player can choose either a queen, rook, bishop or knight to replace the pawn.\n'+
                                       'The choice is not limited to previously captured pieces.\n'+
                                       'Hence it is theoretically possible for a player to have up to nine queens or up to ten rooks, bishops, or knights if all of their pawns are promoted.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // End of game
                    embedMap.set('end of game', new Discord.MessageEmbed()
                        .setTitle('End of game')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR%20w%20-%20-%200%201&size=400&coordinates=true&check=e8&squares=e7&arrows=Gc4f7')
                        .addField('Checkmate', 'If a player\'s king is placed in check and there is no legal move that player can make to escape check,\n'+
                            'then the king is said to be checkmated, the game ends, and that player loses.\n'+
                            'The image below shows an example checkmate position.\n'+
                            'The black king is threatened by the white queen; the square to which the king could move is also threatened;\n'+
                            'it cannot capture the queen, because it would then be in check by the bishop.')
                        .addField('Resignation', 'Either player may resign at any time, conceding the game to their opponent, resulting in a loss.')
                        .addField('Stalemate', 'The game is automatically a draw if the player to move is not in check and has no legal move. This situation is called a stalemate.')
                        .addField('Insufficient material', 'The game is automatically a draw if both players have insufficient material to deliver checkmate.')
                        .addField('Threefold repetition', 'The same board position has occurred three times with the same player to move and all pieces having the same rights to move, including the right to castle or capture en passant.')
                        .addField('Draw by agreement', 'The game is automatically a draw if both players agree to a draw after such an offer is made.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );
                    // Move notation
                    embedMap.set('move notation', new Discord.MessageEmbed()
                        .setTitle('Move notation')
                        .setImage('https://chesswebserver.larsvandartel.repl.co/board.png?fen=3r3r/8/8/R7/4Q2Q/8/8/R6Q%20w%20-%20-%200%201&coordinates=true&squares=e1,a3,f8&arrows=Ga1a3,Ga5a3,Yd8f8,Yh8f8,Re4e1,Rh4e1,Rh1e1')
                        .addField('Notation', 'Each move of a piece is indicated by the piece\'s uppercase letter, plus the coordinate of the destination square.\n'+
                            'For example, Be5 (move a bishop to e5), Nf3 (move a knight to f3).\n'+
                            'For pawn moves, a letter indicating pawn is not used, only the destination square is given. For example, c5 (move a pawn to c5).')
                        .addField('Captures', 'When a piece makes a capture, an "x" is inserted immediately before the destination square.\n'+
                            'For example, Bxe5 (bishop captures the piece on e5).\n'+
                            'When a pawn makes a capture, the file from which the pawn departed is used to identify the pawn. For example, exd5 (pawn on the e-file captures the piece on d5)')
                        .addField('Disambiguating moves', 'When two (or more) identical pieces can move to the same square,\n'+
                            'the moving piece is uniquely identified by specifying the piece\'s letter, followed by (in descending order of preference):\n'+
                            ' 1) the file of departure (if they differ); or\n'+
                            ' 2) the rank of departure (if the files are the same but the ranks differ); or\n'+
                            ' 3) both the file and rank of departure (if neither alone is sufficient to identify the piece)\n'+
                            'In the image below, both black rooks could legally move to f8, so the move of the d8-rook to f8 is disambiguated as Rdf8.\n'+
                            'For the white rooks on the a-file which could both move to a3, it is necessary to provide the rank of the moving piece, i.e., R1a3.\n'+
                            'In the case of the white queen on h4 moving to e1, neither the rank nor file alone are sufficient to disambiguate from the other white queens.\n'+
                            'As such, this move is written Qh4e1.')
                        .addField('Pawn promotion', 'When a pawn promotes, the piece promoted to is indicated at the end of the move notation, pawn promotion is indicated by the equals sign (e8=Q')
                        .addField('Castling', 'Castling is indicated by the special notations O-O (for kingside castling) and O-O-O (queenside castling).')
                        .addField('Check', 'A move that places the opponent\'s king in check usually has the symbol "+" appended. For the bot, this is not necessary')
                        .addField('Checkmate', 'A move that places the opponent\'s king in check usually has the symbol "#" appended. For the bot, this is not necessary.')
                        .setFooter('Source: https://en.wikipedia.org/wiki/Rules_of_chess')
                    );

                    if(concept != 'all'){
                        const val = embedMap.get(concept);
                        if(!val){
                            return msg.channel.send(`Concept ${concept} was not found, choose one of the following concepts: setup, king, queen, rook, bishop, knight, pawn, check, castling, en passant, promotion, end of game, move notation`);
                        }
                        if(Array.isArray(val)){
                            val.forEach(embed => msg.channel.send(embed));
                            return;
                        } 
                        return msg.channel.send(val)
                    }

                    embedArray = [];

                    embedMap.forEach((value, key) => {
                        embedArray.push(value);
                    });

                    var index = 0;

                    msg.channel.send(embedArray[0]).then(message => {

                        message.react('➡️')
                        
                        const collector = message.createReactionCollector(
                            (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id == msg.author.id,
                            {time: 5*60000}
                        )

                        collector.on('collect', reaction => {
                                message.reactions.removeAll().then(async () => {
                                reaction.emoji.name == '⬅️' ? index -- : index++;
                                message.edit(embedArray[index]);
                                if (index != 0) await message.react('⬅️');
                                if (index < embedArray.length - 1) message.react('➡️');
                            });
                        });
                    });
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
                    if(msg.content.includes('black')){
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
            if(!game.chess) return;
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

