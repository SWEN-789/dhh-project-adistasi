# ASL Font Translation Generator

## Introduction
This tool was developed with the aim of creating documentation and enabling tools to make domain-specific language more clearly communicated for Deaf users.  The tool allows for customized creation of a sort of "Dictionary" between ASL Font and written English.  The tool accepts both typing and spoken word as modalities of input.

## Resources Used
- [jQuery 3.3.1](https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js)
- [Web Speech API](https://github.com/mdn/web-speech-api)
- [ASL Font](http://aslfont.github.io/Symbol-Font-For-ASL/try-it.html)

## Features
The ASL Font Translation Generator offers the following features:
 - **Side-by-Side text comparison**: You can enter text in both textareas - the one on the left will display the text in ASL Font, while the one on the right will display it in English, allowing for quick correlation between the two versions.
 - **Multi-modality Input**: Users can choose between manually typing information into each textarea or using the Web Speech API to speak into the microphone and have their utterance automatically transcribed into both textboxes.
 - **Export to a JSON Dictionary**: The Web Speech API requires the definition of a dictionary of acceptable words.  For this project, I have retrieved and passed in the Webster Unabridged English Dictionary.  Such a large dictionary may introduce unnecessary overhead for specialized domains.  To mitigate this, I have created functionality to export and download all utterances in the textarea to a JSON Dictionary File that could be used in place of the Unabridged Dictionary.  This allows a user to custom define a subset of words they value for use with the Web Speech API
 - **Export to Print**: If the user wants to create a physical quick reference sheet, the tool offers customized print formatting to display the page as a translation guide for the words/phrases in the textbox.

## How to Run
To run this file, you will need to download the repository and ensure that all files are in the same folder. Run the 'index.html' file in Chrome to open the application locally.

## Browser Issues & Security Quirks
Browser Security is important, but Chrome has several unchangable presets that have made the development of this tool difficult.  First, Chrome refuses to allow you to grant websites only using http:// (instead of https://) access to your microhpone. Unless the website is secured with Https, it completely refuses access.  The only online server environment I have access to is not fully Https secured, meaning I could not run the application online.  In my experiences, Chrome also has a quirk with allowing microphone usage for a local file. Every time I attempted to use the microphone, I had to reallow the site access to my microphone. However, the prompt to allow microphone access wouldn't show up unless I opened or closed the developer console (Control + Shift + J).

In order to bring in the Dictionary for use with the Web Speech API, I downloaded a JSON file that I would load in the AJAX and parse.  However, Chrome browser security regulations will not allow AJAX loading from a local file (meaning that I can't AJAX load in the dictionary from a local file or from a server if I'm operating locally, which I have to do for the microphone to work). To mitigate this, I parsed dictionary file into a string, which I saved as grammar.js.  This script is loaded in and contains a function that returns the string that would result from AJAX loading in the dictionary.  The code to AJAX load in the JSON Dictionary can be found (commented out) at the top of script.js.

If both of these functionalities were deployed to a site that uses https://, they should work properly as intended.
