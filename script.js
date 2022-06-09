
//#region Logique
//#endregion
var gameState = {
    numberOfPlayer: 3,
    numberOfCardToGive: 7,
    generateSpecialCard: true,
    players: [],


    playerHasToPlay: true,
    playerHasToDraw: false,
    
    lastCardPlayed: [],

    drawingDeck: [],

    currentPlayerIndex: 0,
    playingDirection: 1,
}

var possibleColor = ["rouge", "bleu", "vert", "jaune"];


function addPlayer()
{
    for(var i = 0; i < gameState.numberOfPlayer; i++)
    {
        var p1ayer = {
            playerOrder: i,
            cards: new Array(),
            playableCards: new Array(),
            canPlay: true,
        };
        gameState.players.push(p1ayer);
    }
    
}



function generateDrawingDeck()
{
    for (var i = 0; i < gameState.numberOfCardToGive; i++)
    {
        for (var j = 0; j < possibleColor.length; j++)
        {
            var card = {"color": possibleColor[j], "number": i};
            gameState.drawingDeck.push(card);
            gameState.drawingDeck.push(card);
        }
    }

}

function shuffleDeck()
{   
    var deck = gameState.drawingDeck;
    var currentIndex = deck.length, randomIndex;

    while (currentIndex != 0)
    {
        randomIndex = Math.floor(Math.random() * (currentIndex));
        currentIndex--;
        var tempI = deck[currentIndex];
        var tempJ = deck[randomIndex];

        deck[currentIndex] = tempJ;
        deck[randomIndex] = tempI;

    }
    gameState.drawingDeck = deck;


    return deck;
}

function giveCards()
{
    for (var i = 0; i < gameState.numberOfCardToGive; i++)
    {
        for(var j = 0; j < gameState.players.length; j++)
        {
            var player = gameState.players[j % gameState.numberOfPlayer].cards
            gameState.players[j % gameState.numberOfPlayer].cards = giveCard(player);
        }

    }
}

function generateCardsDom()
{
    for (var i = 0; i < gameState.players.length; i++)
    {
        generateCardDom(gameState.players[i]);
    }   
}

function giveCard(playingDeck)
{
    var currentDeck = playingDeck;
    currentDeck.push(gameState.drawingDeck[0]);
    gameState.drawingDeck.splice(0, 1);
    return currentDeck;
}

function initPlayedCard()
{
    gameState.lastCardPlayed = [];
    gameState.lastCardPlayed.unshift(gameState.drawingDeck[0]);
    gameState.drawingDeck.splice(0, 1);
}


function initFirstPlayer()
{
    var randomFirstPlayer = Math.floor(Math.random() * gameState.players.length);
    currentPlayerIndex = randomFirstPlayer;
    gameState.players[randomFirstPlayer].canPlay = true;
}

function initGame()
{
    addPlayer();
    generateDrawingDeck();
    gameState.drawingDeck = shuffleDeck(gameState.drawingDeck);
    giveCards();
    initPlayedCard();
    initFirstPlayer();
}

function findPlayableCards(player)
{
    var currentPlayedCard = gameState.lastCardPlayed[0];
    return playableCard = player.cards.filter(element => element.color == currentPlayedCard.color || element.number == currentPlayedCard.number);
}

function drawCard(numberOfCardToDraw)
{
    if (numberOfCardToDraw > gameState.drawingDeck.length)
    {
        var lastCardPlayer = gameState.lastCardPlayed.splice(1, gameState.lastCardPlayed.length - 1);

        gameState.drawingDeck = lastCardPlayer;
        shuffleDeck();
    }
    return gameState.drawingDeck.splice(0, numberOfCardToDraw);
}



function addClickEventListenerToCard()
{
    console.log("Player " + gameState.currentPlayerIndex);
    var cards = document.getElementById("Player " + gameState.currentPlayerIndex);
    for (var i = 0; i < cards.children.length; i++)
    {
        //findPlayableCards
        //Sinon Update DrawDeck

        cards.children[i].addEventListener("click", function()
        {
            gameState.currentPlayerIndex += gameState.playingDirection;

            gameState.currentPlayerIndex = gameState.currentPlayerIndex % gameState.players.length;
            if (gameState.currentPlayerIndex == -1)
            {
                gameState.currentPlayerIndex = (gameState.currentPlayerIndex * gameState.players.length * -1) - 1;
            }

            //playCards

            render();
        })
    }
    //A refaire en une boucle
    for (var j = 0; j < gameState.players.length; j++)
    {
        //remove event from drawDeck

        if (j == gameState.currentPlayerIndex)
            continue;
        var card = document.getElementById("Player " + gameState.currentPlayerIndex);
        for (var k = 0; k < card.children.length; k++)
        {
            cards.children[k].removeEventListener("click", this);
        }
    }
}


function playerTurn()
{
    var currentPlayerIndex = gameState.currentPlayerIndex % (gameState.players.length);
    var currentPlayer = gameState.players[currentPlayerIndex];
    console.log("Current Player Cards Before : " + currentPlayer.cards.length);

    if (currentPlayer.canPlay)
    {
        currentPlayer.playableCards = findPlayableCards(currentPlayer);
 
        if (currentPlayer.playableCards.length > 0)
        {
            var playedCard = currentPlayer.playableCards[0];
            currentPlayer.cards.splice(currentPlayer.cards.findIndex(x => x.color == playedCard.number && x.number == playedCard.number), 1);
            gameState.players[gameState.currentPlayerIndex] = currentPlayer;
            gameState.lastCardPlayed.unshift(playedCard);
            if (currentPlayer.cards.length == 1)
                console.log("------UNO " + currentPlayer.playerOrder + "------------" );
            if (currentPlayer.cards.length == 0)
            {
                console.log("------------- VICTORY ---------------------")
                console.log("------------- PLAYER " + currentPlayer.playerOrder + "---------------------");
                return true;
            }
        }
        else{
            var drawnCard = drawCard(1);
            console.log("=========DRAW==========");
            gameState.players[gameState.currentPlayerIndex].cards.concat(drawnCard);
        }
        gameState.players[gameState.currentPlayerIndex] = currentPlayer;
    }
    return false;
}

function play()
{
    return playerTurn();
}

function render()
{
    generateCardsDom(); 
        //A Sortir
    updateRenderPlayedCard();
        //A sortir
            //A sortir
    // renderDrawingDeck();
    addClickEventListenerToCard();
    //A sortir
           // A sortir
    //updateRenderPlayableCard(currentPlayer.playableCards);
           // A sortir
}

async function main()
{
    
    initGame();
    render();
    while(!play())
    {
         render();
         await new Promise(r => setTimeout(r, 2000));
    //     // while((gameState.playerHasToPlay || gameState.playerHasToDraw));
    }
    render();
    return true;
}

main();