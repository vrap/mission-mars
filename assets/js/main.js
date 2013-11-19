(function() {
	/* Loading namespaces. */
	var nsCommon = using('mars.common');
	var nsViewer = using('mars.viewer');
	var nsEditor = using('mars.editor');
	var nsMaterial = using('mars.common.material');

	/* Loading materials. */
	var materialRock = new nsMaterial.Rock();
	console.log(materialRock);

	/* Define viewer container. */
	var renderDiv  = document.querySelector('#render');

	/* Generate a map. */
	var terrain = nsEditor.TerrainGenerator.generate([materialRock], [], 100, 300, -10, 10);
	var map = new nsCommon.Map(terrain);

	/* Load map in 3d viewer. */
	var viewer = new nsViewer.Viewer(map);
	viewer.load3D(renderDiv);
})();
