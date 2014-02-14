/**
 * Return offset top of element
 */
function getElementTop( elem ) 
{

    yPos = elem.offsetTop;
    tempEl = elem.offsetParent;

    while ( tempEl != null ) 
    {
        yPos += tempEl.offsetTop;
        tempEl = tempEl.offsetParent;
    }  

    return yPos;
}   

function radInDeg(deg){
	return deg * (Math.PI/180);
}


/**
 * Return offset left of element
 */
function getElementLeft( elem ) 
{

    xPos = elem.offsetLeft;
    tempEl = elem.offsetParent; 		

    while ( tempEl != null ) 
    {
        xPos += tempEl.offsetLeft;
        tempEl = tempEl.offsetParent;
    }   		
    return xPos;
}

/**
 * Return bool if element has class
 */
function hasClass(elem, className) {
    return elem.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(elem.className);
}

/**
 * Remove Classe of element
 */
function removeClass(elem, classN){
	var myClassName=classN;
	elem.className=elem.className.replace(myClassName,'');
}

/**
* Adding a class of element
*/
function addClass(elem, classN){
	var myClassName= classN;
	elem.className=elem.className.replace(myClassName,'');
	elem.className = elem.className + myClassName;
}




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

// `condition` is a function that returns a boolean
// `body` is a function that returns a promise
// returns a promise for the completion of the loop
function promiseWhile(condition, body) {
    var done = Q.defer();

    function loop() {
        // When the result of calling `condition` is no longer true, we are
        // done.
        if (!condition()) return done.resolve();
        // Use `when`, in case `body` does not return a promise.
        // When it completes loop again otherwise, if it fails, reject the
        // done promise
        Q.when(body(), loop, done.reject);
    }

    // Start running the loop in the next tick so that this function is
    // completely async. It would be unexpected if `body` was called
    // synchronously the first time.
    Q.nextTick(loop);

    // The promise
    return done.promise;
}

/**
 * Copy an object.
 *
 * Found at : http://jsperf.com/cloning-an-object/2
 */
function clone(obj) {
    var target = {};
    for (var i in obj) {
	if (obj.hasOwnProperty(i)) {
	    target[i] = obj[i];
	}
    }
    return target;
}

/**
 * Check if a number is an int.
 */
function isInt(n) {
   return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
}
