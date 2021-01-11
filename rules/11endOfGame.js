module.exports = {
    title: 'End of Game',
    imageUrl: 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR%20w%20-%20-%200%201&size=400&coordinates=true&check=e8&squares=e7&arrows=Gc4f7',
    fields: [
        {
            name: 'Checkmate',
            value: 'If a player\'s king is placed in check and there is no legal move that player can make to escape check,'+
                   'then the king is said to be checkmated, the game ends, and that player loses.'+
                   'The image below shows an example checkmate position.'+
                   'The black king is threatened by the white queen; the square to which the king could move is also threatened;'+
                   'it cannot capture the queen, because it would then be in check by the bishop.'
        },
        {
            name: 'Resignation',
            value: 'Either player may resign at any time, conceding the game to their opponent, resulting in a loss.'
        },
        {
            name: 'Stalemate',
            value: 'The game is automatically a draw if the player to move is not in check and has no legal move. This situation is called a stalemate.'
        },
        {
            name: 'Insufficient material',
            value: 'The game is automatically a draw if both players have insufficient material to deliver checkmate.'
        },
        {
            name: 'Threefold repetition',
            value: 'The same board position has occurred three times with the same player to move and all pieces having the same rights to move, including the right to castle or capture en passant.'
        },
        {
            name: 'Draw by agreement',
            value: 'The game is automatically a draw if both players agree to a draw after such an offer is made.'

        } 
    ]
}