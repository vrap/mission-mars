(function() {
	var nsMemory = using('mars.rover.memory');
	var nsCommon = using('mars.common');

	/**
	 * Class constructor of the memory.
	 */
	nsMemory.Memory = function() {
		/**
 	 	 * Pattern 
 	 	 * [
 	 	 *   	{ 
 	 	 *			x0, y0, z0, type0, status0
 	 	 *   	}
 	 	 * ]
 	 	 *
	 	 * status: 0 (visited), 1 (inaccessible), -1 (yet unknown)
	 	 */
		this.memory = new Array();
	};

	/**
	 * Add a square in memory.
	 * 
	 * @param  {int}     x         position of the square.
	 * @param  {int}     y         position of the square.
	 * @param  {float}   z         elevation of the square.
	 * @param  {int}     type      nature of the square.
	 * @param  {int}     status    state of the squre (0 (visited), 1 (inaccessible), -1 (yet unknown)).
	 * @return {boolean}           true if added, false otherwise.
	 *
	 * TODO: prefer square array in parameter?
	 */
	nsMemory.Memory.prototype.create = function(x, y, z, type, status) {
		if (x < 0 || y < 0) {
			throw new Error('X and Y can only be set superior to 0.');
		}

		if (type < 0 || type > 6) {
			throw new Error('Type can only be set between 1 and 6.');
		}

		if (status != 0 && status != 1 && status != -1) {
			throw new Error('Status can only be set between -1 and 1.');
		}

		var memorySize = this.getSize();
		var square     = {
			x: x,
			y: y,
			z: z,
			type: type,
			status: status
		};

		this.memory.push(square);

		if (memorySize == this.getSize()) {
			return false;
		}

		return true;
	};

	/**
	 * Read a square stored in memory, find by x and y position.
	 * 
	 * @param  {int}   x position of the square.
	 * @param  {int}   y position of the square.
	 * @return {array}   the square with all this properties.
	 */
	nsMemory.Memory.prototype.read = function(x, y) {
		if (x < 0 || y < 0) {
			throw new Error('X and Y can only be set superior to 0.');
		}

		return this.memory.filter(function(square) {
  			return (square.x == x && square.y == y);
		});
	};

	/**
	 * Search a square in memory, find by x and y position, then update with new properties.
	 * 
	 * @param  {int}     x         position of the square.
	 * @param  {int}     y         position of the square.
	 * @param  {int}     z         elevation of the square.
	 * @param  {int}     type      nature of the square.
	 * @param  {int}     status    state of the squre (0 (visited), 1 (inaccessible), -1 (yet unknown)).
	 * @return {boolean}           true if modified, false otherwise.
	 */
	nsMemory.Memory.prototype.update = function(x, y, z, type, status) {
		if (x < 0 || y < 0) {
			throw new Error('X and Y can only be set superior to 0.');
		}

		if (type < 0 || type > 6) {
			throw new Error('Type can only be set between 1 and 6.');
		}

		if (status != 0 && status != 1 && status != -1) {
			throw new Error('Status can only be set between -1 and 1.');
		}

		this.memory = this.memory.filter(function(square) {
    		if (square.x == x && square.y == y) {
    			square.z         = z;
    			square.type      = type;
    			square.status    = status;

    			return true;
    		}
  		});

  		return false;
	};

	/**
	 * Search and delete a square in memory, find by x and y position.
	 * 
	 * @param  {int}     x         position of the square.
	 * @param  {int}     y         position of the square.
	 * @return {boolean}           true if modified, false otherwise.
	 */
	nsMemory.Memory.prototype.delete = function(x, y) {
		if (x < 0 || y < 0) {
			throw new Error('X and Y can only be set superior to 0.');
		}

		this.memory = this.memory.filter(function(square) {
    		if (square.x == x && square.y == y) {
    			square.z         = null;
    			square.type      = null;
    			square.status    = null;

    			return true;
    		}
  		});

  		return false;
	};

	/**
	 * Empty all memory.
	 *
	 * @return {boolean} true if memory is empty, false otherwise.
	 */
	nsMemory.Memory.prototype.reset = function() {
		this.memory = new Array();

		if (this.getSize() != 0) {
			return false;
		}

		return true;
	};

	/**
	 * Return the current size of memory.
	 * 
	 * @return {int} number of squares stored in memory.
	 */
	nsMemory.Memory.prototype.getSize = function() {
		return this.memory.length;
	};

	/**
	 * Return all squares stored in memory.
	 *
	 * @return {array} array that contains all squares.
	 */
	nsMemory.Memory.prototype.readAll = function() {
		return this.memory;
	};
})();