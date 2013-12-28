/**
* File for functions used for UI and UX
*/


/* Console */
var askConcoleElement = document.querySelector('#form-commande');
var responseConsoleElement = document.querySelector('#panel-response-console');

var consoleInvader = new ConsoleInvader(askConcoleElement, responseConsoleElement);
document.querySelector('#form-commande').onsubmit = function(e){
		e.preventDefault();
		var commande = this.elements["commande"];
		consoleInvader.getCommande(commande);

}
