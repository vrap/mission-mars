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

	function get (el) {
	  if (typeof el == 'string') return document.getElementById(el);
	  return el;
	}

	function mouseX (e) {
	  if (e.pageX) {
	    return e.pageX;
	  }
	  if (e.clientX) {
	    return e.clientX + (document.documentElement.scrollLeft ?
	      document.documentElement.scrollLeft :
	      document.body.scrollLeft);
	  }
	  return null;
	}

	function mouseY (e) {
	  if (e.pageY) {
	    return e.pageY;
	  }
	  if (e.clientY) {
	    return e.clientY + (document.documentElement.scrollTop ?
	      document.documentElement.scrollTop :
	      document.body.scrollTop);
	  }
	  return null;
	}
	function dragable (clickEl,dragEl) {

	  var p = get(clickEl);
	  var t = get(dragEl);
	  var drag = false;
	  offsetX = 0;
	  offsetY = 0;
	  var mousemoveTemp = null;

	  if (t) {
	    var move = function (x,y) {
	      t.style.left = (parseInt(t.style.left)+x) + "px";
	      t.style.top  = (parseInt(t.style.top) +y) + "px";
	    }
	    var mouseMoveHandler = function (e) {
	      e = e || window.event;

	      if(!drag){return true};

	      var x = mouseX(e);
	      var y = mouseY(e);
	      if (x != offsetX || y != offsetY) {
	        move(x-offsetX,y-offsetY);
	        offsetX = x;
	        offsetY = y;
	      }
	      return false;
	    }
	    var start_drag = function (e) {

	      e = e || window.event;

	      offsetX=mouseX(e);
	      offsetY=mouseY(e);
	      drag=true; // basically we're using this to detect dragging

	      // save any previous mousemove event handler:
	      if (document.body.onmousemove) {
	        mousemoveTemp = document.body.onmousemove;
	      }
	      document.body.onmousemove = mouseMoveHandler;
	      return false;
	    }
	    var stop_drag = function () {
	      drag=false;      

	      // restore previous mousemove event handler if necessary:
	      if (mousemoveTemp) {
	        document.body.onmousemove = mousemoveTemp;
	        mousemoveTemp = null;
	      }
	      return false;
	    }
	    p.onmousedown = start_drag;
	    p.onmouseup = stop_drag;
	  }
	}
