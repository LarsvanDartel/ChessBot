const {getSettings} = require('./../../functions/getSettings');


module.exports = {
    commands: 'settings',
    expectedArgs: '',
    description: 'Displays the current settings for this sever.',
    permissionError: 'You need admin permissions to run this command.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {
        msg.reply(await getSettings(msg.guild));
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannel: true
}