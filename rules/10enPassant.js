module.exports = {
    title: 'En passant',
    imageUrl: 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/8/Pp6/8/1P6/8%20w%20-%20-%200%201&size=400&coordinates=true&arrows=Ga2,Ga4,Rb4a3&squares=a3',
    fields: [
        {
            name: 'Description',
            value: 'When a pawn advances two squares from its original square and ends the turn adjacent to a pawn of the opponent\'s on the same rank,'+
                   'it may be captured by that pawn of the opponent\'s, as if it had moved only one square forward.'+
                   'This capture is only legal on the opponent\'s next move immediately following the first pawn\'s advance.'+
                   'The image below demonstrates an instance of this: if the white pawn moves from a2 to a4,'+
                   'the black pawn on b4 can capture it en passant, moving from b4 to a3 while the white pawn on a4 is removed from the board.'
        }
    ]
}