const defaultGame = function(){
    return {
        challenge: null,
        messageID: null,
        whiteID: null,
        blackID: null,
        fen: null,
        drawID: null,
        takebackID: null,
        lastFen: null,
        history: []
    };
}

module.exports = {defaultGame};