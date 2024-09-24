const langtag = document.querySelectorAll(".langtag"),  // Language dropdowns
    countriesObject = countries,  // Countries object with language code and names
    exchange = document.querySelector(".exchange"),  // Swap button
    fromText = document.querySelector("#from-text"),  // From text input
    toText = document.querySelector("#to-text"),  // To text input
    translatebtn = document.querySelector('#translate'),  // Translate button
    icon = document.querySelectorAll('.icon i');  // Icons for copy and speak actions

// Populate dropdown options with languages from countriesObject
langtag.forEach((dropdown, index) => {
    const defaultLang = index === 0 ? "en-GB" : "bn-IN";  // Default language selection
    dropdown.innerHTML = Object.keys(countriesObject).map(key =>
        `<option value="${key}" ${key === defaultLang ? 'selected' : ''}>${countriesObject[key]}</option>`
    ).join('');
});

// Swap text between 'from' and 'to' fields and their language dropdowns
exchange.addEventListener("click", () => {
    [fromText.value, toText.value] = [toText.value, fromText.value];  // Swap text values
    [langtag[0].value, langtag[1].value] = [langtag[1].value, langtag[0].value];  // Swap selected languages
});

// Fetch translation from the API
async function getTranslateValue(text) {
    const translateFrom = langtag[0].value.split('-')[0];  // Extract 'from' language code
    const translateTo = langtag[1].value.split('-')[0];  // Extract 'to' language code

    try {
        const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
        const response = await fetch(url);
        const data = await response.json();
        toText.value = data.responseData.translatedText;  // Set the translated text in the 'to' field
    } catch {
        alert('Translation Failed');  // Handle errors
    }
}

// Translate button event listener
translatebtn.addEventListener('click', () => {
    toText.value = "Translating...";  // Show temporary message
    getTranslateValue(fromText.value);  // Call API to translate
});

// Handle copy and speak functionality for icons
icon.forEach(icon => {
    icon.addEventListener('click', event => {
        const isFrom = event.target.id === "from";
        const text = isFrom ? fromText.value : toText.value;

        if (event.target.className.includes("fa-copy")) {  // If it's the copy icon
            navigator.clipboard.writeText(text);  // Copy respective text to clipboard
        } else {  // If it's the speak icon
            const utterance = new SpeechSynthesisUtterance(text);  // Create speech utterance
            utterance.lang = langtag[isFrom ? 0 : 1].value;  // Set the appropriate language
            speechSynthesis.speak(utterance);  // Speak the text
        }
    });
});
/*Key Optimizations
Simplified Language Dropdown Population:

Instead of using a loop with conditions inside, I used map and join to efficiently create the < option > elements and default selections.
The condition for selecting a default language is now more concise(index === 0 ? "en-GB" : "bn-IN").
Swapping Values:

Used array destructuring for swapping values between fromText and toText as well as the dropdown values.This approach reduces lines and improves readability:
javascript
Copy code
[fromText.value, toText.value] = [toText.value, fromText.value];
Icon Handling Logic:

The icon handling is simplified by using a single addEventListener for both copy and speak functionality.I combined the conditions for determining whether it's a copy or speak operation based on className.
Instead of writing if-else blocks twice for from and to, I used the isFrom flag to determine which text to use and where to get the language from.
Error Handling:

The error handling in the API call is simplified using a single catch block without over - complicating the logic.
Code Explanation
Dropdown Population(langtag.forEach): The code dynamically generates < option > elements for each language dropdown using Object.keys(countriesObject) which extracts all language codes.It checks if the current dropdown should have a default selection(en - GB for the first and bn - IN for the second).

Swap Functionality(exchange.addEventListener): The code uses array destructuring to swap both the text values and the selected languages of the two dropdowns.This keeps the functionality compact and easy to understand.

Translation API Call(getTranslateValue): It extracts the language codes for the "from" and "to" fields, then sends an API request to translate the text.If successful, it updates the toText field with the translated text.If the API call fails, it alerts the user.

Copy and Speak Icons(icon.forEach): The code handles both "copy" and "speak" actions using a single event listener for all icons.It distinguishes between copying and speaking based on the icon's class (fa-copy for copying). If it's a speak action, it uses the Web Speech API(SpeechSynthesisUtterance) to read the text out loud.*/