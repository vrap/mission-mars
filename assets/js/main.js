var test;

(function() {
	/* Loading namespaces. */
	var nsCommon = using('mars.common');
	var nsViewer = using('mars.viewer');
	var nsEditor = using('mars.editor');
	var nsRover = using('mars.rover');
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
	var elementCrater = new nsElements.CraterModel([materialSand], -3, 20, 1);
	var elementHill   = new nsElements.HillModel([materialSand], -20, 3, 1);
	var elementRavine = new nsElements.RavineModel([materialRock], -20, 20, 1);

	/* Define viewer container. */
	var renderDiv = document.querySelector('#render');
	var render2dDiv = document.querySelector('#minimap');

	/* Generate a map. */
	var terrain = nsEditor.TerrainGenerator.generate([materialRock, materialIce, materialIron, materialOre, materialSand, materialOther], [elementCrater, elementHill, elementRavine], 300, 300, -10, 10);

	var map = new nsCommon.Map(terrain);

	/* Load map in 3d viewer. */
	var viewer = new nsViewer.Viewer(map);
	viewer.load2D(render2dDiv);
	viewer.load3D(renderDiv, {fog: 0.04, wireframe: true});

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
	observable.subscribe('rover.move', function(data) {
		console.log('move', data);
	});
	observable.subscribe('rover.scanMaterial', function(data) {
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
		console.log('elevation found', data);
	});
	observable.subscribe('rover.spawn', function(data) {
		console.log('Rover spawned !', data);
	});

	/* Rover tests. */
	var rover = new nsRover.Rover(map, 10, 10, 10);
	/*rover.setDirection(nsRover.Rover.DIRECTION.NORTH);*/

	var count = 0;
	// setInterval(function(){
	// 	if(count % 4 == 0){
	// 		rover.move(rover.constructor.DIRECTION.SOUTH, 1);
	// 	}else{
	// 		rover.move(rover.constructor.DIRECTION.EAST, 1);
	// 	}
		
	// 	count++;
	// },100);
	
	rover.move(rover.constructor.DIRECTION.SOUTH, 1);
	rover.move(rover.constructor.DIRECTION.SOUTH, 1);
	//rover.move(rover.constructor.DIRECTION.NORTH, 1);
	//rover.move(rover.constructor.DIRECTION.NORTH, 1);

	rover.scanMaterial(rover.constructor.DIRECTION.SOUTH, 0);
	rover.scanElevation(rover.constructor.DIRECTION.NORTH, 0);


	
})();