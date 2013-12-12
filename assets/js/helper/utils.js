function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomIntArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function maxValueOfArray(array) {
	return Math.max.apply(Math, array);
}

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