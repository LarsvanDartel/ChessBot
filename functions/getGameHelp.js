const Discord = require('discord.js');
const Database = require("@replit/database");
const db = new Database();


const getGameHelp = async function(guild){
    const {settings} = await db.get(guild.id)
	const embed = new Discord.MessageEmbed()
        .setColor(12882441)
        .setFooter('This bot was made by Lars73#0152. If you have any questions, feel free to DM.')
        .setAuthor('ChessBot Help Game', 'https://image.freepik.com/free-vector/horse-chess-logo_45189-56.jpg')
        .setDescription(`The game starts when someone issues a challenge using \`${settings.prefix}challenge [member]\`.\n`+
				  `This challenge can now be accepted or declined by either answering yes to accept or no to decline.\n`+
				  `Once a challenge has been accepted, the game will immediately start.\n`+
				  `From this point, both players will take turns making moves, following the rules of chess and the chess notation.\n`+
				  `To get information about the specific rules or notation, use \`${settings.prefix}help chess\`\n`+
				  `The game ends in a win when your opponent is in checkmate or resigns.\n`+
				  `The game ends in a draw following the 50-move rule, stalemate, threefold repetition or insufficient material.`
		);
        
    return embed;
}

module.exports = {getGameHelp};