(function() {

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	ConsoleInvader = function(askElement, reponseElement) {

		this.askElement = askElement;
		this.reponseElement = reponseElement;

	}

	ConsoleInvader.prototype.init = function(){

	}

	ConsoleInvader.prototype.__scrollBottom = function(){
		this.reponseElement.scrollTop = this.reponseElement.scrollHeight;
	}

	/*------------------
	| Layout
	+-------------------*/
	/**
	 * Help
	 * @param {string} titre de la commande
	 * @param {json} commande ou option disponible
	 */
	 ConsoleInvader.prototype.__layoutHelp = function(title, commande){

	 	var bloc = '';
	 	bloc += '<div class="help">';
	 	bloc += '-------------------------';
	 	bloc += '<h3>'+ title +'</h3>';
	 	bloc += '<ul>';

	 	for (var i = 0; i < commande.length; i++) {
	 		bloc += '<li class="response">' + commande[i].name + ' (' + commande[i].description + ')</li>';
	 	};

		bloc += '</ul>';
		bloc += '-------------------------';
		bloc += '</div>';

		return bloc;

	 }

	/**
	 * Commande de premier niveau, redirige vers les commandes des niveaux supèrieur
	 * Exemple de commande : [indaver show panel]
	 * 	=> Cette fonction va renvoyer vers la fonction invader
	 * @param {element input:text}         
	 */
	ConsoleInvader.prototype.getCommande = function(commande){
		
		var commandes = commande.value;
		commande.value = '';

		var commandeNames = commandes.split(' ');

		switch(commandeNames[0])
			{
			case 'invader':
			  this.invader(commandeNames);
			  break;
			default:
			  this.response('This commande doesn\'t existe <br> ( for help : invader --help )');
			}

		this.__scrollBottom();

	}

	/**
	 * Commande de deuxième niveau, redirige vers les commandes des niveaux supèrieur
	 * Exemple de commande : [indaver show panel]
	 * 	=> Cette fonction va renvoyer vers la fonction show
	 * @param {tab de commande}         
	 */
	ConsoleInvader.prototype.invader = function(commandes){

		var commandesList = new Array();
		commandesList.push({name: 'hello', description: 'Say hello !'});
		commandesList.push({name: 'infos', description: 'Informations about battery level and materials found.'});
		commandesList.push({name: 'control', description: 'Control panel of invader 3000.'});

		switch(commandes[1])
			{
			case 'hello':
			  this.invaderResponse('hello you !');
			  break;
			 case 'infos':
			 	this.invaderInfos();
			 	break;
			case '--help':
			  this.response(this.__layoutHelp('Commande of invader 3000', commandesList));
			  break;
			case 'control':
			  this.control(commandes);
			  break;
			default:
			   this.response('This commande doesn\'t existe <br> ( for help : invader --help )');
			}

	}

	/**
	 * Commande de troisieme niveau
	 * Toutes les fonction de la commande control
	 * @param {tab de commande}         
	 */
	ConsoleInvader.prototype.control = function(commandes){

		var commandesList = new Array();
		commandesList.push({name: '--show', description: 'To show panel control.'});
		commandesList.push({name: '--hide', description: 'To hide panel control.'});

		switch(commandes[2])
			{
			case '--show':
				this.showPanelControl();
				  break;
			case '--hide':
				this.hidePanelControl();
				  break;
			case '--help':
				  this.response(this.__layoutHelp('Control', commandesList));
				  break;
			default:
			  	this.response('This commande doesn\'t existe <br> ( for help : invader control --help )');
			}
			
	}

	ConsoleInvader.prototype.showPanelControl = function(){

		if (document.querySelector('#panel-control').className == 'closed') {
			document.querySelector('#controls').className = 'show';
			document.querySelector('#panel-control').className = 'opened';
			this.response('le pannel open !');	
		} else if (document.querySelector('#panel-control').className == 'opened') {
			//this.response('le pannel control est déjà ouvert');	
		}

	}

	ConsoleInvader.prototype.hidePanelControl = function(){

		if (document.querySelector('#panel-control').className == 'closed') {
			this.response('le pannel control est déjà fermer');
		} else if (document.querySelector('#panel-control').className == 'opened') {
			document.querySelector('#controls').className = 'hide';
			document.querySelector('#panel-control').className = 'closed';
			//this.response('le pannel close !');	
		}
		
	}

	ConsoleInvader.prototype.invaderInfos = function(){
		this.invaderResponse('Battery: '+ document.querySelector('#battery-level').value +'%');
		this.invaderResponse('Rock found: '+ document.querySelector('#rock-counter').value);
		this.invaderResponse('Sand found: '+ document.querySelector('#sand-counter').value);
		this.invaderResponse('Ore found: '+ document.querySelector('#ore-counter').value);
		this.invaderResponse('Iron found: '+ document.querySelector('#iron-counter').value);
		this.invaderResponse('Ice found: '+ document.querySelector('#ice-counter').value);
		this.invaderResponse('Others: '+ document.querySelector('#other-counter').value);
	}

	ConsoleInvader.prototype.response = function(text){
		this.reponseElement.innerHTML = this.reponseElement.innerHTML + '<li class="response">' + text + '</li>';
	}
	ConsoleInvader.prototype.invaderResponse = function(text){
		this.reponseElement.innerHTML = this.reponseElement.innerHTML + '<li class="invader">' + text + '</li>';
	}

	ConsoleInvader.prototype.hello = function(){
		return 'hello';
	}

})();