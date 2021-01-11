const fs = require('fs');
const path = require('path')
const Discord = require('discord.js');


const getAllRules = async function (){
    const embedArray = [];

    const constructMessage = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                constructMessage(path.join(dir, file))
            } else {
                var {title, fields, symbol, imageUrl} = require(path.join(__dirname, dir, file));
                const embed = new Discord.MessageEmbed();
                if(symbol) title = `${title} (${symbol})`;
                if(imageUrl) embed.setImage(imageUrl);
                embed.setTitle(title).addFields(fields);
                embedArray.push(embed);
            }
        }
    }
    constructMessage('./../rules');
    return embedArray;
}

module.exports = {getAllRules};