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


while(true){  // Code to run on start, using prompt
    let pItem = prompt("Enter items","");
    
    if(!pItem){
        break }
    makeListItem(pItem);
    }

addButton.addEventListener("click", () => {
    let entry = inputBox.value.trim();

    if (entry !== "") {
        // add new item by function        
        makeListItem(entry);

        // Clear the input box
        inputBox.value = "";
        }
    });

// also using Enter to trigger the add button
inputBox.addEventListener("keypress", (some) => {
    if (some.key === "Enter") {
        addButton.click();
    }
});


function makeListItem(input){
    // create a new list item
    let listItem = document.createElement('li');
    // add input data and button tag with class
    listItem.innerHTML = `${input} <button class="delButton">delete</button>`;
    // append to list
    listEl.append(listItem);

    // select delete button WITHIN Current ListItem, not document
    // putting it on documnet deletes all entries
    let delButton = listItem.querySelector('.delButton');
    // add removing function on click
    delButton.addEventListener( 'click', ()=> {
        listEl.removeChild(listItem);
    })
}

// A button to clear the list
const clearButton = document.querySelector('.clearButton');

clearButton.addEventListener('click', ()=> {
    while(listEl.firstChild){
        listEl.firstChild.remove();
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


