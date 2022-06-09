
function mod(n, m)
{
    return ((n % m) + m) % m;
}



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

var possibleColor = ["Rouge", "Bleu", "Vert", "Jaune"];


function addPlayer()
{
    var playersDom = document.getElementsByClassName("playersHands");
    for(var i = 0; i < gameState.numberOfPlayer; i++)
    {
        var newPlayerDom = document.createElement("div");
        newPlayerDom.classList.add("playerHand");
  
        var p1ayer = {
            playerOrder: i,
            cards: new Array(),
            playableCards: new Array(),
            canPlay: true,
        };
        newPlayerDom.setAttribute("id", "Player " + i);
        // A sortir
        playersDom[0].appendChild(newPlayerDom);
        // A sortir
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

function renderDrawingDeck()
{
    var playedCard = document.querySelector(".drawingDeck");

    var cardDom = document.createElement("p");
    cardDom.classList.add("card");
    cardDom.classList.add("verso");
    playedCard.appendChild(cardDom);
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

function generateCardDom(player)
{
    var doms = document.getElementById("Player "+ player.playerOrder);
    while(doms.firstChild)
        doms.removeChild(doms.lastChild);
    document.getElementById("Player "+ player.playerOrder).children = 'null';
    for (var i = 0; i < player.cards.length; i++)
    {
        var cardDom = document.createElement("p");
        cardDom.classList.add("card");
        var textNode = document.createTextNode("Couleur : " + player.cards[i].color + " Nombre : " + player.cards[i].number);
        
        var cardId = (player.playerOrder * gameState.numberOfCardToGive) + i;

        cardDom.setAttribute("id", cardId);
        cardDom.appendChild(textNode);
        document.getElementById("Player "+ player.playerOrder).appendChild(cardDom);
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

    var playedCard = document.querySelector(".playedDeck");

    var cardDom = document.createElement("p");
    cardDom.classList.add("card");
    var textNode = document.createTextNode("Couleur : " + gameState.lastCardPlayed[0].color + " Nombre : " + gameState.lastCardPlayed[0].number);
    cardDom.appendChild(textNode);
    playedCard.appendChild(cardDom);
}

function updateRenderPlayedCard()
{
    var playedCard = document.querySelector(".playedDeck");

    var cardDom = document.createElement("p");
    cardDom.classList.add("card");
    var textNode = document.createTextNode("Couleur : " + gameState.lastCardPlayed[0].color + " Nombre : " + gameState.lastCardPlayed[0].number);
    cardDom.appendChild(textNode);

    while(playedCard.firstChild)
        playedCard.removeChild(playedCard.lastChild);

    playedCard.appendChild(cardDom);
}

function updateCardPlayed(cardDiv)
{
    var cardChildren = cardDiv.children[0].children[0];
    cardDiv.classList.remove(gameState.lastCardPlayed.color);
    cardDiv.classList.add(gameState.lastCardPlayed[0].color);
    
    cardChildren[0].textContent = gameState.lastCardPlayed[0].number;
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
    }
    return gameState.drawingDeck.splice(0, numberOfCardToDraw);
}



function addClickEventListenerToCard()
{
    console.log("Player " + gameState.currentPlayerIndex);
    var cards = document.getElementById("Player " + gameState.currentPlayerIndex);
    console.log("PRE INCR " + gameState.currentPlayerIndex);
    for (var i = 0; i < cards.children.length; i++)
    {
        cards.children[i].addEventListener("click", function()
        {
            gameState.currentPlayerIndex += gameState.playingDirection;

            gameState.currentPlayerIndex = gameState.currentPlayerIndex % gameState.players.length;
            console.log(gameState.currentPlayerIndex);
            render();
        })
    }
    console.log("PRE INCR " + gameState.currentPlayerIndex);
    for (var j = 0; j < gameState.players.length; j++)
    {
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
    gameState.currentPlayerIndex += gameState.playingDirection;

    gameState.currentPlayerIndex = gameState.currentPlayerIndex % gameState.players.length;
    if (gameState.currentPlayerIndex <= -1)
    {
        gameState.currentPlayerIndex = gameState.currentPlayerIndex * gameState.players.length * -1;
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

function updateRenderPlayableCard(cards)
{
    console.log("Player " + gameState.currentPlayerIndex);
    var cards = document.getElementById("Player " + gameState.currentPlayerIndex);
    for (var i = 0; i < cards.children.length; i++)
    {
        cards.children[i].addEventListener("click", function()
        {
            console.log(this);
        })
    }
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