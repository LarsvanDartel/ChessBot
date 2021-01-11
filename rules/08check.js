module.exports = {
    title: 'Check',
    imageUrl: 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/5n2/8/4K3/8/8%20w%20-%20-%200%201&coordinates=true&squares=d4&arrows=Gf5e3&check=e3',
    fields: [
        {
            name: 'Description',
            value: 'A king is in check when it is under attack by at least one enemy piece.'+
                   'It is illegal to make a move that places or leaves one\'s king in check.'+
                   'The possible ways to get out of check are:'+
                   ' - Move the king to a square where it is not in check.'+
                   ' - Capture the checking piece (possibly with the king).'+
                   ' - Block the check by placing a piece between the king and the opponent\'s threatening piece.'+
                   'If it is not possible to get out of check, the king is checkmated and the game is over (see end of game).'
        }
    ]    
}