const Database = require("@replit/database")
const db = new Database();
const {defaultSettings} = require('./../functions/defaultSettings');
const {defaultGame} = require('./../functions/defaultGame');

const validatePermissions = (permissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]
    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`)
        }
    }
}

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You don\'t have the correct permissions to run this command.',
        description = '',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback,
        requiredChannel = true
    } = commandOptions;

    if(typeof commands === 'string') commands = [commands];

    console.log(`Registering command ${commands[0]}`);

    if(permissions.length){
        if(typeof permissions === 'string') permissions = [permissions];
        validatePermissions(permissions);
    }

    if(requiredRoles.length){
        if(typeof requiredRoles === 'string') {
            requiredRoles = [requiredRoles ];
        }
    }

    client.on('message', async msg => {
        if(msg.author.bot) return;
        if(msg.channel.type == 'dm') return;

        const {member, content, guild} = msg;

        if(!db.get(guild.id)){
            await db.set(guild.id, {game: defaultGame(), settings: defaultSettings(guild)});
        }

        const {game, settings} = await db.get(guild.id);
        const {prefix, channelID} = settings;
        
        for(const alias of commands){
            if(content.toLowerCase().startsWith(`${prefix.toLowerCase()}${alias.toLowerCase()}`)){
                if(!member.hasPermission('ADMINISTRATOR') && requiredChannel && msg.channel.id !== channelID) {
                    const channel = guild.channels.cache.get(channelID);
                    msg.reply(`The bot only functions in the ${channel} channel.`);
                }

                for(const permission of permissions){
                    if(!member.hasPermission(permission)) {
                        msg.reply(permissionError);
                        return;
                    }
                }
                for(const requiredRole of requiredRoles){
                    const role = guild.roles.cache.find(role => role.name === requiredRole);
                    if(!role || !member.roles.cache.has(role.id)) {
                        msg.reply(`You must have the ${role} role to use this command.`);
                        return;
                    }
                }

                const args = content.split(/[ ]+/);
                args.shift();
                if(args.length < minArgs || (maxArgs !== null && args.length > maxArgs)){
                    msg.reply(`Incorrect syntax! Use \`${prefix}${alias} ${expectedArgs}\``);
                    return;
                }

                callback(msg, args, args.join(' '))

                return;
            }
        }
    })
}