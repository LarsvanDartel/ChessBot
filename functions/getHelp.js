const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const Database = require("@replit/database")
const db = new Database()


const getHelp = async function(guild, length){
    const {settings} = await db.get(guild.id);

    const embedArray = [];
    var fields = [];
    var current = 0;

    const embed = new Discord.MessageEmbed()
        .setColor(12882441)
        .setFooter('This bot was made by Lars73#0152. If you have any questions, feel free to DM.')
        .setAuthor('ChessBot Help', 'https://images.vexels.com/media/users/3/152864/isolated/preview/2e095de08301a57890aad6898ad8ba4c-yellow-circle-question-mark-icon-by-vexels.png')        

    const baseFile = 'command-base.js';
    const commandBase = require(`./../commands/${baseFile}`);

    const constructMessage = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                constructMessage(path.join(dir, file))
            } else if(file !== baseFile){
                var {commands, expectedArgs, description} = require(path.join(__dirname, dir, file));
                
                if(typeof commands === 'string') commands = [commands];
                if(!expectedArgs) expectedArgs = '';
                if(!description) description = '';
                fields.push({name: `${settings.prefix}${commands[0]} ${expectedArgs}`, value:`**${description}**`});
                current++;
            }
            if(current === length){
                embedArray.push(new Discord.MessageEmbed(embed).addFields(fields));
                fields = [];
                current = 0;
            }
        }
    }
    constructMessage('./../commands');
    return embedArray;
}

module.exports = {getHelp};