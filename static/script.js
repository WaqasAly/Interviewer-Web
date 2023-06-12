// Create references to necessary DOM elements
const messageContainer = document.getElementById('messageContainer');
const convertText = document.getElementById('convert_text');
const clickToRecord = document.getElementById('click_to_record');
const sendMessageBtn = document.getElementById('sendMessageBtn');
// const refreshBtn = document.getElementById('refresh');
// const continueBtn = document.getElementById('continue');
const feedbackBtn = document.getElementById('feedback');
let welcomeMessage = 'Assume you are a customer of an insurance company calling their contact center! Ask me a question about the status of your own payment. Only ask question, nothing else. Do not ask to assist me, you are the customer';

// Add event listeners
clickToRecord.addEventListener('click', startSpeechRecognition);
sendMessageBtn.addEventListener('click', sendMessage);
// refreshBtn.addEventListener('click', refreshChat);
// continueBtn.addEventListener('click', addContinueMessage);
feedbackBtn.addEventListener('click', addFeedbackMessage);

convertText.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        document.getElementById('sendMessageBtn').click();
        // addFeedbackMessage();
    }
});

// Speech Recognition
function startSpeechRecognition() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.interimResults = true;

        recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            convertText.value = transcript;
            console.log(transcript);
        });

        recognition.start();
    } else {
        console.log('Speech recognition is not supported in this browser.');
    }
}

// Send message and retrieve response
function sendMessage() {
    const userMessage = convertText.value;
    addMessage('user', userMessage);

    // Replace this with your actual API call to ChatGPT
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userMessage })
    })
        .then(response => response.json())
        .then(data => {
            const aiResponse = data.reply; // Get the AI response from the server
            addMessage('system', aiResponse);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error if needed
        });

    // Clear the input field
    convertText.value = '';
}

// Function to add a message to the chat interface
function addMessage(role, content) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(role);

    const messageContent = document.createElement('span');
    messageContent.textContent = content;

    if (role === 'user') {
        messageContent.classList.add('bold');
    }

    message.appendChild(messageContent);

    messageContainer.appendChild(message);
}

function refreshChat() {
    // Clear the message container
    messageContainer.innerHTML = '';

    // Clear the input field
    convertText.value = '';

    // Clear conversation memory in browser storage
    sessionStorage.removeItem('chatMessages');
    //clear session storage 
    sessionStorage.clear();

    // Refresh the page
    location.reload();
}

// Function to add a continue message to the chat
function addContinueMessage() {
    const continueMessage = 'continue and ask more questions';
    addMessage('user', continueMessage);

    // Replace this with your actual API call to ChatGPT
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: continueMessage })
    })
        .then(response => response.json())
        .then(data => {
            const aiResponse = data.reply; // Get the AI response from the server
            addMessage('system', aiResponse);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error if needed
        });
}

function addFeedbackMessage() {
    // const feedbackMsg = 'Assume you are a customer of an insurance company calling their contact center! rate my answer out of 10 and give reason why. Only give feedback, nothing else.';
    const feedbackMsg = 'what was my/users last message? I am a contact center representative of an insurace company, so provide feedback on my/user message.';
    try{
        var lastMessage = messageContainer.lastChild.lastChild.textContent;
        console.log("last message: ", lastMessage);
    }
    catch(err){
        console.log("error: ", err);
    }
    addMessage('user', feedbackMsg);
    // addMessage('user', continueMessage);
    // Replace this with your actual API call to ChatGPT
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: feedbackMsg })
    })
        .then(response => response.json())
        .then(data => {
            const aiResponse = data.reply; // Get the AI response from the server
            addMessage('system', 'Feedback: ' + aiResponse);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error if needed
        });
}

function proceed() {
    var selectElement = document.getElementById("scenario");
    var selectedOption = selectElement.options[selectElement.selectedIndex].text;
    console.log("Selected option:", selectedOption);
    // Use the selectedOption variable as needed

    alert("Selected option:" + selectedOption);
    // Add your desired functionality here with the selected option
}


function proceed() {
    // var selectElement = document.getElementById("scenario");
    // var selectedOption = selectElement.options[selectElement.selectedIndex].text;

    // // Display a welcome message in the chat with the selected option
    // welcomeMessage = `Hi! You are a customer of the bank now! Ask a question about your ${selectedOption} from me. I am a bank employee, and I will answer you.`;

    // Redirect to index.html
    window.location.href = 'index.html';
};
//add start function here
function start() {
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: welcomeMessage })
    })
        .then(response => response.json())
        .then(data => {
            const aiResponse = data.reply; // Get the AI response from the server
            addMessage('system', aiResponse);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error if needed
        });
}