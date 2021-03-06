(function() {
    var nsCommon = using('mars.common'),
    nsEditor = using('mars.editor'),
    nsMaterials = using('mars.common.material'),
    nsElements = using('mars.editor.elements');

    var rock = new nsMaterials.Rock (),
    iron = new nsMaterials.Iron (),
    ice = new nsMaterials.Ice (),
    ore = new nsMaterials.Ore (),
    sand = new nsMaterials.Sand (),
    other = new nsMaterials.Other ();

    /**
     * TerrainGenerator
     * "Static class" to generate a terrain.
     */

    /**
     * [TerrainGenerator description]
     * @type {Object}
     */
    nsEditor.TerrainGenerator = {
	_width: null,
	_height: null,
	_zMin: null,
	_zMax: null,
	_materials: [],
	_elements: [],
	_segments: 64,
	_smoothingFactor: 540
    };

    /**
     * [ description]
     * @return {[type]} [description]
     */
    nsEditor.TerrainGenerator._createBase = function() {

	// Create map base
	for (var i = 0; i < this._width; i++) {
	    this._map[i] = new Array();
	    for (var j = 0; j < this._height; j++) {
		this._map[i][j] = { z: getRandomInt(this._zMin, this._zMax),
				    type: this._getFloorType()
				  };
	    }
	}

    };


    nsEditor.TerrainGenerator.RandomElevation = function(){

	/* Boucle général */
	var count = 0;
	while(count < Math.round(this._width)*2){

	    /* Tous les 2 tours inverser la map
	       à l'aide d'un clone de la map */
	    if(count % 2){
		for (var i = 0; i < this._width; i++) {
		    for (var j = 0; j < this._height; j++) {
			this._map[i][j].z = reversMap[i][j].z;
		    }
		}
	    }

	    /* Random des points à éléver sur la map */
	    var width = getRandomInt(0, this._width );
	    var height = getRandomInt(0, this._height);
	    var startWidth = getRandomInt(0, this._width);
	    var startHeight = getRandomInt(0, this._height);

	    /* Élévation des points */
	    for (var i = startWidth; i < width; i++) {
		for (var j = startHeight; j < height; j++) {
		    this._map[i][j].z += 0.1;
		}
		height--; // <= pour avoir des dessins en diagonale
	    }

	    /* Random des points à diminuer sur la map */
	    var width = getRandomInt(0, this._width );
	    var height = getRandomInt(0, this._height);
	    var startWidth = getRandomInt(0, this._width);
	    var startHeight = getRandomInt(0, this._height);

	    /* Diminution des points */
	    for (var i = startWidth; i < width; i++) {
		for (var j = startHeight; j < height; j++) {
		    this._map[j][i].z -= 0.1;
		}
		height--;

	    }
	    count++;

	    /* Création du clone de la map */
	    var reversMap = new Array();
	    for (var i = 0; i < this._width; i++) {
		reversMap[i] = new Array();
		for (var j = 0; j < this._height; j++) {
		    reversMap[i][j] = {z: this._map[j][i].z }
		}
	    }
	}
    }

    nsEditor.TerrainGenerator._diamondSquare = function() {
	this._segments = this._width-1;
    	var size = this._segments+1;

    	var memorySmoothing = this._smoothingFactor;

    	for (var p = 0; p < 1; p++) {
    	    this._smoothingFactor = memorySmoothing;

	    for(var length = this._segments; length >= 2; length /= 2) {
	        var half = Math.round(length/2);
	        this._smoothingFactor = Math.round(this._smoothingFactor / 2);

	        length = Math.round(length);

	        // generate the new square values
	        for(var x = 0; x < this._segments; x += length) {
	            for(var y = 0; y < this._segments; y += length) {
			var xLength = x+length;
			var yLength = y+length;

			if (xLength >= this._width){ var xLength = this._width-1 };
			if (yLength >= this._width){ var yLength = this._width-1 };

			var average = this._map[x][y].z+ // top left
			this._map[xLength][y].z+ // top right
			this._map[x][yLength].z+ // lower left
			this._map[xLength][yLength].z; // lower right
			average = Math.round(average / 4);

			average += Math.round(2*this._smoothingFactor*Math.random()-this._smoothingFactor);
			//this._map[Math.round(x+half)][Math.round(y+half)].z = average;
	            }
	        }

	        // generate the diamond values
	        for(var x = 0; x < this._segments; x += half) {
	            for(var y = Math.round((x+half)%length); y < this._segments-1; y += length) {

	        	var a = Math.round((x-half+size)%size);
	        	var b = Math.round((x+half)%size);
	        	var c = Math.round((y+half)%size);
	        	var d = Math.round((y-half+size)%size);

			var average = this._map[a][y].z+ // middle left
	                this._map[b][y].z+ // middle right
	                this._map[x][c].z+ // middle top
	                this._map[x][(y-half+size)%size].z; // middle bottom

			average = Math.round(average / 4);
			average += Math.round(2*this._smoothingFactor*Math.random()-this._smoothingFactor);

			if(average < 5){
	            	    this._map[x][y].z = average;
			}
			

			// values on the top and right edges
			if(x === 0)
			    this._map[this._segments][y].z = average;
			if(y === 0)
			    this._map[x][this._segments].z = average;
	            }
        	}
      	    }
	};
    };

    /**
     * [ description]
     * @return {Integer} Id of the material
     */
    nsEditor.TerrainGenerator._getFloorType = function () {
	var rand = (Math.floor((Math.random()*100)+this._materialsProbabilitySum())) / 100;

	for (var i=0; i< this._materials.length; i++) {
	    var probaMax = 0;
	    for (var j = 0; j < i+1; j++) {
		probaMax += this._materials[j].probability;
	    }

	    if (rand <= probaMax) {
		return this._materials[i].id;
	    }
	}

	return 5; // Material 5 by default
    };

    /**
     * [ description]
     * @return { Int } The sum of materials probabilities
     */
    nsEditor.TerrainGenerator._materialsProbabilitySum = function() {
	var sum = 0;

	for (var i in this._materials) {
	    sum += this._materials[i].probability;
	}

	return sum;
    };

    /**
     * [ description]
     * @return { Int } The sum of materials probabilities
     */
    nsEditor.TerrainGenerator._getAroundMajorMaterial = function(x, y) {
	var arrayCounters = [],
	nbRock = 0,
	nbSand = 0,
	nbOre = 0,
	nbOther = 0;

	xMoinUn = x-1
	yMoinUn = y-1

	if(xMoinUn < 0){ xMoinUn = 0; }
	if(yMoinUn < 0){ yMoinUn = 0; }

	xPlusUn = x+1
	yPlusUn = y+1

	if(xPlusUn >= this._width){ xPlusUn = this._width-1; }
	if(yPlusUn >= this._height){ yPlusUn = this._height-1; }

	square1 = this._map[xMoinUn][yMoinUn].type;

	switch (square1) {
	case rock.id : nbRock++; break;
	case sand.id : nbSand++; break;
	case ore.id : nbOre++; break;
	case other.id : nbOther++; break;
	}

	square2 = this._map[x][yMoinUn].type;
	switch (square2) {
	case rock.id : nbRock++; break;
	case sand.id : nbSand++; break;
	case ore.id : nbOre++; break;
	case other.id : nbOther++; break;
	}

	square3 = this._map[xPlusUn][yMoinUn].type;
	switch (square3) {
	case rock.id : nbRock++; break;
	case sand.id : nbSand++; break;
	case ore.id : nbOre++; break;
	case other.id : nbOther++; break;
	}

	square4 = this._map[xMoinUn][y].type;
	switch (square4) {
	case rock.id : nbRock++; break;
	case sand.id : nbSand++; break;
	case ore.id : nbOre++; break;
	case other.id : nbOther++; break;
	}

	square6 = this._map[xPlusUn][y].type;
	switch (square6) {
	case rock.id : nbRock++; break;
	case sand.id : nbSand++; break;
	case ore.id : nbOre++; break;
	case other.id : nbOther++; break;
	}

	square7 = this._map[xMoinUn][yPlusUn].type;
	switch (square7) {
	case rock.id : nbRock++; break;
	case sand.id : nbSand++; break;
	case ore.id : nbOre++; break;
	case other.id : nbOther++; break;
	}

	square8 = this._map[x][yPlusUn].type;
	switch (square8) {
	case rock.id : nbRock++; break;
	case sand.id : nbSand++; break;
	case ore.id : nbOre++; break;
	case other.id : nbOther++; break;		
	}

	square9 = this._map[xPlusUn][yPlusUn].type;
	switch (square9) {
	case rock.id : nbRock++; break;
	case sand.id : nbSand++; break;
	case ore.id : nbOre++; break;
	case other.id : nbOther++; break;
	}

	// Save all numbers in an array to get the maximal value
	arrayCounters.push(nbRock);
	arrayCounters.push(nbSand);
	arrayCounters.push(nbOre);
	arrayCounters.push(nbOther);
	valueMax = maxValueOfArray(arrayCounters);

	// Return the id of the material the most present
	switch (valueMax) {
	case nbRock : return rock.id;
	case nbSand : return sand.id;
	case nbOre : return ore.id;
	case nbOther : return other.id;
	}
    }

    nsEditor.TerrainGenerator._createElements = function() {
	for (var elementKey in this._elements) {
	    var element = this._elements[elementKey].model,
	    nbElement = this._elements[elementKey].number,
	    sizeX,
	    sizeY,
	    posX,
	    posY,
	    temp,
	    objectTemp;

	    for (var i = 0; i < nbElement; i++) {
		sizeX = getRandomInt(10, 200);
      		sizeY = sizeX;
      		posX  = getRandomInt(0, this._width);
      		posY  = getRandomInt(0, this._height);
      		temp = element.create(sizeX, sizeY, element._allowedMaterials);
      		objectTemp = JSON.parse(temp);
      		this._pushElement(objectTemp, posX, posY);
	    }
	}
    };

    /**
     * [ description]
     * @return {[type]} [description]
     */
    nsEditor.TerrainGenerator._pushElement = function(element, x, y) {
	var elementHeight = element[0].length - 1;
	var mapHeight = this._map[0].length - 1;

	for (var i = 0; i < element.length; i++) {
	    posX = i + x;

	    if (posX <= this._map.length) {
		for (var j = 0; j < elementHeight; j++) {
		    posY = j + y;

		    // TODO : fix le bug undefined
		    if (posX <= mapHeight && this._map[posX][posY] != undefined) {
			this._map[posX][posY].z += element[i][j].z;
		    }
		    
		}
	    }
	}
    };

    /**
     * [ description]
     * @return {[type]} [description]
     */
    nsEditor.TerrainGenerator._smoothing = function() {


	/*--------------------*
	  |	Smoothing         |
	  *--------------------*/

	var countPassages = 0;
	var nbPassage = 1;
	// Inisialisation des variables :
	var square1, square2, square3, square4, square5, square6, square7, square8, square9;
	var squareX, squareY;

	var count = 0;
	var squareMax = this._width * this._height;

	var beginIceZoneX = parseInt(0.25*this._width),
	beginIceZoneY = 0,
	endIceZoneX = parseInt(0.75*this._width),
	temp,
	maxIce = ice.probability*squareMax,
	iceZoneCurrentX = beginIceZoneX,
	iceZoneCurrentY = beginIceZoneY;

	// Boucle pour parcourir le tableau
	while(count < squareMax){

	    // Récupération d'un case au hazard dans la grille
	    squareX = getRandomInt(0, this._width-1);
	    squareY = getRandomInt(0, this._height-1);

	    // Si la case est au bord de la map, la décalé.
	    if(squareX < 0){ squareX = 0; }
	    if(squareY < 0){ squareY = 0; }

	    if(squareX >= this._width){ squareX = this._width-1; }
	    if(squareY >= this._height){ squareY = this._height-1; }

	    squareXMoinUn = squareX-1
	    squareYMoinUn = squareY-1

	    if(squareXMoinUn < 0){ squareXMoinUn = 0; }
	    if(squareYMoinUn < 0){ squareYMoinUn = 0; }

	    squareXPlusUn = squareX+1
	    squareYPlusUn = squareY+1

	    if(squareXPlusUn >= this._width){ squareXPlusUn = this._width-1; }
	    if(squareYPlusUn >= this._height){ squareYPlusUn = this._height-1; }


	    //console.log(squareX + '  ' + squareY + ' ' +squareXMoinUn + ' ' + squareYMoinUn + ' ' + squareXPlusUn + ' ' + squareYPlusUn);


	    // Récupéation des coordonnée les 9 cases situé autour de la case séléctionnés
	    // (la case selectionné c'est la 5)
	    square1 = {
		z: this._map[squareXMoinUn][squareYMoinUn].z,
		type: this._map[squareXMoinUn][squareYMoinUn].type
	    };
	    square2 = {
		z: this._map[squareX][squareYMoinUn].z,
		type: this._map[squareX][squareYMoinUn].type
	    };
	    square3 = {
		z: this._map[squareXPlusUn][squareYMoinUn].z,
		type: this._map[squareXPlusUn][squareYMoinUn].type
	    };
	    square4 = {
		z: this._map[squareXMoinUn][squareY].z,
		type: this._map[squareXMoinUn][squareY].type
	    };
	    square5 = {
		z: this._map[squareX][squareY].z,
		type: this._map[squareX][squareY].type
	    };
	    square6 = {
		z: this._map[squareXPlusUn][squareY].z,
		type: this._map[squareXPlusUn][squareY].type
	    };
	    square7 = {
		z: this._map[squareXMoinUn][squareYPlusUn].z,
		type: this._map[squareXMoinUn][squareYPlusUn].type
	    };
	    square8 = {
		z: this._map[squareX][squareYPlusUn].z,
		type: this._map[squareX][squareYPlusUn].type
	    };
	    square9 = {
		z: this._map[squareXPlusUn][squareYPlusUn].z,
		type: this._map[squareXPlusUn][squareYPlusUn].type
	    };

	    // Sur les case 2-4-8-9 attribution de nouvelle valeur en calculant la moyenne des valeurs des cases les entourants.
	    // square 2
	    this._map[squareX][squareYMoinUn].z = Math.round((square1.z+square5.z+square3.z)/3);
	    // square 4
	    this._map[squareXMoinUn][squareY].z = Math.round((square1.z+square5.z+square7.z)/3);
	    // square 8
	    this._map[squareX][squareYPlusUn].z = Math.round((square5.z+square7.z+square9.z)/3);
	    // square 6
	    this._map[squareXPlusUn][squareY].z = Math.round((square5.z+square3.z+square9.z)/3);

	    /**
	     * Materials smothing
	     */
	    if (square5.type != iron.id) { // The iron doesn't move
		if (square5.type == ice.id) {
		    // Switch the type present in the actual iceblok with the tracker
		    temp = this._map[iceZoneCurrentX][iceZoneCurrentY].type;
		    this._map[iceZoneCurrentX][iceZoneCurrentY].type = this._map[squareX][squareY].type;
		    this._map[squareX][squareY].type = temp;

		    if (iceZoneCurrentX < endIceZoneX) {
			iceZoneCurrentX++;
		    } else {
			beginIceZoneX++;
			endIceZoneX--;
			iceZoneCurrentX = beginIceZoneX;
			iceZoneCurrentY++;
		    }
		} else { // for all others
		    this._map[squareX][squareY].type = this._getAroundMajorMaterial(squareX, squareY);
		}
	    }

	    // Gestion du nombre de passage
	    if((count == squareMax-1) && (countPassages != nbPassage)){
		count = 0;
		countPassages++;
	    }
	    count++;
	}

    };

    /**
     * [ description]
     * @return {[type]} [description]
     * @todo Set the scale correctly.
     */
    nsEditor.TerrainGenerator._toJSON = function() {
	var map = {
	    "size": {
		"x": this._width,
		"y": this._height
    	    },
	    "map": this._map
	};

	return JSON.stringify(map);
    };

    /**
     * [ description]
     * 
     * @param {array} materials
     * @param {array} elements
     * @param {int} width
     * @param {int} height
     * @param {int} zMin
     * @param {int} zMax
     * @return {object} Return a map in json format.
     */
    nsEditor.TerrainGenerator.generate = function(materials, elements, width, height, zMin, zMax) {
	/* Initialize observer. */
	this._observer  = new nsCommon.Observable();

	/* Terrain generator initialization */
	this._observer.publish('editor.terrain.generator.generate', [{'progress': 0}]);

	this._materials = materials;
	this._elements  = elements;
	this._width     = width;
	this._height    = height;
	this._zMin      = zMin;
	this._zMax      = zMax;

	this._map       = new Array();

	/* Creating base of the terrain. */
	this._createBase();
	this._observer.publish('editor.terrain.generator.generate', [{'progress': 25}]);

	/* Add some slope with diamond square algorithm. */
	this._diamondSquare();
	this._observer.publish('editor.terrain.generator.generate', [{'progress': 50}]);

	/* Create elements. */
	this._createElements();
	this._observer.publish('editor.terrain.generator.generate', [{'progress': 75}]);

	/* Smooth the terrain. */
	this._smoothing();
	this._observer.publish('editor.terrain.generator.generate', [{'progress': 100}]);

	/* Return the generated terrrain as JSON. */
	return this._toJSON();
    };
})();
