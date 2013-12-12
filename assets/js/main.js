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
	var elementCrater = new nsElements.CraterModel([materialSand], -20, 20, 0);
	var elementHill   = new nsElements.HillModel([materialSand], -5, 5, 0);
	var elementRavine = new nsElements.RavineModel([materialRock], -20, 20, 1);

	/* Define viewer container. */
	var renderDiv = document.querySelector('#render');
	var render2dDiv = document.querySelector('#mini-map');

	/* Generate a map. */
	var terrain = nsEditor.TerrainGenerator.generate([materialRock, materialIce, materialIron, materialOre, materialSand, materialOther], [elementCrater, elementHill, elementRavine], 400, 400, -10, 10);

	var map = new nsCommon.Map(terrain);

	/* Load map in 3d viewer. */
	var viewer = new nsViewer.Viewer(map);

	viewer.load3D(renderDiv);
	viewer.load2D(render2dDiv);

	
	/* Listen to rover events. */
	var observable = new nsCommon.Observable();
	observable.subscribe('rover.move', function(data) {
		console.log('move', data);
	});
	observable.subscribe('rover.scanMaterial', function(data) {
		console.log('material found', data);
	});
	observable.subscribe('rover.scanElevation', function(data) {
		console.log('elevation found', data);
	});

	/* Rover tests. */
	var rover = new nsRover.Rover(map, 0, 0, 10);
	rover.setDirection(nsRover.Rover.DIRECTION.NORTH);
	rover.move(rover.constructor.DIRECTION.NORTH_EAST, 2);
	rover.move(rover.constructor.DIRECTION.NORTH, 2);
	rover.scanMaterial(rover.constructor.DIRECTION.SOUTH, 0);
	rover.scanElevation(rover.constructor.DIRECTION.NORTH, 0);
})();
