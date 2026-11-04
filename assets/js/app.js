"use strict";

// Los IDs del HTML conectan los botones y los marcadores con la lógica del juego.
const newGameButton = document.querySelector("#new-game");
const hitButton = document.querySelector("#hit");
const standButton = document.querySelector("#stand");
const message = document.querySelector("#game-message");
const turnHint = document.querySelector("#turn-hint");
const playerScore = document.querySelector("#player-score");
const playerCards = document.querySelector("#player-cards");
const dealerScore = document.querySelector("#dealer-score");
const dealerCards = document.querySelector("#dealer-cards");
const winsCounter = document.querySelector("#wins");

// Cada código combina el valor y el palo, como 10C para el diez de tréboles.
let types = ["C", "D", "H", "S"];
let specials = ["A", "J", "Q", "K"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let hiddenCard;
// La ronda activa acepta jugadas. Las victorias se acumulan hasta recargar la página.
let active = false;
let wins = 0;

// Combina cada palo con los valores del 2 al 10 y las cartas especiales.
// _.shuffle() devuelve las cartas en orden aleatorio.
const createDeck = (types, specials) => {
  const deck = [];

  for (let value = 2; value <= 10; value++) {
    for (const type of types) {
      deck.push(`${value}${type}`);
    }
  }
  for (const type of types) {
    for (const special of specials) {
      deck.push(`${special}${type}`);
    }
  }

  return _.shuffle(deck);
};

// Extrae y devuelve la última carta del mazo. Si el mazo está vacío, lanza un error.
const hit = (deck) => {
  if (deck.length === 0) {
    throw new Error("No quedan cartas en el mazo");
  }
  // pop() retira la carta del mazo para que no vuelva a salir en la misma ronda.
  return deck.pop();
};

// Obtiene los puntos de una carta. slice(0, -1) separa el valor del palo final.
const getCardValue = (card) => {
  const value = card.slice(0, -1);

  if (value === "A") {
    return 11;
  }
  if (Number.isNaN(Number(value))) {
    return 10;
  }
  return Number(value);
};

// Suma una mano completa y ajusta los ases de 11 a 1 si el total supera 21.
const getHandPoints = (hand) => {
  let points = 0;
  let aces = 0;

  for (const card of hand) {
    const value = getCardValue(card);
    points += value;
    if (value === 11) {
      aces++;
    }
  }

  // Restar 10 cambia el valor de un as de 11 a 1.
  while (points > 21 && aces > 0) {
    points -= 10;
    aces--;
  }
  return points;
};

// Inserta la imagen de una carta en la mesa y la devuelve para poder actualizarla.
const showCard = (card, container) => {
  const image = document.createElement("img");
  image.src = `./assets/cartas/${card}.png`;
  image.alt = "Carta " + card;
  image.classList.add("playing-card");
  container.append(image);
  return image;
};

// Deshabilita las jugadas, muestra el resultado y suma una victoria si ganó el jugador.
const finishRound = (result, playerWon) => {
  active = false;
  hitButton.disabled = true;
  standButton.disabled = true;
  turnHint.innerText = "Ronda terminada";
  message.innerText = result;

  if (playerWon) {
    wins++;
    winsCounter.innerText = wins;
  }
};

// Reemplaza el dorso por la segunda carta de la banca y muestra el puntaje completo.
const revealDealer = () => {
  hiddenCard.src = `./assets/cartas/${dealerHand[1]}.png`;
  hiddenCard.alt = "Carta " + dealerHand[1];
  dealerScore.innerText = getHandPoints(dealerHand);
};

// Resuelve un blackjack inicial o juega el turno de la banca y compara los puntajes.
const playDealer = () => {
  revealDealer();
  const playerPoints = getHandPoints(playerHand);
  let dealerPoints = getHandPoints(dealerHand);

  // Un blackjack se decide con las dos primeras cartas, antes de que la banca robe.
  const playerBlackjack = playerHand.length === 2 && playerPoints === 21;
  const dealerBlackjack = dealerPoints === 21;
  if (playerBlackjack && dealerBlackjack) {
    finishRound("Empate. Ambos tienen blackjack.", false);
    return;
  }
  if (playerBlackjack) {
    finishRound("¡Blackjack! Ganaste con tus dos primeras cartas.", true);
    return;
  }
  if (dealerBlackjack) {
    finishRound("La banca tiene blackjack. Perdiste esta ronda.", false);
    return;
  }

  // La banca pide cartas hasta llegar a 17 o más, incluso si un as cuenta como 11.
  while (dealerPoints < 17) {
    const card = hit(deck);
    dealerHand.push(card);
    showCard(card, dealerCards);
    dealerPoints = getHandPoints(dealerHand);
  }
  dealerScore.innerText = dealerPoints;

  if (dealerPoints > 21 || playerPoints > dealerPoints) {
    finishRound("¡Ganaste esta ronda!", true);
  } else if (playerPoints === dealerPoints) {
    finishRound("Empate. Las dos manos tienen los mismos puntos.", false);
  } else {
    finishRound("La banca tiene más puntos. Perdiste esta ronda.", false);
  }
};

// Inicia una ronda con una baraja nueva y reparte dos cartas por mano.
newGameButton.addEventListener("click", () => {
  deck = createDeck(types, specials);
  // Se alterna el reparto para dar dos cartas a cada mano.
  playerHand = [hit(deck)];
  dealerHand = [hit(deck)];
  playerHand.push(hit(deck));
  dealerHand.push(hit(deck));
  playerCards.innerHTML = "";
  dealerCards.innerHTML = "";

  showCard(playerHand[0], playerCards);
  showCard(playerHand[1], playerCards);
  showCard(dealerHand[0], dealerCards);
  // La segunda carta de la banca queda guardada en su mano y se muestra el dorso.
  hiddenCard = showCard("red_back", dealerCards);
  hiddenCard.alt = "Carta oculta de la computadora";

  const playerPoints = getHandPoints(playerHand);
  playerScore.innerText = playerPoints;
  dealerScore.innerText = getCardValue(dealerHand[0]) + " + ?";

  if (playerPoints === 21 || getHandPoints(dealerHand) === 21) {
    playDealer();
    return;
  }

  turnHint.innerText = "Es tu turno";
  message.innerText = "Pide otra carta o plántate.";
  active = true;
  hitButton.disabled = false;
  standButton.disabled = false;
});

// Reparte otra carta al jugador y decide si puede seguir, llega a 21 o se pasa.
hitButton.addEventListener("click", () => {
  if (!active) {
    return;
  }

  const card = hit(deck);
  playerHand.push(card);
  showCard(card, playerCards);
  const playerPoints = getHandPoints(playerHand);
  playerScore.innerText = playerPoints;

  if (playerPoints > 21) {
    revealDealer();
    finishRound("Te pasaste de 21. Perdiste esta ronda.", false);
  } else if (playerPoints === 21) {
    // Llegar a 21 con una carta adicional termina el turno y deja jugar a la banca.
    playDealer();
  }
});

// Si la ronda está activa, cede el turno a la banca cuando el jugador se planta.
standButton.addEventListener("click", () => {
  if (active) {
    playDealer();
  }
});
