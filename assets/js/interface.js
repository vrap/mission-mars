/************************************
* File for functions used for UI and UX
*************************************/

/**
 * Scripts to load
 */
var scripts = [
		// Main script
		"assets/js/main.js"
];

(function () {


	/**
	 * Home page gestion
	 */
	document.querySelector('.view').style.display = 'none';
  document.querySelector('#bloc-panel-minimap').style.display = 'none';
  document.querySelector('#bloc-panel-minimap-hover').style.display = 'none';
  document.querySelector('#panel-minimap').style.display = 'none';
  document.querySelector('#bloc-pop').style.display = 'none';
  document.querySelector('#panel-infos').style.display = 'none';
  document.querySelector('#voyager-settings').style.display = 'none';
  document.querySelector('#explorer-settings').style.display = 'none';

  /**
   * First panel
   */
  document.querySelector('#start').onclick = function () {
    document.querySelector('#st-control-2').checked = true;
  };
  /**
   * Second panel
   */
  document.querySelector('#import').onclick = function () {
    document.querySelector('#st-control-3').checked = true;
    document.querySelector('#text-map').innerHTML = "Upload your map";
    document.querySelector('#block-generate').style.display = 'none';
    document.querySelector('#block-upload').style.display = 'block';
  };

  document.querySelector('#generate').onclick = function () {
    document.querySelector('#st-control-3').checked = true;
    document.querySelector('#text-map').innerHTML = "New map";
    document.querySelector('#block-generate').style.display = 'block';
    document.querySelector('#block-upload').style.display = 'none';
  };
  /**
   * Third panel
   */
  document.querySelector('#scenario').onclick = function () {
    if(isNaN(document.querySelector('#map-size').value) || document.querySelector('#map-size').value < 1) {
      alert("Invalid map size !");

      return false;
    }

    document.querySelector('#to-check-voyager').onclick = function(){
		document.querySelector('#voyager').checked = true;
		document.querySelector('#voyager-settings').style.display = 'block';
      	document.querySelector('#explorer-settings').style.display = 'none';
      	if(!hasClass(this, 'checked')){
      		addClass(this, 'checked');
      		removeClass(document.querySelector('#to-check-explorer'), 'checked');
      	}
      	
	};
	document.querySelector('#to-check-explorer').onclick = function(){
		document.querySelector('#explorer').checked = true;
		document.querySelector('#voyager-settings').style.display = 'none';
      	document.querySelector('#explorer-settings').style.display = 'block';
      	if(!hasClass(this, 'checked')){
      		addClass(this, 'checked');
      		removeClass(document.querySelector('#to-check-voyager'), 'checked');
      	}
	};


    if (true === document.querySelector('#voyager').checked) {
      document.querySelector('#voyager-settings').style.display = 'block';
      document.querySelector('#explorer-settings').style.display = 'none';
    } else if(true === document.querySelector('#explorer').checked) {
      document.querySelector('#voyager-settings').style.display = 'none';
      document.querySelector('#explorer-settings').style.display = 'block';
    }
    document.querySelector('#st-control-4').checked = true;
  };

  /**
   * Fourth panel
   */
  document.querySelector('#explorer').onclick = function () {
    document.querySelector('#voyager-settings').style.display = 'none';
    document.querySelector('#explorer-settings').style.display = 'block';
  };

  document.querySelector('#voyager').onclick = function () {
    document.querySelector('#voyager-settings').style.display = 'block';
    document.querySelector('#explorer-settings').style.display = 'none';
  };

  /**
   * Viewer
   */

  document.querySelector('#view').onclick = function () {
    if(document.querySelector('#explorer').checked) {
      // Explorer settings verifications
      if(!isPositiveInteger(document.querySelector('#explorer-energy').value)
          || parseInt(document.querySelector('#explorer-energy').value) < 1) {
        alert("Invalid energy value !");

        return false;
      } else if(!isPositiveInteger(document.querySelector('#explorer-startX').value)) {
        alert("Invalid starting position X !");

        return false;
      } else if(!isPositiveInteger(document.querySelector('#explorer-startY').value)) {
        alert("Invalid starting position Y !");

        return false;
      } else {
        createScript("assets/js/main.js");
        document.querySelector('.st-container').style.display = 'none';
        document.querySelector('.view').style.display = 'block';
      }
    } else if (document.querySelector('#voyager').checked) {
      // Voyager settings verifications
      if(!isPositiveInteger(document.querySelector('#voyager-energy').value)
          || parseInt(document.querySelector('#voyager-energy').value) < 1) {
        alert("Invalid energy value !");

        return false;
      } else if(!isPositiveInteger(document.querySelector('#voyager-startX').value)
          || parseInt(document.querySelector('#voyager-startX').value) > parseInt(document.querySelector('#map-size').value)) {
        alert("Invalid starting position X !");

        return false;
      } else if(!isPositiveInteger(document.querySelector('#voyager-startY').value)
          || parseInt(document.querySelector('#voyager-startY').value) > parseInt(document.querySelector('#map-size').value)) {
        alert("Invalid starting position Y !");

        return false;
      } else if(!isPositiveInteger(document.querySelector('#voyager-endX').value)
          || parseInt(document.querySelector('#voyager-endX').value) > parseInt(document.querySelector('#map-size').value)) {
        alert("Invalid ending position X !");

        return false;
      } else if(!isPositiveInteger(document.querySelector('#voyager-endY').value)
          || parseInt(document.querySelector('#voyager-endY').value) > parseInt(document.querySelector('#map-size').value)) {
        alert("Invalid ending position Y !");

        return false;
      } else {
        createScript("assets/js/main.js");
        document.querySelector('.st-container').style.display = 'none';
        document.querySelector('.view').style.display = 'block';
      }
    } else {
      alert('Select a scenario.');

      return false;
    }
  };

	/**
	 * Read JSon and save it in an input hidden
	 */
	document.querySelector('#upload').onclick = function () {
    var file = document.getElementById('uploadedMap').files[0];
		if(undefined !== file) {
      var reader = new FileReader();
			reader.onload = function(evt) {
				// When reader has finished
				// Save file in an input hidden
	  		document.getElementById('json').value = evt.target.result;
        if (true === document.querySelector('#voyager').checked) {
          document.querySelector('#voyager-settings').style.display = 'block';
          document.querySelector('#explorer-settings').style.display = 'none';
        } else if(true === document.querySelector('#explorer').checked) {
          document.querySelector('#voyager-settings').style.display = 'none';
          document.querySelector('#explorer-settings').style.display = 'block';
        }
        document.querySelector('#st-control-4').checked = true;
			};
			reader.readAsText(file);
      return true;
		} else {
      alert('Please upload a JSon.');
      return false;
    }
	}
})();
