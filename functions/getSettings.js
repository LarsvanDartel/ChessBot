const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const Database = require("@replit/database")
const db = new Database()


const getSettings = async function(guild){
    const {settings} = await db.get(guild.id);
    const embed = new Discord.MessageEmbed()
        .setColor(8026746)
        .setFooter('This bot was made by Lars73#0152. If you have any questions, feel free to DM.')
        .setAuthor('ChessBot Settings', 'https://icons-for-free.com/iconfiles/png/512/settings+icon-1320184981403058053.png')
        .addField('Prefix', settings.prefix)
        .addField('Channel', guild.channels.cache.get(settings.channelID))
        .addField('Theme', settings.theme)
        .addField('showCoördinates', settings.showCoordinates)
        .addField('showCheck', settings.showCheck)
        
    return embed;
}

module.exports = {getSettings};