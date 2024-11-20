//event listeners
// Allows user to send a message using the "enter" key
document.querySelector("#userMessage").addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        // Trigger the button element with a click
        document.querySelector("#send").click();
    }
});
document.querySelector("#send").addEventListener("click", sendMessage);

//functions

// Gets a response from the Gemini API when the user sends a message
async function sendMessage(){
    document.querySelector("#send").style.enabled = false;
    // console.log("Inside sendMesssage...");
    let userMessage = document.querySelector("#userMessage").value;
    // console.log("User Message: " + userMessage);
    let feedback = document.querySelector("#msgFb");
    if(userMessage != ""){
        // adds the userMessage to the chat history
        addUserMsg(userMessage);
        // clears the message input box
        document.querySelector("#userMessage").value = "";
        feedback.innerHTML = "";
        // Retrieves a response from the API
        const response = await getResponse(userMessage);
        // console.log("API Response: " + response.reply);
        // display api response in chat history
        addApiResponse(response.reply);
    }else{
        // Sends feedback if message is empty
        feedback.innerHTML = "Please type a message to send";
        feedback.style.color="red";
    }
    document.querySelector("#send").style.enabled = true;
}

// Handles the frontend API endpoint interaction with the backend
async function getResponse(userMessage){
    // console.log("Inside getResponse...");
    // console.log("Sending Message: " + userMessage);
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
        // console.log("client received: " + response);
        return response;
    
    // There was another error retrieveing a response
    }catch(error){
        console.error("Error: ", error);
        feedback.innerHTML = "there was an error...";
    };
    console.log("Problem getting response.");
    response = "An error occured.";
    // console.log("client received: " + response);
    return response;
}

// adds the user message to the chat history
function addUserMsg(message){
    // console.log("adding user message...");
    let chatHistory = document.querySelector("#chatHistory");
    chatHistory.innerHTML += `<div class="request_box"><div class="request"> ${message} </div></div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// adds the API response to the chat history
function addApiResponse(message){
    // console.log("adding response message...");
    let chatHistory = document.querySelector("#chatHistory");
    chatHistory.innerHTML += `<div class="response_box"> <img id="gemini_logo" src="/img/gemini_icon.png">
    <div class="response">${message}</div> </div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;
}