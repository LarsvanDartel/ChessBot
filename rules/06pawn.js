module.exports = {
    title: 'Pawn',
    symbol: 'P',
    imageUrl: 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/r1r5/1P6/3bb3/4PP2/3P2P1/8%20w%20-%20-%200%201&size=400&coordinates=true&squares=g3,g4,f4,d3,b6&arrows=Gb5a6,Gb5c6',
    fields: [
        {
            name: 'Movement',
            value: 'Pawns have the most complex rules of movement:'+
                   'A pawn moves straight forward one square, if that square is vacant.'+
                   'If it has not yet moved, a pawn also has the option of moving two squares straight forward, provided both squares are vacant.'+
                   'Pawns cannot move backwards. Pawns are the only pieces that capture differently from how they move.'+
                   'A pawn can capture an enemy piece on either of the two squares diagonally in front of the pawn'+
                   '(but cannot move to those squares if they are vacant).'+
                   'The pawn is also involved in the two special moves en passant and promotion.'
        }
    ]
}