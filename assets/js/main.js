(function() {
    /* Loading namespaces. */
    var nsCommon = using('mars.common');
    var nsViewer = using('mars.viewer');
    var nsEditor = using('mars.editor');
    var nsRover = using('mars.rover');
    var nsSpeculator = using('mars.rover.speculator3000');
    var nsMaterial = using('mars.common.material');
    var nsElements = using('mars.editor.element');

    /* Loading observer. */
    var observable = new nsCommon.Observable();

    /* Subscribing to load events. */
    observable.subscribe('editor.terrain.generator.generate', function(data) {
	switch (data.progress) {
	case 0:
	    message = 'Sends the rocket.';
	    break;
	case 25:
	    message = 'Satellite is currently analysing surface.';
	    break;
	case 50:
	    message = 'Looking for a landing area.';
	    break;
	case 75:
	    message = 'Sending the rover.';
	    break;
	}

	document.querySelector('.loader > p').innerText = message;
    });
    observable.subscribe('viewer.3d.init', function(data) {
	switch (data.progress) {
	case 0:
	    message = 'Trying to connect to S3000';
	    break;
	case 20:
	    message = 'Authorization required, sending credentials';
	    break;
	case 50:
	    message = 'Authentification successfull.';
	    break;
	case 70:
	    message = 'Connection established';
	    break;
	case 90:
	    message = 'Sending commands to S3000';
	    break;
	}

	document.querySelector('.loader > p').innerText = message;
    });

    /* Initializing map related var. */
    var terrain, map, mapSize;

    /* If user upload map load it; otherwize generate it. */
    if (document.getElementById('json').value != '') {
	terrain = document.getElementById('json').value;
    }
    else {
	/* Retrieve defined map size. */
	mapSize = document.querySelector('#map-size').value;

	/* Loading materials. */
	var materialRock  = new nsMaterial.Rock();
	var materialIce   = new nsMaterial.Ice();
	var materialIron  = new nsMaterial.Iron();
	var materialOre   = new nsMaterial.Ore();
	var materialSand  = new nsMaterial.Sand();
	var materialOther = new nsMaterial.Other();

	/* Loading elements model. */
	var elementCrater = new nsElements.CraterModel([materialSand], -40, 100, 2);
	var elementHill   = new nsElements.HillModel([materialSand], 20, 200, 2);
	var elementRavine = new nsElements.RavineModel([materialRock], -60, 20, 2);

	/* Generate a terrain. */
	terrain = nsEditor.TerrainGenerator.generate(
	    [
		materialRock,
		materialIce,
		materialIron,
		materialOre,
		materialSand,
		materialOther
	    ],
	    [
		{
		    "model": elementCrater,
		    "number": Math.floor((mapSize / 10) * 1.5)
		},
		{
		    "model": elementHill,
		    "number": Math.floor(mapSize / 25)
		},
		{
		    "model": elementRavine,
		    "number": Math.floor((mapSize / 25) * 0.3)
		}
	    ],
	    mapSize,
	    mapSize,
            -10,
	    10
	);
    }

    /* Load map from terrain. */
    map = new nsCommon.Map(terrain);

    /* Initialize rover related variables. */
    var module,
    startX,
    startY,
    endX,
    endY;

    /* Get mission arguments. */
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

    /* Define energy. */
    var energy = parseInt(document.querySelector('#voyager-energy').value);

    /* Instanciate rover at defined position on the map. */
    var rover = new nsRover.Rover(map, startX, startY, energy);

    /* Instanciate speculator and attach it to the rover. */
    var speculator = new nsSpeculator.S3000(rover);

    /* Define viewers container. */
    var renderDiv = document.querySelector('#render');
    var render2dDiv = document.querySelector('#minimap');
    var renderFull2dDiv = document.querySelector('#fullmap');
    
    /* Init viewer manager. */
    var viewer     = new nsViewer.Viewer(map);
    var viewerFull = new nsViewer.Viewer(map);

    /* Load 2D viewer (radar). */
    viewer.load2D(render2dDiv, '', true);

    /* Load map in full screen 2D viewer. */
    viewerFull.load2D(renderFull2dDiv, '', false);

    /* Load 3D viewer. */
    viewer.load3D(renderDiv, {fog: 0.005, wireframe: false, axis: false});

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
    moreTime = document.querySelector('#roundTime-more'),
    lessTime = document.querySelector('#roundTime-less'),
    roundTime = document.querySelector('#roundTime-current'),
    cameraOn = document.querySelector('#c1'),
    cameraOff = document.querySelector('#c2'),
    downloadMap = document.querySelector('#download'),
    blocPop = document.querySelector('#bloc-pop');
    closePanel = document.querySelector('#to-close-panel');

    var elements = {
	'elementBattery': elementBattery,
	'elementPosition': elementPosition,
	'elementMaterial': elementMaterial,
	'elementMove': elementMove,
	'elementMiniMap': elementMiniMap,
	'elementControl': elementControl,
	'control' : {
	    'wireframeOn': wireframeOn,
	    'wireframeOff': wireframeOff,
	    'moreFog': moreFog,
	    'lessFog': lessFog,
	    'cameraOn': cameraOn,
	    'cameraOff': cameraOff,
	    'downloadMap': downloadMap,
	    'closePanel': closePanel,
	    'moreTime': moreTime,
	    'lessTime': lessTime,
	    'roundTime': roundTime,
	    'terrain': [terrain]
	},
	'pop' : {
	    'blocPop': blocPop,
	    'classPop': 'pop'
	}
    }
    
    var elementViewer = viewer.viewers[renderDiv],
    interfaces = new nsViewer.Interface(elements, elementViewer, rover);

    var drag = new nsViewer.Drag();
    drag.dragable('fullmap', 'fullmap');

    document.querySelector('#bloc-panel-minimap-hover').onclick = function (){
	document.querySelector('#bloc-over-full').className = 'show';
    }
    document.querySelector('#bloc-fullMap .glyphicon-close').onclick = function (){
	document.querySelector('#bloc-over-full').className = 'hidden';
    }

    /* Change camera elevation. */
    observable.subscribe('rover.scanElevation.end', function(data) {
	viewer.viewers[renderDiv].camera.position.y += data.elevation;
    });

    /* When rover spawn display all informations and move camera. */
    observable.subscribe('rover.spawn', function(data) {
	document.querySelector('#bloc-panel-minimap').style.display = 'block';
	document.querySelector('#bloc-panel-minimap-hover').style.display = 'block';
	document.querySelector('#panel-minimap').style.display = 'block';
	document.querySelector('#panel-infos').style.display = 'block';
	document.querySelector('#bloc-pop').style.display = 'block';
	document.querySelector('.loader').style.display = 'none';
	document.querySelector('.loader > p').innerText = '';

	/* Define camera position. */
	var ratio = viewer.viewers[renderDiv].MAP_RATIO,
        init_x = (-ratio/2)*map.getWidth(),
        init_z = (-ratio/2)*map.getHeight();

	viewer.viewers[renderDiv].camera.position.x = init_x + ratio*data.rover.x;
	viewer.viewers[renderDiv].camera.position.z = init_z + ratio*data.rover.y;
    });

    /* Enable the choosen s3000 module and start it with selected parameters. */
    speculator.enableModule(module);

    if (module == 'voyager') {
        speculator.start({x: endX, y: endY});
    }
    else {
	speculator.start();
    }
})();
