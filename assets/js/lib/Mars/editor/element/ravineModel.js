(function() {
	var nsElements = using('mars.editor.element');

	/**
	 * [ description]
	 *
	 * @constructor
	 * @this {RavineModel}
	 */
	nsElements.RavineModel = function() {
		/* Inherit from parent, and call his constructor. */
		this.parent = this.__proto__.__proto__;
		this.parent.constructor.apply(this, arguments);
	};

	/**
	 * Inherit from Model class.
	 * 
	 * @this {RavineModel}
	 */
	nsElements.RavineModel.prototype.__proto__ = nsElements.Model.prototype;

	/**
	 * [ description]
	 *
	 * @this {RavineModel}
	 * @param  {int} width     [description]
	 * @param  {int} height    [description]
	 * @param  {array} materials [description]
	 */
	nsElements.RavineModel.prototype.create = function(width, height, materials) {
		/* Initialize the creation of the element. */
		this.parent.create.call(this, width, height, materials);

		var startX = getRandomInt(0, width-1);
		var startY = getRandomInt(0, height-1);

		var squartMax = width*height;

		count = 0;
		while(width > count){

			startX = startX + getRandomInt(1,2);
			startY = startY + getRandomInt(1,2);

			if(startX >= width){startX = getRandomInt(0, width-1)};
			if(startY >= height){startY = getRandomInt(0, height-1)};


			this._element[startX][startY].z = -50;
			count++;

		}
		
		/* Return the element and clean the var. */
		return this._toJSON(true);


	}


	/**
	 * [ description]
	 *
	 * @this {RavineModel}
	 * @param  {int} width     [description]
	 * @param  {int} height    [description]
	 * @param  {array} materials [description]
	 */
	nsElements.RavineModel.prototype.pierre = function(width, height, materials) {
		/* Initialize the creation of the element. */
		//this.parent.create.call(this, width, height, materials);

		var beginningX  	= getRandomInt(0, Math.round(width/4)),  // Point de départ sur la largeur
			beginningY  	= getRandomInt(0, height), // Point de départ sur la longueur
			ravineWidth 	= getRandomInt(3, 8),      // Largeur du ravin
			ravineDirection = getRandomInt(0, 1);      // 0 ravin horizontal, 1 ravin vertical

		// Test vertical uniquement

		for (var i = beginningX; i < height; i++) {
			// Probabilité que le ravin dévie
			var deviationChance = getRandomInt(0, 100);

			// Si le ravin dévie (50% de chances)
			if (deviationChance >= 50) {
					// Nombre de cases de décalage (comprises entre 1 et la largeur du ravin)
				var deviationShift     = getRandomInt(1, ravineWidth - 1),
					// 0 déviation horizontale, 1 déviation verticale 		
					deviationDirection = getRandomInt(0, 1),
					// Nouvelle position du point de départ du ravin sur la largeur
					newBeginningX,
					// Nouvelle position du point de départ du ravin sur la longueur
					newBeginningYn;

				// Si la déviation est horizontale
				if (deviationDirection == 0) {
					newBeginningX = beginningX + deviationShift;
				}
				// Sinon elle est verticale
				else {
					newBeginningX = beginningX - deviationShift;
				}

				// Si la largeur du ravin est paire
				if (ravineWidth % 2 == 0) {
					for (var j = 0; j < ravineWidth / 2; j++) {
						this._element[newBeginningX + j][i].z = -100;
						this._element[newBeginningX - j][i].z = -100;
					}
				}
				// Sinon la largeur du ravin est impaire
				else {
					this._element[newBeginningX][i].z = -100;

					for (var j = 0; j < (ravineWidth - 1) / 2; j++) {
						this._element[newBeginningX + j][i].z = -100;
						this._element[newBeginningX - j][i].z = -100;
					}
				}
			}
			// Sinon le ravin ne dévie pas
			else {
				// Si largeur paire
				if (ravineWidth % 2 == 0) {
					for (var j = 0; j < ravineWidth / 2; j++) {
						this._element[beginningX + j][i].z = -100;
						this._element[beginningX - j][i].z = -100;
					}
				}
				// Si largeur impaire
				else {
					this._element[beginningX][i].z = -100;

					for (var j = 0; j < (ravineWidth - 1) / 2; j++) {
						this._element[beginningX + j][i].z = -100;
						this._element[beginningX - j][i].z = -100;
					}
				}
			}
		}

		/* Return the element and clean the var. */
		return this._toJSON(true);
	};
})();