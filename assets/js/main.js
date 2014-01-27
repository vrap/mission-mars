(function() {
	/* Loading namespaces. */
	var nsCommon = using('mars.common');
	var nsViewer = using('mars.viewer');
	var nsEditor = using('mars.editor');
	var nsRover = using('mars.rover');
	var nsMemory = using('mars.rover.memory');
	var nsSpeculator = using('mars.rover.speculator3000');
	var nsMaterial = using('mars.common.material');
	var nsElements = using('mars.editor.element');

	/* Define viewer container. */
	var renderDiv = document.querySelector('#render');
	var render2dDiv = document.querySelector('#minimap');

	var renderFull2dDiv = document.querySelector('#fullmap');

	var roverInformations = document.querySelector('#rover-informations');

	/* Generate a map. */
	var map,
			terrain;
	if( "" != document.getElementById('json').value) {
		// When a JSon is uploaded
		terrain = document.getElementById('json').value;
		map = new nsCommon.Map(terrain);
	} else {
		// Map generation otherwise.
    var mapSize = document.querySelector('#map-size').value;
    /* Loading materials. */
    var materialRock = new nsMaterial.Rock();
    var materialIce = new nsMaterial.Ice();
    var materialIron = new nsMaterial.Iron();
    var materialOre = new nsMaterial.Ore();
    var materialSand = new nsMaterial.Sand();
    var materialOther = new nsMaterial.Other();

    /* Loading elements. */
    var elementCrater = new nsElements.CraterModel([materialSand], -20, 40, 2);
    var elementHill   = new nsElements.HillModel([materialSand], -0, 40, 2);
    var elementRavine = new nsElements.RavineModel([materialRock], -60, 20, 2);

		terrain = nsEditor.TerrainGenerator.generate([materialRock, materialIce, materialIron, materialOre, materialSand, materialOther], 
			[{
				"model": elementCrater,
				"number": 3
			},
			{
				"model": elementHill,
				"number": 2
			},
			{
				"model": elementRavine,
				"number": 2
			}],
			mapSize, mapSize, -10, 10);
		map = new nsCommon.Map(terrain);
	}
	
	/* Load map in 3d viewer. */
	var viewer = new nsViewer.Viewer(map);

	viewer.load2D(render2dDiv);

	var viewerFul = new nsViewer.Viewer(map);
	viewerFul.load2D(renderFull2dDiv);

	viewer.load3D(renderDiv, {fog: 0.002, wireframe: false});

	/* Load infos of robot */
	var elementBattery = document.querySelector('#battery');
	var elementPosition = document.querySelector('#position');
	var elementMaterial = document.querySelector('#material');
	var elementMove = document.querySelector('#move');
	var elementMiniMap = document.querySelector('#bloc-panel-minimap-hover');

	var elementControl = document.querySelector('#display-control');

	var wireframeOn = document.querySelector('#w1');
	var wireframeOff = document.querySelector('#w2');

	var moreFog = document.querySelector('#more');
	var lessFog = document.querySelector('#less');

	var cameraOn = document.querySelector('#c1');
	var cameraOff = document.querySelector('#c2');

	var downloadMap = document.querySelector('#download');

	var elemements = {
		'elementBattery' : elementBattery,
		'elementPosition' : elementPosition,
		'elementMaterial' : elementMaterial,
		'elementMove' : elementMove,
		'elementMiniMap' : elementMiniMap,
		'elementControl' : elementControl,
		control : {
			'wireframeOn' : wireframeOn,
			'wireframeOff' : wireframeOff,
			'moreFog' : moreFog,
			'lessFog' : lessFog,
			'cameraOn' : cameraOn,
			'cameraOff' : cameraOff,
			'downloadMap' : downloadMap,
			'terrain' : [terrain]
			}
	}
	
	var elemementViewer = viewer.viewers[renderDiv];
	var interfaces = new nsViewer.Interface(elemements, elemementViewer);

	document.querySelector('#bloc-panel-minimap-hover').onclick = function (){
		document.querySelector('#bloc-over-full').className = 'show';
	}
	document.querySelector('#bloc-fullMap .glyphicon-close').onclick = function (){
		document.querySelector('#bloc-over-full').className = 'hidde';
	}

	/* Listen to rover events. */
	var observable = new nsCommon.Observable();

	observable.subscribe('rover.scanMaterial.end', function(data) {
		roverInformations.innerHTML  = 'Energie : ' + data.rover.tank + '/' + data.rover.tankSize + "<br />";
		roverInformations.innerHTML += 'Mouvements : ' + data.rover.moves;
		//viewer.viewers[renderDiv].move(data.rover.moves);
		console.log('material found', data);
		switch(data.type) {
			case 0:
				document.querySelector('#rock-counter').value++;
				break;
			case 1:
				document.querySelector('#sand-counter').value++;
				break;
			case 2:
				document.querySelector('#ore-counter').value++;
				break;
			case 3:
				document.querySelector('#iron-counter').value++;
				break;
			case 4:
				document.querySelector('#ice-counter').value++;
				break;
			case 5:
				document.querySelector('#other-counter').value++;
				break;
		}
	});
	observable.subscribe('rover.scanElevation.end', function(data) {
		// Change camera elevation
		viewer.viewers[renderDiv].camera.position.y += data.elevation;
	});
	observable.subscribe('rover.spawn', function(data) {
    viewer.viewers[renderDiv].camera.position.x += data.rover.x;
    viewer.viewers[renderDiv].camera.position.z -= data.rover.y;
	});
	observable.subscribe('rover.actions.fillTank.end', function(data) {
		//console.log('tank is filled', data);
	});
	observable.subscribe('rover.actions.deploySolarPanels.end', function(data) {
		//console.log('panels are deployed', data);
	});
  observable.subscribe('rover.direction.end', function(data) {
    // Set camera vision.
    viewer.viewers[renderDiv].setVision(data.lastDirection);
  });
  observable.subscribe('rover.move.end', function(data) {
    // Set camera position.
    viewer.viewers[renderDiv].move(data.direction);
    console.log(viewer.viewers[renderDiv].camera.position);
  });

	/* Rover tests. */
  var module,
      startX,
      startY,
      endX,
      endY;
  if(document.querySelector('#explorer').checked) {
    module = 'explorer';
    startX = parseInt(document.querySelector('#explorer-startX').value);
    startY = parseInt(document.querySelector('#explorer-startY').value);
  } else {
    module = 'voyager';
    startX = parseInt(document.querySelector('#voyager-startX').value);
    startY = parseInt(document.querySelector('#voyager-startY').value);
    endX = parseInt(document.querySelector('#voyager-endX').value);
    endY = parseInt(document.querySelector('#voyager-endY').value);
  }
	var memory = new nsMemory.Memory();
	var rover = new nsRover.Rover(map, 50, 50, 100, memory);
	var speculator = new nsSpeculator.S3000(rover);

	/* Voyager
	speculator.enableModule('voyager');
    speculator.start({x: 10, y: 20});

	console.log(rover.memory.readAll()); */

	speculator.enableModule('explorer');
	speculator.start();
})();
