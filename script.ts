// Define an interface for languages
interface Language {
    name: string;
    proficiency: string;
}

let languageCount = 0; // Variable to track the number of languages

// Function to handle form submission
document.getElementById('resumeForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    // Extract input elements and their values
    const getInputValue = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement)?.value || '';
    const getFileInput = (id: string) => (document.getElementById(id) as HTMLInputElement)?.files?.[0] || null;

    const data = {
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
    const languages = collectLanguages();

    const uniquePath = `${data.name.replace(/\s+/g, '_')}_resume.html`;
    let resumeOutput = generateResumeHTML(data, languages);

    if (data.profilePicture) {
        addProfilePicture(data.profilePicture, resumeOutput, uniquePath);
    } else {
        displayResume(resumeOutput, uniquePath);
    }
});

// Helper function to collect languages from the form
function collectLanguages(): Language[] {
    const languages: Language[] = [];
    const languageInputs = document.getElementById('languageContainer')?.querySelectorAll('.languageInput');
    languageInputs?.forEach(input => {
        const languageName = (input.querySelector('input') as HTMLInputElement).value;
        const languageProficiency = (input.querySelector('select') as HTMLSelectElement).value;
        languages.push({ name: languageName, proficiency: languageProficiency });
    });
    return languages;
}

// Helper function to generate HTML for resume output
function generateResumeHTML(data: any, languages: Language[]): string {
    return `
        <h2>Resume</h2>
        <div style="text-align: center;">
            <strong>Name:</strong> <span id="edit-name" class="editable">${data.name}</span><br>
            <strong>Position:</strong> <span id="edit-position" class="editable">${data.position}</span><br>
            <strong>Contact Number:</strong> <span id="edit-contact" class="editable">${data.contact}</span><br>
            <strong>Email:</strong> <span id="edit-email" class="editable">${data.email}</span><br>
            <strong>Address:</strong> <span id="edit-address" class="editable">${data.address}</span><br>
        </div>
        <h3>Education</h3>
        <p><strong>${data.educationTitle}</strong> (${data.educationStartDate} - ${data.educationEndDate})<br>${data.educationDescription}</p>
        <h3>Experience</h3>
        <p>${data.experience}</p>
        <h3>Achievements</h3>
        <p><strong>${data.achievementTitle}</strong>: ${data.achievementDescription}</p>
        <h3>Skills</h3>
        <p>${data.skills}</p>
        <h3>Languages</h3>
        <ul>${languages.map(lang => `<li>${lang.name} (${lang.proficiency})</li>`).join('')}</ul>
    `;
}

// Helper function to handle profile picture and update resume output
function addProfilePicture(profilePicture: File, resumeOutput: string, uniquePath: string): void {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageDataUrl = e.target?.result as string;
        const profilePicHTML = `
            <div class="profilePictureContainer" style="text-align: center;">
                <img src="${imageDataUrl}" class="profilePicture" style="border-radius: 50%; width: 100px; height: 100px;" alt="Profile Picture">
            </div>
        `;
        displayResume(profilePicHTML + resumeOutput, uniquePath);
    };
    reader.readAsDataURL(profilePicture);
}

// Function to display resume and add buttons for download and sharing
function displayResume(resumeOutput: string, uniquePath: string) {
    const resumeOutputElement = document.getElementById('resumeOutput');
    if (resumeOutputElement) {
        resumeOutputElement.innerHTML = resumeOutput;
        addDownloadAndShareButtons(resumeOutput, uniquePath);
        enableEditing();
    }
}

// Function to add Download as PDF and Share Link buttons
function addDownloadAndShareButtons(resumeOutput: string, uniquePath: string) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    // Download as PDF button
    const printButton = document.createElement('button');
    printButton.textContent = 'Download as PDF';
    printButton.classList.add('button');
    printButton.addEventListener('click', () => printResume(resumeOutput));

    // Share Link button
    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share Link';
    shareButton.classList.add('button');
    shareButton.addEventListener('click', () => shareResumeLink(uniquePath));

    buttonContainer.appendChild(printButton);
    buttonContainer.appendChild(shareButton);

    // Add margin between buttons
    printButton.style.marginRight = '10px'; // Add space between buttons

    document.getElementById('resumeOutput')?.appendChild(buttonContainer);
}

// Function to print resume as PDF
function printResume(resumeOutput: string) {
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow?.document.write(`<html><head><title>Resume</title></head><body>${resumeOutput}</body></html>`);
    newWindow?.document.close();
    newWindow?.focus();
    newWindow?.print();
}

// Function to share resume link by copying to clipboard
function shareResumeLink(uniquePath: string) {
    const shareUrl = `${window.location.origin}/resumes/${uniquePath}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy the link.');
    });
}

// Function to enable in-place editing of resume fields
function enableEditing() {
    document.querySelectorAll('.editable').forEach(element => {
        element.addEventListener('click', function() {
            const currentElement = element as HTMLElement;
            const currentValue = currentElement.textContent || "";
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.classList.add('editing-input');

            input.addEventListener('blur', function() {
                currentElement.textContent = input.value;
                currentElement.style.display = 'inline';
                input.remove();
            });

            currentElement.style.display = 'none';
            currentElement.parentNode?.insertBefore(input, currentElement);
            input.focus();
        });
    });
}

// Function to handle adding new languages, up to 3 languages
document.getElementById('addLanguageButton')?.addEventListener('click', function() {
    if (languageCount < 3) {
        languageCount++;
        const languageContainer = document.getElementById('languageContainer')!;
        
        const newLanguageInput = document.createElement('div');
        newLanguageInput.classList.add('languageInput');

        newLanguageInput.innerHTML = `
            <label for="languageName${languageCount}">Language: </label>
            <input type="text" id="languageName${languageCount}" name="languageName" required><br>

            <label for="languageProficiency${languageCount}">Proficiency: </label>
            <select id="languageProficiency${languageCount}" name="languageProficiency" required>
                <option value="Basic">Basic</option>
                <option value="Conversational">Conversational</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
            </select><br>
        `;
        
        languageContainer.appendChild(newLanguageInput);
        
       // Ensure the 'addLanguageButton' exists before modifying its style
       const addLanguageButton = document.getElementById('addLanguageButton');
       if (addLanguageButton && languageCount === 3) {
           addLanguageButton.style.display = 'none'; // Hide the button after 3 languages
       }
   }
});
