function Map(properties) {
	this.map = new Array();
	this.properties = {
		width: 100,
		height: 100,
		elevationMin: -5,
		elevationMax: 5,
		scale: 100
	};

	if (properties != null && properties.json != null) {
		this.load(properties.json);
	}
	else {
		$.extend(this.properties, properties);

		this.initialize(properties);
	}
}

Map.prototype.FLOOR_TYPE = [
	{
		name: 'rock',
		material: 'rock.jpg',
		coeff: {
			0: 0.8,
			1: 0.2
		}
	},
	{
		name: 'other',
		material: 'unknow.jpg',
		coeff: {
			0: 0.2,
			1: 0.8
		}
	}
];

Map.prototype.initialize = function() {
	var dfd = $.Deferred();

	for (var i = 0; i <= this.getWidth(); i++) {
		this.map[i] = new Array();

		for (var j = 0; j <= this.getHeight(); j++) {
			this.map[i][j] = {
				z: (this.getElevationMin() + this.getElevationMax()) /2,
				nature: 0
			};
		}
	}

	dfd.resolve();

	return dfd.promise();
};

Map.prototype.getElevationMin = function() {
	return this.properties.elevationMin;
};

Map.prototype.getElevationMax = function() {
	return this.properties.elevationMax;
};

Map.prototype.getWidth = function() {
	return this.properties.width;
};

Map.prototype.getHeight = function() {
	return this.properties.height;
};

Map.prototype.getSquareMax = function() {
	return this.getWidth() * this.getHeight();
};

Map.prototype.getScale = function() {
	return this.properties.scale;
};

Map.prototype.generate = function() {
	var dfd = $.Deferred();

	$.when(
		this.generateFloorElevation(),
		this.smoothFloorElevation()
	).done(function() {
		dfd.resolve();
	});

	return dfd.promise();
};

Map.prototype.generateFloorType = function() {
};

Map.prototype.generateFloorElevation = function() {
	var dfd = $.Deferred();
	var nbSquareTop = 0;

	while (nbSquareTop < this.getSquareMax()) {
		var squareX     = Math.floor(Math.random() * this.getWidth());
		var squareY     = Math.floor(Math.random() * this.getHeight());

		if (squareX == 0) {
			squareX++;
		}
		if (squareY == 0) {
			squareY++;
		}

		var lastSquareX = squareX -1;
		var nextSquareX = squareX +1;
		var lastSquareY = squareY -1;
		var nextSquareY = squareY +1;

		var z = getRandomInt(
			this.getElevationMin(),
			(this.getElevationMax())
		);

		var square1 = this.map[lastSquareX][lastSquareY];
		var square2 = this.map[squareX][lastSquareY];
		var square3 = this.map[lastSquareX][lastSquareY];
		var square4 = this.map[lastSquareX][squareY];
		var square5 = this.map[squareX][squareY];
		var square6 = this.map[nextSquareX][squareY];
		var square7 = this.map[lastSquareX][nextSquareY];
		var square8 = this.map[squareX][nextSquareY];
		var square9 = this.map[nextSquareX][nextSquareY];

		if ((square5 == this.getElevationMax()) && ((square3 == square5) || (square1 == square5) || (square7 == square5) || (square9 == square5))) {
			this.map[squareX][lastSquareY].z = this.getElevationMax();
			this.map[lastSquareX][squareY].z = this.getElevationMax();
			this.map[nextSquareX][squareY].z = this.getElevationMax();
			this.map[squareX][nextSquareY].z = this.getElevationMax();
		}
		else {
			this.map[lastSquareX][lastSquareY].z = z;
			this.map[squareX][lastSquareY].z     = z;
			this.map[lastSquareX][lastSquareY].z = z;
			this.map[lastSquareX][squareY].z     = z;
			this.map[squareX][squareY].z         = z;
			this.map[nextSquareX][squareY].z     = z;
			this.map[lastSquareX][nextSquareY].z = z;
			this.map[squareX][nextSquareY].z     = z;
			this.map[nextSquareX][nextSquareY].z = z;
		}

		nbSquareTop++;
	}

	dfd.resolve();

	return dfd.promise();
};

Map.prototype.smoothFloorElevation = function() {
	var dfd = $.Deferred();
	var count = 0;
	var nbPassage = 2;

	while (count < this.getSquareMax()) {
		var squareX     = Math.floor(Math.random() * this.getWidth());
		var squareY     = Math.floor(Math.random() * this.getHeight());

		if (squareX == 0) {
			squareX++;
		}
		if (squareY == 0) {
			squareY++;
		}

		var lastSquareX = squareX -1;
		var nextSquareX = squareX +1;
		var lastSquareY = squareY -1;
		var nextSquareY = squareY +1;

		var square1 = this.map[lastSquareX][lastSquareY].z;
		var square2 = this.map[squareX][lastSquareY].z;
		var square3 = this.map[lastSquareX][lastSquareY].z;
		var square4 = this.map[lastSquareX][squareY].z;
		var square5 = this.map[squareX][squareY].z;
		var square6 = this.map[nextSquareX][squareY].z;
		var square7 = this.map[lastSquareX][nextSquareY].z;
		var square8 = this.map[squareX][nextSquareY].z;
		var square9 = this.map[nextSquareX][nextSquareY].z;

		this.map[squareX][lastSquareY].z = Math.round((square1+square5+square3)/3);
		this.map[lastSquareX][squareY].z = Math.round((square1+square5+square7)/3);
		this.map[squareX][nextSquareY].z = Math.round((square5+square7+square9)/3);
		this.map[nextSquareX][squareY].z = Math.round((square5+square3+square9)/3);

		// Gestion du nombre de passage
		if(count == this.getSquareMax()-1 && nbPassage != nbPassage){
			count = 0;
			nbPassage++;
		}

		count++;
	}

	dfd.resolve();
	
	return dfd.promise();
};

Map.prototype.toJson = function() {
	var jsonMap = {
		echelle: this.getScale(),
		lignes: this.map
	}

	return JSON.stringify(jsonMap);
};