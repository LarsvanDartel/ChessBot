const {getRules} = require('./../../functions/getRules');
const {getAllRules} = require('./../../functions/getAllRules');

module.exports = {
    commands: 'rules',
    expectedArgs: '<all | concept>',
    description: 'Displays the rules of chess.',
    minArgs: 0,
    callback: async (msg, args, text) => {
        if(text === 'all') {
            embedArray = await getAllRules();

            var index = 0;

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
        } else {
            msg.reply(await getRules(text));
        }
    },
    permissions: [],
    requiredRoles: [],
    requiredChannel: true
}