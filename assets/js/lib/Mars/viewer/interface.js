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
		this._displayWireframe();
		this._displayFog();
		this._displayCamera();
		this._downloadMap();
		this._pop();
	};

  /**
   * Events from rover
   */
	nsViewer.Interface.prototype._pop = function(){
		
		var solar = false;
		var finishX = '';
		var finishY = '';

    // On spawn, positioning camera
		this.observable.subscribe('rover.spawn', function(data){

			var bloc = '<div class="'+ this.elements.pop.classPop +'">';
			 	bloc += 'Hi Dude! I\'m speculator 3000 and I\'ve just been spawn!';
			 	bloc += '</div>';

			this.elements.pop.blocPop.innerHTML = bloc;

		}.bind(this));

    // On solar panels deploying, stop move
		this.observable.subscribe('rover.actions.deploySolarPanels.begin', function(data){
			
			if(!solar){
				var bloc = '<div class="'+ this.elements.pop.classPop +'" id="popSloar">';
			 	bloc += 'Wait! I\'m deploying my solar panels, Man!';
			 	bloc += '</div>';

				this.elements.pop.blocPop.innerHTML = bloc;
        		// this.viewer.move('stop');
				solar = true;
			}

		}.bind(this));

    // When rover move
		this.observable.subscribe('rover.move.end', function(data){
			
			if(solar){

				var bloc = '<div class="'+ this.elements.pop.classPop +'">';
			 	bloc += 'What a fucking sunny day ! I\'m ready to continue my exploration on this dumb planet';
			 	bloc += '</div>';

				this.elements.pop.blocPop.innerHTML = bloc;
				solar = false;

			} else {
        setTimeout(function () {
          // this.viewer.move('stop');
        }.bind(this), 1000);

        this.viewer.move(data);
      }

		}.bind(this));

	};

  /**
   * Download JSon of map
   */
	nsViewer.Interface.prototype._downloadMap = function(){

		this.elements.control.downloadMap.onclick = function (){
			var blob = new Blob(this.elements.control.terrain, {type: "octet/stream"});
			saveAs(blob, "map.json");
		}.bind(this);
	};

  /**
   * Wireframe gestion
   */
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

	};

  /**
   * Fog gestion
   */
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
	};

  /**
   * Camera control gestion
   */
	nsViewer.Interface.prototype._displayCamera = function(){

		viewer = this.viewer;
		cameraOn = this.elements.control.cameraOn;
		cameraOff = this.elements.control.cameraOff;
    viewer.options.cameraControl = false;

		this.elements.control.cameraOn.onclick = function (){
			viewer.options.cameraControl = true;
			viewer._loadControls();
			addClass(this, ' active');
			removeClass(cameraOff, 'active');
		};

		this.elements.control.cameraOff.onclick = function (){
			viewer.options.cameraControl = false;
			viewer._loadControls();
			addClass(this, ' active');
			removeClass(cameraOn, 'active');
		};

	};

  /**
   * Display battery percentage
   */
	nsViewer.Interface.prototype._pushBattery = function(){

		this.observable.subscribe('rover.move.end', function(data){

			var tank = Math.round(data.rover.tank * 100 / data.rover.tankSize);

			this.elementBattery.innerHTML = tank + '%';

			if(tank < 30){
				addClass(this.elementBattery, 'warning');
			}

		}.bind(this));
	};

  /**
   * Information of robot position
   */
	nsViewer.Interface.prototype._pushPosition = function(){

		this.observable.subscribe('rover.*', function(data){
			this.elementPosition.innerHTML = 'x: ' + data.rover.x + ' | ' + 'y: ' + data.rover.y;
		}.bind(this));
		
	};

  /**
   * Count movements of robot and display it on interface
   */
	nsViewer.Interface.prototype._pushMove = function(){
		this.observable.subscribe('rover.move.end', function(data){
			this.elementMove.innerHTML = data.rover.moves;
		}.bind(this));

	};

  /**
   * Panel control display
   */
	nsViewer.Interface.prototype._displayControl = function(){

		this.elementControl.onclick = function(e){

			var panelControl = document.querySelector('#panel-control');

			if(hasClass(panelControl, 'show')){

				removeClass(panelControl, 'show');
				addClass(panelControl, 'hide');

			}else{

				removeClass(panelControl, 'hide');
				addClass(panelControl, 'show');

				var elem = this;
				var top = getElementTop(elem);
				var left = getElementLeft(elem);

				panelControl.style.top = (top - 330) + 'px';
				panelControl.style.left = (left - 60) + 'px';

			}
		};
	}
})();
