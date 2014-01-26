(function() {
	var nsViewer = using('mars.viewer');
	var nsCommon = using('mars.common');

	/**
	 * Constructor
	 */
	nsViewer.Interface = function(elements, viewer) {
		
		this.viewer = viewer;
		this.elements = elements;

		this.elementBattery = elements.elementBattery;
		this.elementPosition = elements.elementPosition;
		this.elementMaterial = elements.elementMaterial;
		this.elementMove = elements.elementMove;

		this.elementControl = elements.elementControl;

		this.elementMiniMap = elements.elementMiniMap;

		this.observable = new nsCommon.Observable();

		this.init();

		

	};

	/**
	* Initialisation of val in div
	*/
	nsViewer.Interface.prototype.init = function(){
		this._displayControl();
		this._pushBattery();
		this._pushPosition();
		this._pushMove();
		this._extendMiniMap();
		this._displayWireframe();
		this._displayFog();
		this._displayCamera();
		this._downloadMap();
	};

	nsViewer.Interface.prototype._downloadMap = function(){

		this.elements.control.downloadMap.onclick = function (){
			var blob = new Blob(this.elements.control.terrain, {type: "octet/stream"});
			saveAs(blob, "map.json");
		}.bind(this);
	}

	nsViewer.Interface.prototype._displayWireframe = function(){

		viewer = this.viewer;
		wireframeOn = this.elements.control.wireframeOn;
		wireframeOff = this.elements.control.wireframeOff;
		this.elements.control.wireframeOn.onclick = function (){
			viewer.options.wireframe = true;
			viewer._loadMaterials();
			addClass(this, ' active');
			removeClass(wireframeOff, 'active');

		};

		this.elements.control.wireframeOff.onclick = function (){
			viewer.options.wireframe = false;
			viewer._loadMaterials();
			console.log(wireframeOn);
			addClass(this, ' active');
			removeClass(wireframeOn, 'active');

		};

	}

	nsViewer.Interface.prototype._displayFog = function(){

		viewer = this.viewer;
		this.elements.control.moreFog.onclick = function(){
			if (viewer.options.fog < 1) {
				viewer.options.fog += 0.001;
			} else {
				viewer.options.fog = 1;
			}
			viewer._loadFog();
		};

		this.elements.control.lessFog.onclick = function(){
			if (viewer.options.fog > 0) {
				viewer.options.fog -= 0.001;
			} else {
				viewer.options.fog = 0;
			}
			viewer._loadFog();
		};

	}

	nsViewer.Interface.prototype._displayCamera = function(){

		viewer = this.viewer;
		cameraOn = this.elements.control.cameraOn;
		cameraOff = this.elements.control.cameraOff;
		this.elements.control.cameraOn.onclick = function (){
			viewer.options.cameraControl = true;
			viewer._loadControls();
			addClass(this, ' active');
			removeClass(cameraOff, 'active');

		};

		this.elements.control.cameraOff.onclick = function (){
			viewer.options.cameraControl = false;
			viewer._loadControls();
			console.log(wireframeOn);
			addClass(this, ' active');
			removeClass(cameraOn, 'active');

		};

	}

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

	nsViewer.Interface.prototype._displayControl = function(){

		
		this.elementControl.onclick = function(e){

			var panelControl = document.querySelector('#panel-control');
			panelControl.className = 'show';

			var elem = this;
			var top = getElementTop(elem);
			var left = getElementLeft(elem);

			console.log(top);
			panelControl.style.top = (top - 330) + 'px';
			panelControl.style.left = (left - 50) + 'px';
			

		};

	}


})();