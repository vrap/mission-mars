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
	document.querySelector('.view').style.display = 'none';
  document.querySelector('#voyager-settings').style.display = 'none';
  document.querySelector('#explorer-settings').style.display = 'none';

  document.querySelector('#start').onclick = function () {
    document.querySelector('#st-control-2').checked = true;
  };

  document.querySelector('#import').onclick = function () {
    document.querySelector('#st-control-3').checked = true;
    document.querySelector('#block-generate').style.display = 'none';
    document.querySelector('#block-upload').style.display = 'block';
  };

  document.querySelector('#generate').onclick = function () {
    document.querySelector('#st-control-3').checked = true;
    document.querySelector('#block-generate').style.display = 'block';
    document.querySelector('#block-upload').style.display = 'none';
  };

  document.querySelector('#scenario').onclick = function () {
    document.querySelector('#st-control-4').checked = true;
  };

  document.querySelector('#explorer').onclick = function () {
    document.querySelector('#voyager-settings').style.display = 'none';
    document.querySelector('#explorer-settings').style.display = 'inline-block';
  };

  document.querySelector('#voyager').onclick = function () {
    document.querySelector('#voyager-settings').style.display = 'inline-block';
    document.querySelector('#explorer-settings').style.display = 'none';
  };

  document.querySelector('#view').onclick = function () {
    createScript("assets/js/main.js");
    document.querySelector('.st-container').style.display = 'none';
    document.querySelector('.view').style.display = 'block';
  };

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
	};

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
	};

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
        document.querySelector('#st-control-4').checked = true;
			};
			reader.readAsText(file);
      return true;
		} else {
      alert('Please, upload a JSon');
      return false;
    }
	}
})();

/**
 * Add scripts at the end of the body
 */
function createScript (script) {
  var s = document.createElement('script');
  s.src = scriptsArray[i];
  document.body.appendChild(s);
}