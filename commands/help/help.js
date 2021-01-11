const {getHelp} = require('./../../functions/getHelp');

module.exports = {
    commands: 'help',
    expectedArgs: '',
    description: 'Displays help menu.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (msg, args, text) => {

        const embedArray = await getHelp(msg.guild, 5);

        var index = 0;

        if(embedArray.length === 1) return msg.channel.send(embedArray[0]);

        msg.channel.send(embedArray[0]).then(message => {

            message.react('➡️');
                        
            const collector = message.createReactionCollector(
                (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id == msg.author.id,
                {time: 5*60000}
            );

            collector.on('collect', reaction => {
                message.reactions.removeAll().then(async () => {
                    reaction.emoji.name == '⬅️' ? index -- : index++;
                    await message.edit(embedArray[index]);
                    if (index != 0) await message.react('⬅️');
                    if (index < embedArray.length - 1) message.react('➡️');
                });
            });
        });
    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
};