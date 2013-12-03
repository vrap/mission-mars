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
	var elementCrater = new nsElements.CraterModel([materialRock], -20, 20);

	/* Define viewer container. */
	var renderDiv  = document.querySelector('#render');

	/* Generate a map. */
	var terrain = nsEditor.TerrainGenerator.generate([materialRock, materialIce, materialIron, materialOre, materialSand, materialOther], [elementCrater], 100, 100, -10, 10);
	var map = new nsCommon.Map(terrain);

	/* Load map in 3d viewer. */
	var viewer = new nsViewer.Viewer(map);
	viewer.load3D(renderDiv);

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

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	function onDocumentMouseMove(event) {
		var projector = new THREE.Projector();
		var camera = viewer.viewers[renderDiv].camera;
		var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5);

		projector.unprojectVector(vector, camera);

		var dir = vector.sub(camera.position).normalize();
		var distance = - camera.position.z / dir.z;
		var pos = camera.position.clone().add(dir.multiplyScalar(distance));

		console.log(pos);
	}
})();
