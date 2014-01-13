/**
* File for functions used for UI and UX
*/
var scripts = [
		// Main script
		"assets/js/main.js"
];

document.body.onload = function () {
	document.querySelector('.home').style.display = 'block';
	document.querySelector('.view').style.display = 'none';
}

document.querySelector('#show').onclick = function () {
	createScripts(scripts);
	document.querySelector('.home').style.display = 'none';
	document.querySelector('.view').style.display = 'block';
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

function createScripts (scriptsArray) {
	for (var i = 0; i < scriptsArray.length; i++) {
		var s = document.createElement('script');
		s.src = scriptsArray[i];

		document.body.appendChild(s);
	};
}