var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

/*
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

var diagnosticPara = document.querySelector('.output');
var testBtn = document.querySelector('#inputSpeech');
var aslArea = document.querySelector('#ASLMessage');
var englishArea = document.querySelector('#EnglishMessage');



function translate() {
  testBtn.disabled = true;
  testBtn.textContent = 'Processing Speech';

  diagnosticPara.textContent = 'Diagnostic Messages';

  var grammar = getDictionaryLocal();
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    var speechResult = event.results[0][0].transcript;

    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    var aslText = document.createTextNode(speechResult + "\n");
    var englishText = document.createTextNode(speechResult + "\n");

    console.log(aslText);
    console.log(englishText);

    englishArea.appendChild(englishText);
    aslArea.appendChild(aslText);


    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Input Speech';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

}

testBtn.addEventListener('click', translate);


function exportToJavaScript() {
  var dictionary = {};
  var lines = $('#EnglishMessage').val().split('\n');

  for(var i=0; i < lines.length; i++){
    dictionary[lines[i]] = "Enter Description Here";
  }

  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dictionary));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "Dictionary.json");
  dlAnchorElem.click();
}

function exportToPrint() {
  var lines = $('#EnglishMessage').val().split('\n');
  var aslPrint = $("#ASLPrint");
  var englishPrint = $("#EnglishPrint");

  aslPrint.empty();
  englishPrint.empty();

  for(var i=0; i < lines.length; i++) {
    aslPrint.append("<p>" + lines[i] + "</p>")
    englishPrint.append("<p>" + lines[i] + "</p>")
  }
}