const langtag = document.querySelectorAll(".langtag"),  // Selecting language dropdown elements
  countriesObject = countries,  // Countries object holding language code and name pairs
  exchange = document.querySelector(".exchange"),  // Selecting the exchange button element
  fromText = document.querySelector("#from-text"),  // Selecting the input field for 'from' text
  toText = document.querySelector("#to-text"),  // Selecting the input field for 'to' text
  translatebtn = document.querySelector('#translate'),  // Selecting the translate button
  icon = document.querySelectorAll('.icon i');  // Selecting all icons within class 'icon'

// Looping through each language dropdown (langtag) and adding options from countriesObject
langtag.forEach((e, index) => {
  for (const key in countriesObject) {
    let select;
    // Set default language options: 'en-GB' for the first dropdown, 'bn-IN' for the second
    if (index == 0 && key == "en-GB") {
      select = "selected";
    } else if (index == 1 && key == "bn-IN") {
      select = "selected";
    }
    // Append options dynamically into the dropdowns
    e.innerHTML += `<option value="${key}" id="${index}" ${select}>${countriesObject[key]}</option>`;
  }
})

// Event listener for swapping the content between 'from' and 'to' text fields
exchange.addEventListener("click", () => {
  let demoText = fromText.value;  // Store 'from' text temporarily
  fromText.value = toText.value;  // Swap 'to' text to 'from' text
  toText.value = demoText;  // Assign original 'from' text to 'to' text

  // Swap the selected languages in the dropdowns
  let first_optionValue = langtag[0].value,
    second_optionValue = langtag[1].value;
  langtag[0].value = second_optionValue;
  langtag[1].value = first_optionValue;
});

// Function to fetch translated text from an external translation API
async function get_Translate_value(text) {
  let translateFrom = langtag[0].value;  // Extract language code for 'from'
  let translateTo = langtag[1].value;  // Extract language code for 'to'
  try {
    // Construct API URL using 'from' and 'to' languages
    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    const response = await fetch(url);  // Fetch data from API
    const data = await response.json();  // Parse JSON response
    toText.value = data.responseData.translatedText;  // Set translated text in 'to' field
  } catch (error) {
    alert('Translation Failed');  // Handle any errors
  }
}

// Event listener for the translate button
translatebtn.addEventListener('click', () => {
  let text = fromText.value;  // Get text from 'from' input
  toText.value = "Translating...";  // Show "Translating..." while waiting for API response
  get_Translate_value(text);  // Call the translation function
});

// Event listener for icon clicks (either copy or speak functionality)
icon.forEach((e) => {
  e.addEventListener('click', (data) => {
    // If the icon clicked is 'copy', copy the respective text to clipboard
    if (data.target.className === "fa-solid fa-copy") {
      if (data.target.id === "from") {
        navigator.clipboard.writeText(fromText.value);  // Copy 'from' text
      } else {
        navigator.clipboard.writeText(toText.value);  // Copy 'to' text
      }
    } else {  // If the icon clicked is 'speak', use SpeechSynthesis API to speak the text
      let utterance;
      if (data.target.id === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);  // Speak 'from' text
        utterance.lang = langtag[0].value;  // Set the language for 'from' text
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);  // Speak 'to' text
        utterance.lang = langtag[1].value;  // Set the language for 'to' text
      }
      speechSynthesis.speak(utterance);  // Trigger speech synthesis
    }
  });
});
