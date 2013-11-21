(function() {
	/* Loading namespaces. */
	var nsCommon = using('mars.common');
	var nsViewer = using('mars.viewer');
	var nsEditor = using('mars.editor');
	var nsMaterial = using('mars.common.material');
	var nsElements = using('mars.editor.element');

	/* Loading materials. */
	var materialRock = new nsMaterial.Rock();
	console.log(materialRock);

	/* Loading elements. */
	var elementCrater = new nsElements.CraterModel([materialRock], -20, 20);

	/* Define viewer container. */
	var renderDiv  = document.querySelector('#render');

	/* Generate a map. */
	var terrain = nsEditor.TerrainGenerator.generate([materialRock], [elementCrater], 100, 100, -10, 10);
	var map = new nsCommon.Map(terrain);

	/* Load map in 3d viewer. */
	var viewer = new nsViewer.Viewer(map);
	viewer.load3D(renderDiv);

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
