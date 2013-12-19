/**
* File for functions used for UI and UX
*/

document.querySelector('#controls-header').onclick = function () {
	if (document.querySelector('#panel-control').className == 'closed') {
		document.querySelector('#controls').className = 'show';
		document.querySelector('#panel-control').className = 'opened';
	} else if (document.querySelector('#panel-control').className == 'opened') {
		document.querySelector('#controls').className = 'hide';
		document.querySelector('#panel-control').className = 'closed';
	}
}