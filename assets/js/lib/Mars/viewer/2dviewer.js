(function() {
	var nsViewer = using('mars.viewer');
	var nsCommon = using('mars.common');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Viewer2D = function(viewer, element, options) {
		this.viewer = viewer;
		this.element = element;
		this.options = (options) ? options : {};
		this.context = element.getContext('2d');

		this.init();
	};


	nsViewer.Viewer2D.prototype.init = function(){

		var ValPixel = 10;

		// Taille du canvas
		this.element.width = this.viewer.map.getWidth()*10;
		this.element.height = this.viewer.map.getHeight()*10;

		
		// Initialisation de la position de depard de desson
		var positionX = 0;
		var positionY = 0;

		//couleurs :
		var color;

		//dessin de la grille
		for(var x = 0; x < this.viewer.map.getWidth(); x++){
			for(var y = 0; y < this.viewer.map.getHeight(); y++ ){
				var elevevation =  Math.round(this.viewer.map._squares[x][y].z);
				if(elevevation == -5){ color = '#f06a4c'; }
				else if(elevevation == -6){ color = '#e96d4e'; }
				else if(elevevation == -4){ color = '#e96d4e'; }
				else if(elevevation == -3){ color = '#e27151'; }
				else if(elevevation == -2){ color = '#da7553'; }
				else if(elevevation == -1){ color = '#d37856'; }
				else if(elevevation == 0){ color = '#cc7c59'; }
				else if(elevevation == 1){ color = '#c5805b'; }
				else if(elevevation == 2){ color = '#be835e'; }
				else if(elevevation == 3){ color = '#b68760'; }
				else if(elevevation == 4){ color = '#af8b63'; }
				else if(elevevation == 5){ color = '#a88e65'; }
				this.context.fillStyle = color;
				this.context.fillRect(x * ValPixel, y * ValPixel, ValPixel, ValPixel);
			}
		}

		this.listenRover();

	}

	nsViewer.Viewer2D.prototype.drawRover = function(data){
		this.context.fillStyle = '#000';
		this.context.fillRect(data.newX * 10, data.newY * 10, 10, 10);
		this.context.fillStyle = '#D3CFBE';
		this.context.fillRect(data.lastX * 10, data.lastY * 10, 10, 10);
	}

	nsViewer.Viewer2D.prototype.listenRover = function(){
		/* Listen to rover events. */
		var observable = new nsCommon.Observable();
		observable.subscribe('rover.move', function(data) {
			this.drawRover(data);
		}.bind(this));

	}



})();