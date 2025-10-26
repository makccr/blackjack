// Nuclear option: all animations, transitions, and timeouts removed. Everything is instant.

var cardsInDeck;

$(document).ready(function() {
	getCards();
	cardsInDeck = cards;
	updateVisibleChipBalances();
});

var currentTurn = "player";
var currentWager = 0;
var currentChipBalance = localStorage.getItem('blackjackChips') || 500;
var gameWinner = "none";
var isGameOver = false;

// Dealer setup
var dealerHand = [];
var dealerHandTotal = 0;
var dealerGameBoard = $("#dealer");
var dealerStatus = "start";

// Player setup
var playerHand = [];
var playerHandTotal = 0;
var playerGameBoard = $("#user-hand");
var playerHandTotalDisplay = $(".hand-total");
var playerStatus = "start";
var playerHasAce = false;

// Split setup
var splitGame = false;
var playerSplitHand = [];
var playerSplitHandTotal = 0;
var playerSplitGameBoard = $("#user-split-hand");
var playerSplitHandTotalDisplay = $(".split-hand-total");
var playerSplitStatus;

// Buttons
var startButton = $("#start-game-button");
var doubleDownButton = $("#double-down-button");
var hitButton = $("#hit-button");
var standButton = $("#stand-button");
var splitButton = $(".split-button");
var playAgainButton = $(".new-game-button");

// Disable a button instantly
function disableButton(buttonName) {
	$(buttonName).off();
	$(buttonName).addClass("disabled-button");
}

// Enable a button instantly
function enableButton(buttonName, event) {
	$(buttonName).off().click(event).removeClass("disabled-button");
}

// Update chip totals instantly
function updateVisibleChipBalances() {
	$(".current-wager").text(currentWager);
	$(".current-chip-balance").text(currentChipBalance);
	localStorage.setItem('blackjackChips', currentChipBalance);
}

// Update hand totals instantly
function updateVisibleHandTotals() {
	$(playerHandTotalDisplay).text(playerHandTotal);
	$(playerSplitHandTotalDisplay).text(playerSplitHandTotal);

	if (dealerHand.length === 2 && !isGameOver && dealerStatus === "start") {
		$(".dealer-hand-total").text(dealerHandTotal - dealerHand[1].value);
	} else {
		$(".dealer-hand-total").text(dealerHandTotal);
	}
}

// Select wager instantly
function selectWager(amount) {
	currentWager = amount;
	updateVisibleChipBalances();
}

// Flip dealer card instantly (no delay or animation)
function flipHiddenCard() {
	if (dealerHand.length === 2) {
		$("#dealer-card-1")
			.removeClass("flipped")
			.attr("src", "img/" + dealerHand[1].src);
		updateVisibleHandTotals();
	}
}

// Split deck visual toggles (instant)
function scaleDownDeck(deck, totalDisplay) {
	$(totalDisplay).addClass("splithand-scaledown");
	$(deck).addClass("splithand-scaledown");
}

function enlargeDeck(deck, totalDisplay) {
	$(totalDisplay).removeClass("splithand-scaledown");
	$(deck).removeClass("splithand-scaledown");
}

// Instantly toggle rules (no animation)
$(".rules-nav").click(function() {
	$("#rules").toggle();
});

// Instantly close rules
$("#rules-close").click(function() {
	$("#rules").hide();
});

// Materialize modal: all durations zeroed out
$(".modal").modal({
	dismissible: false,
	opacity: 1,
	inDuration: 0,
	outDuration: 0,
	startingTop: "10%",
	endingTop: "10%"
});

// Event listeners
$("#chip-10").click(() => selectWager(10));
$("#chip-25").click(() => selectWager(25));
$("#chip-50").click(() => selectWager(50));
$("#chip-100").click(() => selectWager(100));

$(startButton).click(startGame);
$(doubleDownButton).click(doubleDown);
$(hitButton).click(hit);
$(standButton).click(stand);
$(playAgainButton).click(newGame);
$("#reset-game").click(resetGame);

$(".reduce-aces-button").click(function() {
	reduceAcesValue(playerHand);
	disableButton(splitButton);
});
