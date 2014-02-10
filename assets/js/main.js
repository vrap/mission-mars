(function() {
	/* Loading namespaces. */
	var nsCommon = using('mars.common');
	var nsViewer = using('mars.viewer');
	var nsEditor = using('mars.editor');
	var nsRover = using('mars.rover');
	var nsSpeculator = using('mars.rover.speculator3000');
	var nsMaterial = using('mars.common.material');
	var nsElements = using('mars.editor.element');

	/* Define viewer container. */
	var renderDiv = document.querySelector('#render');
	var render2dDiv = document.querySelector('#minimap');

	var renderFull2dDiv = document.querySelector('#fullmap');

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
	
	/* Load map in viewer. */
  // Init viewer
	var viewer = new nsViewer.Viewer(map);
  // Load map in 2D
	viewer.load2D(render2dDiv,'',true);
  // Load map in full screen 2D viewer
	var viewerFul = new nsViewer.Viewer(map);
	viewerFul.load2D(renderFull2dDiv, '' ,false);
  // Load map in 3D
	viewer.load3D(renderDiv, {fog: 0.002, wireframe: false});

	/* Load infos of robot */
	var elementBattery = document.querySelector('#battery'),
	 elementPosition = document.querySelector('#position'),
	 elementMaterial = document.querySelector('#material'),
	 elementMove = document.querySelector('#move'),
	 elementMiniMap = document.querySelector('#bloc-panel-minimap-hover'),
	 elementControl = document.querySelector('#display-control'),
	 wireframeOn = document.querySelector('#w1'),
   wireframeOff = document.querySelector('#w2'),
	 moreFog = document.querySelector('#more'),
	 lessFog = document.querySelector('#less'),
	 cameraOn = document.querySelector('#c1'),
	 cameraOff = document.querySelector('#c2'),
	 downloadMap = document.querySelector('#download'),
	 blocPop = document.querySelector('#bloc-pop');

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
			},
		pop : {'blocPop' : blocPop, 'classPop' : 'pop'}
	}
	
	var elemementViewer = viewer.viewers[renderDiv],
	  interfaces = new nsViewer.Interface(elemements, elemementViewer);

	var drag = new nsViewer.Drag();
	drag.dragable('fullmap', 'fullmap');

	document.querySelector('#bloc-panel-minimap-hover').onclick = function (){
		document.querySelector('#bloc-over-full').className = 'show';
	}
	document.querySelector('#bloc-fullMap .glyphicon-close').onclick = function (){
		document.querySelector('#bloc-over-full').className = 'hidde';
	}

	/* Listen to rover events. */
	var observable = new nsCommon.Observable();

	observable.subscribe('rover.scanMaterial.end', function(data) {

	});
	observable.subscribe('rover.scanElevation.end', function(data) {
		// Change camera elevation
		viewer.viewers[renderDiv].camera.position.y += data.elevation;
	});
	observable.subscribe('rover.spawn', function(data) {
    var ratio = viewer.viewers[renderDiv].MAP_RATIO,
        init_x = (-ratio/2)*map.getWidth(),
        init_z = (-ratio/2)*map.getHeight();
    viewer.viewers[renderDiv].camera.position.x = init_x + ratio*data.rover.x;
    viewer.viewers[renderDiv].camera.position.z = init_z + ratio*data.rover.y;
	});
	observable.subscribe('rover.actions.fillTank.end', function(data) {

	});
	observable.subscribe('rover.actions.deploySolarPanels.end', function(data) {

	});
  observable.subscribe('rover.direction.end', function(data) {

  });
  observable.subscribe('rover.move.end', function(data) {

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
  var energy = parseInt(document.querySelector('#voyager-energy').value);

	var rover = new nsRover.Rover(map, startX, startY, energy);
	var speculator = new nsSpeculator.S3000(rover);

	speculator.enableModule(module);
	if(module == 'voyager'){
        speculator.start({x: endX, y: endY});
	}
	else {
	    speculator.start();
	}

	console.log(rover.memory.readAll());
})();
