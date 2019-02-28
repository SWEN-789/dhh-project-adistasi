//Create necessary SpeechRecognition global variables with fallback to webkit if they don't exist
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

/*
THIS SECTION WOULD HANDLE THE AJAX LOADING OF A DICTIONARY IF IT WERE ON A LIVE SERVER
var words = []

console.log("loading");

$.ajax({
    url: 'dictionary.json',
    dataType: 'json',
    async: false,
    success: function(json) {
      console.log(json);
        $.each(json, function(key, value){
        words.push(key);
    });
    }
});

console.log("loaded");
var grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ';'
*/

//Get necessary page elements for interaction
var diagnosticPara = document.querySelector('.output');
var testBtn = document.querySelector('#inputSpeech');
var aslArea = document.querySelector('#ASLMessage');
var englishArea = document.querySelector('#EnglishMessage');


/**
 * A function to take in human speech and transcribe it into written text
 */
function translate() {
  //Some visual edits to disable the button, show that it's processing, and reset the diagnostic display
  testBtn.disabled = true;
  testBtn.textContent = 'Processing Speech';
  diagnosticPara.textContent = 'Diagnostic Messages';

  //Load in the dictionary for the local version (this would be commented out on a live version)
  var grammar = getDictionaryLocal();

  //Instantiate and configure the SpeechRecognition object - setting the language, providing it with a grammar, and other settings
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  //Begin the recognition
  recognition.start();

  // ===== DEFINING ACTIONS TAKEN ON RECOGNITION RESULTS =====
  //On a successful recogntion, log the data recieved and it's confidence, append it to the diagnostic results, and append it to each textarea
  recognition.onresult = function(event) {
    var speechResult = event.results[0][0].transcript;
    console.log('Confidence: ' + event.results[0][0].confidence);


    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    var aslText = document.createTextNode(speechResult + "\n");
    var englishText = document.createTextNode(speechResult + "\n");

    englishArea.appendChild(englishText);
    aslArea.appendChild(aslText);
  }

  //When the speech input ends, stop listening, and re-enable the button indicating we're ready for more input
  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Input Speech';
  }

  //When the speech input errors, reset the view to allow for another input and print the error that occured to the diagnostics panel
  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

}

//Apply the above function as a click event to the "Translate" button
testBtn.addEventListener('click', translate);


/**
 * A function to export the contents of the textarea (e.g. the words spoken) to a JSON dictionary for use with a Web Speech API tool
 */
function exportToJavaScript() {
  //Get the text in the textareas
  var dictionary = {};
  var lines = $('#EnglishMessage').val().split('\n');

  //Loop through each line and append it to the dictionary as a it's own entry (users can manually input definitions if they desire)
  for(var i=0; i < lines.length; i++){
    dictionary[lines[i]] = "Enter Description Here";
  }

  //Format a hidden download element with the appropriate data and start the download
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dictionary));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "Dictionary.json");
  dlAnchorElem.click();
}

/**
 * A function to "export" the results to print
 * Essentially, it populates a hidden div that is configured for printing with the information in the text area
 */
function exportToPrint() {
  //Get the text in the english textbox and get references to the hidden print fields
  var lines = $('#EnglishMessage').val().split('\n');
  var aslPrint = $("#ASLPrint");
  var englishPrint = $("#EnglishPrint");

  //Clear the fields of previous data
  aslPrint.empty();
  englishPrint.empty();

  //For each line (e.g. entry) in the textarea, append it (in each font) to the different areas
  for(var i=0; i < lines.length; i++) {
    aslPrint.append("<p>" + lines[i] + "</p>")
    englishPrint.append("<p>" + lines[i] + "</p>")
  }
}
