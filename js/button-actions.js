// Nuclear version: no animations, no fades, no delays — instant gameplay

var startGame = function() {
	getCards();
	if (currentWager === 0) {
		Materialize.toast("You must select a bet to play", 1000);
	} else if (currentChipBalance < 10) {
		Materialize.toast("You're out of chips! Reset the game to continue", 2000);
	} else if (currentChipBalance < currentWager) {
		Materialize.toast("Insufficient chip balance, please select a lower bet", 1500);
	} else {
		currentChipBalance -= currentWager;
		updateVisibleChipBalances();
		$("#welcome").hide();
		$("#game-over").hide();
		$(".brand-logo").text("blackjack");
		$("#game-board").show(); // no fade, instant

		cardsInDeck = cards;
		cardsInDeck.sort(() => 0.5 - Math.random());

		// Instantly deal both hands without delay
		currentTurn = "player";
		dealCard(playerHand, playerGameBoard);
		currentTurn = "dealer";
		dealCard(dealerHand, dealerGameBoard);
		currentTurn = "player";
		dealCard(playerHand, playerGameBoard);
		currentTurn = "dealer";
		dealCard(dealerHand, dealerGameBoard);

		// Instantly check for split eligibility
		currentTurn = "player";
		if (playerHand.length === 2 && playerHand[0].name === playerHand[1].name) {
			enableButton(splitButton, split);
		}
	}
};

var hit = function() {
	if (currentTurn === "player") {
		playerStatus = "hit";
		dealCard(playerHand, playerGameBoard);
	} else if (currentTurn === "playerSplit") {
		playerSplitStatus = "hit";
		dealCard(playerSplitHand, playerSplitGameBoard);
	}
};

var stand = function() {
	if (currentTurn === "player") {
		changeHand(playerStatus);
	} else if (currentTurn === "playerSplit") {
		changeHand(playerSplitStatus);
	}
};

var split = function() {
	splitGame = true;
	playerHandTotal -= playerHand[1].value;
	playerSplitHandTotal = playerHand[1].value;
	updateVisibleHandTotals();

	$(".split-hand-total").removeClass("inactive").show();
	$(playerSplitGameBoard).removeClass("inactive").show();

	var splitCard = playerHand.pop();
	playerSplitHand.push(splitCard);

	// Instantly move the split card to the new deck, no delay
	$("#player-card-1")
		.attr("id", "playerSplit-card-0")
		.appendTo($(playerSplitGameBoard))
		.css({ left: "", marginRight: "auto" })
		.show();

	currentChipBalance -= currentWager;
	currentWager *= 2;
	updateVisibleChipBalances();

	// Instantly deal to both hands
	currentTurn = "player";
	dealCard(playerHand, playerGameBoard);
	currentTurn = "playerSplit";
	dealCard(playerSplitHand, playerSplitGameBoard);

	// Disable split button immediately
	disableButton(splitButton);

	// Instantly scale inactive deck (no delay)
	scaleDownDeck(playerSplitGameBoard, playerSplitHandTotalDisplay);
	currentTurn = "player";
};

function doubleDown() {
	if (currentChipBalance - currentWager <= 0) {
		Materialize.toast("Insufficient chip balance", 1000);
	} else {
		currentChipBalance -= currentWager;
		currentWager *= 2;
		updateVisibleChipBalances();
		disableButton(doubleDownButton);
	}
}

function newGame() {
	getCards();
	cardsInDeck = cards;
	gameWinner = "none";
	dealerHand = [];
	dealerHandTotal = 0;
	dealerStatus = "start";
	playerHand = [];
	playerHandTotal = 0;
	playerStatus = "start";
	playerHasAce = false;
	splitGame = false;
	isGameOver = false;
	playerSplitHand = [];
	playerSplitHandTotal = 0;
	playerSplitStatus = "start";

	if (currentWager === 0) {
		Materialize.toast("You must select a bet to play", 1000);
	} else {
		$(playerSplitGameBoard).hide();
		$(".split-hand-total").hide();
		enableButton(standButton, stand);
		enableButton(hitButton, hit);
		enableButton(doubleDownButton, doubleDown);
		dealerGameBoard.empty();
		playerGameBoard.empty();
		playerSplitGameBoard.empty();
		updateVisibleHandTotals();
		startGame();
	}
}

function resetGame() {
	currentWager = 0;
	currentChipBalance = 500;
	updateVisibleChipBalances();
	location.reload();
}