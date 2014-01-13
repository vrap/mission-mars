/**
* File for functions used for UI and UX
*/
var nsCommon = using('mars.common');

var scripts = [
		// Main script
		"assets/js/main.js"
];

/* Home and viewer display */
document.body.onload = function () {
	document.querySelector('.home').style.display = 'block';
	document.querySelector('.view').style.display = 'none';
}

document.querySelector('#show').onclick = function () {
	createScripts(scripts);
	document.querySelector('.home').style.display = 'none';
	document.querySelector('.view').style.display = 'block';
}

function createScripts (scriptsArray) {
	for (var i = 0; i < scriptsArray.length; i++) {
		var s = document.createElement('script');
		s.src = scriptsArray[i];

		document.body.appendChild(s);
	};
}

/* Control */
document.querySelector('#controls-header').onclick = function () {
	if (document.querySelector('#panel-control').className == 'closed') {
		document.querySelector('#controls').className = 'show';
		document.querySelector('#panel-control').className = 'opened';
	} else if (document.querySelector('#panel-control').className == 'opened') {
		document.querySelector('#controls').className = 'hide';
		document.querySelector('#panel-control').className = 'closed';
	}
}

/* Console */
var askConcoleElement = document.querySelector('#form-commande');
var responseConsoleElement = document.querySelector('#panel-response-console');

var consoleInvader = new ConsoleInvader(askConcoleElement, responseConsoleElement);
document.querySelector('#form-commande').onsubmit = function(e){
		e.preventDefault();
		var commande = this.elements["commande"];
		consoleInvader.getCommande(commande);
}

/* Upload */
document.querySelector('#upload').onclick = function () {
	var file = document.getElementById('uploadedMap').files[0];
	if(undefined !== file) {
		var reader = new FileReader();
		reader.onload = function(evt) {
  		document.getElementById('json').value = evt.target.result;
		};
		reader.readAsText(file);

		createScripts(scripts);
		document.querySelector('.home').style.display = 'none';
		document.querySelector('.view').style.display = 'block';
	}
}