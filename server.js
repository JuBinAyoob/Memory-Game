const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
//Connecting to mongodb
mongoose.connect('mongodb://admin:admin123@127.0.0.1:27017/admin');
let db = mongoose.connection;

db.once('open',function(){
  console.log('Connected to MongoDb');
});
db.on('error',function(err){

  console.log('Error in connection... Error:'+err);
});


let app = express();

//Load view engine
app.set("views",path.join(__dirname,"views"));
app.set("view engine","pug");
app.use("/static", express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Bring in models
let Game=require('./models/game');

app.get('/',function(req,res){
    res.status(200).render('index');
});

app.post('/',function(req,res){
  let data=req.body;
  console.log(data);
  let game = new Game();
  game.player= data.player;
  game.numOfMoves= data.numOfMoves;
  game.timeTaken= data.timeTaken;
  //game.score= data.score;

  game.save(function(err,gameData){
    console.log(gameData);
    if(err){
      console.log("Fail in saving game data, Error:",err);
      res.status(500).json({msg:"Fail in saving game data"});
    }else{
      res.status(200).json({msg:"game data saved"});
    }
  });
  //res.status(200).end();
});

app.listen(process.env.port||8002);

