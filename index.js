const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const Database = require("@replit/database")

const config = require('./config.json');
const {getChessChannel} = require('./functions/getChessChannel');
const {defaultGame} = require('./functions/defaultGame');
const {defaultSettings} = require('./functions/defaultSettings');

const keepAlive = require('./server');

const client = new Discord.Client();
const db = new Database();

client.setMaxListeners(0);

client.on('ready', () => {
    console.log(`Logged in as: ${client.user.tag}`);
	keepAlive();
    client.user.setPresence({activity: {name: `chess on ${client.guilds.cache.size} servers.`, type: 'PLAYING'}, status: 'online'});

    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }

  readCommands('commands')
});

client.on('guildCreate', async (guild) => {
    await db.set(guild.id, {game: defaultGame(), settings: defaultSettings(guild)});
});

client.on('guildDelete',  async guild => {
    await db.delete(guild.id);
});


client.login(config.token);