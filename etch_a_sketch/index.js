const startBtn = document.querySelector(".startBtn");
const container = document.querySelector('#container');


startBtn.addEventListener("click", ()=> {
    getNumber();
});

function getNumber(){
    const num = prompt("Type the number of square");
    const number = parseInt(num);  // to convert to int

    if (!isNaN(number) && number>0) {
        makeGrid(number);
    } else {
        alert(`Please enter a valid number`);
    }
}


function makeGrid(number) {
    container.innerHTML = ''; // clearing previous grid

    for (let i = 0; i < number; i++) {
        let div = document.createElement("div");
        div.classList.add("pixel");

        // Initialize the darkening level
        div.dataset.darkness = 0;

        div.addEventListener("mouseover", () => {
            let currentDarkness = parseInt(div.dataset.darkness);

            // Limit the darkness to a maximum value
            if (currentDarkness < 5) {
                currentDarkness++;
                div.style.backgroundColor = 
                `rgb(${currentDarkness * 51}, 
                ${currentDarkness * 51}, 
                ${currentDarkness * 51})`; // Darken color

                div.dataset.darkness = currentDarkness; 
                // Update the darkness level
            }
        });
        container.appendChild(div);
        }
    }
