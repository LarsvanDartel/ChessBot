module.exports = {
    title: 'Castling',
    imageUrl: 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=r3k3/8/8/8/8/8/8/4K2R%20w%20-%20-%200%201&size=400&coordinates=true&arrows=Ge1,Gg1,Yh1,Yf1,Re8,Rc8,Ba8,Bd8',
    symbol: 'O-O / O-O-O',
    fields: [
        {
            name: 'Piece movement',
            value: 'Castling consists of moving the king two squares towards a rook, then placing the rook on the other side of the king, adjacent to it.'+
                   'Castling is only permissible if all of the following conditions hold:'+
                   ' - The king and rook involved in castling must not have previously moved;'+
                   ' - There must be no pieces between the king and the rook;'+
                   ' - The king may not currently be in check, nor may the king pass through or end up in a square that is under attack by an enemy piece'+
                   '   (though the rook is permitted to be under attack and to pass over an attacked square);'+
                   'The castling must be kingside or queenside as shown in the image below.'
        }
    ]
}