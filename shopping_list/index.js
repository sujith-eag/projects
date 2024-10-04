// assigning container
const container = document.querySelector(".container");

// adding heading
const heading = document.createElement("h1");
heading.classList.add("heading");
heading.innerText = "Shopping List";

// appending heading to container
container.appendChild(heading);


// Input box and Button

const inputBox = document.querySelector("#inputBox");
const addButton = document.querySelector(".addButton");
const listEl = document.querySelector(".listEl");

addButton.addEventListener("click", () => {
    let entry = inputBox.value.trim();

    if (entry !== "") {
        // Create new list item
        const listItem = document.createElement("li");
        listItem.innerHTML = `${entry} <button class="delButton">delete</button>`;

        // Append the new list item to the list
        listEl.appendChild(listItem);
        
        // Clear the input box
        inputBox.value = "";

        // Add event listener for delete button
        const delButton = listItem.querySelector(".delButton");
        // listItem used instead of document reference
        delButton.addEventListener("click", () => {
            listEl.removeChild(listItem);
            });
        }
    });

/* 
Using appendChild for List Items: Instead of manipulating innerHTML, 
we now create list items using document.createElement("li") and 
append them to the list.

Delete Functionality: 
The delete button event listener is now set up inside the click 
event of the add button. This way, each delete button can refer 
to its corresponding list item.
*/

// also using Enter to trigger the add button
inputBox.addEventListener("keypress", (some) => {
    if (some.key === "Enter") {
        addButton.click();
    }
});

/* event listener is keypress, function needs a name and using
the if statement to identiy if key was Enter and trigger button
by using click() */




/*

// didnt work because i added all html and appended it,
instead of adding li first and appending html to it

addButton.addEventListener("click", ()=> {
    let entry = inputBox.value.trim();
    
    let listItem = `<li>${entry}  <button class = "delButton">delete</button></li>`;

    //listEl.append(listItem); doesnt work when inputting HTML
    listEl.innerHTML = listItem;
    
    inputBox.value = "";

    let delButton = listItem.querySelector(".delButton");
        delButton.addEventListener("click", ()=>{
        listEl.removeChild(listItem);
    })
})
*/


