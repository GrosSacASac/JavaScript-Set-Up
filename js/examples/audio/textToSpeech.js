
const speechSynthesisUtterance = new SpeechSynthesisUtterance();
speechSynthesisUtterance.lang = "en";
speechSynthesisUtterance.text = "A wonderfull day to do web programming";
speechSynthesis.speak(speechSynthesisUtterance);
