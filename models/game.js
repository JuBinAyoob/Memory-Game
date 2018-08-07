const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//To do data schema
let gameSchema = new Schema({
    player: {
        type: String
    },
    numOfMoves: {
        type: Number
    },
    timeTaken: {
        type: String
    },
    score: {
        type: Number
    }
});

let Game = module.exports = mongoose.model('Game', gameSchema);
