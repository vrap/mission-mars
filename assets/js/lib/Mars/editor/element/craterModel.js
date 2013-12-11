(function() {
	var nsElements = using('mars.editor.element');

	/**
	 * [ description]
	 *
	 * @constructor
	 * @this {CraterModel}
	 */
	nsElements.CraterModel = function() {
		/* Inherit from parent, and call his constructor. */
		this.parent = this.__proto__.__proto__;
		this.parent.constructor.apply(this, arguments);
	};

	/**
	 * Inherit from Model class.
	 * 
	 * @this {CraterModel}
	 */
	nsElements.CraterModel.prototype.__proto__ = nsElements.Model.prototype;

	/**
	 * [ description]
	 *
	 * @this {CraterModel}
	 * @param  {int} width     [description]
	 * @param  {int} height    [description]
	 * @param  {array} materials [description]
	 */
	nsElements.CraterModel.prototype.create = function(width, height, materials) {
		/* Initialize the creation of the element. */
		this.parent.create.call(this, width, height, materials);

		//Generer un carte aleatoir avec un max et un min X y
		var count = 0;
		var count2 =0;
		var count3 = 0;
		var randomMap;
		var initialeZ;
		var maxWidth, maxHeight, minWidth, minHeight;

		while(count<150){

			while(count2<150){

				var pWidth = getRandomInt(0, width);
				var pHeight = getRandomInt(0, height);
				var start = getRandomInt(0, height);

				maxWidth = getRandomInt(0, pWidth);
				minWidth = getRandomInt(start, width);

				minHeight = getRandomInt(start, height);
				maxHeight = getRandomInt(0, pHeight);

				for (var i = minWidth; i < maxWidth; i++) {
					for (var j = minHeight; j < maxHeight; j++) {
						initialileZ = this._element[i][j].z;
						this._element[i][j].z = initialileZ-0.2;
						this._element[i][j].nature = 4;

					}
				}

				count2++;
			}

			count2 = 0;
			count++;

		}

		/* Return the element and clean the var. */
		return this._toJSON(true);
	};
})();
