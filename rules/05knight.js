module.exports = {
    title: 'Knight',
    symbol: 'N',
    imageUrl: 'https://chesswebserver.larsvandartel.repl.co/board.png?fen=8/8/8/4N3/8/8/8/8%20w%20-%20-%200%201&size=400&coordinates=true&squares=f7,g6,g4,f3,d3,c4,c6,d7',
    fields: [
        {
            name: 'Movement',
            value: 'A knight moves to the nearest square not on the same rank, file, or diagonal. (This can be thought of as moving two squares horizontally then one square vertically, or moving one square horizontally then two squares vertically—i.e. in an "L" pattern.) The knight is not blocked by other pieces: it jumps to the new location.'
        }
    ]
}