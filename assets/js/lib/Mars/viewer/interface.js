(function() {
	var nsViewer = using('mars.viewer');
	var nsCommon = using('mars.common');

	/**
	 * Constructor
	 */
	nsViewer.Interface = function(elementBattery, elementPosition, elementMaterial, elementMove, elementMiniMap) {
		
		this.elementBattery = elementBattery;
		this.elementPosition = elementPosition;
		this.elementMaterial = elementMaterial;
		this.elementMove = elementMove;

		this.elementMiniMap = elementMiniMap;

		this.observable = new nsCommon.Observable();

		this.init();

		this._pushBattery();
		this._pushPosition();
		this._pushMove();
		this._extendMiniMap();

	};

	/**
	* Initialisation of val in div
	*/
	nsViewer.Interface.prototype.init = function(){

	};

	nsViewer.Interface.prototype._pushBattery = function(){

		this.observable.subscribe('rover.move', function(data){

			var tank = Math.round(data.rover.tank * data.rover.tankSize / 100);

			this.elementBattery.innerHTML = tank + '%';
		}.bind(this));

	}
	nsViewer.Interface.prototype._pushPosition = function(){

		this.observable.subscribe('rover.*', function(data){
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

	nsViewer.Interface.prototype._extendMiniMap = function(){

		this.elementMiniMap.onclick = function (){
			
		}

	}


})();