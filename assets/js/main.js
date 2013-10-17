// Animate function
function animate() {
	requestAnimationFrame(animate);
	viewer.render();
}

// Initialize render.
var renderDiv  = document.querySelector('#render');
var mapManager = new MapManager();
var viewer     = new viewer(renderDiv);

// Add new generated map to the map manager.

var map = new Map({ width: 100, height: 100 });

map.generate().done(function() {
	mapManager.add(map);

	// Load the map in the viewer and render it.
	viewer.load(mapManager.mapList[0]);
	viewer.render();

	animate();
});