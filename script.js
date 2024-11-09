var _a, _b;
var languageCount = 0; // Variable to track the number of languages
// Function to handle form submission
(_a = document.getElementById('resumeForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault();
    // Extract input elements and their values
    var getInputValue = function (id) { var _a; return ((_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value) || ''; };
    var getFileInput = function (id) { var _a, _b; return ((_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0]) || null; };
    var data = {
        name: getInputValue('name'),
        position: getInputValue('Position'),
        contact: getInputValue('contact'),
        address: getInputValue('address'),
        email: getInputValue('email'),
        profilePicture: getFileInput('profilePicture'),
        educationTitle: getInputValue('educationTitle'),
        educationStartDate: getInputValue('educationStartDate'),
        educationEndDate: getInputValue('educationEndDate'),
        educationDescription: getInputValue('educationDescription'),
        experience: getInputValue('experience'),
        skills: getInputValue('skills'),
        achievementTitle: getInputValue('achievementTitle'),
        achievementDescription: getInputValue('achievementDescription')
    };
    // Collect languages
    var languages = collectLanguages();
    var uniquePath = "".concat(data.name.replace(/\s+/g, '_'), "_resume.html");
    var resumeOutput = generateResumeHTML(data, languages);
    if (data.profilePicture) {
        addProfilePicture(data.profilePicture, resumeOutput, uniquePath);
    }
    else {
        displayResume(resumeOutput, uniquePath);
    }
});
// Helper function to collect languages from the form
function collectLanguages() {
    var _a;
    var languages = [];
    var languageInputs = (_a = document.getElementById('languageContainer')) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.languageInput');
    languageInputs === null || languageInputs === void 0 ? void 0 : languageInputs.forEach(function (input) {
        var languageName = input.querySelector('input').value;
        var languageProficiency = input.querySelector('select').value;
        languages.push({ name: languageName, proficiency: languageProficiency });
    });
    return languages;
}
// Helper function to generate HTML for resume output
function generateResumeHTML(data, languages) {
    return "\n        <h2>Resume</h2>\n        <div style=\"text-align: center;\">\n            <strong>Name:</strong> <span id=\"edit-name\" class=\"editable\">".concat(data.name, "</span><br>\n            <strong>Position:</strong> <span id=\"edit-position\" class=\"editable\">").concat(data.position, "</span><br>\n            <strong>Contact Number:</strong> <span id=\"edit-contact\" class=\"editable\">").concat(data.contact, "</span><br>\n            <strong>Email:</strong> <span id=\"edit-email\" class=\"editable\">").concat(data.email, "</span><br>\n            <strong>Address:</strong> <span id=\"edit-address\" class=\"editable\">").concat(data.address, "</span><br>\n        </div>\n        <h3>Education</h3>\n        <p><strong>").concat(data.educationTitle, "</strong> (").concat(data.educationStartDate, " - ").concat(data.educationEndDate, ")<br>").concat(data.educationDescription, "</p>\n        <h3>Experience</h3>\n        <p>").concat(data.experience, "</p>\n        <h3>Achievements</h3>\n        <p><strong>").concat(data.achievementTitle, "</strong>: ").concat(data.achievementDescription, "</p>\n        <h3>Skills</h3>\n        <p>").concat(data.skills, "</p>\n        <h3>Languages</h3>\n        <ul>").concat(languages.map(function (lang) { return "<li>".concat(lang.name, " (").concat(lang.proficiency, ")</li>"); }).join(''), "</ul>\n    ");
}
// Helper function to handle profile picture and update resume output
function addProfilePicture(profilePicture, resumeOutput, uniquePath) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        var imageDataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        var profilePicHTML = "\n            <div class=\"profilePictureContainer\" style=\"text-align: center;\">\n                <img src=\"".concat(imageDataUrl, "\" class=\"profilePicture\" style=\"border-radius: 50%; width: 100px; height: 100px;\" alt=\"Profile Picture\">\n            </div>\n        ");
        displayResume(profilePicHTML + resumeOutput, uniquePath);
    };
    reader.readAsDataURL(profilePicture);
}
// Function to display resume and add buttons for download and sharing
function displayResume(resumeOutput, uniquePath) {
    var resumeOutputElement = document.getElementById('resumeOutput');
    if (resumeOutputElement) {
        resumeOutputElement.innerHTML = resumeOutput;
        addDownloadAndShareButtons(resumeOutput, uniquePath);
        enableEditing();
    }
}
// Function to add Download as PDF and Share Link buttons
function addDownloadAndShareButtons(resumeOutput, uniquePath) {
    var _a;
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    // Download as PDF button
    var printButton = document.createElement('button');
    printButton.textContent = 'Download as PDF';
    printButton.classList.add('button');
    printButton.addEventListener('click', function () { return printResume(resumeOutput); });
    // Share Link button
    var shareButton = document.createElement('button');
    shareButton.textContent = 'Share Link';
    shareButton.classList.add('button');
    shareButton.addEventListener('click', function () { return shareResumeLink(uniquePath); });
    buttonContainer.appendChild(printButton);
    buttonContainer.appendChild(shareButton);
    // Add margin between buttons
    printButton.style.marginRight = '10px'; // Add space between buttons
    (_a = document.getElementById('resumeOutput')) === null || _a === void 0 ? void 0 : _a.appendChild(buttonContainer);
}
// Function to print resume as PDF
function printResume(resumeOutput) {
    var newWindow = window.open('', '', 'width=800,height=600');
    newWindow === null || newWindow === void 0 ? void 0 : newWindow.document.write("<html><head><title>Resume</title></head><body>".concat(resumeOutput, "</body></html>"));
    newWindow === null || newWindow === void 0 ? void 0 : newWindow.document.close();
    newWindow === null || newWindow === void 0 ? void 0 : newWindow.focus();
    newWindow === null || newWindow === void 0 ? void 0 : newWindow.print();
}
// Function to share resume link by copying to clipboard
function shareResumeLink(uniquePath) {
    var shareUrl = "".concat(window.location.origin, "/resumes/").concat(uniquePath);
    navigator.clipboard.writeText(shareUrl).then(function () {
        alert('Share link copied to clipboard!');
    }).catch(function () {
        alert('Failed to copy the link.');
    });
}
// Function to enable in-place editing of resume fields
function enableEditing() {
    document.querySelectorAll('.editable').forEach(function (element) {
        element.addEventListener('click', function () {
            var _a;
            var currentElement = element;
            var currentValue = currentElement.textContent || "";
            var input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.classList.add('editing-input');
            input.addEventListener('blur', function () {
                currentElement.textContent = input.value;
                currentElement.style.display = 'inline';
                input.remove();
            });
            currentElement.style.display = 'none';
            (_a = currentElement.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(input, currentElement);
            input.focus();
        });
    });
}
// Function to handle adding new languages, up to 3 languages
(_b = document.getElementById('addLanguageButton')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    if (languageCount < 3) {
        languageCount++;
        var languageContainer = document.getElementById('languageContainer');
        var newLanguageInput = document.createElement('div');
        newLanguageInput.classList.add('languageInput');
        newLanguageInput.innerHTML = "\n            <label for=\"languageName".concat(languageCount, "\">Language: </label>\n            <input type=\"text\" id=\"languageName").concat(languageCount, "\" name=\"languageName\" required><br>\n\n            <label for=\"languageProficiency").concat(languageCount, "\">Proficiency: </label>\n            <select id=\"languageProficiency").concat(languageCount, "\" name=\"languageProficiency\" required>\n                <option value=\"Basic\">Basic</option>\n                <option value=\"Conversational\">Conversational</option>\n                <option value=\"Fluent\">Fluent</option>\n                <option value=\"Native\">Native</option>\n            </select><br>\n        ");
        languageContainer.appendChild(newLanguageInput);
        // Ensure the 'addLanguageButton' exists before modifying its style
        var addLanguageButton = document.getElementById('addLanguageButton');
        if (addLanguageButton && languageCount === 3) {
            addLanguageButton.style.display = 'none'; // Hide the button after 3 languages
        }
    }
});
