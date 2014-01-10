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
		this.position = {x:0, y:0};
		this.valPixel = 10;

		this.init();
	};


	nsViewer.Viewer2D.prototype.init = function(){

		// Taille du canvas
		this.element.width = this.viewer.map.getWidth() * this.valPixel;
		this.element.height = this.viewer.map.getHeight()* this.valPixel;

		this.initRover();

		//dessin de la grille
		for(var x = 0; x < this.viewer.map.getWidth(); x++){
			for(var y = 0; y < this.viewer.map.getHeight(); y++ ){
				color= {red: 122, green: 122, blue: 122, opacity: 0.8};
				var elevevation =  Math.round(this.viewer.map._squares[x][y].z*10);

				color.blue -= elevevation*3;
				color.green -= elevevation*3;
				color.red -= elevevation*3;

				this.context.fillStyle = 'rgba('+ color.red + ','+ color.green + ','+ color.blue + ','+ color.opacity +')';
				this.context.fillRect(x * this.valPixel, y * this.valPixel, this.valPixel, this.valPixel);
			}
		}

		this.listenRover();
		
	}

	nsViewer.Viewer2D.prototype.drawRover = function(data){
		this.context.fillStyle = 'rgba(33, 98, 94, 0.6)';
		this.context.fillRect(data.newX * this.valPixel, data.newY * this.valPixel, this.valPixel, this.valPixel);

		var square = this.viewer.map.getSquare(data.lastX, data.lastY);

		var elevevation =  Math.round(square.z*10);

		this.context.fillStyle = 'rgba(40, 237, 74, 0.2)';
		this.context.fillRect(data.lastX * this.valPixel, data.lastY * this.valPixel, this.valPixel, this.valPixel);
	}

	nsViewer.Viewer2D.prototype.initRover = function(){

		var observable = new nsCommon.Observable();
		observable.subscribe('rover.spawn', function(data) {

			this.position.x -= data.rover.x * this.valPixel - 100;
			this.position.y -= data.rover.y * this.valPixel - 100;

		}.bind(this));

	}

	nsViewer.Viewer2D.prototype.moveMap = function(data){

		switch (data.direction) {
			case 0: //<= NORTH
				this.position.y += data.distance * this.valPixel;
			break;
			case 1: //<= NORTH_EAST
				this.position.y += data.distance * this.valPixel;
				this.position.x -= data.distance * this.valPixel;
			break;
			case 2: //<= EAST
				this.position.x -= data.distance * this.valPixel;
			break;
			case 3: //<= SOUTH_EAST
				this.position.y -= data.distance * this.valPixel;
				this.position.x -= data.distance * this.valPixel;
			break;
			case 4: //<= SOUTH
				this.position.y -= data.distance * this.valPixel;
			break;
			case 5: //<= SOUTH_WEST
				this.position.y -= data.distance * this.valPixel;
				this.position.x += data.distance * this.valPixel;
			break;
			case 6: //<= WEST
				this.position.x += data.distance * this.valPixel;
			break;
			case 7: //<= NORTH_WEST
				this.position.y += data.distance * this.valPixel;
				this.position.x += data.distance * this.valPixel;
			break;
		}

		this.element.style.top = this.position.y  + 'px';
		this.element.style.left = this.position.x + 'px';

	}

	nsViewer.Viewer2D.prototype.listenRover = function(){
		/* Listen to rover events. */
		var observable = new nsCommon.Observable();
		observable.subscribe('rover.move', function(data) {
			this.drawRover(data);
			this.moveMap(data);
		}.bind(this));

	}



})();
