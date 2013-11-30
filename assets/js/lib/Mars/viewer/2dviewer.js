(function() {
	var nsViewer = using('mars.viewer');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Viewer2D = function(viewer, element, options) {
		this.viewer = viewer;
		this.element = element;
		this.options = (options) ? options : {};

		console.log('lala');
		this.init();
	};


	nsViewer.Viewer2D.prototype.init = function(){

	// Initialisation du canvas
	var c = this.element;
	var ctx = c.getContext("2d");
	
	// Initialisation de la position de depard de desson
	var positionX = 0;
	var positionY = 0;

	//couleurs :
	var color;
	var ValPixel = 4;
	console.log(ValPixel);

	// dessin de la grille
	for(var x = 0; x < this.viewer.map.getWidth()-1; x++){
		for(var y = 0; y < this.viewer.map.getHeight()-1; y++ ){

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
			ctx.fillStyle = color;
			ctx.fillRect(x * ValPixel, y * ValPixel, 10-1, 10-1);
		}
	}

}



})();