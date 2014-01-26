/**
 * Return a random integer between min and max
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Return a random value in an array
 */
function getRandomIntArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Return maximal value of an array
 */
function maxValueOfArray(array) {
	return Math.max.apply(Math, array);
}

/**
 * Draw a circle with the Bresenham algorithm
 */
function drawCircle (x_center, y_center, rayon, z, elements) {
	var x =0,
		y = rayon,
		m = 5-4*rayon;

	while (x<= y) {
		
		elements[x+x_center][y+y_center].z = z;
		elements[y+x_center][x+y_center].z = z;
		elements[-x+x_center][y+y_center].z = z;
		elements[-y+x_center][x+y_center].z = z;
		elements[x+x_center][-y+y_center].z = z;
		elements[y+x_center][-x+y_center].z = z;
		elements[-x+x_center][-y+y_center].z = z;
		elements[-y+x_center][-x+y_center].z = z;
		if (m > 0) {
			y--;
			m = m-8*y;
		}
		x++;
		m = m + 8*x + 4;
	}
}

/**
 * Converts a value in degrees to radians
 */
function degToRad (degrees) {
	return degrees * Math.PI/180;
}

/**
 * Add script at the end of the body
 */
function createScript (script) {
  var s = document.createElement('script');
  s.src = script;
  document.body.appendChild(s);
}

function isPositiveInteger(n) {
  return (!isNaN(n) && parseInt(n) >= 0);
}