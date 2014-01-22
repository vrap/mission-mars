/************************************
* File for functions used for UI and UX
*************************************/

/**
 * Scripts to load
 */
var scripts = [
		// Main script
		"assets/js/main.js"
];

(function () {
	/**
	 * Display home page and hide viewer
	 */
	document.querySelector('.home').style.display = 'block';
	document.querySelector('.view').style.display = 'none';
	document.querySelector('#containerUpload').style.display = 'none';

	/**
	 * Display viewer and hide home page
	 */
	document.querySelector('#show').onclick = function () {
		createScripts(scripts);
		document.querySelector('.home').style.display = 'none';
		document.querySelector('.view').style.display = 'block';
	}

	/**
	 * Show or hide file selector
	 */
	document.querySelector('#showUpload').onclick = function () {
		if('none' == document.querySelector('#containerUpload').style.display) {
			document.querySelector('#containerUpload').style.display = 'block';
		} else {
			document.querySelector('#containerUpload').style.display = 'none';
		}
	}

	/**
	 * Open and close control panel
	 */
	document.querySelector('#controls-header').onclick = function () {
		if (document.querySelector('#panel-control').className == 'closed') {
			document.querySelector('#controls').className = 'show';
			document.querySelector('#panel-control').className = 'opened';
		} else if (document.querySelector('#panel-control').className == 'opened') {
			document.querySelector('#controls').className = 'hide';
			document.querySelector('#panel-control').className = 'closed';
		}
	}

	/**
	 * Console intialization
	 */
	var askConcoleElement = document.querySelector('#form-commande');
	var responseConsoleElement = document.querySelector('#panel-response-console');
	var consoleInvader = new ConsoleInvader(askConcoleElement, responseConsoleElement);

	/**
	 * Response on the console
	 */
	document.querySelector('#form-commande').onsubmit = function(e){
		e.preventDefault();
		var commande = this.elements["commande"];
		consoleInvader.getCommande(commande);
	}

	/**
	 * Read JSon and save it in an input hidden
	 */
	document.querySelector('#upload').onclick = function () {
		var file = document.getElementById('uploadedMap').files[0];
		if(undefined !== file) {
			var reader = new FileReader();
			reader.onload = function(evt) {
				// When reader has finished
				// Save file in an input hidden
	  		document.getElementById('json').value = evt.target.result;
	  		// Call main.js
	  		createScripts(scripts);
	  		// Display viewer
				document.querySelector('.home').style.display = 'none';
				document.querySelector('.view').style.display = 'block';
			};
			reader.readAsText(file);
		}
	}
})();

/**
 * Add scripts at the end of the body
 */
function createScripts (scriptsArray) {
	for (var i = 0; i < scriptsArray.length; i++) {
		var s = document.createElement('script');
		s.src = scriptsArray[i];

		document.body.appendChild(s);
	};
}