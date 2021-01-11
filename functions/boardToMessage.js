const Discord = require('discord.js');
const Database = require("@replit/database");
const {Chess} = require('chess.js');
const db = new Database();


const boardToMessage = async function(guild){
    const {game, settings} = await db.get(guild.id);
    const chess = new Chess(game.fen);
    const fen = `?fen=${game.fen}`;
    const orientation = (chess.turn() == 'w') ? '&orientation=white' : '&orientation=black';
    const size = '&size=400';
    const history = game.history;
    console.log(history);
    const lastFen = (history.length > 0) ? `&lastMove=${history[history.length-1]}` : '';
    var check = '';
    if(chess.in_check() && settings.showCheck){
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
    const coordinates = (settings.showCoordinates) ? '&coordinates=true' : '&coordinates=false';
    const colors = `&colors=${settings.theme}`;
    const url = `https://ChessWebServer.larsvandartel.repl.co/board.png${fen.split(' ').join('%20')}${orientation}${size}${lastFen}${check}${coordinates}${colors}`;
    console.log(url);
    return new Discord.MessageEmbed().setImage(url);
}

module.exports = {boardToMessage};