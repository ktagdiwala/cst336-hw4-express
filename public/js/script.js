//event listeners
document.querySelector("#send").addEventListener("click", sendMessage);

//functions

// Gets a response from the Gemini API when the user sends a message
async function sendMessage(){
    console.log("Inside sendMesssage...");
    let userMessage = document.querySelector("#userMessage").value;
    console.log("User Message: " + userMessage);
    addUserMsg(userMessage);
    let feedback = document.querySelector("#msgFb");
    if(userMessage != ""){
        feedback.innerHTML = "";
        // Retrieves a response from the API
        const response = await getResponse(userMessage);
        console.log("API Response: " + response.reply);
        addApiResponse(response.reply);
    }else{
        // Sends feedback if message is empty
        feedback.innerHTML = "Please type a message to send";
        feedback.style.color="red";
    }
}

// Handles the frontend API endpoint interaction with the backend
async function getResponse(userMessage){
    console.log("Inside getResponse...");
    console.log("Sending Message: " + userMessage);
    try{
        response = await fetch("/aiapp",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_message: userMessage
            }),
        });
        // There was some issue with the network
        if (!response.ok) { 
            console.error("Network response was not OK (200)");
            return("An error occured.");
        }
        // Successfully received a response
        response = response.json();
        console.log("client received: " + response);
        return response;
    
    // There was another error retrieveing a response
    }catch(error){
        console.error("Error: ", error);
        feedback.innerHTML = "there was an error...";
    };
    console.log("Problem getting response.");
    response = "An error occured.";
    console.log("client received: " + response);
    return response;
}

// adds the user message to the chat history
function addUserMsg(message){
    console.log("adding user message...");
    document.querySelector("#chatHistory").innerHTML += `<div><span class="request"> ${message} </span></div>`;
}

// adds the API response to the chat history
function addApiResponse(message){
    console.log("adding response message...");
    document.querySelector("#chatHistory").innerHTML += `<div><span class="request"> ${message} </span></div>`;
}