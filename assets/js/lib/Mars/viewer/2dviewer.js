(function() {
	var nsViewer = using('mars.viewer');
	var nsCommon = using('mars.common');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Viewer2D = function(viewer, element, options, moved) {
		this.viewer = viewer;
		this.element = element;
		this.options = (options) ? options : {};
		this.context = element.getContext('2d');
		this.position = {x:0, y:0};
		this.valPixel = 15;

		this.stepX = 0;
		this.stepY = 0;

		this.roverInitx = 0;
		this.roverInitY = 0;

		this.moved = moved;

		this.init();
	};

    nsViewer.Viewer2D.prototype.init = function(){
	/* 2D viewer initialization */
	this.viewer._observer.publish('viewer.2d.init', [{'progress': 0}]);

	// Taille du canvas
	this.element.width = this.viewer.map.getWidth() * this.valPixel;
	this.element.height = this.viewer.map.getHeight()* this.valPixel;

	if(!this.moved){

	    this.element.style.top = 0  + 'px';
	    this.element.style.left = 0 + 'px';
	    
	}


	var width = this.element.width;
	var height = this.element.height;
	var i = 0;
	
	this.initRover();
	this.viewer._observer.publish('viewer.2d.init', [{'progress': 25}]);

	//dessin de la grille
	for(var x = 0; x < this.viewer.map.getWidth(); x++){
	    for(var y = 0; y < this.viewer.map.getHeight(); y++ ){
		color= {red: 110, green: 110, blue: 110, opacity: 1};
		var elevevation =  this.viewer.map._squares[x][y].z;

		color.blue += elevevation*3;
		color.green += elevevation*3;
		color.red += elevevation*3;

		this.context.fillStyle = 'rgba('+ color.red + ','+ color.green + ','+ color.blue + ','+ color.opacity +')';
		this.context.fillRect(x * this.valPixel, y * this.valPixel, this.valPixel, this.valPixel);
	    }
	}
	this.viewer._observer.publish('viewer.2d.init', [{'progress': 50}]);

	var opacity = 1;
	var valPixel = 3;
	var y = valPixel;
	for (var i = 0; i < 10; i++) {
	    shade = 'rgba(68, 68, 68, '+ opacity +')';
	    this.context.fillStyle = shade;
	    if(i==0){
		this.context.fillRect(0, i, width, y); // top
		this.context.fillRect(0, height - i + 1, width, y); // bottom
		this.context.fillRect(i, 0, y, height) // left
		this.context.fillRect(width - i + 1, 0, y, height) // right
	    }else{
		this.context.fillRect(0, y, width, valPixel); // top
		this.context.fillRect(0, height - y + 1, width, valPixel); // bottom
		this.context.fillRect(y, 0, valPixel, height) // left
		this.context.fillRect(width - y + 1, 0, valPixel, height) // right
		y += valPixel;	
	    }		
	    opacity -= 0.1;

	};
	this.viewer._observer.publish('viewer.2d.init', [{'progress': 75}]);

	this.listenRover();
	this.viewer._observer.publish('viewer.2d.init', [{'progress': 100}]);
    }

    nsViewer.Viewer2D.prototype.drawRover = function(data){

	this.context.fillStyle = 'rgba(48, 244, 255, 0.6)';
	this.context.fillRect(data.newX * this.valPixel, data.newY * this.valPixel, this.valPixel, this.valPixel);
	this.context.fillStyle = 'rgba(198, 240, 242, 0.2)';
	this.context.fillRect(data.lastX * this.valPixel, data.lastY * this.valPixel, this.valPixel, this.valPixel);
	
    }

    nsViewer.Viewer2D.prototype.initRover = function(){

	var observable = new nsCommon.Observable();
	observable.subscribe('rover.spawn', function(data) {

	    this.position.x -= data.rover.x * this.valPixel - 100;
	    this.position.y -= data.rover.y * this.valPixel - 100;
	    
	    this.roverInitx = data.rover.x;
	    this.roverInitY = data.rover.y;

	}.bind(this));

    }

    nsViewer.Viewer2D.prototype.moveMap = function(data){



	switch (data.direction) {
	case 0: //<= NORTH
	    this.position.y -= 1 * this.valPixel;
	    this.stepY++;
	    break;
	case 1: //<= NORTH_EAST
	    this.position.y -= 1 * this.valPixel;
	    this.position.x -= 1 * this.valPixel;
	    this.stepY++;
	    this.stepX++;
	    break;
	case 2: //<= EAST
	    this.position.x -= 1 * this.valPixel;
	    break;
	case 3: //<= SOUTH_EAST
	    this.position.y -= 1 * this.valPixel;
	    this.position.x -= 1 * this.valPixel;
	    this.stepY++;
	    this.stepX++;
	    break;
	case 4: //<= SOUTH
	    this.position.y += 1 * this.valPixel;
	    this.stepY++;
	    break;
	case 5: //<= SOUTH_WEST
	    this.position.y += 1 * this.valPixel;
	    this.position.x += 1 * this.valPixel;
	    this.stepY++;
	    this.stepX++;
	    break;
	case 6: //<= WEST
	    this.position.x += 1 * this.valPixel;
	    break;
	case 7: //<= NORTH_WEST
	    this.position.y -= 1 * this.valPixel;
	    this.position.x += 1 * this.valPixel;
	    this.stepY++;
	    this.stepX++;
	    break;
	}
	if(this.stepY > 9 || data.rover.y > 9){
	    this.element.style.top = this.position.y  + 'px';
	}

	if(this.stepX > 9 || data.rover.x > 9 ){
	    this.element.style.left = this.position.x + 'px';
	}
	
    }

    nsViewer.Viewer2D.prototype.listenRover = function(){

	/* Listen to rover events. */
	var observable = new nsCommon.Observable();
	observable.subscribe('rover.move.end', function(data) {
	    this.drawRover(data);
	    if(this.moved){
		this.moveMap(data);
		
	    }
	    
	}.bind(this));

    }
})();
