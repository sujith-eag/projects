//document.getElementById("counter-el").innerText=5;

let count = 0;
let countEl = document.querySelector("#count-el");
let saveEL = document.querySelector("#save_btn");
let para = document.querySelector("#paraLine");


let total = 0;
function btnf() {
    count += 1;
    total += 1;
    countEl.innerText = count;
}

let content = "Previous Count: ";

function saveBtn(){
    // content = content + " - " + count;
    //content += " -   " + count;
    // para.innerText = content;
    // para.textContent = content += " -   " + count;
    content += count + " - ";
    let countStr = content;
    para.textContent = countStr;
    
    count = 0;
    countEl.innerText = count;
    // countEl.innerText = count;
    // count = 0;
}

let totalPeople = document.querySelector("#total");
totalPeople.addEventListener("click", () => {
    para.textContent = total;
});

// function totalCount() {
//     para.textContent = total; }

let resetCount = document.querySelector("#reset");
resetCount.addEventListener("click", () => {
    content = "Previous Count: ";
    para.textContent = content;

    total = 0;
})

