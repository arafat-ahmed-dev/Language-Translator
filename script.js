const langtag = document.querySelectorAll(".langtag"),
  countriesObject = countries,
  exchange = document.querySelector(".exchange"),
  fromText = document.querySelector("#from-text"),
  toText = document.querySelector("#to-text"),
  translatebtn = document.querySelector('#translate'),
  from = document.querySelectorAll('#from'),
  to = document.querySelectorAll('#to'),
  icon = document.querySelectorAll('.icon i'),
  fromIcon = document.querySelector('.from'),
  toIcon = document.querySelector('.to');
langtag.forEach((e, index) => {
  for (const key in countriesObject) {
    let select;
    if (index == 0 && key == "en-GB") {
      select = "selected";
    } else if (index == 1 && key == "bn-IN") {
      select = "selected";
    }
    e.innerHTML += `<option value="${key}" id="${index}" ${select}>${countriesObject[key]}</option>`;
  }
})

//swap text between userText to transationText
exchange.addEventListener("click", () => {
  let demoText = fromText.value;
  fromText.value = toText.value;
  toText.value = demoText;

  let first_optionValue = langtag[0].value,
    second_optionValue = langtag[1].value;
  langtag[0].value = second_optionValue;
  langtag[1].value = first_optionValue;


});

async function get_Translate_value(text) {
  let translateFrom = langtag[0].value.toString().split('-')[0];
  let translateTo = langtag[1].value.toString().split('-')[0];
  try {
    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
    const response = await fetch(url);
    const data = await response.json();
    toText.value = data.responseData.translatedText;
  }
  catch (error) {
    alert('Transation Failed')
  }
}

translatebtn.addEventListener('click', () => {
  let text = fromText.value;
  toText.value = "Translating...";
  get_Translate_value(text);
})

icon.forEach((e) => {
  e.addEventListener('click', (data) => {
    if (data.target.className === "fa-solid fa-copy") {
      if (data.target.id === "from") {
        navigator.clipboard.writeText(fromText.value)
      } else {
        navigator.clipboard.writeText(toText.value)
      }
    } else {
      let utterance;
      if (data.target.id === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = langtag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = langtag[1].value; 
      }
      speechSynthesis.speak(utterance);
    }
  });
});
