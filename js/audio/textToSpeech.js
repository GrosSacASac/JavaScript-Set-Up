
const speechSynthesisUtterance = new SpeechSynthesisUtterance();
speechSynthesisUtterance.lang = "en";
speechSynthesisUtterance.text = "Hi what is up ?";
speechSynthesis.speak(speechSynthesisUtterance);
