
const getGeneralChannel = function (guild){
    if(guild.channels.cache.has(guild.id)) return guild.channels.cache.get(guild.id);

    const generalChannel = guild.channels.cache.find(channel => channel.name.toLowerCase().includes('general'));
    if(generalChannel) return generalChannel;

    return guild.channels.cache.filter(c => c.type === "text" && c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
        .sort((a, b) => a.position - b.position || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
        .first();
}
const getChessChannel = function(guild){

    const chessChannel = guild.channels.cache.find(channel => channel.name.toLowerCase().includes('chess'));
    if(chessChannel) return chessChannel;

    return getGeneralChannel(guild);
}

module.exports = {getChessChannel};