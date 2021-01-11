const fs = require('fs');
const path = require('path')
const Discord = require('discord.js');


const getRules = async function(concept){
    const embed = new Discord.MessageEmbed()
        .setColor(14971173)
        .setFooter('This bot was made by Lars73#0152. If you have any questions, feel free to DM.')

    if(!concept) embed.setDescription('**Choose one of the following concepts.**');
    const constructMessage = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                constructMessage(path.join(__dirname, dir, file))
            } else if (!concept){
                const {title} = require(path.join(__dirname, dir, file));
                embed.setDescription(`${embed.description}\n${title}`);
            } else {
                var {title, fields, symbol, imageUrl} = require(path.join(__dirname, dir, file));
                if(title.toLowerCase() == concept){
                    if(imageUrl) embed.setImage(imageUrl);
                    if(symbol) title = `${title} (${symbol})`;
                    embed.setTitle(title).addFields(fields);
                    return;
                }
            }
        }
    }
    constructMessage('./../rules');
    return embed.addField('Source:','https://en.wikipedia.org/wiki/Rules_of_chess');;
}

module.exports = {getRules};