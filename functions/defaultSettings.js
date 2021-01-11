const {getChessChannel} = require('./getChessChannel');

const defaultSettings = function(guild){
    return {
        prefix: 'c!',
        showCheck: true,
        theme: 'lichess-brown',
        showCoordinates: true,
        channelID: getChessChannel(guild).id
    };
}

module.exports = {defaultSettings};
