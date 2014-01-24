(function() {
	var nsViewer = using('mars.viewer');
	var nsCommon = using('mars.common');

	/**
	 * Constructor
	 */
	nsViewer.Interface = function(elementBattery, elementPosition, elementMaterial, elementMove) {
		
		this.elementBattery = elementBattery;
		this.elementPosition = elementPosition;
		this.elementMaterial = elementMaterial;
		this.elementMove = elementMove;

		this.observable = new nsCommon.Observable();

		//this.elementBattery.innerHTML = 'je suis ';
		this.pushInfos();
		this._pushBattery();
		this._pushPosition();
		this._pushMove();


	};

	/**
	* Initialisation of val in div
	*/
	nsViewer.Interface.prototype.init = function(){

	};

	nsViewer.Interface.prototype._pushBattery = function(){

		this.observable.subscribe('rover.move', function(data){

			var tank = data.rover.tank * data.rover.tankSize / 100;

			this.elementBattery.innerHTML = tank + '%';
		}.bind(this));

	}
	nsViewer.Interface.prototype._pushPosition = function(){

		this.observable.subscribe('rover.move', function(data){
			this.elementPosition.innerHTML = 'x: ' + data.rover.x + ' | ' + 'y: ' + data.rover.y;
		}.bind(this));
		
	}
	nsViewer.Interface.prototype._pushMaterial = function(){
		
	}
	nsViewer.Interface.prototype._pushMove = function(){
		
		this.observable.subscribe('rover.move', function(data){
			this.elementMove.innerHTML = data.rover.moves;
		}.bind(this));

	}

	/**
	* Update infos of rover
	*/
	nsViewer.Interface.prototype.pushInfos = function(){

		var observable = new nsCommon.Observable();

		observable.subscribe('rover.*', function(data) {
		
			
			
			var type;

			console.log(data);

			switch(data.scanMaterial) {
			case 0:
				type = 'rock';
				console.log('lala');
				break;
			case 1:
				type = 'sand';
				console.log('lala');
				break;
			case 2:
				type = 'ore';
				console.log('lala');
				break;
			case 3:
				type = 'iron';
				console.log('lala');
				break;
			case 4:
				type = 'ice';
				console.log('lala');
				break;
			case 5:
				type = 'other';
				console.log('lala');
				break;
			}
			this.elementMaterial.innerHTML = type;

		}.bind(this));

	};


})();