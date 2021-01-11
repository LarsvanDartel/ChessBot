module.exports = {
    title: 'Move notation',
    imageUrl: 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=3r3r/8/8/R7/4Q2Q/8/8/R6Q%20w%20-%20-%200%201&coordinates=true&squares=e1,a3,f8&arrows=Ga1a3,Ga5a3,Yd8f8,Yh8f8,Re4e1,Rh4e1,Rh1e1',
    fields:[
        {
            name: 'Notation',
            value: 'Each move of a piece is indicated by the piece\'s uppercase letter, plus the coordinate of the destination square.\n'+
                   'For example, Be5 (move a bishop to e5), Nf3 (move a knight to f3).\n'+
                   'For pawn moves, a letter indicating pawn is not used, only the destination square is given. For example, c5 (move a pawn to c5).\n'
        },
        {
            name: 'Captures',
            value: 'When a piece makes a capture, an "x" is inserted immediately before the destination square.\n'+
                   'For example, Bxe5 (bishop captures the piece on e5).\n'+
                   'When a pawn makes a capture, the file from which the pawn departed is used to identify the pawn. For example, exd5 (pawn on the e-file captures the piece on d5)\n'
        },
        {
            name: 'Disambiguating moves',
            value: 'When two (or more) identical pieces can move to the same square,\n'+
                   'the moving piece is uniquely identified by specifying the piece\'s letter, followed by (in descending order of preference):\n'+
                   ' 1) the file of departure (if they differ); or\n'+
                   ' 2) the rank of departure (if the files are the same but the ranks differ); or\n'+
                   ' 3) both the file and rank of departure (if neither alone is sufficient to identify the piece)\n'+
                 'In the image below, both black rooks could legally move to f8, so the move of the d8-rook to f8 is disambiguated as Rdf8.\n'+
                   'For the white rooks on the a-file which could both move to a3, it is necessary to provide the rank of the moving piece, i.e., R1a3.\n'+
                   'In the case of the white queen on h4 moving to e1, neither the rank nor file alone are sufficient to disambiguate from the other white queens.\n'+
                   'As such, this move is written Qh4e1.\n'
        },
        {
            name: 'Pawn promotion',
            value: 'When a pawn promotes, the piece promoted to is indicated at the end of the move notation, pawn promotion is indicated by the equals sign (e8=Q).\n'
        },
        {
            name: 'Castling',
            value: 'Castling is indicated by the special notations O-O (for kingside castling) and O-O-O (queenside castling).\n'
        },
        {
            name: 'Check',
            value: 'A move that places the opponent\'s king in check usually has the symbol "+" appended. For the bot, this is not necessary\n'
        },
        {
            name: 'Checkmate',
            value: 'A move that places the opponent\'s king in check usually has the symbol "#" appended. For the bot, this is not necessary.'                 
        }
    ]                 
}