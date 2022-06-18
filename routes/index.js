const e = require('express');
var express = require('express');
var router = express.Router();

var lobbies = [];
var players= [];
var possibleColor = ["rouge", "bleu", "vert", "jaune"];



function createLobby()
{
  var lobby =     {
    numberOfPlayers: 4,
    numberOfCardToGive: 7,
    generateSpecialCard: true,
    players: [],


    playerHasToPlay: true,
    playerHasToDraw: false,

    lastCardPlayed: [],

    drawingDeck: [],

    currentPlayerIndex: 0,
    playingDirection: 1,
    lobbyId: lobbies.length,
  };
  
  lobbies.push(lobby);
  return lobby;

}

function createLobbies(numberOfPlayers, numberOfCardToGive)
{
  lobbies.push(
  {
    numberOfPlayers: numberOfPlayers,
    numberOfCardToGive: numberOfCardToGive,
    generateSpecialCard: true,
    players: [],


    playerHasToPlay: true,
    playerHasToDraw: false,

    lastCardPlayed: [],

    drawingDeck: [],

    currentPlayerIndex: 0,
    playingDirection: 1,
    lobbyId: lobbies.length,
  });
}


function addUser(session)
{
  var player;
  if (!session.player)
  {
    session.player  = {id: players.length,
                       name: "Test"};
    player = {userId : players.length, name:"Test"};
    players.push(player);
  }
  else
  {
    player = session.player;
  }
  return player;
}

function findLobby(lobbyId)
{
  var lobby = lobbies.find(element => element.lobbyId == lobbyId);
  console.log("FOUND LOBBY : " + lobbyId);
  return lobby;
}

function findEmptyLobby()
{
  var lobby = lobbies.find(element => element.players.length < element.numberOfPlayer);
  
  if (!lobby)
    lobby = createLobby();
  return lobby;
}

function getLobbies()
{
  return lobbies;
}

function addPlayerToLobby(lobby, session)
{
  if (lobby.players.length < lobby.numberOfPlayers)
  {
    
    var player = {
      playerOrder: lobby.players.length,
      cards: new Array(),
      playableCards: new Array(),
      canPlay: true,
      lobbyId: lobby.lobbyId,
      playerId: session.userId,
    };
    lobby.players.push(player);
  }
  if (lobby.players.length == lobby.numberOfPlayers)
    beginGame(lobby);
}

function beginGame(lobby){
  giveCards(lobby);
  initPlayedCard(lobby);
}

function generateDrawingDeck(lobby) {
  var counter = 0;
  for (var i = 0; i < 18; i++) {
      for (var j = 0; j < possibleColor.length; j++) 
      {
          var card = { "color": possibleColor[j], "number": (i % 10), "playable": false, id: counter};
          lobby.drawingDeck.push(card);
          counter++;
      }
  }

}

function shuffleDeck(deck) {
  var currentIndex = deck.length, randomIndex;

  while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * (currentIndex));
      currentIndex--;
      var tempI = deck[currentIndex];
      var tempJ = deck[randomIndex];

      deck[currentIndex] = tempJ;
      deck[randomIndex] = tempI;

  }


  return deck;
}

 function giveCards(lobby)
 {
   for (var i = 0; i < lobby.numberOfCardToGive; i++)
   {
     for (var j = 0; j < lobby.players.length; j++)
     {
        var player = lobby.players[j % lobby.numberOfPlayers].cards;
        console.log("-----_GIVE --------");
        console.log(JSON.stringify(player));
        lobby.players[j % lobby.numberOfPlayers].cards = giveCard(lobby, player);

     }
   }
 }


 function giveCard(lobby, playingDeck) {
  var currentDeck = playingDeck;
  currentDeck.push(lobby.drawingDeck[0]);
  lobby.drawingDeck.splice(0, 1);
  return currentDeck;
}

function drawCard(nbToDraw, lobby, playerId)
{

}

 function initPlayedCard(lobby)
 {
  lobby.lastCardPlayed = [];
  lobby.lastCardPlayed.unshift(lobby.drawingDeck[0]);
  lobby.drawingDeck.splice(0, 1);
 }

 function initFirstPlayer(lobby) {
  var randomFirstPlayer = Math.floor(Math.random() * lobby.players.length);
  currentPlayerIndex = randomFirstPlayer;
  lobby.players[randomFirstPlayer].canPlay = true;
}

function initLobby(lobbyId)
{
  var lobby = findLobby(lobbyId);
  generateDrawingDeck(lobby);
  lobby.drawingDeck = shuffleDeck(lobby.drawingDeck);
}

function playCard(lobby, cardId)
{
  var cardOwner = lobby.players.findIndex(player => player.cards.find(card => card.id == cardId));
  var cardIndex = lobby.players[cardOwner].cards.findIndex(card => card.id == cardId);

  var card = lobby.players[cardOwner].cards[cardIndex];

  lobby.lastCardPlayed.unshift(card);
  lobby.players[cardOwner].cards.splice(cardIndex, 1);
}



/* GET home page. */
router.get('/', function(req, res, next) {

  req.session.player = addUser(req.session);

  res.render('index', { title: 'Express' });
});

router.post('/getLobbies', function(req, res, next) {
  res.send(JSON.stringify(getLobbies()));
});

router.post('/createLobby', function(req, res, next){
  var lobby = createLobby();
  initLobby(lobby.lobbyId);
  res.send("Lobby Created");
});


router.get('/initLobby', function(req, res, next){
  initLobby(req.query.lobbyId);
  res.send("Lobby Init");
});

router.post('/joinLobby', function(req, res, next)
{
  var lobby = findLobby(req.body.lobbyId);
  addPlayerToLobby(lobby, req.session);
  res.send("Player " + req.session.playerId + "Joined lobby " + req.body.lobbyId);
});

router.post('/playCard', function(req, res, next)
{
  var lobby = findLobby(req.body.lobbyId);
  playCard(lobby, req.body.cardId);
  res.send("Card Played");
});

router.post('/drawCard', function (req, res, next)
{
  var lobby = findLobby(req.body.lobbyId);
  drawCard(1, lobby, req.body.playerId);
  
});

module.exports = router;
