module.exports = {
    title: 'Setup',
    imageUrl: 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR%20w%20KQkq%20-%200%201&size=400&coordinates=true',
    fields: [
        {
            name: 'Board',
            value: 'Chess is played on a chessboard, a square board divided into 64 squares (eight-by-eight) of alternating color.'+
                   'No matter what the actual colors of the board, the lighter-colored squares are called "light" or "white",'+
                   'and the darker-colored squares are called "dark" or "black".'+
                   'Sixteen "white" and sixteen "black" pieces are placed on the board at the beginning of the game.'+
                   'The board is placed so that a white square is in each player\'s near-right corner.'+
                   'Horizontal rows are called ranks and vertical rows are called files.'
        },
        {
            name: 'Piece Placement',
            value: 'At the beginning of the game, the pieces are arranged as shown in the image below:'+
                   'for each side one king, one queen, two rooks, two bishops, two knights, and eight pawns.'+
                   'The pieces are placed, one on a square, as follows:'+
                   ' - The rooks are placed on the outside corners, right and left edge.'+
                   ' - The knights are placed immediately inside of the rooks.'+
                   ' - The bishops are placed immediately inside of the knights.'+
                   ' - The queen is placed on the central square of the same color of that of the player:'+
                   '   white queen on the white square and black queen on the black square.'+
                   ' - The king takes the vacant spot next to the queen.'+
                   ' - The pawns are placed one square in front of all of the other pieces.',
        }
    ]    
}