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
		this.parent.create(width, height, materials);

		var beginningX  	= getRandomInt(0, width),  // Point de départ sur la largeur
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
						this._element[newBeginningX + j][i].z = -10;
						this._element[newBeginningX - j][i].z = -10;
					}
				}
				// Sinon la largeur du ravin est impaire
				else {
					this._element[newBeginningX][i].z = -10;

					for (var j = 0; j < (ravineWidth - 1) / 2; j++) {
						this._element[newBeginningX + j][i].z = -10;
						this._element[newBeginningX - j][i].z = -10;
					}
				}
			}
			// Sinon le ravin ne dévie pas
			else {
				// Si largeur paire
				if (ravineWidth % 2 == 0) {
					for (var j = 0; j < ravineWidth / 2; j++) {
						this._element[beginningX + j][i].z = -10;
						this._element[beginningX - j][i].z = -10;
					}
				}
				// Si largeur impaire
				else {
					this._element[beginningX][i].z = -10;

					for (var j = 0; j < (ravineWidth - 1) / 2; j++) {
						this._element[beginningX + j][i].z = -10;
						this._element[beginningX - j][i].z = -10;
					}
				}
			}
		}

		/* Return the element and clean the var. */
		return this._toJSON(true);
	};
})();