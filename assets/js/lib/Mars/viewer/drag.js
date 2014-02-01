(function() {
	var nsViewer = using('mars.viewer');
	var nsCommon = using('mars.common');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Drag = function() {

	}


	nsViewer.Drag.prototype.get = function (el) {
	  if (typeof el == 'string') return document.getElementById(el);
	  return el;
	}

	nsViewer.Drag.prototype.mouseX = function (e) {
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

	nsViewer.Drag.prototype.mouseY = function(e) {
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

	nsViewer.Drag.prototype.dragable = function(clickEl,dragEl) {

	  var p = this.get(clickEl);
	  var t = this.get(dragEl);
	  var drag = false;
	  offsetX = 0;
	  offsetY = 0;
	  var mousemoveTemp = null;

	  if (t) {
	    var move = function (x,y) {
	      t.style.left = (parseInt(t.style.left)+x) + "px";
	      t.style.top  = (parseInt(t.style.top)+y) + "px";
	    }
	    var mouseMoveHandler = function (e) {
	      e = e || window.event;

	      if(!drag){return true};

	      var x = this.mouseX(e);
	      var y = this.mouseY(e);
	      if (x != offsetX || y != offsetY) {
	        move(x-offsetX,y-offsetY);
	        offsetX = x;
	        offsetY = y;
	      }
	      return false;
	    }.bind(this);

	    var start_drag = function (e) {

	      e = e || window.event;

	      offsetX=this.mouseX(e);
	      offsetY=this.mouseY(e);
	      drag=true; // basically we're using this to detect dragging

	      // save any previous mousemove event handler:
	      if (document.body.onmousemove) {
	        mousemoveTemp = document.body.onmousemove;
	      }
	      document.body.onmousemove = mouseMoveHandler;
	      return false;
	    }.bind(this);

	    var stop_drag = function () {
	      drag=false;      

	      // restore previous mousemove event handler if necessary:
	      if (mousemoveTemp) {
	        document.body.onmousemove = mousemoveTemp;
	        mousemoveTemp = null;
	      }
	      return false;
	    }.bind(this);

	    p.onmousedown = start_drag;
	    p.onmouseup = stop_drag;
	  }
	}

})();