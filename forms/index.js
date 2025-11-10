


//  Form validation example

// let nameValue = document.getElementById("name").value;

// function validateName(nameValue)
// {
//  if(nameValue.length < 6)
//     {
//         let divName = document.getElementById("name");
//         divName.style.borderColor = "red"; 
//     }   
// };


// nameValue.onsubmit( validateName() );
let size = 8;

for (let i = size; i >= 0; i--)
{
	if ( (i%2) === 0)
	{
		console.log(" #".repeat(size) );
	}
	else
	{
		console.log("# ".repeat(size) );
	}
}