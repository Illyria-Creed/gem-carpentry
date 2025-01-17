//Slider for the images of the company's work
let slideIndex = 0;
let slides = document.getElementsByClassName("mySlides");
let intervalID;

function initialiseslider() {
    if (slides.length > 0) {
        slides[slideIndex].style.display = "block";
        intervalID = setInterval(nextSlide, 5000);
    }
}

function showSlide(index) {
    if (index >= slides.length) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = slides.length - 1;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}

function nextSlide() {
    slideIndex++;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex--;
    showSlide(slideIndex);
}

document.addEventListener("DOMContentLoaded", initialiseslider);

//Function for qoute price calculation
document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".serviceCheckbox");

    function toggleDetails(event) {
        const checkbox = event.target;
        const details = document.getElementById(checkbox.id + "Details");
        details.style.display = checkbox.checked ? "block" : "none";
    }

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", toggleDetails);
    });

    function calculateTotalCost() {
        let total = 0;

        if (document.getElementById("Decking").checked) {
            const qty = parseFloat(document.getElementById("DeckingQuantity").value) || 0;
            total += 200 * qty;
        }

        if (document.getElementById("Roofbeams").checked) {
            const qty = parseFloat(document.getElementById("RoofbeamsQuantity").value) || 0;
            total += 150 * qty;
        }

        if (document.getElementById("Walls").checked) {
            const qty = parseFloat(document.getElementById("WallsQuantity").value) || 0;
            total += 300 * qty;
        }

        const output = document.getElementById("output");
        output.textContent = total > 0 ? `Total Cost: $${total.toFixed(2)}` : "Select a service and enter valid quantities.";
    }

    document.getElementById("calculateButton").addEventListener("click", calculateTotalCost);
});

//Confirmation modal for the video call
document.getElementById("submitVC").addEventListener("click", function () {
    const name = document.getElementById("Name").value.trim();
    const date = document.getElementById("date").value.trim();
    const time = document.getElementById("time").value.trim();

    const selectedTopics = [];
    const topicCheckboxes = document.querySelectorAll("form input[type='checkbox']");
    
    topicCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedTopics.push(checkbox.name);
        }
    });

    if (!name || !date || !time) {
        alert("Please fill out all fields (name, date, and time).");
        return;
    }

    if (selectedTopics.length === 0) {
        alert("Please select at least one topic to discuss.");
        return;
    }

    const roomCode = generateUniqueCode();
    const entryCode = generateUniqueCode();

    const confirmationMessage = `
        Dear ${name},\n\n
        Thank you for submitting a meeting request with us. Our team will be in contact with you regarding your appointment. 
        When selecting a username, please use the name you entered here.\n\n
        At ${time} on the ${date}, our virtual meeting will take place on the Zoom platform.\n\n
        This is the meeting code: ${roomCode}\n
        Pin: ${entryCode}\n\n
        Please save these codes to access your meeting.
    `;

    document.getElementById("confirmationMessage").textContent = confirmationMessage;
    document.getElementById("confirmationModal").style.display = "block";

    document.getElementById("Name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    topicCheckboxes.forEach((checkbox) => (checkbox.checked = false));
});

document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("confirmationModal").style.display = "none";
});

// Function to generate a unique code for thr video call
function generateUniqueCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

//Supplier form validation if they can work with the company
function checkDeliveryQualification() {
    const supplyData = JSON.parse(localStorage.getItem("supplyFormData"));
    const resultDiv = document.getElementById("qualificationResult");

    if (!supplyData) {
        resultDiv.textContent = "No data found. Please fill out the form first.";
        resultDiv.style.color = "red";
        return;
    }

    const { vehicleType, hours, days, pay } = supplyData;

    let message = "You qualify to work with us as a delivery partner!";
    let qualifies = true;

    if (vehicleType !== "Truck" && vehicleType !== "Small Van" && vehicleType !== "Large Van") {
        qualifies = false;
        message = "You do not qualify because your vehicle type does not meet our requirements.";
    }

    if (!hours.includes("10-20")) {
        qualifies = false;
        message = "You do not qualify because your working hours do not meet our requirements.";
    }

    const requiredDays = ["Tuesday", "Wednesday", "Thursday", "Saturday"];
    const missingDays = requiredDays.filter(day => !days.includes(day));
    if (missingDays.length > 0) {
        qualifies = false;
        message = `You do not qualify because you are not available on: ${missingDays.join(", ")}.`;
    }

    if (pay >= 250) {
        qualifies = false;
        message = "You do not qualify because your expected pay exceeds $250/day.";
    }

    resultDiv.textContent = message;
    resultDiv.style.color = qualifies ? "green" : "red";
}

document.getElementById("checkQualification").addEventListener("click", checkDeliveryQualification);

// The form to check if the recruit can work with the company
function checkRecruitQualification() {
    const expectedAnswers = ["yes", "yes", "yes", "no", "no"];
    const responses = [];

    for (let i = 1; i <= 5; i++) {
        const answer = document.querySelector(`input[name="q${i}"]:checked`);
        if (answer) {
            responses.push(answer.value);
        } else {
            alert("Please answer all questions.");
            return;
        }
    }

    const isSuitable = responses.every((response, index) => response === expectedAnswers[index]);

    const resultDiv = document.getElementById("qualificationResult2");
    resultDiv.textContent = isSuitable
        ? "Congratulations! Based on your responses, you are suitable to work with us."
        : "Unfortunately, based on your responses, you are not suitable to work with us.";
    resultDiv.style.fontWeight = "bold";
    resultDiv.style.color = isSuitable ? "green" : "red";
}

document.getElementById("checkQualification2").addEventListener("click", checkRecruitQualification);
