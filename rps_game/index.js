const inputField = document.querySelector("#userInput");
const goBtn = document.querySelector(".goBtn");
const rockBtn = document.querySelector(".rockBtn");
const paperBtn = document.querySelector(".paperBtn");
const scissorBtn = document.querySelector(".scissorBtn");
const compChoise = document.querySelector(".compChoise");
const winOrLoseString = document.querySelector(".winOrLoseString");
const pScore = document.querySelector(".pScore");
const cScore = document.querySelector(".cScore");

let player = 0;
let computer = 0;


goBtn.addEventListener("click", ()=>{
    userInput();
})


rockBtn.addEventListener("click", ()=>{
    let hC = "rock";
    computerChoise(hC);
})
paperBtn.addEventListener("click", ()=>{
    let hC = "paper";
    computerChoise(hC);
})
scissorBtn.addEventListener("click", ()=>{
    let hC = "scissor";
    computerChoise(hC);
})

function userInput(){
    let hC = inputField.value.trim().toLowerCase();
    inputField.value = "";

    if (hC ==="rock" || hC === "paper" || hC==="scissor") {
        computerChoise(hC);
    } else {
        alert("choose Rock Paper or Scissor")
    }
}

function computerChoise(hC){
    let cC= ""
    let number = Math.floor(Math.random()*3);

    if (number===0){
        cC = "rock";
    } else if(number===1){
        cC = "paper";
    } else {
        cC = "scissor";
    }

    let output = `Computer Chose: ${cC.toLocaleUpperCase()}`
    compChoise.textContent = output;
    winLoseDraw(hC,cC);
}

function winLoseDraw(hC, cC){
    
    let resultString = ""
    let winStatus = null;

    if (hC==="rock") {
        if (cC === "rock"){
           resultString = "Both Chose Rock!! Play again.";
        } else if(cC === "paper"){
            resultString = "Paper covers Rock, You lost.";
            winStatus = false;
        } else {
            resultString = "Rock Breaks Scissor, You Won.";
            winStatus = true;
        }

    }else if (hC ==="paper"){
        if (cC === "paper"){
            resultString = "Both Chose Paper!! Play again.";
         } else if(cC === "scissor"){
             resultString = "Scissor cuts Paper, You lost.";
             winStatus = false;
         } else {
             resultString = "Paper covers Rock, You Won.";
             winStatus = true;
         }
    } else if (hC === "scissor") {
        if (cC === "scissor"){
            resultString = "Both Chose Scissor!! Play again.";
         } else if(cC === "rock"){
             resultString = "Rock breaks Scissor, You lost.";
             winStatus = false;
         } else {
             resultString = "Scissor cuts Paper, You Won.";
             winStatus = true;
            }
    }

    winOrLoseString.textContent = resultString;

    if (winStatus!= null) {
        updateCounter(winStatus);
    }
    
    
}


function updateCounter(winStatus){

    if (winStatus === true) {
        player += 1;
    } else if (winStatus === false) {
        computer += 1;
    }

    cScore.textContent = `Computer Score: ${computer}`;
    pScore.textContent = `Player Score:  ${player}`;
    
    checkEnd();
}

function checkEnd() {
    if (player===5) {
        winOrLoseString.textContent = "YOU WON THE GAME";
        player = 0;
        computer = 0;
        pScore.textContent = "";
        cScore.textContent = "";
    } else if (computer===5){
        winOrLoseString.textContent = "You Lost the GAME";
        player = 0;
        computer = 0;
        pScore.textContent = "";
        cScore.textContent = "";
    }

}

function compareInput(){
    // take both and compare
    // win(hC, cC), lose(hC, cC), draw(hC, cC)
    // to update result string and scores

    // pass to render(hc, cC)
}

function render(hC, cC){
    // to 
}
