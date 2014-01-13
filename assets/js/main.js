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

	/* Loading materials. */
	var materialRock = new nsMaterial.Rock();
	var materialIce = new nsMaterial.Ice();
	var materialIron = new nsMaterial.Iron();
	var materialOre = new nsMaterial.Ore();
	var materialSand = new nsMaterial.Sand();
	var materialOther = new nsMaterial.Other();

	/* Loading elements. */
	var elementCrater = new nsElements.CraterModel([materialSand], -3, 40, 2);
	var elementHill   = new nsElements.HillModel([materialSand], -20, 3, 0);
	var elementRavine = new nsElements.RavineModel([materialRock], -20, 20, 0);

	/* Define viewer container. */
	var renderDiv = document.querySelector('#render');
	var render2dDiv = document.querySelector('#minimap');
	var roverInformations = document.querySelector('#rover-informations');

	/* Generate a map. */
	var map,
			terrain;
	if( "" != document.getElementById('json').value) {
		terrain = document.getElementById('json').value;
		map = new nsCommon.Map(terrain);
	} else {
		terrain = nsEditor.TerrainGenerator.generate([materialRock, materialIce, materialIron, materialOre, materialSand, materialOther], [elementCrater, elementCrater, elementCrater, elementHill, elementRavine], 200, 200, -10, 10);
		map = new nsCommon.Map(terrain);
	}
	
	/* Load map in 3d viewer. */
	var viewer = new nsViewer.Viewer(map);
	viewer.load2D(render2dDiv);
	viewer.load3D(renderDiv, {fog: 0.002, wireframe: false});

	document.controlsForm.wireframe[0].onclick = function () {
		viewer.viewers[renderDiv].options.wireframe = true;
		viewer.viewers[renderDiv]._loadMaterials();
	}
	document.controlsForm.wireframe[1].onclick = function () {
		viewer.viewers[renderDiv].options.wireframe = false;
		viewer.viewers[renderDiv]._loadMaterials();
	}
	document.querySelector('#more').onclick = function () {
		if (viewer.viewers[renderDiv].options.fog < 1) {
			viewer.viewers[renderDiv].options.fog += 0.01;
		} else {
			viewer.viewers[renderDiv].options.fog = 1;
		}
		viewer.viewers[renderDiv]._loadFog();
	}
	document.querySelector('#less').onclick = function () {
		if (viewer.viewers[renderDiv].options.fog > 0) {
			viewer.viewers[renderDiv].options.fog -= 0.01;
		} else {
			viewer.viewers[renderDiv].options.fog = 0;
		}
		viewer.viewers[renderDiv]._loadFog();
	}
	document.controlsForm.camera[0].onclick = function () {
		viewer.viewers[renderDiv].options.cameraControl = true;
		viewer.viewers[renderDiv]._loadControls();
	}
	document.controlsForm.camera[1].onclick = function () {
		viewer.viewers[renderDiv].options.cameraControl = false;
		viewer.viewers[renderDiv]._loadControls();
	}

	/* Listen to rover events. */
	var observable = new nsCommon.Observable();
	observable.subscribe('rover.scanMaterial', function(data) {
		roverInformations.innerHTML  = 'Energie : ' + data.rover.tank + '/' + data.rover.tankSize + "<br />";
		roverInformations.innerHTML += 'Mouvements : ' + data.rover.moves;
		
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
	observable.subscribe('rover.scanElevation', function(data) {
		// Change camera elevation
		viewer.viewers[renderDiv].camera.position.y += data.elevation;
	});
	observable.subscribe('rover.spawn', function(data) {
		//console.log('Rover spawned !', data);
	});
	observable.subscribe('rover.actions.fillTank', function(data) {
		roverInformations.innerHTML  = 'Energie : ' + data.rover.tank + '/' + data.rover.tankSize + "<br />";
		roverInformations.innerHTML += 'Mouvements : ' + data.rover.moves;
		
		//console.log('tank is filled', data);
	});
	observable.subscribe('rover.actions.deploySolarPanels', function(data) {
		roverInformations.innerHTML  = 'Energie : ' + data.rover.tank + '/' + data.rover.tankSize + "<br />";
		roverInformations.innerHTML += 'Mouvements : ' + data.rover.moves;
		
		//console.log('panels are deployed', data);
	});

	/* Rover tests. */
	var rover = new nsRover.Rover(map, 50, 50, 100);
	var memory = new nsMemory.Memory();
	var speculator = new nsSpeculator.S3000(rover, memory);
	speculator.enableModule('voyager');

	rover.setDirection(nsRover.Rover.DIRECTION.SOUTH);
	rover.scanElevation(rover.constructor.DIRECTION.NORTH, 0);

	rover.move(2);
	rover.scanElevation(rover.constructor.DIRECTION.NORTH, 1);
	
	rover.move(2);
	rover.scanElevation(rover.constructor.DIRECTION.NORTH, 1);
	
	rover.move(2);
	rover.scanElevation(rover.constructor.DIRECTION.NORTH, 1);

        console.log('STARTING VOYAGER');
        speculator.start({x: 10, y: 20});
})();
