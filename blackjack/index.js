
// Creating elements in div

// first container
let welResult = document.querySelector(".welResult");

    // first child, result string
    let resultString = document.createElement("h2");
    resultString.classList.add("resultString");
    resultString.textContent = "Do you want to play a game?";
    welResult.appendChild(resultString);

    // second child, Cards string
    let cardsString = document.createElement("h2");
    cardsString.classList.add("cardsString");
    cardsString.textContent = "Cards Drawn: ";
    // welResult.appendChild(cardsString);

    // third child, Sum of Cards
    let sumOfCards = document.createElement("h2");
    sumOfCards.classList.add("sumOfCards");
    sumOfCards.textContent = "Sum: ";
    // welResult.appendChild(sumOfCards);



// second container
let btnSet = document.querySelector(".btnSet");

    // start Button
    let startButton = document.createElement("button");
    startButton.classList.add("startButton");
    startButton.textContent = "START";
    btnSet.appendChild(startButton);

    // newCard Button
    let newCardButton = document.createElement("button");
    newCardButton.classList.add("newCardButton");
    newCardButton.textContent = "NEW CARD";
    // btnSet.appendChild(newCardButton);


// third container, Prize and Reset Button
let prizeReset = document.querySelector(".prizeReset");

    // Prize anouncement
    let prizeString = document.createElement("p");
    prizeString.classList.add("prizeString");
    // prizeString.textContent = "Your Prize: ";
    // prizeReset.appendChild(prizeString);


    // reset button
    let resetButton = document.createElement("button");
    resetButton.classList.add("resetButton");
    resetButton.textContent = "Reset";
    // prizeReset.appendChild(resetButton);





// Staring with start and removing it.
startButton.addEventListener("click", ()=> renderGame());

function renderGame(){
        welResult.appendChild(cardsString);
        welResult.appendChild(sumOfCards);
        btnSet.appendChild(newCardButton);
        btnSet.removeChild(startButton);
        getCards();
        getSum();
        changeStatus();
    }

function randomNum() {
    let n = Math.floor(Math.random()*10)+2;
    return n;
    }

let cards = [];
function getCards(){
    let cardOne = randomNum();
    let cardTwo = randomNum();
    cards = [cardOne, cardTwo];
    }


function getSum(){
    let sum = 0;
    let str = ""
    for (let i=0; i < cards.length; i++ ) {
        sum += cards[i];
        str += cards[i] + " ";
    }
    cardsString.textContent = "Cards Drawn: " + str;
    
    sumOfCards.textContent=sum;

    changeStatus(sum);
}


function changeStatus(sum){
    
    if (sum<21){
        resultString.textContent = "Draw another card";
    } else if (sum === 21) {
        resultString.textContent = "You got BlackJack!!";

        // show prize
        prizeString.textContent = "Your Prize: $200"
        prizeReset.appendChild(prizeString);


        // remove next card
        btnSet.removeChild(newCardButton);

        // show reset
        prizeReset.appendChild(resetButton);

    } else if (sum > 21) {
        resultString.textContent = "You Lost";
        
        // show reset
        prizeReset.appendChild(resetButton);

        // remove next card
        btnSet.removeChild(newCardButton);
    }
}


newCardButton.addEventListener("click",()=> {
    choseNextCard();
})


function choseNextCard(){
    let next = randomNum();
    cards.push(next);
    getSum();
}


resetButton.addEventListener("click", ()=>{
    cards = [];
    resultString.textContent = "Do you want to play a game?";
    btnSet.appendChild(startButton);
    prizeReset.removeChild(resetButton);

    welResult.removeChild(cardsString);
    welResult.removeChild(sumOfCards);
    prizeReset.removeChild(prizeString);
})


// More ideas in mind but i'll leave it at this