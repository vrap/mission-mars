function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomIntArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function maxValueOfArray(array) {
	return Math.max.apply(Math, array);
}