function mod(n, m) {
    return ((n % m) + m) % m;
}



var gameState = {
    numberOfPlayer: 3,
    numberOfCardToGive: 7,
    generateSpecialCard: true,
    players: [],

    lastCardPlayed: [],

    drawingDeck: [],

    currentPlayerIndex: 0,
    playingDirection: 1,
}

var possibleColor = ["rouge", "bleu", "vert", "jaune"];


function addPlayer() {

    for (var i = 0; i < gameState.numberOfPlayer; i++) {

        var p1ayer = {
            playerOrder: i,
            cards: new Array(),
            playableCards: new Array(),
            canPlay: true,
        };

        gameState.players.push(p1ayer);
    }

}

function generateDrawingDeck() {
    for (var i = 0; i < gameState.numberOfCardToGive; i++) {

        for (var j = 0; j < possibleColor.length; j++) {

            var card = { "color": possibleColor[j], "number": i };
            gameState.drawingDeck.push(card);
            gameState.drawingDeck.push(card);

        }
    }

}

function shuffleDeck() {
    var deck = gameState.drawingDeck;
    var currentIndex = deck.length, randomIndex;

    while (currentIndex != 0) {
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


function giveCards() {

    for (var i = 0; i < gameState.numberOfCardToGive; i++) {

        for (var j = 0; j < gameState.players.length; j++) {

            var player = gameState.players[j % gameState.numberOfPlayer].cards
            gameState.players[j % gameState.numberOfPlayer].cards = giveCard(player);

        }

    }
}


function giveCard(playingDeck) {

    var currentDeck = playingDeck;
    currentDeck.push(gameState.drawingDeck[0]);
    gameState.drawingDeck.splice(0, 1);
    return currentDeck;

}

function initPlayedCard() {

    gameState.lastCardPlayed = [];
    gameState.lastCardPlayed.unshift(gameState.drawingDeck[0]);
    gameState.drawingDeck.splice(0, 1);

}


function initFirstPlayer() {
    var randomFirstPlayer = Math.floor(Math.random() * gameState.players.length);
    currentPlayerIndex = randomFirstPlayer;
    gameState.players[randomFirstPlayer].canPlay = true;
}



function findPlayableCards(player) {
    var currentPlayedCard = gameState.lastCardPlayed[0];
    return playableCard = player.cards.filter(element => element.color == currentPlayedCard.color || element.number == currentPlayedCard.number);
}

function drawCard(numberOfCardToDraw) {
    if (numberOfCardToDraw > gameState.drawingDeck.length)
        numberOfCardToDraw;
    return gameState.drawingDeck.splice(0, numberOfCardToDraw);
}


function play() {
    var currentPlayerIndex = gameState.currentPlayerIndex % (gameState.players.length);
    var currentPlayer = gameState.players[currentPlayerIndex];
    console.log("Current Player Cards Before : " + currentPlayer.cards.length);

    if (currentPlayer.canPlay) {
        currentPlayer.playableCards = findPlayableCards(currentPlayer);

        if (playerPlayableCards.length > 0) {
            var playedCard = playerPlayableCards[0];
            currentPlayer.cards.splice(currentPlayer.cards.findIndex(x => x.color == playedCard.number && x.number == playedCard.number), 1);
            gameState.players[gameState.currentPlayerIndex] = currentPlayer;
            console.log("Current Player Cards : " + currentPlayer.cards.length);
            console.log("Index Player Card : " + (gameState.players[gameState.currentPlayerIndex].cards.length));
            gameState.lastCardPlayed.unshift(playedCard);
            console.log("-------- Player " + gameState.currentPlayerIndex + "played Card : " + JSON.stringify(playedCard) + "----------------");
            if (currentPlayer.cards.length == 1)
                console.log("------UNO " + currentPlayer.playerOrder + "------------");
            if (currentPlayer.cards.length == 0) {
                console.log("------------- VICTORY ---------------------")
                console.log("------------- PLAYER " + currentPlayer.playerOrder + "---------------------");
                return true;
            }
        }
        else {
            var drawnCard = drawCard(1);
            console.log("Player Remaining Card " + currentPlayer.cards.length);
            gameState.players[gameState.currentPlayerIndex].cards.push(drawnCard);
        }
        gameState.players[gameState.currentPlayerIndex] = currentPlayer;
    }
    console.log("Current Player " + gameState.currentPlayerIndex + " Card Left: " + currentPlayer.cards.length);
    gameState.currentPlayerIndex += gameState.playingDirection;

    gameState.currentPlayerIndex = gameState.currentPlayerIndex % gameState.players.length;
    if (gameState.currentPlayerIndex <= -1) {
        gameState.currentPlayerIndex = gameState.currentPlayerIndex * gameState.players.length * -1;
    }
    return false;
}





function renderInit() {
    // ---- Render addPlayer & generateInitialCards ----
    for (var i = 0; i < gameState.numberOfPlayer; i++) {

        var playersDom = document.getElementsByClassName("playersHands");
        var newPlayerDom = document.createElement("div");
        newPlayerDom.classList.add("playerHand")
        newPlayerDom.setAttribute("id", "Player " + i);
        playersDom[0].appendChild(newPlayerDom);

        var player = gameState.players[i];

        for (var j = 0; j < player.cards.length; j++) {
            var cardDom2 = document.createElement("p");

            cardDom2.classList.add(player.cards[j].color);
            cardDom2.classList.add("card");
            cardDom2.classList.add("recto");
            cardDom2.textContent = player.cards[j].number;

            var cardId = player.playerOrder * gameState.numberOfPlayer + j;
            cardDom2.setAttribute("id", cardId);

            document.getElementById("Player " + player.playerOrder).appendChild(cardDom2);
        }

    }

    // ---- Render InitPlayedCard ----
    var initPlayedCard = document.querySelector(".playedDeck");

    var cardDom3 = document.createElement("p");

    cardDom3.classList.add("card");
    cardDom3.classList.add("recto");
    cardDom3.setAttribute("id", "currentPlayedCard");
    cardDom3.classList.add(gameState.lastCardPlayed[0].color);
    cardDom3.textContent = gameState.lastCardPlayed[0].number;

    initPlayedCard.appendChild(cardDom3);

}

function renderPlay() {

    // ---- Render updateCardPlayed ----

    var playedCard = document.getElementById('currentPlayedCard');
    playedCard.classList.remove(gameState.lastCardPlayed[0].color);
    playedCard.classList.add(gameState.lastCardPlayed[0].color);
    playedCard.textContent = gameState.lastCardPlayed[0].n


    // ---- Render playableCards ----


}

function renderEndRound() {
    // --- 
}


/*function main() {
    initGame();
    while (!play()) {
        render();
        while (!(gameState.playerHasToPlay || gameState.playerHasToDraw));
    }
    return true;
}

main(); */

function initGame() {
    addPlayer();
    generateDrawingDeck();
    gameState.drawingDeck = shuffleDeck(gameState.drawingDeck);
    giveCards();
    initPlayedCard();
    initFirstPlayer();
    renderInit();
}

initGame();